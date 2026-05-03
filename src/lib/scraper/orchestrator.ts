import { getDb } from "../db";
import { probeShopify, scrapeShopify } from "./shopify";
import { probeWoocommerce, scrapeWoocommerce } from "./woocommerce";
import { scrapeJsonLd } from "./jsonld";
import { cacheImage } from "./images";
import { safeExternalUrl } from "../url";
import type { ScrapedProduct, ScrapeStrategy } from "./types";

interface BrandRow {
  slug: string;
  name: string;
  url: string;
  scrape_strategy: ScrapeStrategy | null;
  consecutive_failures: number;
  dormant: number;
  dormant_at: number | null;
}

const PER_HOST_DELAY_MS = Number(process.env.PILLARPEARL_PER_HOST_DELAY_MS ?? 2000);
const MAX_PARALLEL = Number(process.env.PILLARPEARL_MAX_PARALLEL ?? 4);
const STALE_DORMANT_AFTER = Number(process.env.PILLARPEARL_DORMANT_AFTER ?? 5);
const DORMANT_RETRY_AFTER_MS = Number(
  process.env.PILLARPEARL_DORMANT_RETRY_MS ?? 6 * 60 * 60 * 1000,
);

let _running = false;

export async function runScraper(): Promise<{
  runId: number;
  ok: number;
  failed: number;
  added: number;
  updated: number;
  disappeared: number;
  skipped: boolean;
}> {
  if (_running) {
    return { runId: 0, ok: 0, failed: 0, added: 0, updated: 0, disappeared: 0, skipped: true };
  }
  _running = true;
  const db = getDb();
  ensureSchemaExtras(db);
  const startedAt = Date.now();
  const runRow = db
    .prepare("INSERT INTO scrape_runs (started_at) VALUES (?)")
    .run(startedAt);
  const runId = Number(runRow.lastInsertRowid);

  let ok = 0;
  let failed = 0;
  let added = 0;
  let updated = 0;
  let disappeared = 0;
  const sessionImageBudget = { remaining: 500 * 1024 * 1024 };

  try {
    const brands = db
      .prepare(
        `SELECT slug, name, url, scrape_strategy, consecutive_failures, dormant, dormant_at
         FROM brands ORDER BY slug`,
      )
      .all() as BrandRow[];

    const now = Date.now();
    const targets = brands.filter(
      (b) =>
        b.dormant === 0 ||
        (b.dormant_at != null && now - b.dormant_at >= DORMANT_RETRY_AFTER_MS),
    );

    for (let i = 0; i < targets.length; i += MAX_PARALLEL) {
      const batch = targets.slice(i, i + MAX_PARALLEL);
      const results = await Promise.allSettled(
        batch.map((b) => scrapeOneBrand(b, runId, sessionImageBudget)),
      );
      for (const r of results) {
        if (r.status === "fulfilled") {
          ok++;
          added += r.value.added;
          updated += r.value.updated;
          disappeared += r.value.disappeared;
        } else {
          failed++;
        }
      }
    }

    db.prepare(
      `UPDATE scrape_runs SET finished_at = ?, brands_total = ?, brands_ok = ?, brands_failed = ?, products_added = ?, products_updated = ?, products_disappeared = ? WHERE id = ?`,
    ).run(
      Date.now(),
      targets.length,
      ok,
      failed,
      added,
      updated,
      disappeared,
      runId,
    );
  } catch (e) {
    db.prepare(
      `UPDATE scrape_runs SET finished_at = ?, notes = ? WHERE id = ?`,
    ).run(Date.now(), `run aborted: ${String(e)}`, runId);
    throw e;
  } finally {
    _running = false;
  }

  return { runId, ok, failed, added, updated, disappeared, skipped: false };
}

function ensureSchemaExtras(db: ReturnType<typeof getDb>): void {
  const cols = db.prepare("PRAGMA table_info(brands)").all() as { name: string }[];
  const has = (n: string) => cols.some((c) => c.name === n);
  if (!has("dormant_at")) {
    db.exec("ALTER TABLE brands ADD COLUMN dormant_at INTEGER");
  }
}

