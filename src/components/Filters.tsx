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
  { value: "all", label: "Any" },
  { value: "usmade", label: "US-Made" },
  { value: "import", label: "Import" },
];

const CATEGORY_OPTIONS: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "control_tower", label: CATEGORY_META.control_tower.label },
  { value: "terp_slurper", label: CATEGORY_META.terp_slurper.label },
  { value: "dunking_station", label: CATEGORY_META.dunking_station.label },
];

const SORT_OPTIONS: {
  value: NonNullable<ProductFilters["sort"]>;
  label: string;
}[] = [
  { value: "brand", label: "Bench Pick" },
  { value: "name", label: "A → Z" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
];

const PAGE_SIZE = 12;

interface Props {
  products: NormalizedProduct[];
  initialCategory?: ProductCategory;
}

/* ── Sidebar filter group ── */
function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="filter-group"
      style={{ padding: "22px 0", borderBottom: "1px solid var(--color-line)" }}
    >
      <h4
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--color-fg)",
          marginBottom: 14,
        }}
      >
        {label}
      </h4>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
        {children}
      </ul>
    </div>
  );
}

/* ── Custom checkbox row ── */
function CheckRow({
  label,
  active,
  count,
  onClick,
}: {
  label: string;
  active: boolean;
  count?: number;
  onClick: () => void;
}) {
  return (
    <li>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: active ? "var(--color-fg)" : "var(--color-muted)",
          cursor: "pointer",
          transition: "color .2s",
        }}
      >
        <input
          type="checkbox"
          checked={active}
          onChange={onClick}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            width: 14,
            height: 14,
            borderRadius: 4,
            border: `1px solid ${active ? "var(--color-gold-light)" : "var(--color-line-strong)"}`,
            background: active
              ? "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))"
              : "rgba(255,255,255,0.04)",
            flexShrink: 0,
            transition: "all .2s",
            cursor: "pointer",
            position: "relative",
          }}
        />
        {label}
        {count !== undefined ? (
          <span
            style={{
              marginLeft: "auto",
              color: "var(--color-dim)",
              fontSize: 11,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {count}
          </span>
        ) : null}
      </label>
    </li>
  );
}

