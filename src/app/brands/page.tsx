import type { Metadata } from "next";
import { getBrandSummaries, getMetadata } from "@/lib/catalog";
import BrandCard from "@/components/BrandCard";
import { Caustics, RotatedKicker } from "@/components/editorial";

export const metadata: Metadata = {
  title: "Makers · Glass houses & lapidaries",
  description:
    "Every banger maker we track — import, US-made, active, dormant. Curated by craft, not algorithm.",
};

export default function BrandsPage() {
  const meta = getMetadata();
  const brands = getBrandSummaries();
  const usmade = brands.filter((b) => b.tier === "usmade");
  const imports = brands.filter((b) => b.tier === "import");

  return (
    <>
      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <Caustics opacity={0.5} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "var(--bs-gutter) 1fr var(--bs-gutter)",
            borderBottom: "1px solid var(--color-hairline)",
          }}
        >
          <div className="bs-gutter">
            <RotatedKicker>
              § Makers · {meta.summary.total_brands} houses on file
            </RotatedKicker>
          </div>
          <div style={{ padding: "80px 32px 56px", position: "relative" }}>
            <div className="kicker" style={{ marginBottom: 16 }}>
              Folio II · The Lapidaries · Indexed nightly
            </div>
            <h1
              className="font-display ink"
              style={{
                fontSize: "clamp(64px, 9vw, 132px)",
                fontWeight: 200,
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                margin: 0,
              }}
            >
              {meta.summary.total_brands}{" "}
              <em
                className="ink-brass-l"
                style={{ fontStyle: "italic", fontWeight: 300 }}
              >
                lapidaries,
              </em>
              <br />
              one bench.
            </h1>
            <p
              className="font-display ink-soft"
              style={{
                fontSize: 22,
                fontStyle: "italic",
                fontWeight: 400,
                lineHeight: 1.5,
                marginTop: 28,
                maxWidth: 640,
              }}
            >
              {meta.summary.active_brands} actively shipping ·{" "}
              {meta.summary.usmade_tier_count} US-made artisans ·{" "}
              {meta.summary.import_tier_count} import-tier value picks. Curated
              by craft, not algorithm.
            </p>
          </div>
          <div className="bs-gutter bs-gutter-r">
            <RotatedKicker color="var(--color-smoke)">
              Two tiers · One standard
            </RotatedKicker>
          </div>
        </div>
      </section>

      {/* US-MADE */}
      <Section
        sectionLabel="§1 — US-Made · Heritage glass houses"
        gutterRight="Hand-lathed in the States"
        kicker={`Folio · ${usmade.length} US-made houses · ${meta.tiers.usmade.price_range}`}
        title="US-Made,"
        titleEm="hand-lathed."
      >
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
          {usmade.map((b) => (
            <BrandCard key={b.slug} brand={b} />
          ))}
        </div>
      </Section>

      {/* IMPORT */}
      <Section
        sectionLabel="§2 — Import · Value-tier workhorses"
        gutterRight="Curated import · vetted at the dock"
        kicker={`Folio · ${imports.length} import houses · ${meta.tiers.import.price_range}`}
        title="Import,"
        titleEm="curated."
      >
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
          {imports.map((b) => (
            <BrandCard key={b.slug} brand={b} />
          ))}
        </div>
      </Section>
    </>
  );
}

function Section({
  sectionLabel,
  gutterRight,
  kicker,
  title,
  titleEm,
  children,
}: {
  sectionLabel: string;
  gutterRight: string;
  kicker: string;
  title: string;
  titleEm: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "var(--bs-gutter) 1fr var(--bs-gutter)",
        borderBottom: "1px solid var(--color-hairline)",
      }}
    >
      <div className="bs-gutter">
        <RotatedKicker>{sectionLabel}</RotatedKicker>
      </div>
      <div>
        <div
          style={{
            padding: "40px 32px 28px",
            borderBottom: "1px solid var(--color-hairline)",
          }}
        >
          <div className="kicker" style={{ marginBottom: 12 }}>
            {kicker}
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
            <span style={{ fontStyle: "normal" }}>{title}</span>{" "}
            <em
              className="ink-brass-l"
              style={{ fontStyle: "italic", fontWeight: 300 }}
            >
              {titleEm}
            </em>
          </h2>
        </div>
        <div style={{ padding: 32 }}>{children}</div>
      </div>
      <div className="bs-gutter bs-gutter-r">
        <RotatedKicker color="var(--color-smoke)">{gutterRight}</RotatedKicker>
      </div>
    </section>
  );
}
