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
  { value: "all", label: "All" },
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
  { value: "name", label: "Name" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
];

// Inline SVG chevron as data URI for native select caret
const CARET_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2376705f' stroke-width='1.4' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;

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
    <div className="grid lg:grid-cols-[280px_1fr] lg:gap-12">
      {/* ── Left rail: filters ── */}
      <aside className="surface-flat p-6 rounded-[var(--radius-md)] lg:sticky lg:top-24 self-start">
        {/* Search */}
        <div>
          <span className="eyebrow eyebrow-mute block">Search</span>
          <div className="relative mt-3">
            {/* Magnifier icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 ink-mute pointer-events-none"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 90 pieces — by brand, model, or keyword."
              className="w-full pl-9 pr-3 py-2 text-sm bg-transparent border-b border-[var(--color-line)] focus:border-[var(--color-amber)] focus:outline-none transition-colors rounded-none"
            />
          </div>
        </div>

        {/* Category select */}
        <div className="mt-6">
          <label>
            <span className="eyebrow eyebrow-mute block">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory | "all")}
              className="mt-3 w-full px-3 py-2 text-sm rounded-[2px] border border-[var(--color-line)] bg-[var(--color-bg-soft)] appearance-none bg-no-repeat focus:border-[var(--color-amber)] focus:outline-none"
              style={{
                backgroundImage: CARET_SVG,
                backgroundPosition: "right 12px center",
              }}
            >
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Tier segmented button group */}
        <div className="mt-6">
          <span className="eyebrow eyebrow-mute block">Tier</span>
          <div
            role="group"
            aria-label="Tier filter"
            className="mt-3 inline-flex rounded-[2px] border border-[var(--color-line)] overflow-hidden w-full"
          >
            {TIER_OPTIONS.map((o) => {
              const active = tier === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTier(o.value)}
                  className={`flex-1 px-3 py-2 text-xs uppercase tracking-[0.04em] transition-colors focus-ring ${
                    active
                      ? "bg-[var(--color-bg-elev)] text-[var(--color-ink)]"
                      : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort chip group */}
        <div className="mt-6">
          <span className="eyebrow eyebrow-mute block">Sort</span>
          <div
            role="group"
            aria-label="Sort order"
            className="mt-3 flex flex-wrap gap-2"
          >
            {SORT_OPTIONS.map((o) => {
              const active = sort === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSort(o.value)}
                  className={`rounded-[2px] border px-3 py-1.5 text-xs uppercase tracking-[0.04em] transition-colors focus-ring ${
                    active
                      ? "border-[var(--color-amber-deep)] text-[var(--color-amber-soft)]"
                      : "border-[var(--color-line)] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* In-stock checkbox */}
        <label className="mt-6 inline-flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-amber)]"
          />
          In-stock only
        </label>
      </aside>

      {/* ── Right region: result count + grid ── */}
      <div>
        <p className="mb-6 font-mono text-xs ink-mute text-right">
          Showing <span className="ink">{visible.length}</span> of{" "}
          {products.length}
        </p>

        {visible.length === 0 ? (
          <EmptyState
            title="Nothing matches that combo"
            body="Try loosening the filters or clearing the search box."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
