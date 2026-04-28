import Fuse from "fuse.js";
import type { NormalizedProduct } from "@/types";

const indexCache = new WeakMap<NormalizedProduct[], Fuse<NormalizedProduct>>();

export function buildSearchIndex(
  products: NormalizedProduct[],
): Fuse<NormalizedProduct> {
  const cached = indexCache.get(products);
  if (cached) return cached;
  const fuse = new Fuse(products, {
    keys: [
      { name: "name", weight: 0.5 },
      { name: "brandName", weight: 0.3 },
      { name: "categoryLabel", weight: 0.2 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
  indexCache.set(products, fuse);
  return fuse;
}

export function searchProducts(
  products: NormalizedProduct[],
  query: string,
): NormalizedProduct[] {
  if (!query.trim()) return products;
  return buildSearchIndex(products)
    .search(query)
    .map((r) => r.item);
}

export function resetSearchCache(): void {
  // No-op kept for backwards compat; the WeakMap GCs entries when arrays go out of scope.
}
