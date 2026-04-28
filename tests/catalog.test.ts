import { describe, expect, it } from "vitest";
import {
  filterProducts,
  getAllBrands,
  getAllProducts,
  getBrandBySlug,
  getBrandSummaries,
  getMetadata,
  getProductById,
  getProductsByBrandSlug,
  getRelatedProducts,
  parsePrice,
  slugify,
} from "@/lib/catalog";

describe("slugify", () => {
  it("normalizes brand names into stable slugs", () => {
    expect(slugify("AFM Glass (Alien Flower Monkey)")).toBe(
      "afm-glass-alien-flower-monkey",
    );
    expect(slugify("Thick Ass Glass (TAG)")).toBe("thick-ass-glass-tag");
    expect(slugify("710 Coils")).toBe("710-coils");
  });

  it("strips diacritics", () => {
    expect(slugify("Café Quärtz")).toBe("cafe-quartz");
  });
});

describe("parsePrice", () => {
  it.each([
    ["$67", 67],
    ["~$40", 40],
    ["$300–310", 300],
    ["from $25.99", 25.99],
    ["varies", null],
    [null, null],
    [undefined, null],
  ])("parses %s -> %s", (input, expected) => {
    expect(parsePrice(input)).toBe(expected);
  });
});

describe("catalog", () => {
  it("exposes metadata", () => {
    const meta = getMetadata();
    expect(meta.title).toBe("Pillar & Pearl");
    expect(meta.summary.total_brands).toBeGreaterThan(0);
  });

  it("returns brands in declared order", () => {
    const brands = getAllBrands();
    expect(brands.length).toBe(getMetadata().summary.total_brands);
  });

  it("yields products with valid categories", () => {
    const products = getAllProducts();
    expect(products.length).toBeGreaterThan(0);
    for (const p of products) {
      expect(p.id).toContain("--");
      expect(["control_tower", "terp_slurper", "dunking_station"]).toContain(
        p.category,
      );
      expect(p.available).toBe(true);
    }
  });

  it("looks up brands and products by id", () => {
    const products = getAllProducts();
    const sample = products[0];
    expect(getProductById(sample.id)).toEqual(sample);
    expect(getBrandBySlug(sample.brandSlug)?.name).toBe(sample.brandName);
  });

  it("groups products by brand", () => {
    const summaries = getBrandSummaries();
    const someActive = summaries.find((s) => s.productCount > 0)!;
    const products = getProductsByBrandSlug(someActive.slug);
    expect(products.length).toBe(someActive.productCount);
  });

  it("returns related products in same category", () => {
    const target = getAllProducts().find(
      (p) => p.category === "terp_slurper",
    )!;
    const related = getRelatedProducts(target.id);
    expect(related.length).toBeGreaterThan(0);
    for (const r of related) {
      expect(r.category).toBe("terp_slurper");
      expect(r.id).not.toBe(target.id);
    }
  });
});

describe("filterProducts", () => {
  const all = getAllProducts();

  it("filters by category", () => {
    const towers = filterProducts(all, { category: "control_tower" });
    expect(towers.length).toBeGreaterThan(0);
    expect(towers.every((p) => p.category === "control_tower")).toBe(true);
  });

  it("filters by tier", () => {
    const usmade = filterProducts(all, { tier: "usmade" });
    expect(usmade.every((p) => p.brandTier === "usmade")).toBe(true);
  });

  it("filters in-stock only", () => {
    const inStock = filterProducts(all, { inStock: true });
    expect(inStock.every((p) => !p.soldOut && p.brandStatus === "active")).toBe(
      true,
    );
  });

  it("substring-matches the query", () => {
    const matches = filterProducts(all, { query: "slurper" });
    expect(matches.length).toBeGreaterThan(0);
  });

  it("sorts by price ascending", () => {
    const sorted = filterProducts(all, { sort: "price-asc" });
    const nums = sorted.map((p) => p.priceValue ?? Infinity);
    for (let i = 1; i < nums.length; i++) {
      expect(nums[i]).toBeGreaterThanOrEqual(nums[i - 1]);
    }
  });
});
