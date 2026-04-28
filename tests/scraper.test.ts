import { describe, expect, it } from "vitest";
import { classifyProduct, isQuartzHardware } from "@/lib/scraper/classify";

describe("classifyProduct", () => {
  it("classifies control tower variants", () => {
    expect(classifyProduct("Control Tower Banger 25mm")).toBe("control_tower");
    expect(classifyProduct("CT 30mm Beveled Top", "tag: control-tower")).toBe(
      "control_tower",
    );
  });

  it("classifies terp slurpers", () => {
    expect(classifyProduct("Terp Slurper Set")).toBe("terp_slurper");
    expect(classifyProduct("Vortex Slurper 25mm")).toBe("terp_slurper");
  });

  it("classifies dunking stations", () => {
    expect(classifyProduct("Dunking Station Combo")).toBe("dunking_station");
    expect(classifyProduct("Banger Basket Dual Chamber")).toBe(
      "dunking_station",
    );
    expect(classifyProduct("ISO Station Quartz Soak")).toBe("dunking_station");
  });

  it("returns null when no rule matches", () => {
    expect(classifyProduct("Random Lighter")).toBeNull();
    expect(classifyProduct(null, undefined, "")).toBeNull();
  });
});

describe("isQuartzHardware", () => {
  it.each([
    ["Quartz Banger 25mm", true],
    ["Terp Pearl Set", true],
    ["Carb Cap", true],
    ["T-shirt Logo Black", false],
    ["Dab tray rosin pad", false],
  ])("recognizes %s -> %s", (text, expected) => {
    expect(isQuartzHardware(text)).toBe(expected);
  });
});
