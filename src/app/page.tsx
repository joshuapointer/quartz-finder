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
    { value: meta.summary.active_brands.toString(), label: "makers" },
    { value: corridor, label: "price corridor" },
  ];

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
                  fontWeight: 400,
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
                    fontWeight: 400,
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
                {`${products.length.toLocaleString()} pieces from ${meta.summary.active_brands} makers, compared across vendors. Updated nightly.`}
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
              {heroProduct ? (
                <Link
                  href={`/products/${heroProduct.id}`}
                  className="focus-ring"
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
                    {heroProduct.brandName} {heroProduct.name}
                  </span>
                  <span style={{ color: "var(--color-brass)" }}>
                    Now showing →
                  </span>
                </Link>
              ) : null}
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
                      fontWeight: 400,
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
                § On the bench
              </div>
              <h2
                className="font-display"
                style={{
                  fontSize: "clamp(40px, 6vw, 64px)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  margin: 0,
                  color: "var(--color-pearl)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                Featured{" "}
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
                        lineHeight: 1.05,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {p.name}
                    </div>
                  </div>
                  <div style={{ marginTop: "auto" }}>
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
                        marginTop: 8,
                      }}
                    >
                      {vendors} vendors
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
              § Maker portrait
            </div>
            <h2
              className="font-display ink"
              style={{
                fontSize: "clamp(40px, 5.5vw, 68px)",
                fontWeight: 400,
                lineHeight: 0.98,
                letterSpacing: "-0.025em",
                margin: 0,
              }}
            >
              On{" "}
              <em
                className="ink-brass-l"
                style={{ fontWeight: 400, fontStyle: "italic" }}
              >
                {featuredBrand.name}.
              </em>
            </h2>
            <p
              className="font-display ink-soft"
              style={{
                marginTop: 32,
                fontSize: 20,
                fontStyle: "italic",
                fontWeight: 400,
                lineHeight: 1.55,
                maxWidth: 560,
              }}
            >
              &ldquo;A banger ought to outlive its first owner. Else why bother
              with the work.&rdquo;
            </p>
            <p
              className="font-mono ink-faint"
              style={{
                marginTop: 14,
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              — {featuredBrand.name}
            </p>
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
              See the lineup →
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
              § By instrument
            </div>
            <h2
              className="font-display ink"
              style={{
                fontSize: "clamp(40px, 6vw, 64px)",
                fontWeight: 400,
                fontStyle: "italic",
                margin: 0,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              <span style={{ fontStyle: "normal" }}>The</span> cabinet.
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
                    fontWeight: 400,
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

      {/* ───────── DISPATCH — final folio ───────── */}
      <section
        className="bs-3"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <Caustics opacity={0.5} />
        <div className="bs-gutter" style={{ position: "relative" }}>
          <RotatedKicker>§ The Dispatch · Once a fortnight</RotatedKicker>
        </div>
        <div
          style={{
            padding: "clamp(64px, 10vw, 120px) clamp(20px, 4vw, 32px)",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div style={{ display: "inline-flex" }} aria-hidden>
            <QuartzOrb size={120} />
          </div>
          <h2
            className="font-display ink"
            style={{
              fontSize: "clamp(48px, 7vw, 84px)",
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              margin: "32px auto 0",
              maxWidth: 720,
            }}
          >
            <em
              className="ink-brass-l"
              style={{ fontStyle: "italic", fontWeight: 400 }}
            >
              The Dispatch.
            </em>
          </h2>
          <p
            className="font-display ink-soft"
            style={{
              fontSize: 20,
              fontStyle: "italic",
              fontWeight: 400,
              lineHeight: 1.55,
              maxWidth: 480,
              margin: "20px auto 0",
            }}
          >
            Drops &amp; restocks, once a fortnight. No spam.
          </p>
          <form
            action="#"
            style={{
              display: "flex",
              gap: 6,
              maxWidth: 480,
              margin: "28px auto 0",
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
                fontSize: 20,
                outline: "none",
                fontStyle: "italic",
                fontWeight: 400,
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
                fontSize: 24,
                fontStyle: "italic",
                cursor: "pointer",
                padding: "0 6px",
                fontWeight: 400,
              }}
            >
              →
            </button>
          </form>
        </div>
        <div className="bs-gutter bs-gutter-r" style={{ position: "relative" }}>
          <RotatedKicker color="var(--color-smoke)">
            End of folio
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
                fontWeight: 400,
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
