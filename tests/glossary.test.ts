import { describe, expect, it } from "vitest";
import { GLOSSARY } from "@/lib/glossary";

describe("glossary", () => {
  it("includes the three core categories", () => {
    const terms = GLOSSARY.map((g) => g.term);
    expect(terms).toContain("Control Tower");
    expect(terms).toContain("Terp Slurper");
    expect(terms).toContain("Dunking Station");
  });

  it("has unique entries", () => {
    const terms = GLOSSARY.map((g) => g.term);
    expect(new Set(terms).size).toBe(terms.length);
  });

  it("provides short + full definitions for every entry", () => {
    for (const g of GLOSSARY) {
      expect(g.short.length).toBeGreaterThan(0);
      expect(g.full.length).toBeGreaterThan(g.short.length);
    }
  });
});
