"use client";

import { useMemo, useState } from "react";
import type { NormalizedProduct, ProductCategory, Tier } from "@/types";
import {
  CATEGORY_META,
  filterProducts,
  type ProductFilters,
} from "@/lib/catalog-shared";
import { searchProducts } from "@/lib/search";
import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";

const TIER_OPTIONS: { value: Tier | "all"; label: string }[] = [
  { value: "all", label: "All tiers" },
  { value: "import", label: "Import" },
  { value: "usmade", label: "US-Made" },
];

const CATEGORY_OPTIONS: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "All categories" },
  { value: "control_tower", label: CATEGORY_META.control_tower.label },
  { value: "terp_slurper", label: CATEGORY_META.terp_slurper.label },
  { value: "dunking_station", label: CATEGORY_META.dunking_station.label },
];

const SORT_OPTIONS: { value: NonNullable<ProductFilters["sort"]>; label: string }[] = [
  { value: "brand", label: "Brand A–Z" },
  { value: "name", label: "Name A–Z" },
  { value: "price-asc", label: "Price: low → high" },
  { value: "price-desc", label: "Price: high → low" },
];

interface Props {
  products: NormalizedProduct[];
  initialCategory?: ProductCategory;
}

export default function Filters({ products, initialCategory }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCategory | "all">(
    initialCategory ?? "all",
  );
  const [tier, setTier] = useState<Tier | "all">("all");
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState<NonNullable<ProductFilters["sort"]>>("brand");

  const visible = useMemo(() => {
    const searched = searchProducts(products, query);
    return filterProducts(searched, {
      category: category === "all" ? undefined : category,
      tier: tier === "all" ? undefined : tier,
      inStock,
      sort,
    });
  }, [products, query, category, tier, inStock, sort]);

  return (
    <div>
      <div className="surface rounded-2xl p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-12">
          <label className="md:col-span-5">
            <span className="block text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
              Search
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Brand, model, slurper..."
              className="mt-2 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-bg)] px-3 py-2 text-sm focus:border-[var(--color-amber)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-amber)]/40"
            />
          </label>
          <label className="md:col-span-3">
            <span className="block text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
              Category
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory | "all")}
              className="mt-2 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-bg)] px-3 py-2 text-sm focus:border-[var(--color-amber)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-amber)]/40"
            >
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="md:col-span-2">
            <span className="block text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
              Tier
            </span>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as Tier | "all")}
              className="mt-2 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-bg)] px-3 py-2 text-sm focus:border-[var(--color-amber)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-amber)]/40"
            >
              {TIER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="md:col-span-2">
            <span className="block text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
              Sort
            </span>
            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value as NonNullable<ProductFilters["sort"]>)
              }
              className="mt-2 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-bg)] px-3 py-2 text-sm focus:border-[var(--color-amber)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-amber)]/40"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--color-ink-soft)]">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="h-4 w-4 accent-[var(--color-amber)]"
            />
            In-stock only
          </label>
          <p className="text-xs text-[var(--color-ink-mute)]">
            Showing <span className="text-[var(--color-amber)]">{visible.length}</span> of{" "}
            {products.length} products
          </p>
        </div>
      </div>

      <div className="mt-8">
        {visible.length === 0 ? (
          <EmptyState
            title="Nothing matches that combo"
            body="Try loosening the filters or clearing the search box."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
