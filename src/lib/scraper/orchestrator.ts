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
}

const PER_HOST_DELAY_MS = 2000;
const MAX_PARALLEL = 4;
const STALE_DORMANT_AFTER = 5;

export async function runScraper(): Promise<{
  runId: number;
  ok: number;
  failed: number;
  added: number;
  updated: number;
  disappeared: number;
}> {
  const db = getDb();
  const startedAt = Date.now();
  const runRow = db
    .prepare("INSERT INTO scrape_runs (started_at) VALUES (?)")
    .run(startedAt);
  const runId = Number(runRow.lastInsertRowid);

  const brands = db
    .prepare(
      "SELECT slug, name, url, scrape_strategy, consecutive_failures, dormant FROM brands ORDER BY slug",
    )
    .all() as BrandRow[];

  let ok = 0;
  let failed = 0;
  let added = 0;
  let updated = 0;
  let disappeared = 0;

  const targets = brands.filter((b) => b.dormant === 0);

  for (let i = 0; i < targets.length; i += MAX_PARALLEL) {
    const batch = targets.slice(i, i + MAX_PARALLEL);
    const results = await Promise.allSettled(
      batch.map((b) => scrapeOneBrand(b, runId)),
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

  return { runId, ok, failed, added, updated, disappeared };
}

async function scrapeOneBrand(
  brand: BrandRow,
  runId: number,
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
    recordFailure(runId, brand.slug, strategy, "fetch", String(e));
    bumpFailure(brand.slug);
    db.prepare(
      "UPDATE brands SET scrape_strategy = ?, updated_at = strftime('%s','now')*1000 WHERE slug = ?",
    ).run(strategy, brand.slug);
    throw e;
  }

  if (strategy !== "manual" && scraped.length === 0) {
    recordFailure(runId, brand.slug, strategy, "extract", "0 products extracted");
  }

  const now = Date.now();
  const seenIds = new Set<string>();
  let added = 0;
  let updated = 0;

  for (const p of scraped) {
    if (!p.category) continue;
    const id = `${brand.slug}--${p.handle}`;
    seenIds.add(id);
    const imageHash = await cacheImage(p.imageUrl);
    const existing = db
      .prepare("SELECT id FROM products WHERE id = ?")
      .get(id) as { id: string } | undefined;
    if (existing) {
      db.prepare(
        `UPDATE products SET name = ?, price = ?, original_price = ?, sold_out = ?,
         link = ?, image_hash = COALESCE(?, image_hash), external_id = ?, handle = ?,
         category = ?, last_seen_at = ?, updated_at = ? WHERE id = ?`,
      ).run(
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
      db.prepare(
        `INSERT INTO products (id, brand_slug, category, name, price, original_price, sold_out, available, link, image_hash, external_id, handle, first_seen_at, last_seen_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
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

  let disappeared = 0;
  if (strategy !== "manual" && scraped.length > 0) {
    const placeholders = seenIds.size
      ? Array.from(seenIds).map(() => "?").join(",")
      : "''";
    const oldRows = db
      .prepare(
        `SELECT id FROM products WHERE brand_slug = ? AND available = 1${
          seenIds.size ? ` AND id NOT IN (${placeholders})` : ""
        }`,
      )
      .all(brand.slug, ...Array.from(seenIds)) as { id: string }[];
    for (const r of oldRows) {
      db.prepare(
        "UPDATE products SET available = 0, sold_out = 1, updated_at = ? WHERE id = ?",
      ).run(now, r.id);
      disappeared++;
    }
  }

  db.prepare(
    `UPDATE brands SET scrape_strategy = ?, last_fetched_ok_at = ?, consecutive_failures = 0, dormant = 0, updated_at = ? WHERE slug = ?`,
  ).run(strategy, now, now, brand.slug);

  await sleep(PER_HOST_DELAY_MS);
  return { added, updated, disappeared };
}

async function detectStrategy(url: string): Promise<ScrapeStrategy> {
  if (await probeShopify(url)) return "shopify";
  if (await probeWoocommerce(url)) return "woocommerce";
  return "jsonld";
}

function recordFailure(
  runId: number,
  brandSlug: string,
  strategy: ScrapeStrategy | null,
  stage: string,
  error: string,
): void {
  getDb()
    .prepare(
      "INSERT INTO scrape_failures (run_id, brand_slug, strategy, stage, error) VALUES (?, ?, ?, ?, ?)",
    )
    .run(runId, brandSlug, strategy, stage, error);
}

function bumpFailure(brandSlug: string): void {
  const db = getDb();
  const row = db
    .prepare(
      "UPDATE brands SET consecutive_failures = consecutive_failures + 1, updated_at = strftime('%s','now')*1000 WHERE slug = ? RETURNING consecutive_failures",
    )
    .get(brandSlug) as { consecutive_failures: number } | undefined;
  if (row && row.consecutive_failures >= STALE_DORMANT_AFTER) {
    db.prepare("UPDATE brands SET dormant = 1 WHERE slug = ?").run(brandSlug);
    console.warn(
      `[scraper] brand ${brandSlug} marked dormant after ${row.consecutive_failures} consecutive failures`,
    );
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
