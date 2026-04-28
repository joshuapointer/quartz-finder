import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const DB_PATH = process.env.PILLARPEARL_DB ?? "/data/pillarpearl.db";

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  mkdirSync(dirname(DB_PATH), { recursive: true });
  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");
  _db.pragma("synchronous = NORMAL");
  migrate(_db);
  return _db;
}

function migrate(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS brands (
      slug TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      url_note TEXT,
      tier TEXT NOT NULL,
      status TEXT NOT NULL,
      status_label TEXT,
      scrape_strategy TEXT,
      scrape_config TEXT,
      last_fetched_ok_at INTEGER,
      consecutive_failures INTEGER NOT NULL DEFAULT 0,
      dormant INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000),
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000)
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      brand_slug TEXT NOT NULL REFERENCES brands(slug) ON DELETE CASCADE,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      price TEXT,
      original_price TEXT,
      sold_out INTEGER NOT NULL DEFAULT 0,
      available INTEGER NOT NULL DEFAULT 1,
      link TEXT,
      note TEXT,
      status_note TEXT,
      image_hash TEXT,
      external_id TEXT,
      handle TEXT,
      first_seen_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000),
      last_seen_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000),
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000)
    );

    CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_slug);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);

    CREATE TABLE IF NOT EXISTS accessories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_slug TEXT NOT NULL REFERENCES brands(slug) ON DELETE CASCADE,
      name TEXT NOT NULL,
      price TEXT,
      UNIQUE(brand_slug, name)
    );

    CREATE TABLE IF NOT EXISTS scrape_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      started_at INTEGER NOT NULL,
      finished_at INTEGER,
      brands_total INTEGER NOT NULL DEFAULT 0,
      brands_ok INTEGER NOT NULL DEFAULT 0,
      brands_failed INTEGER NOT NULL DEFAULT 0,
      products_added INTEGER NOT NULL DEFAULT 0,
      products_updated INTEGER NOT NULL DEFAULT 0,
      products_disappeared INTEGER NOT NULL DEFAULT 0,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS scrape_failures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      run_id INTEGER REFERENCES scrape_runs(id) ON DELETE CASCADE,
      brand_slug TEXT NOT NULL,
      strategy TEXT,
      stage TEXT,
      error TEXT NOT NULL,
      occurred_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000)
    );

    CREATE INDEX IF NOT EXISTS idx_failures_brand ON scrape_failures(brand_slug);

    CREATE TABLE IF NOT EXISTS images (
      hash TEXT PRIMARY KEY,
      ext TEXT NOT NULL,
      source_url TEXT,
      bytes INTEGER,
      width INTEGER,
      height INTEGER,
      fetched_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000)
    );

    CREATE TABLE IF NOT EXISTS metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

export function closeDb(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}
