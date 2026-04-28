import type {
  Brand,
  BrandSummary,
  Catalog,
  NormalizedProduct,
  ProductCategory,
} from "@/types";
import rawData from "@/data/quartz-finder.json";

const catalog = rawData as unknown as Catalog;

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  control_tower: "Control Tower",
  terp_slurper: "Terp Slurper",
  dunking_station: "Dunking Station",
};

const CATEGORY_ORDER: ProductCategory[] = [
  "control_tower",
  "terp_slurper",
  "dunking_station",
];

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function parsePrice(price: string | null | undefined): number | null {
  if (!price) return null;
  const match = price.match(/\$?\s*(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isFinite(n) ? n : null;
}

export function getMetadata(): Catalog["metadata"] {
  return catalog.metadata;
}

export function getAllBrands(): Brand[] {
  return catalog.brands;
}

export function getBrandSummaries(): BrandSummary[] {
  return catalog.brands.map(toBrandSummary);
}

export function toBrandSummary(brand: Brand): BrandSummary {
  const slug = slugify(brand.name);
  const productCount = CATEGORY_ORDER.filter(
    (c) => brand.products[c]?.available,
  ).length;
  return {
    slug,
    name: brand.name,
    url: brand.url,
    urlNote: brand.url_note ?? null,
    tier: brand.tier,
    status: brand.status,
    statusLabel: brand.status_label ?? null,
    productCount,
    accessoryCount: brand.accessories?.length ?? 0,
    hasControlTower: brand.products.control_tower?.available ?? false,
    hasTerpSlurper: brand.products.terp_slurper?.available ?? false,
    hasDunkingStation: brand.products.dunking_station?.available ?? false,
  };
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return catalog.brands.find((b) => slugify(b.name) === slug);
}

function buildAllProducts(): NormalizedProduct[] {
  const products: NormalizedProduct[] = [];
  for (const brand of catalog.brands) {
    const brandSlug = slugify(brand.name);
    for (const category of CATEGORY_ORDER) {
      const entry = brand.products[category];
      if (!entry?.available) continue;
      products.push({
        id: `${brandSlug}--${category}`,
        brandSlug,
        brandName: brand.name,
        brandTier: brand.tier,
        brandStatus: brand.status,
        category,
        categoryLabel: CATEGORY_LABELS[category],
        name: entry.name ?? `${brand.name} ${CATEGORY_LABELS[category]}`,
        price: entry.price ?? "—",
        priceValue: parsePrice(entry.price ?? null),
        originalPrice: entry.original_price ?? null,
        soldOut: entry.sold_out ?? false,
        available: entry.available,
        link: entry.link ?? null,
        note: entry.note ?? null,
        statusNote: entry.status_note ?? null,
      });
    }
  }
  return products;
}

const ALL_PRODUCTS: NormalizedProduct[] = buildAllProducts();
const PRODUCT_BY_ID = new Map(ALL_PRODUCTS.map((p) => [p.id, p]));

export function getAllProducts(): NormalizedProduct[] {
  return ALL_PRODUCTS;
}

export function getProductById(id: string): NormalizedProduct | undefined {
  return PRODUCT_BY_ID.get(id);
}

export function getProductsByBrandSlug(slug: string): NormalizedProduct[] {
  return ALL_PRODUCTS.filter((p) => p.brandSlug === slug);
}

export function getProductsByCategory(
  category: ProductCategory,
): NormalizedProduct[] {
  return ALL_PRODUCTS.filter((p) => p.category === category);
}

export function getRelatedProducts(
  id: string,
  limit = 4,
): NormalizedProduct[] {
  const product = PRODUCT_BY_ID.get(id);
  if (!product) return [];
  return ALL_PRODUCTS.filter(
    (p) => p.id !== id && p.category === product.category,
  ).slice(0, limit);
}

export interface ProductFilters {
  category?: ProductCategory;
  tier?: "import" | "usmade";
  inStock?: boolean;
  query?: string;
  sort?: "price-asc" | "price-desc" | "brand" | "name";
}

export function filterProducts(
  products: NormalizedProduct[],
  filters: ProductFilters,
): NormalizedProduct[] {
  let result = [...products];

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters.tier) {
    result = result.filter((p) => p.brandTier === filters.tier);
  }
  if (filters.inStock) {
    result = result.filter((p) => !p.soldOut && p.brandStatus === "active");
  }
  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q),
    );
  }

  switch (filters.sort) {
    case "price-asc":
    case "price-desc": {
      const dir = filters.sort === "price-asc" ? 1 : -1;
      result.sort((a, b) => {
        const ap = a.priceValue;
        const bp = b.priceValue;
        if (ap == null && bp == null) return 0;
        if (ap == null) return 1;
        if (bp == null) return -1;
        return (ap - bp) * dir;
      });
      break;
    }
    case "brand":
      result.sort((a, b) => a.brandName.localeCompare(b.brandName));
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return result;
}

export const CATEGORY_META: Record<
  ProductCategory,
  { label: string; tagline: string; slug: string }
> = {
  control_tower: {
    label: "Control Towers",
    tagline: "Tall chambers, big dabs, less splash.",
    slug: "control_tower",
  },
  terp_slurper: {
    label: "Terp Slurpers",
    tagline: "Vortex airflow. Flavor first.",
    slug: "terp_slurper",
  },
  dunking_station: {
    label: "Dunking Stations",
    tagline: "Loaders, troughs, ISO baskets.",
    slug: "dunking_station",
  },
};

export { CATEGORY_LABELS, CATEGORY_ORDER };
