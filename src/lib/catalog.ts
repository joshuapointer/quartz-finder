import type {
  Brand,
  BrandStatus,
  BrandSummary,
  Catalog,
  CatalogMeta,
  NormalizedProduct,
  ProductCategory,
  Tier,
} from "@/types";
import { getDb } from "./db";
import { seedIfEmpty } from "./seed";
import {
  slugify,
  parsePrice,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  CATEGORY_META,
  filterProducts,
  type ProductFilters,
} from "./catalog-shared";
import seedJson from "@/data/catalog.json";

let _bootstrapped = false;
function bootstrap(): void {
  if (_bootstrapped) return;
  seedIfEmpty();
  _bootstrapped = true;
}

export {
  slugify,
  parsePrice,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  CATEGORY_META,
  filterProducts,
};
export type { ProductFilters };

interface BrandRow {
  slug: string;
  name: string;
  url: string;
  url_note: string | null;
  tier: Tier;
  status: BrandStatus;
  status_label: string | null;
  last_fetched_ok_at: number | null;
  consecutive_failures: number;
  dormant: number;
}

interface ProductRow {
  id: string;
  brand_slug: string;
  brand_name: string;
  brand_tier: Tier;
  brand_status: BrandStatus;
  category: ProductCategory;
  name: string;
  price: string | null;
  original_price: string | null;
  sold_out: number;
  available: number;
  link: string | null;
  note: string | null;
  status_note: string | null;
  image_hash: string | null;
  last_seen_at: number;
  brand_last_fetched_ok_at: number | null;
  brand_dormant: number;
}

export function getMetadata(): CatalogMeta {
  bootstrap();
  const db = getDb();
  const seedRow = db
    .prepare("SELECT value FROM metadata WHERE key = 'seed_metadata'")
    .get() as { value: string } | undefined;
  const seed = seedRow
    ? (JSON.parse(seedRow.value) as CatalogMeta)
    : ((seedJson as unknown as Catalog).metadata as CatalogMeta);

  const counts = db
    .prepare(
      `SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active,
        SUM(CASE WHEN status != 'active' THEN 1 ELSE 0 END) AS inactive,
        SUM(CASE WHEN tier = 'import' THEN 1 ELSE 0 END) AS import,
        SUM(CASE WHEN tier = 'usmade' THEN 1 ELSE 0 END) AS usmade
      FROM brands`,
    )
    .get() as {
    total: number;
    active: number;
    inactive: number;
    import: number;
    usmade: number;
  };

  return {
    ...seed,
    summary: {
      total_brands: counts.total ?? 0,
      active_brands: counts.active ?? 0,
      inactive_brands: counts.inactive ?? 0,
      import_tier_count: counts.import ?? 0,
      usmade_tier_count: counts.usmade ?? 0,
    },
  };
}

export function getAllBrands(): Brand[] {
  bootstrap();
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM brands ORDER BY rowid")
    .all() as BrandRow[];
  return rows.map(rowToBrand);
}

export function getBrandBySlug(slug: string): Brand | undefined {
  bootstrap();
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM brands WHERE slug = ?")
    .get(slug) as BrandRow | undefined;
  if (!row) return undefined;
  return rowToBrand(row);
}

export function getBrandSummaries(): BrandSummary[] {
  return getAllBrands().map(toBrandSummary);
}

export function toBrandSummary(brand: Brand): BrandSummary {
  bootstrap();
  const slug = slugify(brand.name);
  const db = getDb();
  const cats = db
    .prepare(
      "SELECT category FROM products WHERE brand_slug = ? AND available = 1",
    )
    .all(slug) as { category: ProductCategory }[];
  const set = new Set(cats.map((c) => c.category));
  return {
    slug,
    name: brand.name,
    url: brand.url,
    urlNote: brand.url_note ?? null,
    tier: brand.tier,
    status: brand.status,
    statusLabel: brand.status_label ?? null,
    productCount: cats.length,
    accessoryCount: brand.accessories?.length ?? 0,
    hasControlTower: set.has("control_tower"),
    hasTerpSlurper: set.has("terp_slurper"),
    hasDunkingStation: set.has("dunking_station"),
  };
}

const PRODUCT_BASE_QUERY = `
  SELECT
    p.id, p.brand_slug, p.category, p.name, p.price, p.original_price,
    p.sold_out, p.available, p.link, p.note, p.status_note, p.image_hash,
    p.last_seen_at,
    b.name AS brand_name, b.tier AS brand_tier, b.status AS brand_status,
    b.last_fetched_ok_at AS brand_last_fetched_ok_at, b.dormant AS brand_dormant
  FROM products p
  JOIN brands b ON b.slug = p.brand_slug
`;

