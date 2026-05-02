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
  { value: "all", label: "Any tier" },
  { value: "import", label: "Import" },
  { value: "usmade", label: "US-Made" },
];

const CATEGORY_OPTIONS: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "All instruments" },
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

const AVAILABILITY_OPTIONS: { id: string; label: string; value: boolean }[] = [
  { id: "any", label: "In stock — any", value: false },
  { id: "active", label: "In stock — active brand", value: true },
];

const PAGE_SIZE = 9;

interface Props {
  products: NormalizedProduct[];
  initialCategory?: ProductCategory;
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        borderBottom: "1px solid var(--color-hairline)",
        padding: "18px 0",
      }}
    >
      <div
        className="kicker kicker-light"
        style={{ marginBottom: 14 }}
      >
        {label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {children}
      </div>
    </div>
  );
}

function CheckRow({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={active}
      onClick={onClick}
      className="focus-ring"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        color: active ? "var(--color-pearl)" : "var(--color-bone)",
        cursor: "pointer",
        background: "transparent",
        border: "none",
        padding: 0,
        textAlign: "left",
        transition: "color var(--duration-fast) var(--ease-standard)",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 14,
          height: 14,
          borderRadius: 3,
          border: `1px solid ${active ? "var(--color-brass-light)" : "var(--color-hairline-strong)"}`,
          background: active
            ? "linear-gradient(135deg, var(--color-brass-light), var(--color-brass))"
            : "transparent",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: active ? "0 0 8px rgba(212,174,110,0.5)" : "none",
          flexShrink: 0,
        }}
      >
        {active ? (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 1,
              background: "var(--color-ink)",
              display: "block",
            }}
          />
        ) : null}
      </span>
      {label}
    </button>
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

  // priceVals for slider visualization
  const priceVals = products
    .map((p) => p.priceValue)
    .filter((v): v is number => v != null);
  const priceLo = priceVals.length ? Math.min(...priceVals) : 0;
  const priceHi = priceVals.length ? Math.max(...priceVals) : 1;

  // active filter chips
  type Chip = { id: string; label: string; clear: () => void };
  const chips: Chip[] = [];
  if (category !== "all") {
    chips.push({
      id: "cat",
      label: CATEGORY_META[category].label,
      clear: () => {
        setCategory("all");
        setPage(1);
      },
    });
  }
  if (tier !== "all") {
    chips.push({
      id: "tier",
      label: tier === "usmade" ? "US-Made" : "Import",
      clear: () => {
        setTier("all");
        setPage(1);
      },
    });
  }
  if (inStock) {
    chips.push({
      id: "stock",
      label: "Active brand only",
      clear: () => {
        setInStock(false);
        setPage(1);
      },
    });
  }
  if (makerFilter !== "all") {
    const mk = allMakers.find((m) => m.slug === makerFilter);
    if (mk) {
      chips.push({
        id: "maker",
        label: mk.name,
        clear: () => {
          setMakerFilter("all");
          setPage(1);
        },
      });
    }
  }
  if (query.trim()) {
    chips.push({
      id: "query",
      label: `“${query.trim()}”`,
      clear: () => {
        setQuery("");
        setPage(1);
      },
    });
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
        gridTemplateColumns: "minmax(0,1fr)",
      }}
      className="md:[grid-template-columns:280px_minmax(0,1fr)]"
    >
      {/* ── Left rail ── */}
      <aside
        className="md:min-h-[1400px] md:border-r md:border-[var(--color-hairline)]"
        style={{
          padding: "28px 24px",
        }}
      >
        <div
          className="kicker kicker-pearl"
          style={{
            paddingBottom: 16,
            borderBottom: "1px solid var(--color-hairline)",
            display: "flex",
            justifyContent: "space-between",
            color: "var(--color-pearl)",
          }}
        >
          <span>Refine</span>
          <button
            type="button"
            onClick={resetAll}
            className="focus-ring"
            style={{
              color: "var(--color-brass-light)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "inherit",
              letterSpacing: "inherit",
              textTransform: "inherit",
              padding: 0,
            }}
          >
            Reset
          </button>
        </div>

        {/* Search */}
        <FilterGroup label="Search">
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={`Search ${products.length} pieces…`}
            className="focus-ring"
            style={{
              width: "100%",
              padding: "10px 0",
              fontSize: 13,
              background: "transparent",
              border: "none",
              borderBottom: "1px solid var(--color-hairline)",
              color: "var(--color-pearl)",
              outline: "none",
              fontFamily: "var(--font-sans)",
            }}
          />
        </FilterGroup>

        {/* Category */}
        <FilterGroup label="Instrument">
          {CATEGORY_OPTIONS.map((o) => (
            <CheckRow
              key={String(o.value)}
              label={o.label}
              active={category === o.value}
              onClick={() => {
                setCategory(o.value);
                setPage(1);
              }}
            />
          ))}
        </FilterGroup>

        {/* Tier */}
        <FilterGroup label="Tier">
          {TIER_OPTIONS.map((o) => (
            <CheckRow
              key={String(o.value)}
              label={o.label}
              active={tier === o.value}
              onClick={() => {
                setTier(o.value);
                setPage(1);
              }}
            />
          ))}
        </FilterGroup>

        {/* Maker */}
        <FilterGroup label="Maker">
          <CheckRow
            label="Any maker"
            active={makerFilter === "all"}
            onClick={() => {
              setMakerFilter("all");
              setPage(1);
            }}
          />
          {visibleMakers.map((m) => (
            <CheckRow
              key={m.slug}
              label={m.name}
              active={makerFilter === m.slug}
              onClick={() => {
                setMakerFilter(m.slug);
                setPage(1);
              }}
            />
          ))}
          {allMakers.length > 5 && (
            <button
              type="button"
              onClick={() => setShowAllMakers((v) => !v)}
              className="focus-ring"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--color-bone)",
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                cursor: "pointer",
                textAlign: "left",
                padding: 0,
                marginTop: 4,
              }}
            >
              {showAllMakers
                ? "− show fewer"
                : `+ ${allMakers.length - 5} more`}
            </button>
          )}
        </FilterGroup>

        {/* Price slider — visualization only */}
        <div
          style={{
            borderBottom: "1px solid var(--color-hairline)",
            padding: "18px 0",
          }}
        >
          <div
            className="kicker kicker-light"
            style={{ marginBottom: 16 }}
          >
            Price · USD
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--color-pearl)",
              marginBottom: 12,
            }}
          >
            <span>${priceLo}</span>
            <span>${priceHi}</span>
          </div>
          <div
            aria-hidden
            style={{
              height: 4,
              background: "var(--color-ink-4)",
              position: "relative",
              borderRadius: 999,
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                background:
                  "linear-gradient(90deg, var(--color-brass-light), var(--color-brass))",
                borderRadius: 999,
                boxShadow: "0 0 8px var(--color-brass)",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: 0,
                top: -4,
                width: 12,
                height: 12,
                background: "var(--color-pearl)",
                borderRadius: "50%",
                transform: "translateX(-50%)",
                boxShadow: "0 0 0 1px var(--color-brass)",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: 0,
                top: -4,
                width: 12,
                height: 12,
                background: "var(--color-pearl)",
                borderRadius: "50%",
                transform: "translateX(50%)",
                boxShadow: "0 0 0 1px var(--color-brass)",
              }}
            />
          </div>
        </div>

        {/* Availability */}
        <FilterGroup label="Availability">
          {AVAILABILITY_OPTIONS.map((o) => (
            <CheckRow
              key={o.id}
              label={o.label}
              active={inStock === o.value}
              onClick={() => {
                setInStock(o.value);
                setPage(1);
              }}
            />
          ))}
        </FilterGroup>
      </aside>

      {/* ── Right region ── */}
      <main style={{ padding: "28px clamp(20px, 4vw, 40px)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
            paddingBottom: 24,
            borderBottom: "1px solid var(--color-hairline)",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              flex: 1,
              minWidth: 0,
            }}
          >
            {chips.length === 0 ? (
              <span
                className="font-mono ink-faint"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                No filters · showing all
              </span>
            ) : null}
            {chips.map((c) => (
              <span
                key={c.id}
                className="glass-card"
                style={{
                  borderRadius: 999,
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  color: "var(--color-pearl-2)",
                  padding: "8px 14px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {c.label}
                <button
                  type="button"
                  onClick={c.clear}
                  aria-label={`Clear ${c.label}`}
                  className="focus-ring"
                  style={{
                    color: "var(--color-smoke)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    fontSize: 14,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span
              className="heavy-glass"
              style={{
                borderRadius: 999,
                padding: "12px 18px",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--color-pearl-2)",
              }}
            >
              {visible.length} results
            </span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(
                  e.target.value as NonNullable<ProductFilters["sort"]>,
                );
                setPage(1);
              }}
              aria-label="Sort"
              className="focus-ring heavy-glass"
              style={{
                borderRadius: 999,
                padding: "12px 36px 12px 18px",
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                color: "var(--color-pearl)",
                fontWeight: 500,
                appearance: "none",
                background: "transparent",
                border: "1px solid var(--color-glass-border-strong)",
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option
                  key={o.value}
                  value={o.value}
                  style={{ background: "var(--color-ink-2)" }}
                >
                  Sort: {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            title="Nothing matches that combo"
            body="Try loosening the filters or clearing the search box."
          />
        ) : (
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            }}
          >
            {paged.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {visible.length > 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              marginTop: 40,
              paddingTop: 24,
              borderTop: "1px solid var(--color-hairline)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--color-smoke)",
              letterSpacing: "0.18em",
              flexWrap: "wrap",
            }}
          >
            <span style={{ textTransform: "uppercase" }}>
              Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, visible.length)}{" "}
              of {visible.length}
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              {pageNumbers(currentPage, totalPages).map((n, i) =>
                typeof n === "number" ? (
                  <button
                    key={`p-${n}`}
                    type="button"
                    onClick={() => setPage(n)}
                    aria-current={n === currentPage ? "page" : undefined}
                    aria-label={`Page ${n}`}
                    className="focus-ring"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${n === currentPage ? "var(--color-brass-light)" : "var(--color-hairline-strong)"}`,
                      color:
                        n === currentPage
                          ? "var(--color-pearl)"
                          : "var(--color-pearl-2)",
                      background:
                        n === currentPage
                          ? "linear-gradient(135deg, rgba(212,174,110,0.25), transparent)"
                          : "transparent",
                      boxShadow:
                        n === currentPage
                          ? "0 0 12px rgba(212,174,110,0.25)"
                          : "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: "inherit",
                    }}
                  >
                    {n.toString().padStart(2, "0")}
                  </button>
                ) : (
                  <span
                    key={`gap-${i}`}
                    aria-hidden
                    style={{
                      width: 38,
                      height: 38,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-smoke)",
                    }}
                  >
                    ··
                  </span>
                ),
              )}
            </div>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="focus-ring"
              style={{
                background: "transparent",
                border: "none",
                color:
                  currentPage === totalPages
                    ? "var(--color-smoke)"
                    : "var(--color-pearl)",
                cursor: currentPage === totalPages ? "default" : "pointer",
                fontFamily: "inherit",
                fontSize: "inherit",
                letterSpacing: "inherit",
                textTransform: "uppercase",
                padding: 0,
              }}
            >
              Load next →
            </button>
          </div>
        ) : null}
      </main>
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
