import type { Metadata } from "next";
import { getMetadata } from "@/lib/catalog";
import { Caustics, DropCap, RotatedKicker } from "@/components/editorial";

export const metadata: Metadata = {
  title: "House",
  description:
    "Why Pillar & Pearl exists, how we curate, and the boundaries of what we do.",
};

const PRINCIPLES: { label: string; description: string }[] = [
  {
    label: "Sell",
    description: "We do not sell, ship, or handle product. Every link routes outward to the maker or an authorized vendor.",
  },
  {
    label: "Conceal",
    description: "Affiliate relationships are disclosed where they exist. Most brands here pay us nothing.",
  },
  {
    label: "Sponsor",
    description: "We never accept payment to feature or promote a piece. Curation is independent.",
  },
  {
    label: "Underage",
    description: "21+ jurisdictions only. The threshold is a real gate, not a courtesy.",
  },
];

export default function AboutPage() {
  const meta = getMetadata();
  return (
    <section
      className="bs-3"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <Caustics opacity={0.45} />
      <div className="bs-gutter">
        <RotatedKicker>§ House · An editorial atlas of quartz</RotatedKicker>
      </div>
      <div style={{ padding: "80px 32px 96px", position: "relative" }}>
        <div className="kicker" style={{ marginBottom: 16 }}>
          Folio · House note · Issue 01
        </div>
        <h1
          className="font-display ink"
          style={{
            fontSize: "clamp(56px, 8vw, 96px)",
            fontWeight: 300,
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            margin: 0,
            maxWidth: 920,
          }}
        >
          Made for{" "}
          <em
            className="ink-brass-l"
            style={{ fontStyle: "italic", fontWeight: 300 }}
          >
            hash heads,
          </em>{" "}
          built like a{" "}
          <em
            className="ink-brass-l"
            style={{ fontStyle: "italic", fontWeight: 300 }}
          >
            broadsheet.
          </em>
        </h1>

        <div style={{ marginTop: 56, maxWidth: 720 }}>
          <DropCap>
            {`Pillar & Pearl is the bench you'd keep if shopping for serious quartz didn't mean tab-juggling forty glass houses, half of which are dead, broken, or wholesale-only. We catalog ${meta.summary.total_brands} brands across two tiers — import-priced workhorses and US-made artisan glass — and shop them against the eighteen authorized vendors of these United States, indexed each night.`}
          </DropCap>
        </div>

        <blockquote
          style={{
            marginTop: 56,
            marginBottom: 56,
            padding: "0 0 0 24px",
            borderLeft: "1px solid var(--color-brass)",
          }}
        >
          <p
            className="font-display ink"
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontStyle: "italic",
              fontWeight: 300,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              margin: 0,
              maxWidth: 880,
            }}
          >
            We catalog what we&apos;d buy ourselves. Nothing on this site is
            sold under sponsorship.
          </p>
          <p
            className="font-mono ink-faint"
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginTop: 18,
            }}
          >
            — The House
          </p>
        </blockquote>

        <div
          style={{
            display: "grid",
            gap: 48,
            gridTemplateColumns: "1fr",
          }}
          className="md:[grid-template-columns:1fr_1fr]"
        >
          <div>
            <div className="kicker" style={{ marginBottom: 12 }}>
              § What we will not do
            </div>
            <h2
              className="font-display ink"
              style={{
                fontSize: 40,
                fontStyle: "italic",
                fontWeight: 300,
                margin: 0,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              Four refusals.
            </h2>
            <dl
              style={{
                marginTop: 32,
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 0,
              }}
            >
              {PRINCIPLES.map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: "20px 0",
                    borderBottom: "1px solid var(--color-hairline)",
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    gap: 16,
                    alignItems: "baseline",
                  }}
                >
                  <dt
                    className="font-display ink-brass-l"
                    style={{
                      fontSize: 28,
                      fontStyle: "italic",
                      fontWeight: 300,
                    }}
                  >
                    {item.label}.
                  </dt>
                  <dd
                    className="ink-soft"
                    style={{ fontSize: 14, lineHeight: 1.6 }}
                  >
                    {item.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <div className="kicker" style={{ marginBottom: 12 }}>
              § How we curate
            </div>
            <h2
              className="font-display ink"
              style={{
                fontSize: 40,
                fontStyle: "italic",
                fontWeight: 300,
                margin: 0,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              Bench, not algorithm.
            </h2>
            <p
              className="ink-soft"
              style={{
                marginTop: 24,
                fontSize: 15,
                lineHeight: 1.75,
              }}
            >
              Brands are added based on craft reputation in the dab forums and
              first-hand reviews of each piece&apos;s airflow geometry, weld
              quality, and thermal behavior. Pricing is verified against the
              maker&apos;s site and surfaced alongside the eighteen authorized
              vendor corridor.
            </p>
            <p
              className="ink-soft"
              style={{
                marginTop: 18,
                fontSize: 15,
                lineHeight: 1.75,
              }}
            >
              Inactive brands are kept on file for archival reference; you will
              see a clear status badge — dormant, not deleted.
            </p>

            <div
              style={{
                marginTop: 48,
                padding: 28,
                border: "1px solid var(--color-hairline)",
                borderRadius: 4,
              }}
            >
              <div className="kicker kicker-mute" style={{ marginBottom: 12 }}>
                Disclaimer
              </div>
              <p
                className="ink-soft"
                style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}
              >
                {meta.disclaimer} Nothing here is legal, medical, or financial
                advice. Consult local law before any purchase.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bs-gutter bs-gutter-r">
        <RotatedKicker color="var(--color-smoke)">
          Set in Fraunces · Established MMXXVI
        </RotatedKicker>
      </div>
    </section>
  );
}
