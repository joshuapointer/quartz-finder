import { describe, expect, it, beforeEach } from "vitest";
import { getAllProducts } from "@/lib/catalog";
import { resetSearchCache, searchProducts } from "@/lib/search";

describe("searchProducts", () => {
  beforeEach(() => resetSearchCache());

  it("returns all products on empty query", () => {
    const all = getAllProducts();
    expect(searchProducts(all, "").length).toBe(all.length);
  });

  it("fuzzy-matches brand names", () => {
    const products = getAllProducts();
    const hits = searchProducts(products, "honeybee");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((p) => p.brandName.toLowerCase().includes("honeybee"))).toBe(
      true,
    );
  });

  it("matches by category label", () => {
    const products = getAllProducts();
    const hits = searchProducts(products, "control tower");
    expect(hits.some((p) => p.category === "control_tower")).toBe(true);
  });
});
