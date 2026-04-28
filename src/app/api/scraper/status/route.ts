import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function authorized(req: Request): boolean {
  const required = process.env.PILLARPEARL_ADMIN_TOKEN;
  if (!required) return false;
  const header = req.headers.get("authorization") ?? "";
  const m = header.match(/^Bearer\s+(.+)$/i);
  if (!m) return false;
  const provided = Buffer.from(m[1], "utf8");
  const expected = Buffer.from(required, "utf8");
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return new NextResponse("unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Bearer realm="pillarpearl-admin"',
        "Cache-Control": "no-store",
      },
    });
  }
  const db = getDb();
  const lastRun = db
    .prepare(
      "SELECT id, started_at, finished_at, brands_total, brands_ok, brands_failed, products_added, products_updated, products_disappeared FROM scrape_runs ORDER BY id DESC LIMIT 1",
    )
    .get();
  const brandHealth = db
    .prepare(
      `SELECT slug, scrape_strategy, last_fetched_ok_at, consecutive_failures, dormant
       FROM brands ORDER BY consecutive_failures DESC, slug`,
    )
    .all();
  const recentFailures = db
    .prepare(
      "SELECT brand_slug, strategy, stage, occurred_at FROM scrape_failures ORDER BY id DESC LIMIT 25",
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
      headers: { "Cache-Control": "no-store" },
    },
  );
}
