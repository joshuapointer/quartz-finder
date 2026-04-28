import type { ProductCategory } from "@/types";

const RULES: Array<{ category: ProductCategory; patterns: RegExp[] }> = [
  {
    category: "control_tower",
    patterns: [
      /control\s*tower/i,
      /\bct\b/i,
      /\btall\s*flat\s*top\b/i,
    ],
  },
  {
    category: "terp_slurper",
    patterns: [
      /terp\s*slurper/i,
      /\bslurper\b/i,
      /\bslurp\b/i,
      /vortex\s*slurper/i,
    ],
  },
  {
    category: "dunking_station",
    patterns: [
      /dunking\s*station/i,
      /banger\s*basket/i,
      /iso\s*station/i,
      /soak\s*and\s*wash/i,
      /quartz\s*soak/i,
    ],
  },
];

export function classifyProduct(
  ...sources: Array<string | null | undefined>
): ProductCategory | null {
  const text = sources.filter(Boolean).join(" ").toLowerCase();
  if (!text) return null;
  for (const { category, patterns } of RULES) {
    if (patterns.some((p) => p.test(text))) return category;
  }
  return null;
}

export function isQuartzHardware(...sources: Array<string | null | undefined>): boolean {
  const text = sources.filter(Boolean).join(" ").toLowerCase();
  if (!text) return false;
  return /(banger|slurper|tower|terp|quartz|dab\s*nail|insert|carb\s*cap|pearl)/i.test(
    text,
  );
}
