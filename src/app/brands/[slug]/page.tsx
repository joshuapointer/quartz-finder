import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllBrands,
  getBrandBySlug,
  getBrandSummaries,
  getProductsByBrandSlug,
  slugify,
  toBrandSummary,
} from "@/lib/catalog";
import { safeExternalUrl } from "@/lib/url";
import ProductCard from "@/components/ProductCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllBrands().map((b) => ({ slug: slugify(b.name) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return { title: "Brand not found" };
  return {
    title: `${brand.name} — quartz lineup & accessories`,
    description: `Full quartz lineup from ${brand.name}: control towers, terp slurpers, dunking stations, and signature accessories.`,
  };
}

function makeInitials(name: string): string {
  const SKIP = new Set(["quartz", "glass", "tubes"]);
  const words = name.split(/\s+/).filter((w) => !SKIP.has(w.toLowerCase()));
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words
    .slice(0, 3)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function splitName(name: string): { first: string; rest: string } {
  const idx = name.indexOf(" ");
  if (idx === -1) return { first: name, rest: "" };
  return { first: name.slice(0, idx), rest: name.slice(idx + 1) };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const summary = toBrandSummary(brand);
  const products = getProductsByBrandSlug(slug);
  const homepage = safeExternalUrl(brand.url);

  const allBrands = getBrandSummaries();
  const otherMakers = allBrands.filter((b) => b.slug !== slug).slice(0, 4);

  const initials = makeInitials(brand.name);
  const { first, rest } = splitName(brand.name);

  const tierLabel = brand.tier === "usmade" ? "US-Made" : "Import";
  const cityLabel = brand.tier === "usmade" ? "United States" : "Imported";

  // Specialty from category presence
  const specialtyParts: string[] = [];
  if (summary.hasControlTower) specialtyParts.push("Control Towers");
  if (summary.hasTerpSlurper) specialtyParts.push("Terp Slurpers");
  if (summary.hasDunkingStation) specialtyParts.push("Dunking Stations");
  const specialty = specialtyParts.length > 0 ? specialtyParts[0] : "Accessories";

  const leadTime = brand.tier === "usmade" ? "3–10 days" : "Ships fast";

  // Pull-quote — generic but tasteful, keyed to brand name
  const pullQuote = `"The work is in the details. ${brand.name} pieces aren't made fast — they're made  right."`;
  const pullCite = `— On ${brand.name}, Pillar & Pearl Journal`;

  // Story copy keyed to brand data
  const storyLead = `${brand.name} has been on our bench since we started cataloguing ${tierLabel.toLowerCase()} makers. ${summary.productCount > 0 ? `They focus on ${specialtyParts.length > 0 ? specialtyParts.join(" and ") : "accessories"}.` : ""}`;

  return (
    <>
      {/* Crumbs */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "22px 0 14px",
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--color-muted)",
          fontWeight: 500,
        }}
      >
        <Link href="/" style={{ color: "var(--color-muted)", transition: "color .2s" }}>
          Home
        </Link>
        <span style={{ color: "var(--color-dim)" }}>/</span>
        <Link href="/shop" style={{ color: "var(--color-muted)", transition: "color .2s" }}>
          Shop
        </Link>
        <span style={{ color: "var(--color-dim)" }}>/</span>
        <Link href="/brands" style={{ color: "var(--color-muted)", transition: "color .2s" }}>
          Brands
        </Link>
        <span style={{ color: "var(--color-dim)" }}>/</span>
        <b style={{ color: "var(--color-gold-light)", fontWeight: 600 }}>{brand.name}</b>
      </nav>

      {/* Hero */}
      <section
        style={{
          position: "relative",
          padding: "56px 0 80px",
          borderBottom: "1px solid var(--color-line)",
        }}
      >
        {/* Violet glow halo — top right */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: "50%",
            aspectRatio: "1",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, var(--color-c-violet), transparent 65%)",
            filter: "blur(100px)",
            opacity: 0.35,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 64,
            alignItems: "end",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Left: text */}
          <div>
            {/* Meta line */}
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "var(--color-gold-light)",
                display: "inline-flex",
                alignItems: "center",
                gap: 18,
                marginBottom: 28,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 32,
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, var(--color-line-gold-2))",
                  alignSelf: "center",
                }}
              />
              {cityLabel} · {tierLabel} · {specialty}
            </div>

            {/* Big h1 */}
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(64px, 9vw, 156px)",
                fontWeight: 500,
                letterSpacing: "-0.045em",
                lineHeight: 0.92,
                margin: 0,
              }}
            >
              {first}{" "}
              {rest ? (
                <em
                  style={{
                    fontWeight: 400,
                    fontStyle: "italic",
                    background:
                      "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {rest}.
                </em>
              ) : (
                "."
              )}
              {/* Italic tag below */}
              <small
                style={{
                  display: "block",
                  fontFamily: "var(--font-serif)",
                  fontSize: "0.32em",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "var(--color-muted)",
                  marginTop: 22,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.3,
                  maxWidth: "18ch",
                }}
              >
                {summary.productCount} piece{summary.productCount === 1 ? "" : "s"} on the bench
                {summary.accessoryCount > 0
                  ? `, ${summary.accessoryCount} accessor${summary.accessoryCount === 1 ? "y" : "ies"}`
                  : ""}
                .
              </small>
            </h1>

            {/* Stats row */}
            <div
              style={{
                display: "flex",
                gap: 28,
                marginTop: 44,
                paddingTop: 28,
                borderTop: "1px solid var(--color-line)",
                flexWrap: "wrap",
              }}
            >
              {[
                { lbl: "Studio", val: cityLabel },
                { lbl: "At the bench", val: brand.name },
                { lbl: "Specialty", val: specialty },
                { lbl: "Lead time", val: leadTime },
              ].map(({ lbl, val }) => (
                <div key={lbl} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "var(--color-muted)",
                    }}
                  >
                    {lbl}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 22,
                      fontWeight: 500,
                      letterSpacing: "-0.018em",
                    }}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 24,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <a
                href="#products"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 22px",
                  borderRadius: 999,
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  color: "#000",
                  background:
                    "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))",
                  border: "1px solid rgba(255,255,255,0.4)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
                  textDecoration: "none",
                }}
              >
                Shop the bench →
              </a>
              <a
                href="#"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 22px",
                  borderRadius: 999,
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  color: "var(--color-fg)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--color-line)",
                  textDecoration: "none",
                }}
              >
                Read the interview
              </a>
              {homepage && (
                <a
                  href={homepage}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--color-gold-light)",
                    textDecoration: "underline",
                    textDecorationColor: "var(--color-line-gold)",
                  }}
                >
                  ↗
                </a>
              )}
            </div>
          </div>

          {/* Right: maker stage */}
          <div
            style={{
              position: "relative",
              aspectRatio: "1",
              borderRadius: 32,
              background:
                "radial-gradient(120% 100% at 50% 8%, rgba(255,255,255,0.07), rgba(255,255,255,0.015) 55%, transparent 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              overflow: "hidden",
              boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7)",
            }}
          >
            {/* Inner gold glow */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: "8% 8% 30%",
                borderRadius: "50%",
                background:
                  "radial-gradient(ellipse at 50% 30%, rgba(199,180,255,0.4), transparent 65%)",
                filter: "blur(40px)",
                pointerEvents: "none",
              }}
            />
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: "4%",
                left: "12%",
                right: "12%",
                height: "14%",
                borderRadius: "50%",
                background:
                  "radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.22), transparent 70%)",
                filter: "blur(3px)",
                pointerEvents: "none",
              }}
            />
            {/* Initials watermark */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "clamp(60px, 10vw, 120px)",
                fontWeight: 500,
                background:
                  "linear-gradient(180deg, rgba(232,184,90,0.22), rgba(232,184,90,0.08))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.04em",
                userSelect: "none",
              }}
            >
              {initials}
            </span>
            {/* Maker mark circle */}
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: 24,
                width: 64,
                height: 64,
                borderRadius: "50%",
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0.65))",
                border: "1px solid var(--color-line-gold-2)",
                display: "grid",
                placeItems: "center",
                backdropFilter: "blur(12px)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: 24,
                  fontWeight: 500,
                  background:
                    "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {initials}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section label 01 — The story */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          margin: "64px 0 24px",
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "var(--color-gold-light)",
        }}
      >
        <span style={{ color: "var(--color-fg)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
          01
        </span>
        <span>The story</span>
        <span
          style={{
            flex: 1,
            height: 1,
            background:
              "linear-gradient(90deg, var(--color-line-gold-2), transparent)",
          }}
        />
      </div>

      {/* Story */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: 64,
          paddingTop: 12,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(28px, 3vw, 38px)",
            fontWeight: 500,
            letterSpacing: "-0.024em",
            lineHeight: 1.05,
            maxWidth: "12ch",
            margin: 0,
          }}
        >
          One person, one bench,{" "}
          <em
            style={{
              fontStyle: "italic",
              background:
                "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            one piece at a time.
          </em>
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: "60ch" }}>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 22,
              fontWeight: 400,
              lineHeight: 1.4,
              color: "var(--color-gold-light)",
              fontStyle: "italic",
              letterSpacing: "-0.012em",
              maxWidth: "38ch",
            }}
          >
            {storyLead}
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              lineHeight: 1.65,
              color: "var(--color-fg)",
              fontWeight: 400,
            }}
          >
            Every piece is selected against one criterion: would we use it ourselves?{" "}
            {brand.name} clears that bar. Their work represents the kind of craft that
            doesn&apos;t get easier with scale — it gets harder.
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              lineHeight: 1.65,
              color: "var(--color-fg)",
              fontWeight: 400,
            }}
          >
            <span style={{ color: "var(--color-muted)" }}>
              We catalogue {tierLabel.toLowerCase()} makers with the same rigour as US
              benches. Price range, availability, lead time, and stock status —
              updated nightly from authorised vendor feeds.{" "}
              {summary.accessoryCount > 0
                ? `${brand.name} also has ${summary.accessoryCount} accessor${summary.accessoryCount === 1 ? "y" : "ies"} on file.`
                : ""}
            </span>
          </p>
        </div>
      </section>

      {/* Pull quote */}
      <section
        style={{
          padding: "56px 0",
          borderTop: "1px solid var(--color-line)",
          borderBottom: "1px solid var(--color-line)",
          margin: "64px 0",
        }}
      >
        <blockquote
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(28px, 3.6vw, 48px)",
            fontWeight: 500,
            lineHeight: 1.15,
            letterSpacing: "-0.022em",
            maxWidth: "22ch",
            margin: 0,
          }}
        >
          {pullQuote.split(brand.name).map((part, i, arr) =>
            i < arr.length - 1 ? (
              <span key={i}>
                {part}
                <em
                  style={{
                    fontStyle: "italic",
                    background:
                      "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {brand.name}
                </em>
              </span>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </blockquote>
        <cite
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            marginTop: 24,
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            fontStyle: "normal",
          }}
        >
          <span
            aria-hidden
            style={{
              width: 24,
              height: 1,
              background: "var(--color-line-gold-2)",
              display: "inline-block",
            }}
          />
          {pullCite}
        </cite>
      </section>

      {/* Section label 02 — On the bench */}
      <div
        id="products"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          margin: "0 0 24px",
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "var(--color-gold-light)",
        }}
      >
        <span style={{ color: "var(--color-fg)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
          02
        </span>
        <span>On the bench</span>
        <span
          style={{
            flex: 1,
            height: 1,
            background:
              "linear-gradient(90deg, var(--color-line-gold-2), transparent)",
          }}
        />
        <a
          href="#"
          style={{
            fontSize: 11,
            color: "var(--color-muted)",
            letterSpacing: "0.1em",
            display: "inline-flex",
            gap: 8,
            textDecoration: "none",
            transition: "color .2s",
          }}
        >
          All {brand.name} pieces ↗
        </a>
      </div>

      {/* Products grid */}
      {products.length === 0 ? (
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 22,
            fontStyle: "italic",
            lineHeight: 1.5,
            textAlign: "center",
            padding: "64px 0",
            color: "var(--color-muted)",
          }}
        >
          No quartz pieces are currently catalogued for this maker.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "36px 16px",
          }}
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Section label 03 — Other makers */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          margin: "64px 0 24px",
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "var(--color-gold-light)",
        }}
      >
        <span style={{ color: "var(--color-fg)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
          03
        </span>
        <span>{brand.tier === "usmade" ? "Other US makers" : "Other makers"}</span>
        <span
          style={{
            flex: 1,
            height: 1,
            background:
              "linear-gradient(90deg, var(--color-line-gold-2), transparent)",
          }}
        />
        <Link
          href="/brands"
          style={{
            fontSize: 11,
            color: "var(--color-muted)",
            letterSpacing: "0.1em",
            display: "inline-flex",
            gap: 8,
            textDecoration: "none",
          }}
        >
          All makers ↗
        </Link>
      </div>

      {/* Other makers row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
        }}
      >
        {otherMakers.map((b) => {
          const { first: mFirst, rest: mRest } = splitName(b.name);
          const mCity = b.tier === "usmade" ? "Various, US" : "Imported";
          return (
            <Link
              key={b.slug}
              href={`/brands/${b.slug}`}
              style={{
                padding: "20px 22px",
                borderRadius: 18,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--color-line)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                transition: "border-color .3s, transform .3s",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                }}
              >
                {mCity}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 22,
                  fontWeight: 500,
                  letterSpacing: "-0.018em",
                }}
              >
                {mFirst}{" "}
                {mRest && (
                  <em style={{ fontStyle: "italic", color: "var(--color-gold-light)" }}>
                    {mRest}
                  </em>
                )}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                  display: "inline-flex",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                View pieces →
              </span>
            </Link>
          );
        })}
      </div>

      {/* Accessories (04) */}
      {brand.accessories && brand.accessories.length > 0 && (
        <>
          {/* Section label 04 — Accessories on file */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              margin: "64px 0 24px",
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--color-gold-light)",
            }}
          >
            <span style={{ color: "var(--color-fg)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
              04
            </span>
            <span>Accessories on file</span>
            <span
              style={{
                flex: 1,
                height: 1,
                background:
                  "linear-gradient(90deg, var(--color-line-gold-2), transparent)",
              }}
            />
          </div>

          <dl style={{ margin: 0 }}>
            {brand.accessories.map((a, i) => (
              <div
                key={a.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 24,
                  alignItems: "baseline",
                  padding: "18px 0",
                  borderBottom:
                    i < brand.accessories!.length - 1
                      ? "1px solid var(--color-line)"
                      : "none",
                }}
              >
                <dt style={{ fontSize: 16 }}>{a.name}</dt>
                <dd
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 22,
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    background:
                      "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {a.price}
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}

      {/* Bottom spacer */}
      <div style={{ height: 96 }} />
    </>
  );
}
