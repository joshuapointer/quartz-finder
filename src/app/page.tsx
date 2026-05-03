import Link from "next/link";
import { getAllProducts, getBrandSummaries } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

const goldEm: React.CSSProperties = {
  fontStyle: "italic",
  fontWeight: 400,
  background: "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

export default function HomePage() {
  const allProducts = getAllProducts();
  const brands = getBrandSummaries();

  const picks = allProducts
    .filter((p) => !p.soldOut && p.priceValue != null)
    .slice(0, 10);

  const topBrands = brands
    .filter((b) => b.status === "active")
    .slice(0, 10);

  const brandNames =
    topBrands.length > 0
      ? topBrands.map((b) => b.name)
      : [
          "Joel Halen",
          "710 Coils",
          "AFM Glass",
          "GeeWest",
          "DC Heat",
          "ZOB",
          "Toro",
          "Termini",
          "Highly Educated",
          "Quave",
        ];

  return (
    <>
      {/* ── Headline section ── */}
      <section
        style={{
          paddingTop: 64,
          paddingBottom: 40,
        }}
      >
        <div className="eyebrow" style={{ marginBottom: 28 }}>
          For quartz enthusiasts
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(52px, 8.4vw, 136px)",
            fontWeight: 500,
            lineHeight: 0.92,
            letterSpacing: "-0.045em",
            maxWidth: "12ch",
            margin: "0 0 36px",
          }}
        >
          Good glass.
          <br />
          <em style={goldEm}>Best prices.</em>
        </h1>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/shop" className="btn btn-primary">
            Shop the bench →
          </Link>
          <Link href="/brands" className="btn btn-ghost">
            Browse brands
          </Link>
        </div>
      </section>

      {/* ── Brand marquee ── */}
      <div className="brand-strip" aria-label="Featured makers">
        <div className="brand-strip-inner">
          <span>
            {brandNames.map((name) => (
              <span key={`a-${name}`}>{name}</span>
            ))}
          </span>
          <span>
            {brandNames.map((name) => (
              <span key={`b-${name}`}>{name}</span>
            ))}
          </span>
        </div>
      </div>

      {/* ── Today's picks ── */}
      <section id="bench" style={{ paddingTop: 56, paddingBottom: 72 }}>
        {/* Section head */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(36px, 5vw, 60px)",
                fontWeight: 500,
                letterSpacing: "-0.035em",
                lineHeight: 0.95,
                margin: "0 0 10px",
              }}
            >
              Today&apos;s <em style={goldEm}>picks.</em>
            </h2>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--color-muted)",
                letterSpacing: "0.06em",
              }}
            >
              Hand-selected for the bench.
            </span>
          </div>
        </div>

        {/* Filter pills */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <Link href="/shop" className="filter-pill on">
            All
          </Link>
          <Link
            href="/shop?category=control_tower"
            className="filter-pill"
          >
            Control Towers
          </Link>
          <Link
            href="/shop?category=terp_slurper"
            className="filter-pill"
          >
            Terp Slurpers
          </Link>
          <Link
            href="/shop?category=dunking_station"
            className="filter-pill"
          >
            Dunking Stations
          </Link>
          <Link href="/shop?usmade=1" className="filter-pill">
            US-Made
          </Link>
          <span
            className="filter-pill"
            style={{ marginLeft: "auto", cursor: "default" }}
            aria-label="Current sort"
          >
            Sort: Featured
          </span>
        </div>

        {/* Product grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "36px 16px",
          }}
        >
          {picks.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <style>{`
          @media (max-width: 1200px) {
            #bench > div:last-child { grid-template-columns: repeat(4, 1fr) !important; }
          }
          @media (max-width: 900px) {
            #bench > div:last-child { grid-template-columns: repeat(3, 1fr) !important; }
          }
          @media (max-width: 600px) {
            #bench > div:last-child { grid-template-columns: repeat(2, 1fr) !important; }
          }
        `}</style>
      </section>
    </>
  );
}
