import { describe, expect, it } from "vitest";
import { getDb } from "@/lib/db";
import { seedIfEmpty } from "@/lib/seed";

describe("seed", () => {
  it("seeds DB from catalog.json on first call", () => {
    const res = seedIfEmpty();
    expect(res.brands).toBeGreaterThan(0);
    expect(res.products).toBeGreaterThan(0);
  });

  it("is idempotent", () => {
    seedIfEmpty();
    const second = seedIfEmpty();
    expect(second.seeded).toBe(false);
  });

  it("populates brands + products tables", () => {
    seedIfEmpty();
    const db = getDb();
    const b = db.prepare("SELECT COUNT(*) AS n FROM brands").get() as { n: number };
    const p = db.prepare("SELECT COUNT(*) AS n FROM products").get() as { n: number };
    expect(b.n).toBeGreaterThan(0);
    expect(p.n).toBeGreaterThan(0);
  });
});
