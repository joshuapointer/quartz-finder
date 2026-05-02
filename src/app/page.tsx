import Link from "next/link";
import {
  CATEGORY_META,
  getAllProducts,
  getBrandSummaries,
  getMetadata,
} from "@/lib/catalog";
import { GLOSSARY } from "@/lib/glossary";
import {
  Caustics,
  DropCap,
  PearlDot,
  PlatePlaceholder,
  PriceCorridor,
  QuartzOrb,
  RotatedKicker,
} from "@/components/editorial";
import type { NormalizedProduct, ProductCategory } from "@/types";

// deterministic price-corridor distribution from a single anchor price
function corridorFromPrice(priceValue: number, vendors: number) {
  const low = Math.max(8, Math.round(priceValue * 0.86));
  const high = Math.round(priceValue * 1.18);
  const range = high - low;
  const points: number[] = [];
  for (let i = 0; i < vendors; i++) {
    const t = vendors === 1 ? 0.5 : i / (vendors - 1);
    // weight points toward low end (simulates competitive vendors)
    const eased = Math.pow(t, 1.4);
    points.push(Math.round(low + eased * range));
  }
  return { low, high, points };
}

function vendorCount(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return 3 + (h % 10);
}

function plateNumber(p: NormalizedProduct, idx: number): string {
  const cat = ({
    control_tower: "I",
    terp_slurper: "II",
    dunking_station: "III",
  } as Record<ProductCategory, string>)[p.category];
  const n = (idx + 1).toString().padStart(3, "0");
  return `${cat}.${n}`;
}

