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
  const count = db.prepare("SELECT COUNT(*) AS n FROM brands").get() as { n: number };
  if (count.n > 0) {
    const p = db.prepare("SELECT COUNT(*) AS n FROM products").get() as { n: number };
    return { seeded: false, brands: count.n, products: p.n };
  }

  const data = rawData as unknown as Catalog;
  const insertBrand = db.prepare(`
    INSERT INTO brands (slug, name, url, url_note, tier, status, status_label)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const insertProduct = db.prepare(`
    INSERT INTO products (
      id, brand_slug, category, name, price, original_price, sold_out,
      available, link, note, status_note
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertAccessory = db.prepare(`
    INSERT INTO accessories (brand_slug, name, price) VALUES (?, ?, ?)
  `);
  const insertMeta = db.prepare(`
    INSERT OR REPLACE INTO metadata (key, value) VALUES (?, ?)
  `);

  let brands = 0;
  let products = 0;

  const tx = db.transaction(() => {
    insertMeta.run("seed_metadata", JSON.stringify(data.metadata));
    for (const brand of data.brands) {
      const slug = slugify(brand.name);
      insertBrand.run(
        slug,
        brand.name,
        brand.url,
        brand.url_note ?? null,
        brand.tier,
        brand.status,
        brand.status_label ?? null,
      );
      brands++;
      for (const category of CATEGORY_ORDER) {
        const entry = brand.products[category];
        if (!entry?.available) continue;
        insertProduct.run(
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
        products++;
      }
      if (brand.accessories) {
        for (const a of brand.accessories) {
          insertAccessory.run(slug, a.name, a.price);
        }
      }
    }
  });

  tx();
  return { seeded: true, brands, products };
}