export default function Filters({ products, initialCategory }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCategory | "all">(
    initialCategory ?? "all",
  );
  const [tier, setTier] = useState<Tier | "all">("all");
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] =
    useState<NonNullable<ProductFilters["sort"]>>("brand");
  const [makerFilter, setMakerFilter] = useState<string | "all">("all");
  const [page, setPage] = useState(1);
  const [showAllMakers, setShowAllMakers] = useState(false);

  const visible = useMemo(() => {
    const searched = searchProducts(products, query);
    const filtered = filterProducts(searched, {
      category: category === "all" ? undefined : category,
      tier: tier === "all" ? undefined : tier,
      inStock,
      sort,
    });
    return makerFilter === "all"
      ? filtered
      : filtered.filter((p) => p.brandSlug === makerFilter);
  }, [products, query, category, tier, inStock, sort, makerFilter]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paged = visible.slice(pageStart, pageStart + PAGE_SIZE);

  const allMakers = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of products) m.set(p.brandSlug, p.brandName);
    return Array.from(m, ([slug, name]) => ({ slug, name })).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [products]);
  const visibleMakers = showAllMakers ? allMakers : allMakers.slice(0, 5);

  // active filter chips
  type Chip = { id: string; label: string; clear: () => void };
  const chips: Chip[] = [];
  if (query.trim()) {
    chips.push({
      id: "query",
      label: `"${query.trim()}"`,
      clear: () => { setQuery(""); setPage(1); },
    });
  }
  if (category !== "all") {
    chips.push({
      id: "cat",
      label: CATEGORY_META[category].label,
      clear: () => { setCategory("all"); setPage(1); },
    });
  }
  if (tier !== "all") {
    chips.push({
      id: "tier",
      label: tier === "usmade" ? "US-Made" : "Import",
      clear: () => { setTier("all"); setPage(1); },
    });
  }
  if (inStock) {
    chips.push({
      id: "stock",
      label: "In Stock",
      clear: () => { setInStock(false); setPage(1); },
    });
  }
  if (makerFilter !== "all") {
    const mk = allMakers.find((m) => m.slug === makerFilter);
    if (mk) {
      chips.push({
        id: "maker",
        label: mk.name,
        clear: () => { setMakerFilter("all"); setPage(1); },
      });
    }
  }

  const resetAll = () => {
    setQuery("");
    setCategory("all");
    setTier("all");
    setInStock(false);
    setSort("brand");
    setMakerFilter("all");
    setPage(1);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        gap: 48,
        paddingTop: 36,
      }}
      className="max-[880px]:[grid-template-columns:1fr]"
    >
      {/* ── Sidebar ── */}
      <aside
        className="max-[880px]:hidden"
        style={{ minWidth: 0 }}
      >
        {/* Refine heading */}
        <h3
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--color-gold-light)",
            marginBottom: 14,
            paddingBottom: 12,
            borderBottom: "1px solid var(--color-line-gold)",
          }}
        >
          Refine
        </h3>

        {/* Search */}
        <div style={{ padding: "18px 0", borderBottom: "1px solid var(--color-line)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--color-line)",
            }}
          >
            <svg
              className="pp-icon"
              aria-hidden
              style={{ flexShrink: 0, color: "var(--color-dim)" }}
            >
              <use href="#i-search" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder={`Search ${products.length} pieces…`}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--color-fg)",
                minWidth: 0,
              }}
            />
          </div>
        </div>

        {/* Type / Category */}
        <FilterGroup label="Type">
          {CATEGORY_OPTIONS.map((o) => (
            <CheckRow
              key={String(o.value)}
              label={o.label}
              active={category === o.value}
              onClick={() => { setCategory(o.value); setPage(1); }}
            />
          ))}
        </FilterGroup>

        {/* Brand / Maker */}
        <FilterGroup label="Brand">
          <CheckRow
            label="Any Brand"
            active={makerFilter === "all"}
            onClick={() => { setMakerFilter("all"); setPage(1); }}
          />
          {visibleMakers.map((m) => (
            <CheckRow
              key={m.slug}
              label={m.name}
              active={makerFilter === m.slug}
              onClick={() => { setMakerFilter(m.slug); setPage(1); }}
            />
          ))}
          {allMakers.length > 5 && (
            <li>
              <button
                type="button"
                onClick={() => setShowAllMakers((v) => !v)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--color-dim)",
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  cursor: "pointer",
                  padding: 0,
                  marginTop: 2,
                  letterSpacing: "0.04em",
                }}
              >
                {showAllMakers ? "− Show fewer" : `+ ${allMakers.length - 5} more`}
              </button>
            </li>
          )}
        </FilterGroup>

        {/* Origin / Tier */}
        <FilterGroup label="Origin">
          {TIER_OPTIONS.map((o) => (
            <CheckRow
              key={String(o.value)}
              label={o.label}
              active={tier === o.value}
              onClick={() => { setTier(o.value); setPage(1); }}
            />
          ))}
        </FilterGroup>

        {/* Availability */}
        <FilterGroup label="Availability">
          <CheckRow
            label="In stock only"
            active={inStock}
            onClick={() => { setInStock(!inStock); setPage(1); }}
          />
        </FilterGroup>

        {/* Reset */}
        {chips.length > 0 && (
          <div style={{ paddingTop: 18 }}>
            <button
              type="button"
              onClick={resetAll}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--color-muted)",
                fontFamily: "var(--font-sans)",
                fontSize: 11,
                letterSpacing: "0.06em",
                cursor: "pointer",
                padding: 0,
                transition: "color .2s",
              }}
            >
              Reset all filters
            </button>
          </div>
        )}
      </aside>

      {/* ── Main content ── */}
      <div style={{ minWidth: 0 }}>
        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            paddingBottom: 22,
            fontFamily: "var(--font-sans)",
          }}
        >
          {/* Applied chips */}
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              alignItems: "center",
              flex: 1,
              minWidth: 0,
            }}
          >
            {chips.map((c) => (
              <span
                key={c.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px 6px 12px",
                  borderRadius: 999,
                  background: "rgba(232,184,90,0.12)",
                  border: "1px solid var(--color-line-gold-2)",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  color: "var(--color-gold-light)",
                }}
              >
                {c.label}
                <button
                  type="button"
                  onClick={c.clear}
                  aria-label={`Clear ${c.label}`}
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    color: "var(--color-gold-light)",
                    width: 16,
                    height: 16,
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 10,
                    cursor: "pointer",
                    border: "none",
                    padding: 0,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </span>
            ))}
            {chips.length > 0 && (
              <button
                type="button"
                onClick={resetAll}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--color-muted)",
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  padding: "4px 10px",
                  cursor: "pointer",
                  transition: "color .2s",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Clear all
              </button>
            )}
          </div>

          {/* Right: count + sort */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                color: "var(--color-muted)",
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
              }}
            >
              Showing <strong style={{ color: "var(--color-fg)", fontWeight: 600 }}>{visible.length}</strong> pieces
            </span>
            <div style={{ position: "relative" }}>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as NonNullable<ProductFilters["sort"]>);
                  setPage(1);
                }}
                aria-label="Sort order"
                style={{
                  appearance: "none",
                  WebkitAppearance: "none",
                  padding: "8px 32px 8px 14px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--color-line)",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                  fontFamily: "var(--font-sans)",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option
                    key={o.value}
                    value={o.value}
                    style={{ background: "#111", textTransform: "none", letterSpacing: "normal" }}
                  >
                    {o.label}
                  </option>
                ))}
              </select>
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-gold-light)",
                  fontSize: 9,
                  pointerEvents: "none",
                }}
              >
                ▾
              </span>
            </div>
          </div>
        </div>

        {/* Grid or empty state */}
        {visible.length === 0 ? (
          <EmptyState
            title="Nothing matches that combo"
            body="Try loosening the filters or clearing the search box."
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "36px 16px",
            }}
            className="max-[1180px]:[grid-template-columns:repeat(3,1fr)] max-[880px]:[grid-template-columns:repeat(2,1fr)]"
          >
            {paged.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {visible.length > 0 && (
          <nav
            aria-label="Pagination"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              marginTop: 56,
              paddingTop: 32,
              borderTop: "1px solid var(--color-line)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {/* Previous */}
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 16px",
                borderRadius: 999,
                border: "1px solid var(--color-line)",
                background: "rgba(255,255,255,0.04)",
                fontSize: 12,
                fontWeight: 500,
                color: currentPage === 1 ? "var(--color-dim)" : "var(--color-muted)",
                cursor: currentPage === 1 ? "default" : "pointer",
                transition: "all .2s",
                fontFamily: "var(--font-sans)",
              }}
            >
              ← Previous
            </button>

            {/* Page numbers */}
            <div style={{ display: "inline-flex", gap: 4 }}>
              {pageNumbers(currentPage, totalPages).map((n, i) =>
                typeof n === "number" ? (
                  <button
                    key={`p-${n}`}
                    type="button"
                    onClick={() => setPage(n)}
                    aria-current={n === currentPage ? "page" : undefined}
                    aria-label={`Page ${n}`}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 999,
                      display: "grid",
                      placeItems: "center",
                      fontSize: 13,
                      fontWeight: 600,
                      fontVariantNumeric: "tabular-nums",
                      border: n === currentPage
                        ? "1px solid rgba(255,255,255,0.4)"
                        : "1px solid var(--color-line)",
                      background: n === currentPage
                        ? "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))"
                        : "rgba(255,255,255,0.04)",
                      color: n === currentPage ? "#000" : "var(--color-muted)",
                      boxShadow: n === currentPage
                        ? "inset 0 1px 0 rgba(255,255,255,0.55)"
                        : "none",
                      cursor: "pointer",
                      transition: "all .25s",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {n}
                  </button>
                ) : (
                  <span
                    key={`gap-${i}`}
                    aria-hidden
                    className="gap"
                    style={{
                      color: "var(--color-dim)",
                      alignSelf: "center",
                      padding: "0 6px",
                      fontSize: 14,
                    }}
                  >
                    …
                  </span>
                ),
              )}
            </div>

            {/* Next */}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 16px",
                borderRadius: 999,
                border: "1px solid var(--color-line)",
                background: "rgba(255,255,255,0.04)",
                fontSize: 12,
                fontWeight: 500,
                color: currentPage === totalPages ? "var(--color-dim)" : "var(--color-muted)",
                cursor: currentPage === totalPages ? "default" : "pointer",
                transition: "all .2s",
                fontFamily: "var(--font-sans)",
              }}
            >
              Next →
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}

function pageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "...")[] = [];
  out.push(1);
  if (current > 3) out.push("...");
  for (
    let n = Math.max(2, current - 1);
    n <= Math.min(total - 1, current + 1);
    n++
  ) {
    out.push(n);
  }
  if (current < total - 2) out.push("...");
  out.push(total);
  return out;
}
