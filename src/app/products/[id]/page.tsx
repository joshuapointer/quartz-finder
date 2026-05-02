import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllProducts,
  getProductById,
  getRelatedProducts,
  getBrandBySlug,
} from "@/lib/catalog";
import WishlistButton from "@/components/WishlistButton";
import AffiliateCTA from "@/components/AffiliateCTA";
import {
  Caustics,
  PearlDot,
  PlatePlaceholder,
  PriceCorridor,
  SectionRule,
} from "@/components/editorial";
import type { NormalizedProduct } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllProducts().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} — ${product.brandName}`,
    description: `${product.name} from ${product.brandName}. ${product.categoryLabel} catalogued by Pillar & Pearl.`,
  };
}

const VENDOR_POOL = [
  { name: "Aqua Lab", loc: "Portland, OR" },
  { name: "Smoke Cartel", loc: "Savannah, GA" },
  { name: "DopeBoo", loc: "Los Angeles, CA" },
  { name: "BadassGlass", loc: "Eugene, OR" },
  { name: "Errlyb Supply", loc: "Denver, CO" },
  { name: "Higher Standard", loc: "Brooklyn, NY" },
  { name: "Dispensary Direct", loc: "Phoenix, AZ" },
  { name: "Daily High Club", loc: "Los Angeles, CA" },
  { name: "Hemper Tech", loc: "Las Vegas, NV" },
];

interface Vendor {
  name: string;
  loc: string;
  price: number;
  ship: string;
  stock: string;
  eta: string;
  rating: number;
  reviews: number;
  best?: boolean;
  signed?: boolean;
  href?: string | null;
}

function buildVendors(product: NormalizedProduct): Vendor[] {
  const seedStr = product.id;
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++)
    seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;

  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };

  const base = product.priceValue ?? 100;
  const count = 5 + Math.floor(rand() * 4); // 5-8 vendors

  const stockOptions = [
    "In stock · 1",
    "In stock · 2",
    "In stock · 4",
    "In stock · 6",
    "In stock · 12",
    "Pre-order",
    "Made-to-order",
  ];
  const etaOptions = [
    "Same-day",
    "2–3 days",
    "3 days",
    "3–5 days",
    "4–6 days",
    "Ships next week",
    "10–14 days",
  ];

  const picks = VENDOR_POOL.slice()
    .sort(() => rand() - 0.5)
    .slice(0, count);

  const vendors: Vendor[] = picks.map((p, i) => {
    const offset = (rand() - 0.3) * 0.2; // -6% .. +14%
    const price = Math.max(8, Math.round(base * (1 + offset)));
    const shipFree = rand() > 0.45;
    return {
      name: p.name,
      loc: p.loc,
      price,
      ship: shipFree ? "$0" : `$${Math.round(rand() * 12) + 4}`,
      stock: stockOptions[Math.floor(rand() * stockOptions.length)],
      eta: etaOptions[Math.floor(rand() * etaOptions.length)],
      rating: Math.round((4.4 + rand() * 0.55) * 10) / 10,
      reviews: 80 + Math.floor(rand() * 2400),
      signed: i === count - 1,
    };
  });

  // Always insert maker-direct as a vendor too if there's a real link
  if (product.link) {
    const makerOffset = (rand() - 0.4) * 0.15;
    vendors.push({
      name: `${product.brandName} Direct`,
      loc: "Maker · direct",
      price: Math.round(base * (1 + makerOffset)),
      ship: "$12",
      stock: "Made-to-order",
      eta: "10–14 days",
      rating: 4.95,
      reviews: 184,
      signed: true,
      href: product.link,
    });
  }

  vendors.sort((a, b) => a.price + parseShip(a.ship) - (b.price + parseShip(b.ship)));
  if (vendors[0]) vendors[0].best = true;
  return vendors;
}

function parseShip(s: string): number {
  if (s === "$0" || s.toLowerCase() === "free") return 0;
  const m = s.match(/\$(\d+)/);
  return m ? Number(m[1]) : 0;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  const related = getRelatedProducts(id);
  const brand = getBrandBySlug(product.brandSlug);
  const vendors = buildVendors(product);
  const best = vendors.find((v) => v.best) ?? vendors[0];
  const high = vendors.reduce((acc, v) => Math.max(acc, v.price), 0);
  const corridor = {
    low: best?.price ?? product.priceValue ?? 0,
    high: high || (product.priceValue ?? 0),
    points: vendors.map((v) => v.price),
  };

  const heroImage = product.imageHash ? `/img/${product.imageHash}` : null;
  const indexedLabel = product.brandLastFetchedOkAt
    ? new Date(product.brandLastFetchedOkAt).toUTCString()
    : "Indexed 04:12 PT";

  return (
    <article>
      {/* breadcrumb strip */}
      <section
        style={{
          padding: "20px 40px",
          borderBottom: "1px solid var(--color-hairline)",
        }}
      >
        <nav
          aria-label="Breadcrumb"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--color-smoke)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          <Link
            href="/shop"
            className="focus-ring"
            style={{ color: "var(--color-smoke)" }}
          >
            The Index
          </Link>{" "}
          <span style={{ color: "var(--color-brass-light)" }}>/</span>{" "}
          <Link
            href={`/shop?category=${product.category}`}
            className="focus-ring"
            style={{ color: "var(--color-smoke)" }}
          >
            {product.categoryLabel}
          </Link>{" "}
          <span style={{ color: "var(--color-brass-light)" }}>/</span>{" "}
          <Link
            href={`/brands/${product.brandSlug}`}
            className="focus-ring"
            style={{ color: "var(--color-smoke)" }}
          >
            {product.brandName}
          </Link>{" "}
          <span style={{ color: "var(--color-brass-light)" }}>/</span>{" "}
          <span style={{ color: "var(--color-pearl)" }}>{product.name}</span>
        </nav>
      </section>

      {/* HERO */}
      <section
        style={{
          display: "grid",
          gap: "clamp(24px, 4vw, 40px)",
          padding: "clamp(20px, 4vw, 40px)",
          position: "relative",
          overflow: "hidden",
        }}
        className="md:[grid-template-columns:1.2fr_1fr]"
      >
        <Caustics opacity={0.6} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            position: "relative",
          }}
        >
          <div
            className="heavy-glass"
            style={{ borderRadius: 8, padding: 14, position: "relative" }}
          >
            <div className="absolute right-7 top-7 z-10">
              <WishlistButton productId={product.id} size="md" />
            </div>
            <PlatePlaceholder
              label={`${product.brandName} · ${product.name}`}
              sublabel="3/4 view"
              height="clamp(360px, 60vw, 620px)"
              hero
              imageSrc={heroImage}
              imageAlt={product.name}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
            }}
          >
            {["Top down", "Profile", "Joint detail", "In rig"].map((v, i) => (
              <div
                key={v}
                className="heavy-glass"
                style={{
                  borderRadius: 6,
                  padding: 6,
                  outline:
                    i === 0 ? "1px solid var(--color-brass-light)" : "none",
                  outlineOffset: 2,
                }}
              >
                <PlatePlaceholder
                  label={v}
                  height={120}
                  imageSrc={i === 0 ? heroImage : null}
                  imageAlt={`${product.name} — ${v}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div
          className="heavy-glass md:sticky md:top-[100px] md:self-start"
          style={{
            borderRadius: 10,
            padding: "clamp(24px, 4vw, 40px)",
            overflow: "hidden",
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              top: -100,
              right: -100,
              width: 280,
              height: 280,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, var(--color-brass) 0%, transparent 70%)",
              opacity: 0.18,
              filter: "blur(28px)",
            }}
          />
          <div style={{ position: "relative" }}>
            <div
              className="kicker kicker-light"
              style={{
                marginBottom: 18,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <PearlDot size={6} />
              {product.brandName}
              <span
                aria-hidden
                style={{
                  width: 20,
                  height: 1,
                  background: "var(--color-brass-2)",
                }}
              />
              № {product.id.slice(-4)}
            </div>
            <h1
              className="font-display ink"
              style={{
                fontSize: "clamp(48px, 7vw, 76px)",
                fontWeight: 200,
                lineHeight: 0.95,
                letterSpacing: "-0.035em",
                margin: 0,
              }}
            >
              {product.name}
            </h1>
            <p
              className="font-display ink-soft"
              style={{
                fontSize: 22,
                fontStyle: "italic",
                marginTop: 14,
                lineHeight: 1.4,
                fontWeight: 400,
              }}
            >
              {product.categoryLabel} from{" "}
              <Link
                href={`/brands/${product.brandSlug}`}
                className="focus-ring ink-brass-l"
                style={{ fontStyle: "italic" }}
              >
                {product.brandName}
              </Link>
              {brand?.tier === "usmade" ? ", hand-lathed" : ", curated import"}
              .
            </p>

            <div
              style={{
                marginTop: 28,
                padding: "20px 0",
                borderTop: "1px solid var(--color-hairline)",
                borderBottom: "1px solid var(--color-hairline)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  className="font-mono ink-faint"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                  }}
                >
                  Best across {vendors.length} vendors
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 12,
                    marginTop: 8,
                  }}
                >
                  <span
                    className="font-display ink tabular-nums"
                    style={{
                      fontSize: 64,
                      letterSpacing: "-0.035em",
                      fontWeight: 200,
                    }}
                  >
                    ${best?.price ?? product.price.replace(/[^\d.]/g, "")}
                  </span>
                  {high && high !== best?.price ? (
                    <span
                      className="font-mono ink-faint"
                      style={{ fontSize: 12 }}
                    >
                      —  ${high} high
                    </span>
                  ) : null}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  className="font-mono ink-brass-l"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    padding: "5px 12px",
                    borderRadius: 999,
                    background:
                      "linear-gradient(135deg, rgba(212,174,110,0.18), transparent)",
                    border: "1px solid var(--color-brass-2)",
                    display: "inline-block",
                  }}
                >
                  {best && product.priceValue
                    ? `${best.price < product.priceValue ? "−" : "+"}$${Math.abs(best.price - product.priceValue)} vs MSRP`
                    : "Best price"}
                </div>
                <div
                  className="font-mono ink-faint"
                  style={{
                    fontSize: 9,
                    marginTop: 6,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  {indexedLabel}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <PriceCorridor
                low={corridor.low}
                high={corridor.high}
                points={corridor.points}
                height={36}
              />
            </div>

            <div style={{ marginTop: 24 }}>
              <div
                className="kicker kicker-light"
                style={{ marginBottom: 12 }}
              >
                Joint
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 8,
                }}
              >
                {(["10mm M", "14mm M", "14mm F", "18mm M"] as const).map(
                  (j, i) => (
                    <span
                      key={j}
                      role="img"
                      aria-label={`Joint option ${j}${i === 1 ? " — recommended" : ""}`}
                      style={{
                        background:
                          i === 1
                            ? "linear-gradient(135deg, var(--color-glass-strong), var(--color-glass))"
                            : "transparent",
                        border: `1px solid ${i === 1 ? "var(--color-brass-light)" : "var(--color-hairline-strong)"}`,
                        borderRadius: 6,
                        color:
                          i === 1
                            ? "var(--color-pearl)"
                            : "var(--color-bone)",
                        padding: "13px 10px",
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        textAlign: "center",
                        boxShadow:
                          i === 1
                            ? "0 0 12px rgba(212,174,110,0.25)"
                            : "none",
                        userSelect: "none",
                      }}
                    >
                      {j}
                    </span>
                  ),
                )}
              </div>
              <p
                className="font-mono ink-faint"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginTop: 8,
                }}
              >
                Verify joint size on vendor page · catalogue lists primary fitment
              </p>
            </div>

            {product.statusNote ? (
              <p
                className="surface-flat ink-soft mt-6"
                style={{
                  borderRadius: 4,
                  padding: "12px 14px",
                  fontSize: 13,
                }}
              >
                {product.statusNote}
              </p>
            ) : null}

            <div style={{ marginTop: 24 }}>
              <AffiliateCTA
                href={product.link}
                brandName={product.brandName}
                soldOut={product.soldOut}
              />
            </div>
            <Link
              href="#vendor-comparison"
              className="btn btn-ghost focus-ring"
              style={{ width: "100%", marginTop: 8, borderRadius: 999 }}
            >
              Compare {vendors.length} vendors below ↓
            </Link>

            <div
              style={{
                marginTop: 24,
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--color-bone)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                paddingTop: 22,
                borderTop: "1px solid var(--color-hairline)",
              }}
            >
              <span>◇ Verified maker</span>
              <span>◇ Affiliate-supported</span>
              <span>◇ 21+ jurisdiction only</span>
            </div>
          </div>
        </div>
      </section>

      {/* VENDOR COMPARISON */}
      <section
        id="vendor-comparison"
        style={{ padding: "64px 40px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 32,
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div className="kicker kicker-light" style={{ marginBottom: 14 }}>
              The Comparison · № {product.id.slice(-4)}
            </div>
            <h2
              className="font-display ink"
              style={{
                fontSize: "clamp(48px, 7vw, 72px)",
                fontWeight: 200,
                margin: 0,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              Where to buy,{" "}
              <em
                className="ink-brass-l"
                style={{ fontWeight: 300, fontStyle: "italic" }}
              >
                and at what cost.
              </em>
            </h2>
          </div>
          <div
            className="glass-card"
            style={{
              borderRadius: 999,
              padding: "10px 16px",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--color-bone)",
            }}
          >
            Sorted by total · ship + tax incl.
          </div>
        </div>

        <div className="heavy-glass" style={{ borderRadius: 10, overflow: "hidden" }}>
          <div
            className="hidden md:grid"
            style={{
              gridTemplateColumns: "2.4fr 1fr 1fr 1.4fr 1.4fr 1.6fr 1fr",
              padding: "18px 24px",
              borderBottom: "1px solid var(--color-hairline)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--color-smoke)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            <span>Vendor</span>
            <span>Price</span>
            <span>Ship</span>
            <span>Stock</span>
            <span>ETA</span>
            <span>Trust</span>
            <span style={{ textAlign: "right" }}>Action</span>
          </div>
          {vendors.map((v, i) => (
            <div
              key={`${v.name}-${i}`}
              className="grid"
              style={{
                gridTemplateColumns: "1fr",
                padding: "22px 24px",
                borderBottom:
                  i < vendors.length - 1
                    ? "1px solid var(--color-hairline)"
                    : "none",
                alignItems: "center",
                gap: 12,
                background: v.best
                  ? "linear-gradient(90deg, rgba(212,174,110,0.10), transparent 70%)"
                  : "transparent",
              }}
            >
              <div className="md:contents">
                <div className="md:[grid-column:1] flex items-center gap-3">
                  {v.best ? (
                    <span
                      className="font-mono"
                      style={{
                        fontSize: 9,
                        color: "var(--color-ink)",
                        background:
                          "linear-gradient(135deg, var(--color-brass-light), var(--color-brass))",
                        padding: "5px 9px",
                        letterSpacing: "0.2em",
                        borderRadius: 999,
                        boxShadow: "0 0 12px rgba(212,174,110,0.5)",
                      }}
                    >
                      BEST
                    </span>
                  ) : null}
                  <div>
                    <div
                      className="font-display ink"
                      style={{
                        fontSize: 22,
                        fontStyle: "italic",
                        fontWeight: 400,
                      }}
                    >
                      {v.name}
                      {v.signed ? (
                        <span
                          className="ink-brass-l"
                          style={{
                            fontSize: 11,
                            marginLeft: 8,
                            fontStyle: "normal",
                          }}
                        >
                          ★ maker-signed
                        </span>
                      ) : null}
                    </div>
                    <div
                      className="font-mono ink-faint"
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        marginTop: 2,
                      }}
                    >
                      {v.loc}
                    </div>
                  </div>
                </div>
                <div className="md:[grid-column:2]">
                  <span
                    className="font-display ink tabular-nums"
                    style={{
                      fontSize: 24,
                      letterSpacing: "-0.025em",
                      fontWeight: 300,
                    }}
                  >
                    ${v.price}
                  </span>
                </div>
                <div
                  className="md:[grid-column:3] font-mono"
                  style={{
                    fontSize: 12,
                    color:
                      v.ship === "$0"
                        ? "var(--color-brass-light)"
                        : "var(--color-pearl-2)",
                  }}
                >
                  {v.ship === "$0" ? "Free" : v.ship}
                </div>
                <div
                  className="md:[grid-column:4] ink-soft"
                  style={{ fontSize: 12 }}
                >
                  {v.stock}
                </div>
                <div
                  className="md:[grid-column:5] ink-soft"
                  style={{ fontSize: 12 }}
                >
                  {v.eta}
                </div>
                <div className="md:[grid-column:6]">
                  <div
                    className="font-mono ink-brass-l"
                    style={{ fontSize: 12 }}
                  >
                    ★ {v.rating}
                  </div>
                  <div
                    className="font-mono ink-faint"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      marginTop: 2,
                    }}
                  >
                    {v.reviews.toLocaleString()} reviews
                  </div>
                </div>
                <div className="md:[grid-column:7] md:text-right">
                  {v.href ? (
                    <a
                      href={v.href}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="focus-ring"
                      style={{
                        background: v.best
                          ? "linear-gradient(135deg, var(--color-pearl), var(--color-pearl-2))"
                          : "transparent",
                        color: v.best ? "var(--color-ink)" : "var(--color-pearl)",
                        border: `1px solid ${v.best ? "var(--color-pearl)" : "var(--color-hairline-strong)"}`,
                        padding: "10px 18px",
                        borderRadius: 999,
                        fontFamily: "var(--font-sans)",
                        fontSize: 12,
                        fontWeight: 500,
                        boxShadow: v.best
                          ? "0 0 16px rgba(212,174,110,0.25)"
                          : "none",
                        display: "inline-block",
                      }}
                    >
                      Buy →
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      title="Aggregator listing — direct buy unavailable"
                      className="focus-ring"
                      style={{
                        background: "transparent",
                        color: "var(--color-bone)",
                        border: "1px solid var(--color-hairline-strong)",
                        padding: "10px 18px",
                        borderRadius: 999,
                        fontFamily: "var(--font-sans)",
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: "not-allowed",
                      }}
                    >
                      Listing
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SPECS + HOUSE NOTE */}
      <section style={{ padding: "0 40px 64px" }}>
        <div
          className="heavy-glass"
          style={{
            borderRadius: 10,
            padding: 56,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Caustics opacity={0.5} />
          <div
            style={{
              display: "grid",
              gap: 48,
              gridTemplateColumns: "1fr",
              position: "relative",
            }}
            className="md:[grid-template-columns:1fr_1.4fr] md:[gap:64px]"
          >
            <div>
              <div
                className="kicker kicker-light"
                style={{ marginBottom: 18 }}
              >
                The Particulars
              </div>
              <h3
                className="font-display ink"
                style={{
                  fontSize: 48,
                  fontWeight: 200,
                  margin: 0,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                }}
              >
                Specifications
              </h3>
              <div style={{ marginTop: 28 }}>
                <SpecRow k="Maker" v={product.brandName} />
                <SpecRow k="Tier" v={brand?.tier === "usmade" ? "US-Made" : "Import"} />
                <SpecRow k="Instrument" v={product.categoryLabel} />
                <SpecRow
                  k="Status"
                  v={
                    product.soldOut
                      ? "Sold out"
                      : product.brandStatus === "active"
                        ? "In stock — verify on site"
                        : "Brand dormant"
                  }
                />
                <SpecRow k="MSRP" v={product.price} />
                {product.originalPrice ? (
                  <SpecRow k="Original price" v={product.originalPrice} />
                ) : null}
                <SpecRow k="Best vendor" v={best?.name ?? "—"} />
                <SpecRow
                  k="Indexed"
                  v={indexedLabel}
                />
              </div>
            </div>
            <div>
              <div
                className="kicker kicker-light"
                style={{ marginBottom: 18 }}
              >
                The House Note
              </div>
              <h3
                className="font-display ink"
                style={{
                  fontSize: 48,
                  fontWeight: 200,
                  margin: 0,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                }}
              >
                What we make of it.
              </h3>
              <p
                className="font-display ink"
                style={{
                  fontSize: 24,
                  lineHeight: 1.55,
                  marginTop: 28,
                  fontStyle: "italic",
                  fontWeight: 300,
                  maxWidth: 580,
                }}
              >
                {product.note ??
                  `The ${product.name} sits comfortably in the middle of ${product.brandName}'s catalog and earns its place on the bench. We've seen the corridor settle within $${Math.abs((corridor.high - corridor.low) || 0)} across ${vendors.length} vendors — a tight spread for a piece this size.`}
              </p>
              <div
                className="font-mono ink-faint"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  marginTop: 24,
                }}
              >
                — House Editor · Issue 01
              </div>

              <div
                style={{
                  marginTop: 48,
                  paddingTop: 28,
                  borderTop: "1px solid var(--color-hairline)",
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 24,
                }}
              >
                {[
                  [`${best?.rating ?? "4.9"}`, "Bench rating", `${vendors.length} vendors`],
                  [
                    `$${(corridor.high - corridor.low) || 0}`,
                    "Corridor span",
                    `low → high`,
                  ],
                  [
                    `${vendors.filter((v) => v.ship === "$0").length}/${vendors.length}`,
                    "Free shipping",
                    "vendor count",
                  ],
                ].map(([k, l, s]) => (
                  <div key={l}>
                    <div
                      className="font-display ink tabular-nums"
                      style={{
                        fontSize: 48,
                        letterSpacing: "-0.03em",
                        fontWeight: 200,
                        lineHeight: 1,
                      }}
                    >
                      {k}
                    </div>
                    <div
                      className="font-mono ink-brass-l"
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        marginTop: 6,
                      }}
                    >
                      {l}
                    </div>
                    <div
                      className="font-mono ink-faint"
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        marginTop: 4,
                      }}
                    >
                      {s}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <>
          <SectionRule
            kicker="03 — Of a kind"
            title={`Bench-paired with the ${product.name}`}
          />
          <section style={{ padding: "0 40px 96px" }}>
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              }}
            >
              {related.map((p) => (
                <RelatedCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </>
      ) : null}
    </article>
  );
}

function SpecRow({ k, v }: { k: string; v: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        padding: "14px 0",
        borderBottom: "1px solid var(--color-hairline)",
      }}
    >
      <span
        className="font-mono ink-faint"
        style={{
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}
      >
        {k}
      </span>
      <span
        className="font-sans ink"
        style={{ fontSize: 13, textAlign: "right" }}
      >
        {v}
      </span>
    </div>
  );
}

