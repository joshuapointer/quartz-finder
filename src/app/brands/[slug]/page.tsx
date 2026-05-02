import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllBrands,
  getBrandBySlug,
  getProductsByBrandSlug,
  slugify,
  toBrandSummary,
} from "@/lib/catalog";
import { safeExternalUrl } from "@/lib/url";
import ProductCard from "@/components/ProductCard";
import {
  Caustics,
  PlatePlaceholder,
  RotatedKicker,
} from "@/components/editorial";

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

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();
  const summary = toBrandSummary(brand);
  const products = getProductsByBrandSlug(slug);
  const homepage = safeExternalUrl(brand.url);
  const dormant = brand.status === "dead";

  const stats: { label: string; value: string | number }[] = [
    { label: "Pieces", value: summary.productCount },
    { label: "Accessories", value: summary.accessoryCount },
    { label: "Tier", value: brand.tier === "usmade" ? "US-Made" : "Import" },
    {
      label: "Status",
      value: dormant ? brand.status_label ?? "Dormant" : "Active",
    },
  ];

  return (
    <>
      {/* breadcrumb */}
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
            href="/brands"
            className="focus-ring"
            style={{ color: "var(--color-smoke)" }}
          >
            Makers
          </Link>{" "}
          <span style={{ color: "var(--color-brass-light)" }}>/</span>{" "}
          <span style={{ color: "var(--color-pearl)" }}>{brand.name}</span>
        </nav>
      </section>

      {/* HERO */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "var(--bs-gutter) minmax(0,2fr) minmax(0,3fr) var(--bs-gutter)",
          borderBottom: "1px solid var(--color-hairline)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Caustics opacity={0.5} />
        <div className="bs-gutter">
          <RotatedKicker>§ Maker portrait · Plate V.{brand.name.length.toString().padStart(3, "0")}</RotatedKicker>
        </div>

        <div
          style={{
            borderRight: "1px solid var(--color-hairline)",
            position: "relative",
            minHeight: 480,
          }}
        >
          <PlatePlaceholder
            label={`${brand.name} · atelier`}
            plate={`V.${brand.name.length.toString().padStart(3, "0")}`}
            height="100%"
          />
        </div>

        <div style={{ padding: "64px 48px", position: "relative" }}>
          <div
            className="kicker"
            style={{
              marginBottom: 18,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            {brand.tier === "usmade" ? "US-Made" : "Import"}
            <span
              aria-hidden
              style={{
                width: 20,
                height: 1,
                background: "var(--color-brass-2)",
              }}
            />
            {dormant ? (
              <span style={{ color: "var(--color-ember)" }}>
                {brand.status_label ?? "Dormant"}
              </span>
            ) : (
              "Active"
            )}
          </div>
          <h1
            className="font-display ink"
            style={{
              fontSize: "clamp(48px, 7vw, 92px)",
              fontWeight: 200,
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
              margin: 0,
            }}
          >
            <em
              className="ink-brass-l"
              style={{ fontStyle: "italic", fontWeight: 300 }}
            >
              {brand.name}
            </em>
          </h1>
          <p
            className="font-display ink-soft"
            style={{
              fontSize: 22,
              fontStyle: "italic",
              marginTop: 20,
              lineHeight: 1.45,
              fontWeight: 400,
              maxWidth: 640,
            }}
          >
            {summary.productCount} piece
            {summary.productCount === 1 ? "" : "s"} on the bench
            {summary.accessoryCount > 0
              ? `, ${summary.accessoryCount} accessor${summary.accessoryCount === 1 ? "y" : "ies"} on file`
              : ""}
            .
          </p>

          {homepage ? (
            <a
              href={homepage}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="focus-ring inline-flex items-center gap-2"
              style={{
                marginTop: 24,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--color-brass-light)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                paddingBottom: 4,
                borderBottom: "1px solid var(--color-brass-2)",
                wordBreak: "break-all",
              }}
            >
              {brand.url} ↗
            </a>
          ) : (
            <span
              className="font-mono ink-faint"
              style={{
                marginTop: 24,
                display: "inline-block",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                wordBreak: "break-all",
              }}
            >
              {brand.url}
            </span>
          )}

          {brand.url_note ? (
            <p
              className="ink-mute"
              style={{ fontSize: 13, marginTop: 18, lineHeight: 1.6 }}
            >
              Note: {brand.url_note}
            </p>
          ) : null}

          <dl
            style={{
              marginTop: 40,
              paddingTop: 28,
              borderTop: "1px solid var(--color-hairline)",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 24,
            }}
          >
            {stats.map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <dt
                  className="font-mono ink-mute"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                  }}
                >
                  {s.label}
                </dt>
                <dd
                  className="font-display ink tabular-nums"
                  style={{
                    fontSize: 32,
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="bs-gutter bs-gutter-r">
          <RotatedKicker color="var(--color-smoke)">
            {brand.tier === "usmade" ? "Hand-lathed in the States" : "Curated import"}
          </RotatedKicker>
        </div>
      </section>

      {/* LINEUP */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "var(--bs-gutter) 1fr var(--bs-gutter)",
          borderBottom: "1px solid var(--color-hairline)",
        }}
      >
        <div className="bs-gutter">
          <RotatedKicker>§1 — Lineup · {products.length} pieces</RotatedKicker>
        </div>
        <div>
          <div
            style={{
              padding: "40px 32px 28px",
              borderBottom: "1px solid var(--color-hairline)",
            }}
          >
            <div className="kicker" style={{ marginBottom: 12 }}>
              Folio · {products.length} piece
              {products.length === 1 ? "" : "s"} on the bench
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
              <span style={{ fontStyle: "normal" }}>The lineup,</span>{" "}
              <em
                className="ink-brass-l"
                style={{ fontStyle: "italic", fontWeight: 300 }}
              >
                indexed.
              </em>
            </h2>
          </div>
          <div style={{ padding: 32 }}>
            {products.length === 0 ? (
              <p
                className="font-display ink-soft"
                style={{
                  fontSize: 22,
                  fontStyle: "italic",
                  lineHeight: 1.5,
                  textAlign: "center",
                  padding: "64px 0",
                  color: "var(--color-bone)",
                }}
              >
                No quartz pieces are currently catalogued for this maker.
              </p>
            ) : (
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(280px, 1fr))",
                }}
              >
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="bs-gutter bs-gutter-r">
          <RotatedKicker color="var(--color-smoke)">
            All pieces shopped against authorized vendors
          </RotatedKicker>
        </div>
      </section>

      {/* ACCESSORIES */}
      {brand.accessories && brand.accessories.length > 0 ? (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "var(--bs-gutter) 1fr var(--bs-gutter)",
            borderBottom: "1px solid var(--color-hairline)",
          }}
        >
          <div className="bs-gutter">
            <RotatedKicker>
              §2 — Accessories on file · {brand.accessories.length}
            </RotatedKicker>
          </div>
          <div>
            <div
              style={{
                padding: "40px 32px 28px",
                borderBottom: "1px solid var(--color-hairline)",
              }}
            >
              <div className="kicker" style={{ marginBottom: 12 }}>
                Folio · {brand.accessories.length} accessor
                {brand.accessories.length === 1 ? "y" : "ies"}
              </div>
              <h2
                className="font-display ink"
                style={{
                  fontSize: "clamp(36px, 5vw, 56px)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  margin: 0,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                <span style={{ fontStyle: "normal" }}>Accessories,</span>{" "}
                <em
                  className="ink-brass-l"
                  style={{ fontStyle: "italic", fontWeight: 300 }}
                >
                  on file.
                </em>
              </h2>
            </div>
            <dl
              style={{
                padding: "0 32px 32px",
                margin: 0,
              }}
            >
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
                        ? "1px solid var(--color-hairline)"
                        : "none",
                  }}
                >
                  <dt className="ink" style={{ fontSize: 16 }}>
                    {a.name}
                  </dt>
                  <dd
                    className="font-display ink-brass-l tabular-nums"
                    style={{
                      fontSize: 22,
                      fontWeight: 300,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {a.price}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="bs-gutter bs-gutter-r">
            <RotatedKicker color="var(--color-smoke)">
              Indexed against authorized vendors
            </RotatedKicker>
          </div>
        </section>
      ) : null}
    </>
  );
}