export default function HomePage() {
  const meta = getMetadata();
  const products = getAllProducts();
  const brands = getBrandSummaries();

  const featured = products
    .filter((p) => !p.soldOut && p.priceValue != null)
    .slice(0, 4);

  const featuredBrand = brands.find(
    (b) => b.tier === "usmade" && b.status === "active",
  );

  const heroProduct = featured[0];

  const categoryStats = (
    Object.keys(CATEGORY_META) as ProductCategory[]
  ).map((key) => {
    const cat = CATEGORY_META[key];
    const inCat = products.filter((p) => p.category === key);
    const prices = inCat
      .map((p) => p.priceValue)
      .filter((v): v is number => v != null);
    const lo = prices.length ? Math.min(...prices) : null;
    const hi = prices.length ? Math.max(...prices) : null;
    return { key, cat, count: inCat.length, lo, hi };
  });

  const priceValues = products
    .map((p) => p.priceValue)
    .filter((v): v is number => v != null && v > 0);
  const corridor = priceValues.length
    ? `$${Math.min(...priceValues)} / $${Math.max(...priceValues)}`
    : "$—";

  const stats: { value: string; label: string }[] = [
    { value: products.length.toLocaleString(), label: "pieces" },
    { value: meta.summary.active_brands.toString(), label: "lapidaries" },
    {
      value: meta.summary.usmade_tier_count.toString(),
      label: "US-made houses",
    },
    { value: corridor, label: "corridor" },
  ];

  const tickerItems = products
    .filter((p) => p.priceValue != null)
    .slice(0, 8)
    .map((p, i) => ({
      name: `${p.brandName} ${p.name}`,
      price: p.price,
      delta: ["+1", "−2", "0", "+4", "−3", "0", "+8", "−1"][i % 8],
    }));

  return (
    <>
      {/* ───────── HERO — broadsheet split ───────── */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <Caustics opacity={0.6} />
        <div
          className="bs-2"
          style={{
            borderBottom: "1px solid var(--color-hairline)",
            position: "relative",
          }}
        >
          {/* L gutter */}
          <div className="bs-gutter">
            <RotatedKicker>
              Vol. 01 · Spring · The Quartz Index · Indexed 04:12 PT
            </RotatedKicker>
          </div>

          {/* L column — masthead title */}
          <div
            style={{
              padding: "64px 36px 48px",
              borderRight: "1px solid var(--color-hairline)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "clamp(420px, 80vw, 720px)",
            }}
          >
            <div>
              <div
                className="kicker"
                style={{
                  paddingBottom: 14,
                  borderBottom: "1px solid var(--color-hairline)",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>№ 0247 · The Index</span>
                <span style={{ color: "var(--color-smoke)" }}>i</span>
              </div>
              <h1
                className="font-display reveal"
                style={{
                  fontSize: "clamp(56px, 9vw, 116px)",
                  fontWeight: 300,
                  lineHeight: 0.86,
                  letterSpacing: "-0.04em",
                  margin: "32px 0 0",
                  color: "var(--color-pearl)",
                  hyphens: "manual",
                  overflowWrap: "normal",
                  wordBreak: "normal",
                }}
              >
                The
                <br />
                <span
                  style={{
                    display: "inline-block",
                    marginLeft: "clamp(0px, 4vw, 32px)",
                  }}
                >
                  unhurried
                </span>
                <br />
                study of
                <br />
                <em
                  style={{
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: "var(--color-brass-light)",
                    fontSize: "clamp(80px, 13vw, 168px)",
                    display: "inline-block",
                    marginLeft: -8,
                    marginTop: -8,
                    lineHeight: 0.85,
                  }}
                >
                  quartz.
                </em>
              </h1>
            </div>
            <div className="reveal" style={{ marginTop: 48, maxWidth: 460 }}>
              <DropCap>
                {`${products.length.toLocaleString()} pieces from ${meta.summary.active_brands} lapidaries — shopped against every authorized vendor in the States, indexed each night at the witching hour, and laid out for your bench in the manner of a fishmonger's slab.`}
              </DropCap>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 24,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  href="/shop"
                  className="btn btn-primary focus-ring"
                >
                  Browse the Index →
                </Link>
                <Link
                  href="/glossary"
                  className="btn btn-ghost focus-ring"
                >
                  This week&apos;s drop
                </Link>
              </div>
            </div>
          </div>

          {/* R column — orb + featured plate + ledger */}
          <div
            style={{
              position: "relative",
              minHeight: "clamp(420px, 80vw, 720px)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                flex: 1,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderBottom: "1px solid var(--color-hairline)",
                overflow: "hidden",
              }}
            >
              <QuartzOrb size={520} />
              <div
                aria-hidden
                className="font-display ink-brass-l"
                style={{
                  position: "absolute",
                  top: 32,
                  right: 36,
                  fontSize: 200,
                  fontWeight: 300,
                  fontStyle: "italic",
                  opacity: 0.18,
                  lineHeight: 0.85,
                  letterSpacing: "-0.05em",
                }}
              >
                0247
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 24,
                  left: 36,
                  right: 36,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "var(--color-bone)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }}
              >
                <span>
                  {heroProduct
                    ? `Plate ${plateNumber(heroProduct, 0)} · ${heroProduct.brandName} ${heroProduct.name}`
                    : "Plate III.247"}
                </span>
                {heroProduct ? (
                  <Link
                    href={`/products/${heroProduct.id}`}
                    className="focus-ring"
                    style={{ color: "var(--color-brass)" }}
                  >
                    Now showing →
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="bs-stats-4">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    padding: "20px 24px",
                    borderRight:
                      i < stats.length - 1
                        ? "1px solid var(--color-hairline)"
                        : "none",
                  }}
                >
                  <div
                    className="font-display ink"
                    style={{
                      fontSize: 32,
                      fontWeight: 300,
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="font-mono ink-mute"
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      marginTop: 8,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bs-gutter bs-gutter-r">
            <RotatedKicker color="var(--color-smoke)">
              An aggregate marketplace for high-end quartz
            </RotatedKicker>
          </div>
        </div>
      </section>

      {/* ───────── SECTION — bench, with corridor sparklines ───────── */}
      <section
        className="bs-3"
        style={{ borderBottom: "1px solid var(--color-hairline)" }}
      >
        <div className="bs-gutter">
          <RotatedKicker>§1 — On the bench this week</RotatedKicker>
        </div>
        <div>
          <div
            style={{
              padding: "40px 32px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderBottom: "1px solid var(--color-hairline)",
              gap: 32,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div className="kicker" style={{ marginBottom: 12 }}>
                Folio I · Plates III.247 → III.250
              </div>
              <h2
                className="font-display"
                style={{
                  fontSize: "clamp(40px, 6vw, 64px)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  margin: 0,
                  color: "var(--color-pearl)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                On the bench,{" "}
                <span style={{ fontStyle: "normal" }}>this week.</span>
              </h2>
            </div>
            <Link
              href="/shop"
              className="focus-ring"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                color: "var(--color-pearl)",
                fontWeight: 500,
                padding: "10px 18px",
                border: "1px solid var(--color-hairline-strong)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              All {products.length} →
            </Link>
          </div>

          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            {featured.map((p, i) => {
              const vendors = vendorCount(p.id);
              const corridor = corridorFromPrice(p.priceValue ?? 100, vendors);
              return (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="focus-ring lift group"
                  style={{
                    padding: 24,
                    borderRight:
                      i < featured.length - 1
                        ? "1px solid var(--color-hairline)"
                        : "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  <PlatePlaceholder
                    label={`${p.brandName} · ${p.name}`}
                    plate={plateNumber(p, i)}
                    height={240}
                    imageSrc={p.imageHash ? `/img/${p.imageHash}` : null}
                    imageAlt={p.name}
                  />
                  <div style={{ paddingTop: 4 }}>
                    <div className="kicker" style={{ marginBottom: 6 }}>
                      {p.brandName}
                    </div>
                    <div
                      className="font-display ink"
                      style={{
                        fontSize: 26,
                        fontStyle: "italic",
                        fontWeight: 400,
                        lineHeight: 1.0,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {p.name}
                    </div>
                    <div
                      className="font-mono ink-mute"
                      style={{ fontSize: 10, marginTop: 8 }}
                    >
                      {p.categoryLabel}
                    </div>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <PriceCorridor
                      low={corridor.low}
                      high={corridor.high}
                      points={corridor.points}
                    />
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        color: "var(--color-smoke)",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 6,
                      }}
                    >
                      <span>↓ best of {vendors}</span>
                      <span>{vendors} vendors</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="bs-gutter bs-gutter-r">
          <RotatedKicker color="var(--color-smoke)">
            Corridor: low — vendor distribution — high
          </RotatedKicker>
        </div>
      </section>

      {/* ───────── MAKER FEATURE — broadsheet article ───────── */}
      {featuredBrand ? (
        <section
          className="bs-feat"
          style={{ borderBottom: "1px solid var(--color-hairline)" }}
        >
          <div className="bs-gutter">
            <RotatedKicker>§2 — A maker portrait</RotatedKicker>
          </div>
          <div
            style={{
              borderRight: "1px solid var(--color-hairline)",
              position: "relative",
              minHeight: "clamp(280px, 50vw, 480px)",
            }}
          >
            <PlatePlaceholder
              label={`${featuredBrand.name} · atelier`}
              plate="V.004"
              height="100%"
            />
          </div>
          <div style={{ padding: "clamp(40px, 6vw, 64px) clamp(24px, 4vw, 48px)" }}>
            <div className="kicker" style={{ marginBottom: 20 }}>
              Plate V.004 · Maker · Issue 01
            </div>
            <h2
              className="font-display ink"
              style={{
                fontSize: "clamp(48px, 6vw, 76px)",
                fontWeight: 300,
                lineHeight: 0.92,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              On the slow turning of{" "}
              <em
                className="ink-brass-l"
                style={{ fontWeight: 300, fontStyle: "italic" }}
              >
                {featuredBrand.name},
              </em>{" "}
              &amp; why a banger should outlive its first owner.
            </h2>
            <div
              className="ink-mute"
              style={{
                marginTop: 40,
                columnCount: 2,
                columnGap: 32,
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                lineHeight: 1.75,
                fontWeight: 400,
              }}
            >
              <p style={{ margin: "0 0 14px" }}>
                <span className="drop-cap-letter">E</span>
                ight months ago we sat with the lead lapidary at a small bench
                on the north coast. He was lathing his three-hundredth piece
                that year and showed no urgency to finish before the kettle
                boiled. We took notes. They are below.
              </p>
              <p style={{ margin: "0 0 14px" }}>
                &ldquo;A banger ought to outlive its first owner,&rdquo; he
                said, holding one to the diffused window light. &ldquo;Else why
                bother with the work.&rdquo; The pieces are round-bottomed by
                hand; he refuses templates.
              </p>
              <p style={{ margin: 0 }}>
                We commissioned four. They take fourteen weeks each. He counts
                them as he goes, in chalk, on a slate behind the bench — a
                habit, he tells us, learned from his grandfather, who counted
                herring.
              </p>
            </div>
            <Link
              href={`/brands/${featuredBrand.slug}`}
              className="focus-ring inline-flex items-center gap-2"
              style={{
                marginTop: 32,
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                fontWeight: 500,
                color: "var(--color-brass-light)",
                padding: "10px 0",
                borderBottom: "1px solid var(--color-brass-2)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Read the dispatch in full →
            </Link>
          </div>
        </section>
      ) : null}

      {/* ───────── CABINET — by instrument ───────── */}
      <section
        className="bs-3"
        style={{ borderBottom: "1px solid var(--color-hairline)" }}
      >
        <div className="bs-gutter">
          <RotatedKicker>§3 — The cabinet, by instrument</RotatedKicker>
        </div>
        <div>
          <div
            style={{
              padding: "40px 32px 24px",
              borderBottom: "1px solid var(--color-hairline)",
            }}
          >
            <div className="kicker" style={{ marginBottom: 12 }}>
              Folio III · Three instruments
            </div>
            <h2
              className="font-display ink"
              style={{
                fontSize: "clamp(40px, 6vw, 64px)",
                fontWeight: 300,
                fontStyle: "italic",
                margin: 0,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              The cabinet,{" "}
              <span style={{ fontStyle: "normal" }}>by instrument.</span>
            </h2>
          </div>

          {categoryStats.map((row, i, arr) => {
            const roman = ["I", "II", "III"][i] ?? `${i + 1}`;
            const range =
              row.lo != null && row.hi != null
                ? `${row.count} pieces · $${row.lo} → $${row.hi}`
                : `${row.count} pieces`;
            return (
              <Link
                key={row.key}
                href={`/shop?category=${row.cat.slug}`}
                className="focus-ring group bs-cabinet-row"
                style={{
                  borderBottom:
                    i < arr.length - 1
                      ? "1px solid var(--color-hairline)"
                      : "none",
                  position: "relative",
                }}
              >
                <div
                  className="font-display ink-brass-l"
                  style={{
                    fontSize: 28,
                    fontStyle: "italic",
                    fontWeight: 300,
                  }}
                >
                  {roman}
                </div>
                <div
                  className="font-display ink"
                  style={{
                    fontSize: 36,
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {row.cat.label}
                </div>
                <div
                  className="ink-mute"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 14,
                    fontWeight: 400,
                  }}
                >
                  {row.cat.tagline}
                </div>
                <div
                  className="font-mono ink-soft cab-meta"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.06em",
                  }}
                >
                  {range}
                </div>
                <div
                  className="font-display ink-brass cab-arrow"
                  style={{
                    fontSize: 24,
                    textAlign: "right",
                    transition:
                      "transform var(--duration-base) var(--ease-expressive)",
                  }}
                >
                  ↗
                </div>
              </Link>
            );
          })}
        </div>
        <div className="bs-gutter bs-gutter-r">
          <RotatedKicker color="var(--color-smoke)">
            Three instruments · all kept on the bench
          </RotatedKicker>
        </div>
      </section>

      {/* ───────── TICKER ───────── */}
      <section
        style={{
          background: "var(--color-ink-2)",
          padding: "24px 32px",
          borderBottom: "1px solid var(--color-hairline)",
          display: "grid",
          gridTemplateColumns: "180px 1fr",
          alignItems: "center",
          gap: 32,
        }}
      >
        <div
          className="kicker"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            aria-hidden
            className="brass-pulse"
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--color-brass)",
              display: "inline-block",
            }}
          />
          Live · 04:12 PT
        </div>
        <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
          <div
            className="ticker-track"
            style={{
              display: "inline-flex",
              gap: 36,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--color-pearl-2)",
              willChange: "transform",
            }}
          >
            {[...tickerItems, ...tickerItems].map((t, i) => (
              <span
                key={`${t.name}-${i}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ color: "var(--color-bone)" }}>{t.name}</span>
                <span style={{ color: "var(--color-pearl)", fontWeight: 500 }}>
                  {t.price}
                </span>
                <span
                  style={{
                    color: t.delta.startsWith("+")
                      ? "var(--color-brass-light)"
                      : t.delta.startsWith("−")
                        ? "var(--color-ember)"
                        : "var(--color-smoke)",
                  }}
                >
                  {t.delta}
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── DISPATCH — final folio ───────── */}
      <section
        className="bs-3"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <Caustics opacity={0.5} />
        <div className="bs-gutter" style={{ position: "relative" }}>
          <RotatedKicker>§4 — The Dispatch · Once a fortnight</RotatedKicker>
        </div>
        <div
          style={{
            padding: "120px 32px",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            style={{ display: "inline-flex" }}
            aria-hidden
          >
            <QuartzOrb size={140} />
          </div>
          <div className="kicker" style={{ marginTop: 36 }}>
            Folio IV · Final
          </div>
          <h2
            className="font-display ink"
            style={{
              fontSize: "clamp(56px, 8vw, 96px)",
              fontWeight: 300,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              margin: "20px auto 0",
              maxWidth: 880,
            }}
          >
            <em
              className="ink-brass-l"
              style={{ fontStyle: "italic", fontWeight: 300 }}
            >
              The Dispatch.
            </em>
            <br />
            Once a fortnight, never more.
          </h2>
          <p
            className="font-display ink-soft"
            style={{
              fontSize: 22,
              fontStyle: "italic",
              fontWeight: 400,
              lineHeight: 1.55,
              maxWidth: 560,
              margin: "24px auto 0",
            }}
          >
            Drops, restocks, &amp; longer reading on materials and method.
            Members see new bangers six hours before the public.
          </p>
          <form
            action="#"
            style={{
              display: "flex",
              gap: 6,
              maxWidth: 540,
              margin: "32px auto 0",
              borderBottom: "1px solid var(--color-brass-2)",
              paddingBottom: 8,
            }}
          >
            <input
              type="email"
              placeholder="your.address@dispatch"
              aria-label="Email address"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                padding: "6px 0",
                color: "var(--color-pearl)",
                fontFamily: "var(--font-display)",
                fontSize: 22,
                outline: "none",
                fontStyle: "italic",
                fontWeight: 300,
              }}
            />
            <button
              type="submit"
              aria-label="Subscribe"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--color-brass-light)",
                fontFamily: "var(--font-display)",
                fontSize: 28,
                fontStyle: "italic",
                cursor: "pointer",
                padding: "0 6px",
                fontWeight: 300,
              }}
            >
              Subscribe →
            </button>
          </form>
          <div
            style={{
              marginTop: 64,
              display: "inline-flex",
              alignItems: "center",
              gap: 24,
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "var(--color-smoke)",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <span>4,212 readers</span>
            <PearlDot size={3} color="var(--color-smoke)" />
            <span>26 issues to date</span>
            <PearlDot size={3} color="var(--color-smoke)" />
            <span>0 unsubscribes</span>
          </div>
        </div>
        <div className="bs-gutter bs-gutter-r" style={{ position: "relative" }}>
          <RotatedKicker color="var(--color-smoke)">
            End of folio · Set in Fraunces
          </RotatedKicker>
        </div>
      </section>

      {/* ───────── GLOSSARY TEASER (preserve from old layout) ───────── */}
      <section
        className="bs-3"
        style={{ borderTop: "1px solid var(--color-hairline)" }}
      >
        <div className="bs-gutter">
          <RotatedKicker>§5 — Speak the dialect</RotatedKicker>
        </div>
        <div
          style={{
            padding: "64px 32px",
            display: "grid",
            gap: 48,
            gridTemplateColumns: "1fr 1.4fr",
            alignItems: "start",
          }}
        >
          <div>
            <div className="kicker" style={{ marginBottom: 14 }}>
              Glossary
            </div>
            <h2
              className="font-display ink"
              style={{
                fontSize: 48,
                fontWeight: 300,
                fontStyle: "italic",
                margin: 0,
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
              }}
            >
              Speak the dialect.
            </h2>
            <p
              className="font-display ink-soft"
              style={{
                fontSize: 18,
                fontStyle: "italic",
                lineHeight: 1.55,
                marginTop: 18,
                maxWidth: 440,
              }}
            >
              From terp pearls to ISO stations — the language of low-temp dabs,
              distilled.
            </p>
            <Link
              href="/glossary"
              className="btn btn-ghost focus-ring"
              style={{ marginTop: 28 }}
            >
              Full glossary →
            </Link>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {GLOSSARY.slice(0, 4).map((g) => (
              <li
                key={g.term}
                style={{
                  paddingTop: 16,
                  paddingBottom: 16,
                  borderTop: "1px solid var(--color-hairline-soft)",
                }}
              >
                <p
                  className="font-display ink"
                  style={{
                    fontSize: 22,
                    fontWeight: 400,
                    margin: 0,
                    fontStyle: "italic",
                  }}
                >
                  {g.term}
                </p>
                <p
                  className="ink-mute"
                  style={{
                    fontSize: 14,
                    marginTop: 4,
                    lineHeight: 1.55,
                  }}
                >
                  {g.short}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bs-gutter bs-gutter-r">
          <RotatedKicker color="var(--color-smoke)">
            Knowledge · Folio V
          </RotatedKicker>
        </div>
      </section>
    </>
  );
}