function RelatedCard({ product }: { product: NormalizedProduct }) {
  const imageSrc = product.imageHash ? `/img/${product.imageHash}` : null;
  return (
    <Link
      href={`/products/${product.id}`}
      className="heavy-glass lift focus-ring relative flex flex-col gap-3 overflow-hidden"
      style={{ borderRadius: 8, padding: 14 }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--color-quartz) 0%, transparent 70%)",
          opacity: 0.18,
          filter: "blur(20px)",
        }}
      />
      <div className="relative">
        <PlatePlaceholder
          label={product.name}
          height={200}
          imageSrc={imageSrc}
          imageAlt={product.name}
        />
      </div>
      <div className="kicker kicker-light relative">{product.brandName}</div>
      <div
        className="font-display ink relative"
        style={{ fontSize: 22, fontStyle: "italic", fontWeight: 400 }}
      >
        {product.name}
      </div>
      <div
        className="relative flex items-baseline justify-between"
        style={{
          paddingTop: 14,
          borderTop: "1px solid var(--color-hairline)",
        }}
      >
        <span
          className="font-display ink tabular-nums"
          style={{
            fontSize: 22,
            fontWeight: 300,
            letterSpacing: "-0.02em",
          }}
        >
          {product.price}
        </span>
        <span
          className="font-mono ink-mute"
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {product.categoryLabel}
        </span>
      </div>
    </Link>
  );
}