async function scrapeOneBrand(
  brand: BrandRow,
  runId: number,
  imageBudget: { remaining: number },
): Promise<{ added: number; updated: number; disappeared: number }> {
  const db = getDb();
  const safeUrl = safeExternalUrl(brand.url);
  if (!safeUrl) {
    recordFailure(runId, brand.slug, null, "validate", "invalid url");
    bumpFailure(brand.slug);
    throw new Error(`invalid url for ${brand.slug}`);
  }

  let strategy: ScrapeStrategy | null = brand.scrape_strategy;
  if (!strategy) strategy = await detectStrategy(safeUrl);

  let scraped: ScrapedProduct[] = [];
  let fetchFailed = false;
  try {
    if (strategy === "shopify") {
      scraped = (await scrapeShopify(safeUrl)).products;
    } else if (strategy === "woocommerce") {
      scraped = (await scrapeWoocommerce(safeUrl)).products;
    } else if (strategy === "jsonld") {
      scraped = (await scrapeJsonLd(safeUrl)).products;
    } else {
      strategy = "manual";
    }
  } catch (e) {
    fetchFailed = true;
    recordFailure(runId, brand.slug, strategy, "fetch", String(e));
    bumpFailure(brand.slug);
    db.prepare(
      "UPDATE brands SET scrape_strategy = ?, updated_at = strftime('%s','now')*1000 WHERE slug = ?",
    ).run(strategy, brand.slug);
    throw e;
  }

  if (!fetchFailed && strategy !== "manual" && scraped.length === 0) {
    recordFailure(runId, brand.slug, strategy, "extract", "0 products extracted");
    bumpFailure(brand.slug);
  }

  const now = Date.now();
  const seenIds = new Set<string>();
  let added = 0;
  let updated = 0;
  let disappeared = 0;

  // Resolve images first (async work outside the sync transaction).
  const prepared: Array<{ p: ScrapedProduct; id: string; imageHash: string | null }> = [];
  for (const p of scraped) {
    if (!p.category) continue;
    const id = `${brand.slug}--${p.handle}`;
    seenIds.add(id);
    let imageHash: string | null = null;
    if (imageBudget.remaining > 0) {
      const result = await cacheImage(p.imageUrl);
      if (result) {
        imageHash = result.hash;
        if (!result.cached) {
          const sz = db
            .prepare("SELECT bytes FROM images WHERE hash = ?")
            .get(imageHash) as { bytes: number } | undefined;
          imageBudget.remaining -= sz?.bytes ?? 0;
        }
      }
    }
    prepared.push({ p, id, imageHash });
  }

  const updateProduct = db.prepare(
    `UPDATE products SET name = ?, price = ?, original_price = ?, sold_out = ?,
     link = ?, image_hash = COALESCE(?, image_hash), external_id = ?, handle = ?,
     category = ?, available = 1, last_seen_at = ?, updated_at = ? WHERE id = ?`,
  );
  const insertProduct = db.prepare(
    `INSERT INTO products (id, brand_slug, category, name, price, original_price, sold_out, available, link, image_hash, external_id, handle, first_seen_at, last_seen_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const selectProductId = db.prepare("SELECT id FROM products WHERE id = ?");
  const purgeLegacy = db.prepare(
    `DELETE FROM products
     WHERE brand_slug = ?
     AND (id = brand_slug || '--control_tower'
          OR id = brand_slug || '--terp_slurper'
          OR id = brand_slug || '--dunking_station')`,
  );
  const markUnavailable = db.prepare(
    "UPDATE products SET available = 0, sold_out = 1, updated_at = ? WHERE id = ?",
  );
  const updateBrandSuccess = db.prepare(
    `UPDATE brands SET scrape_strategy = ?, last_fetched_ok_at = ?, consecutive_failures = 0, dormant = 0, dormant_at = NULL, updated_at = ? WHERE slug = ?`,
  );
  const updateBrandStrategyOnly = db.prepare(
    `UPDATE brands SET scrape_strategy = ?, updated_at = ? WHERE slug = ?`,
  );
  const credible = strategy === "manual" || scraped.length > 0;

  const tx = db.transaction(() => {
    for (const { p, id, imageHash } of prepared) {
      const existing = selectProductId.get(id) as { id: string } | undefined;
      if (existing) {
        updateProduct.run(
          p.name,
          p.price,
          p.originalPrice,
          p.soldOut ? 1 : 0,
          p.link,
          imageHash,
          p.externalId,
          p.handle,
          p.category,
          now,
          now,
          id,
        );
        updated++;
      } else {
        insertProduct.run(
          id,
          brand.slug,
          p.category,
          p.name,
          p.price,
          p.originalPrice,
          p.soldOut ? 1 : 0,
          p.link,
          imageHash,
          p.externalId,
          p.handle,
          now,
          now,
          now,
        );
        added++;
      }
    }

    // Sweep only on credible fetches (>0 scraped products).
    if (strategy !== "manual" && scraped.length > 0) {
      purgeLegacy.run(brand.slug);
      const placeholders = Array.from(seenIds).map(() => "?").join(",");
      const oldRows = db
        .prepare(
          `SELECT id FROM products WHERE brand_slug = ? AND available = 1 AND id NOT IN (${placeholders})`,
        )
        .all(brand.slug, ...Array.from(seenIds)) as { id: string }[];
      for (const r of oldRows) {
        markUnavailable.run(now, r.id);
        disappeared++;
      }
    }

    if (credible) {
      updateBrandSuccess.run(strategy, now, now, brand.slug);
    } else {
      updateBrandStrategyOnly.run(strategy, now, brand.slug);
    }
  });
  tx.immediate();

  await sleep(PER_HOST_DELAY_MS);
  return { added, updated, disappeared };
}

async function detectStrategy(url: string): Promise<ScrapeStrategy> {
  const [shopify, woo] = await Promise.all([
    probeShopify(url).catch(() => false),
    probeWoocommerce(url).catch(() => false),
  ]);
  if (shopify) return "shopify";
  if (woo) return "woocommerce";
  return "jsonld";
}

function recordFailure(
  runId: number,
  brandSlug: string,
  strategy: ScrapeStrategy | null,
  stage: string,
  error: string,
): void {
  // Cap stored error to avoid bloating the table with stack traces or huge bodies.
  const trimmed = error.length > 500 ? `${error.slice(0, 500)}…` : error;
  getDb()
    .prepare(
      "INSERT INTO scrape_failures (run_id, brand_slug, strategy, stage, error) VALUES (?, ?, ?, ?, ?)",
    )
    .run(runId, brandSlug, strategy, stage, trimmed);
}

function bumpFailure(brandSlug: string): void {
  const db = getDb();
  const row = db
    .prepare(
      "UPDATE brands SET consecutive_failures = consecutive_failures + 1, updated_at = strftime('%s','now')*1000 WHERE slug = ? RETURNING consecutive_failures",
    )
    .get(brandSlug) as { consecutive_failures: number } | undefined;
  if (row && row.consecutive_failures >= STALE_DORMANT_AFTER) {
    db.prepare(
      "UPDATE brands SET dormant = 1, dormant_at = ? WHERE slug = ? AND dormant = 0",
    ).run(Date.now(), brandSlug);
    console.warn(
      `[scraper] brand ${brandSlug} marked dormant after ${row.consecutive_failures} consecutive failures`,
    );
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
