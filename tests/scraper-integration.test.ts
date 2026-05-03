import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Per-test isolated DB
let tmpDir: string;
let dbPath: string;
let imageDir: string;

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), "pp-scrape-test-"));
  dbPath = join(tmpDir, "test.db");
  imageDir = join(tmpDir, "images");
  process.env.PILLARPEARL_DB = dbPath;
  process.env.PILLARPEARL_IMAGE_DIR = imageDir;
  vi.resetModules();
});

afterEach(() => {
  delete process.env.PILLARPEARL_DB;
  delete process.env.PILLARPEARL_IMAGE_DIR;
  rmSync(tmpDir, { recursive: true, force: true });
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function makeShopifyResponse(products: unknown[]) {
  return new Response(JSON.stringify({ products }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("shopify adapter", () => {
  it("filters non-quartz products + classifies + extracts price/image", async () => {
    const fetchMock = vi.fn(async () =>
      makeShopifyResponse([
        {
          id: 1,
          handle: "ct-25",
          title: "Control Tower 25mm",
          variants: [{ id: 11, price: "85.00", available: true }],
          images: [{ src: "https://example.com/a.jpg", position: 1 }],
        },
        {
          id: 2,
          handle: "tee",
          title: "Brand T-Shirt",
          variants: [{ id: 22, price: "20.00", available: true }],
          images: [],
        },
        {
          id: 3,
          handle: "slurper-30",
          title: "Terp Slurper 30mm",
          variants: [
            { id: 33, price: "120", compare_at_price: "150", available: false },
          ],
          images: [{ src: "https://example.com/b.jpg" }],
        },
      ]),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { scrapeShopify } = await import("@/lib/scraper/shopify");
    const res = await scrapeShopify("https://example.com");
    expect(res.strategy).toBe("shopify");
    expect(res.products).toHaveLength(2);
    const ct = res.products.find((p) => p.handle === "ct-25");
    expect(ct?.category).toBe("control_tower");
    expect(ct?.price).toBe("$85");
    expect(ct?.imageUrl).toBe("https://example.com/a.jpg");
    expect(ct?.soldOut).toBe(false);

    const slurper = res.products.find((p) => p.handle === "slurper-30");
    expect(slurper?.category).toBe("terp_slurper");
    expect(slurper?.originalPrice).toBe("$150");
    expect(slurper?.soldOut).toBe(true);
  });
});

describe("woocommerce adapter", () => {
  it("converts minor units to dollars + filters non-quartz", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify([
            {
              id: 10,
              name: "Quartz Banger 25mm",
              slug: "qb-25",
              is_in_stock: true,
              prices: { price: "4500", regular_price: "4500", currency_symbol: "$" },
              images: [{ src: "https://example.com/q.jpg" }],
              categories: [{ name: "Bangers", slug: "bangers" }],
            },
            {
              id: 11,
              name: "Hat",
              slug: "hat",
              is_in_stock: true,
              prices: { price: "2000", regular_price: "2000", currency_symbol: "$" },
              images: [],
              categories: [{ name: "Apparel", slug: "apparel" }],
            },
          ]),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    const { scrapeWoocommerce } = await import("@/lib/scraper/woocommerce");
    const res = await scrapeWoocommerce("https://example.com");
    expect(res.products).toHaveLength(1);
    expect(res.products[0].price).toBe("$45");
    expect(res.products[0].soldOut).toBe(false);
  });
});

describe("orchestrator", () => {
  it("0-product shopify fetch records failure + bumps consecutive_failures", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => makeShopifyResponse([])),
    );

    const { getDb } = await import("@/lib/db");
    const db = getDb();
    db.prepare(
      "INSERT INTO brands (slug, name, url, tier, status, scrape_strategy) VALUES (?, ?, ?, ?, ?, ?)",
    ).run("test", "Test Brand", "https://example.com", "import", "active", "shopify");

    const { runScraper } = await import("@/lib/scraper/orchestrator");
    const res = await runScraper();
    expect(res.skipped).toBe(false);
    expect(res.added).toBe(0);

    const failure = db
      .prepare("SELECT stage, error FROM scrape_failures WHERE brand_slug = ?")
      .get("test") as { stage: string; error: string } | undefined;
    expect(failure?.stage).toBe("extract");
    expect(failure?.error).toMatch(/0 products/);

    const brand = db
      .prepare("SELECT consecutive_failures FROM brands WHERE slug = ?")
      .get("test") as { consecutive_failures: number };
    expect(brand.consecutive_failures).toBe(1);
  });

  it("respects dormant gating until retry window elapses", async () => {
    const fetchMock = vi.fn(async () => makeShopifyResponse([]));
    vi.stubGlobal("fetch", fetchMock);

    const { getDb } = await import("@/lib/db");
    const db = getDb();
    const dormantAt = Date.now() - 1000 * 60 * 60; // 1h ago
    db.prepare(
      "INSERT INTO brands (slug, name, url, tier, status, scrape_strategy, dormant) VALUES (?, ?, ?, ?, ?, ?, 1)",
    ).run("dorm", "Dorm", "https://example.com", "import", "active", "shopify");
    // ensureSchemaExtras runs inside runScraper; we'll set dormant_at after first invocation
    const { runScraper } = await import("@/lib/scraper/orchestrator");
    await runScraper();
    fetchMock.mockClear();
    db.prepare("UPDATE brands SET dormant_at = ? WHERE slug = ?").run(dormantAt, "dorm");

    process.env.PILLARPEARL_DORMANT_RETRY_MS = String(6 * 60 * 60 * 1000);
    await runScraper();
    expect(fetchMock).not.toHaveBeenCalled(); // dormant + within retry window

    process.env.PILLARPEARL_DORMANT_RETRY_MS = "1"; // expire window
    vi.resetModules();
    const orch2 = await import("@/lib/scraper/orchestrator");
    await orch2.runScraper();
    expect(fetchMock).toHaveBeenCalled();
    delete process.env.PILLARPEARL_DORMANT_RETRY_MS;
  });
});
