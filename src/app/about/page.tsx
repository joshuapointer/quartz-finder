import type { Metadata } from "next";
import Link from "next/link";
import { getMetadata } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "About — Pillar & Pearl",
  description:
    "Why Pillar & Pearl exists, how we curate, and the boundaries of what we do.",
};

const PRINCIPLES: { label: string; description: string }[] = [
  {
    label: "Sell",
    description:
      "We do not sell, ship, or handle product. Every link routes outward to the maker or an authorized vendor.",
  },
  {
    label: "Conceal",
    description:
      "Affiliate relationships are disclosed where they exist. Most brands here pay us nothing.",
  },
  {
    label: "Sponsor",
    description:
      "We never accept payment to feature or promote a piece. Curation is independent.",
  },
  {
    label: "Underage",
    description:
      "21+ jurisdictions only. The threshold is a real gate, not a courtesy.",
  },
];

export default function AboutPage() {
  const meta = getMetadata();

  return (
    <div className="pp-shell">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">/</span>
        <b>About</b>
      </nav>

      {/* Page head */}
      <div
        className="page-head"
        style={{
          padding: "36px 0 56px",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "56px",
          alignItems: "end",
          borderBottom: "1px solid var(--color-line)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(56px, 8vw, 120px)",
            fontWeight: 500,
            letterSpacing: "-0.045em",
            lineHeight: 0.92,
          }}
        >
          An <em>editorial atlas</em> of cannabis-concentrate hardware.
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            color: "var(--color-muted)",
            maxWidth: "42ch",
            lineHeight: 1.65,
            paddingBottom: "12px",
          }}
        >
          Why Pillar &amp; Pearl exists, how we curate, and the boundaries of
          what we do.
        </p>
      </div>

      {/* Intro */}
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 20,
          lineHeight: 1.7,
          color: "var(--color-fg)",
          maxWidth: "72ch",
          margin: "56px 0",
        }}
      >
        Shopping for serious quartz means tab-juggling forty maker sites, half
        of them dead or wholesale-only. We catalog{" "}
        {meta.summary.total_brands} brands across two tiers — import-priced
        workhorses and US-made artisan glass — and surface them alongside
        verified pricing. Updated nightly.
      </p>

      {/* Pull quote */}
      <blockquote
        style={{
          margin: "0 0 64px",
          padding: "0 0 0 28px",
          borderLeft: "2px solid var(--color-gold)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(24px, 3.4vw, 40px)",
            fontStyle: "italic",
            fontWeight: 400,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            margin: 0,
            maxWidth: "880px",
          }}
        >
          We catalog what we&apos;d buy ourselves. Nothing on this site is sold
          under sponsorship.
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginTop: 18,
          }}
        >
          — The House
        </p>
      </blockquote>

      {/* Two-col: refusals + curation */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          paddingBottom: "96px",
        }}
      >
        {/* Left: Four refusals */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--color-gold-light)",
              marginBottom: "12px",
            }}
          >
            § What we will not do
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 40,
              fontStyle: "italic",
              fontWeight: 400,
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
            }}
          >
            {PRINCIPLES.map((item) => (
              <div
                key={item.label}
                style={{
                  padding: "20px 0",
                  borderBottom: "1px solid var(--color-line)",
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  gap: 16,
                  alignItems: "baseline",
                }}
              >
                <dt
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 28,
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "var(--color-gold-light)",
                  }}
                >
                  {item.label}.
                </dt>
                <dd
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 14,
                    color: "var(--color-muted)",
                    lineHeight: 1.6,
                  }}
                >
                  {item.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: Curation */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--color-gold-light)",
              marginBottom: "12px",
            }}
          >
            § How we curate
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 40,
              fontStyle: "italic",
              fontWeight: 400,
              margin: 0,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            Bench, not algorithm.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              color: "var(--color-muted)",
              lineHeight: 1.75,
              marginTop: 24,
            }}
          >
            Brands are added based on craft reputation in the dab forums and
            first-hand reviews of each piece&apos;s airflow geometry, weld
            quality, and thermal behavior. Pricing is verified against the
            maker&apos;s site and surfaced alongside the authorized vendor
            corridor.
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              color: "var(--color-muted)",
              lineHeight: 1.75,
              marginTop: 18,
            }}
          >
            Inactive brands are kept on file for archival reference; you will
            see a clear status badge — dormant, not deleted.
          </p>

          <div
            style={{
              marginTop: 48,
              padding: 28,
              border: "1px solid var(--color-line-gold)",
              borderRadius: 18,
              background: "rgba(232,184,90,0.04)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
                marginBottom: 12,
              }}
            >
              Disclaimer
            </div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--color-muted)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {meta.disclaimer} Nothing here is legal, medical, or financial
              advice. Consult local law before any purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