export function getAllProducts(): NormalizedProduct[] {
  bootstrap();
  const db = getDb();
  const rows = db
    .prepare(`${PRODUCT_BASE_QUERY} WHERE p.available = 1 ORDER BY b.rowid, p.category`)
    .all() as ProductRow[];
  return rows.map(rowToProduct);
}

export function getProductById(id: string): NormalizedProduct | undefined {
  bootstrap();
  const db = getDb();
  const row = db
    .prepare(`${PRODUCT_BASE_QUERY} WHERE p.id = ?`)
    .get(id) as ProductRow | undefined;
  return row ? rowToProduct(row) : undefined;
}

export function getProductsByBrandSlug(slug: string): NormalizedProduct[] {
  bootstrap();
  const db = getDb();
  const rows = db
    .prepare(
      `${PRODUCT_BASE_QUERY} WHERE p.brand_slug = ? AND p.available = 1 ORDER BY p.category`,
    )
    .all(slug) as ProductRow[];
  return rows.map(rowToProduct);
}

export function getProductsByCategory(
  category: ProductCategory,
): NormalizedProduct[] {
  bootstrap();
  const db = getDb();
  const rows = db
    .prepare(
      `${PRODUCT_BASE_QUERY} WHERE p.category = ? AND p.available = 1 ORDER BY b.rowid`,
    )
    .all(category) as ProductRow[];
  return rows.map(rowToProduct);
}

export function getRelatedProducts(
  id: string,
  limit = 4,
): NormalizedProduct[] {
  const product = getProductById(id);
  if (!product) return [];
  bootstrap();
  const db = getDb();
  const rows = db
    .prepare(
      `${PRODUCT_BASE_QUERY} WHERE p.category = ? AND p.id != ? AND p.available = 1 ORDER BY b.rowid LIMIT ?`,
    )
    .all(product.category, id, limit) as ProductRow[];
  return rows.map(rowToProduct);
}


function rowToBrand(row: BrandRow): Brand {
  bootstrap();
  const db = getDb();
  const accs = db
    .prepare(
      "SELECT name, price FROM accessories WHERE brand_slug = ? ORDER BY id",
    )
    .all(row.slug) as { name: string; price: string }[];
  const products: Brand["products"] = {
    control_tower: { available: false },
    terp_slurper: { available: false },
    dunking_station: { available: false },
  };
  const productRows = db
    .prepare(
      "SELECT category, name, price, original_price, sold_out, available, link, note, status_note FROM products WHERE brand_slug = ? AND available = 1",
    )
    .all(row.slug) as Array<{
    category: ProductCategory;
    name: string;
    price: string | null;
    original_price: string | null;
    sold_out: number;
    available: number;
    link: string | null;
    note: string | null;
    status_note: string | null;
  }>;
  for (const p of productRows) {
    products[p.category] = {
      available: true,
      name: p.name,
      price: p.price ?? undefined,
      original_price: p.original_price ?? undefined,
      sold_out: p.sold_out === 1,
      link: p.link ?? undefined,
      note: p.note ?? undefined,
      status_note: p.status_note ?? undefined,
    };
  }
  return {
    name: row.name,
    url: row.url,
    url_note: row.url_note ?? undefined,
    tier: row.tier,
    status: row.status,
    status_label: row.status_label ?? undefined,
    products,
    accessories: accs.length ? accs : undefined,
  };
}

function rowToProduct(row: ProductRow): NormalizedProduct {
  return {
    id: row.id,
    brandSlug: row.brand_slug,
    brandName: row.brand_name,
    brandTier: row.brand_tier,
    brandStatus: row.brand_status,
    category: row.category,
    categoryLabel: CATEGORY_LABELS[row.category],
    name: row.name,
    price: row.price ?? "—",
    priceValue: parsePrice(row.price),
    originalPrice: row.original_price,
    soldOut: row.sold_out === 1,
    available: row.available === 1,
    link: row.link,
    note: row.note,
    statusNote: row.status_note,
    imageHash: row.image_hash,
    lastSeenAt: row.last_seen_at,
    brandLastFetchedOkAt: row.brand_last_fetched_ok_at,
    brandDormant: row.brand_dormant === 1,
  };
}
