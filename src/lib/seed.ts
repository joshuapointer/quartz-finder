import { getDb } from "./db";
import rawData from "@/data/catalog.json";
import type { Catalog, ProductCategory } from "@/types";
import { slugify } from "./catalog-shared";

const CATEGORY_ORDER: ProductCategory[] = [
  "control_tower",
  "terp_slurper",
  "dunking_station",
];

export function seedIfEmpty(): { seeded: boolean; brands: number; products: number } {
  const db = getDb();
  const data = rawData as unknown as Catalog;

  const insertBrand = db.prepare(`
    INSERT OR IGNORE INTO brands (slug, name, url, url_note, tier, status, status_label)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO products (
      id, brand_slug, category, name, price, original_price, sold_out,
      available, link, note, status_note
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertAccessory = db.prepare(`
    INSERT OR IGNORE INTO accessories (brand_slug, name, price) VALUES (?, ?, ?)
  `);
  const insertMeta = db.prepare(`
    INSERT OR REPLACE INTO metadata (key, value) VALUES (?, ?)
  `);
  const checkSeed = db.prepare(`SELECT value FROM metadata WHERE key = 'seed_complete'`);

  let brands = 0;
  let products = 0;
  let alreadySeeded = false;

  const tx = db.transaction(() => {
    const existing = checkSeed.get() as { value: string } | undefined;
    if (existing) {
      alreadySeeded = true;
      return;
    }
    insertMeta.run("seed_metadata", JSON.stringify(data.metadata));
    for (const brand of data.brands) {
      const slug = slugify(brand.name);
      const r = insertBrand.run(
        slug,
        brand.name,
        brand.url,
        brand.url_note ?? null,
        brand.tier,
        brand.status,
        brand.status_label ?? null,
      );
      if (r.changes > 0) brands++;
      for (const category of CATEGORY_ORDER) {
        const entry = brand.products[category];
        if (!entry?.available) continue;
        const pr = insertProduct.run(
          `${slug}--${category}`,
          slug,
          category,
          entry.name ?? `${brand.name} ${category}`,
          entry.price ?? null,
          entry.original_price ?? null,
          entry.sold_out ? 1 : 0,
          1,
          entry.link ?? null,
          entry.note ?? null,
          entry.status_note ?? null,
        );
        if (pr.changes > 0) products++;
      }
      if (brand.accessories) {
        for (const a of brand.accessories) {
          insertAccessory.run(slug, a.name, a.price);
        }
      }
    }
    insertMeta.run("seed_complete", String(Date.now()));
  });

  try {
    tx.immediate();
  } catch {
    // If another process holds the write lock, count it as already-seeded; the winner did the work.
    const total = db.prepare("SELECT COUNT(*) AS n FROM brands").get() as { n: number };
    return { seeded: false, brands: total.n, products: 0 };
  }

  if (alreadySeeded) {
    const totalB = db.prepare("SELECT COUNT(*) AS n FROM brands").get() as { n: number };
    const totalP = db.prepare("SELECT COUNT(*) AS n FROM products").get() as { n: number };
    return { seeded: false, brands: totalB.n, products: totalP.n };
  }
  return { seeded: true, brands, products };
}
