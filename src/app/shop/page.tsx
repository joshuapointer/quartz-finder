import type { Metadata } from "next";
import { getAllProducts, getMetadata } from "@/lib/catalog";
import type { ProductCategory } from "@/types";
import Filters from "@/components/Filters";
import { Caustics } from "@/components/editorial";

export const metadata: Metadata = {
  title: "Bangers, indexed · The Quartz Index",
  description:
    "Filter and compare every quartz banger, terp slurper, and dunking station in the Pillar & Pearl atlas — shopped against authorized vendors, sorted by your bench.",
};

export const revalidate = 3600;

const VALID_CATEGORIES: ProductCategory[] = [
  "control_tower",
  "terp_slurper",
  "dunking_station",
];

interface SearchParams {
  category?: string;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const products = getAllProducts();
  const meta = getMetadata();
  const sp = await searchParams;
  const initialCategory =
    sp.category && (VALID_CATEGORIES as string[]).includes(sp.category)
      ? (sp.category as ProductCategory)
      : undefined;

  return (
    <div>
      <section
        style={{
          padding: "clamp(40px, 6vw, 56px) clamp(20px, 4vw, 40px) clamp(28px, 4vw, 40px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Caustics opacity={0.6} />
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--color-smoke)",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            <span>The Index</span>
            <span style={{ color: "var(--color-brass-light)" }}>/</span>
            <span>Bangers</span>
            <span style={{ color: "var(--color-brass-light)" }}>/</span>
            <span style={{ color: "var(--color-pearl)" }}>All</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 40,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1
                className="font-display ink"
                style={{
                  fontSize: "clamp(56px, 12vw, 140px)",
                  fontWeight: 200,
                  margin: 0,
                  lineHeight: 0.9,
                  letterSpacing: "-0.045em",
                }}
              >
                Bangers,{" "}
                <em
                  className="ink-brass-l"
                  style={{ fontWeight: 300, fontStyle: "italic" }}
                >
                  indexed.
                </em>
              </h1>
              <p
                className="font-display ink-soft"
                style={{
                  fontSize: 20,
                  fontStyle: "italic",
                  marginTop: 24,
                  maxWidth: 600,
                  lineHeight: 1.5,
                  fontWeight: 400,
                }}
              >
                {products.length.toLocaleString()} pieces from{" "}
                {meta.summary.active_brands} lapidaries — shopped against
                authorized vendors, sorted by your bench.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div style={{ borderTop: "1px solid var(--color-hairline)" }}>
        <Filters products={products} initialCategory={initialCategory} />
      </div>
    </div>
  );
}
