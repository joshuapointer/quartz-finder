import type { NormalizedProduct, ProductCategory } from "@/types";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function parsePrice(price: string | null | undefined): number | null {
  if (!price) return null;
  const match = price.match(/\$?\s*(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isFinite(n) ? n : null;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  control_tower: "Control Tower",
  terp_slurper: "Terp Slurper",
  dunking_station: "Dunking Station",
};

export const CATEGORY_ORDER: ProductCategory[] = [
  "control_tower",
  "terp_slurper",
  "dunking_station",
];

export const CATEGORY_META: Record<
  ProductCategory,
  { label: string; tagline: string; slug: string }
> = {
  control_tower: {
    label: "Control Towers",
    tagline: "Tall chambers, big dabs, less splash.",
    slug: "control_tower",
  },
  terp_slurper: {
    label: "Terp Slurpers",
    tagline: "Vortex airflow. Flavor first.",
    slug: "terp_slurper",
  },
  dunking_station: {
    label: "Dunking Stations",
    tagline: "Loaders, troughs, ISO baskets.",
    slug: "dunking_station",
  },
};

export interface ProductFilters {
  category?: ProductCategory;
  tier?: "import" | "usmade";
  inStock?: boolean;
  query?: string;
  sort?: "price-asc" | "price-desc" | "brand" | "name";
}

export function filterProducts(
  products: NormalizedProduct[],
  filters: ProductFilters,
): NormalizedProduct[] {
  let result = [...products];

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters.tier) {
    result = result.filter((p) => p.brandTier === filters.tier);
  }
  if (filters.inStock) {
    result = result.filter((p) => !p.soldOut && p.brandStatus === "active");
  }
  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q),
    );
  }

  switch (filters.sort) {
    case "price-asc":
    case "price-desc": {
      const dir = filters.sort === "price-asc" ? 1 : -1;
      result.sort((a, b) => {
        const ap = a.priceValue;
        const bp = b.priceValue;
        if (ap == null && bp == null) return 0;
        if (ap == null) return 1;
        if (bp == null) return -1;
        return (ap - bp) * dir;
      });
      break;
    }
    case "brand":
      result.sort((a, b) => a.brandName.localeCompare(b.brandName));
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return result;
}
