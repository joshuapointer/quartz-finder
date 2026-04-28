import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET() {
  const db = getDb();
  const lastRun = db
    .prepare(
      "SELECT id, started_at, finished_at, brands_total, brands_ok, brands_failed, products_added, products_updated, products_disappeared FROM scrape_runs ORDER BY id DESC LIMIT 1",
    )
    .get();
  const brandHealth = db
    .prepare(
      `SELECT slug, name, scrape_strategy, last_fetched_ok_at, consecutive_failures, dormant
       FROM brands ORDER BY consecutive_failures DESC, slug`,
    )
    .all();
  const recentFailures = db
    .prepare(
      "SELECT brand_slug, strategy, stage, error, occurred_at FROM scrape_failures ORDER BY id DESC LIMIT 25",
    )
    .all();
  return NextResponse.json(
    {
      lastRun,
      brands: brandHealth,
      recentFailures,
      generatedAt: Date.now(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
