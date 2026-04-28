import type { Metadata } from "next";
import { getMetadata } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Pillar & Pearl exists, how we curate, and the boundaries of what we do.",
};

const WHAT_WE_DONT_DO: { label: string; description: string }[] = [
  {
    label: "Sell",
    description: "Sell, ship, or handle product. Every link routes outward.",
  },
  {
    label: "Conceal",
    description: "Hide affiliate relationships — disclosed where they exist.",
  },
  {
    label: "Sponsor",
    description: "Promote sponsored placements over organic curation.",
  },
  {
    label: "Underage",
    description: "Serve users under 21 or those outside legal jurisdictions.",
  },
];

export default function AboutPage() {
  const meta = getMetadata();
  return (
    <div className="container-narrow section-y-lg">
      <p className="eyebrow">About</p>
      <div className="rule mt-2" />
      <h1 className="font-display mt-6 text-4xl md:text-5xl">
        Made for hash heads.
      </h1>

      <p className="prose-measure ink-soft mt-8 text-lg">
        Pillar &amp; Pearl is an editorial atlas of cannabis-concentrate
        hardware — named after the two craft accessories that quietly define a
        proper low-temp dab. We built it because shopping for a serious banger
        means tab-juggling forty glass-house websites, half of which are dead,
        broken, or wholesale-only.
      </p>

      <p className="prose-measure ink-soft mt-4 text-base">
        We catalog {meta.summary.total_brands} brands across two tiers —
        import-priced workhorses and US-made artisan glass. Pricing is verified
        ~April 2026 and surfaced alongside brand status, sold-out warnings, and
        trustworthy retail links.
      </p>

      <blockquote className="font-display mt-12 border-l border-[var(--color-amber)]/60 pl-6 text-3xl italic leading-tight">
        &ldquo;We catalog what we&apos;d buy ourselves. Nothing on this site is
        sold under sponsorship.&rdquo;
      </blockquote>

      <section className="section-y">
        <h2 className="font-display text-3xl">What we don&apos;t do</h2>
        <dl className="mt-8 grid grid-cols-1 gap-x-12 gap-y-0 md:grid-cols-2">
          {WHAT_WE_DONT_DO.map((item) => (
            <div
              key={item.label}
              className="flex items-baseline justify-between gap-6 border-b border-[var(--color-line-soft)] py-4"
            >
              <dt className="eyebrow eyebrow-mute">{item.label}</dt>
              <dd className="ink-soft max-w-[60%] text-right text-sm">
                {item.description}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="section-y">
        <h2 className="font-display text-3xl">How we curate</h2>
        <p
          className="prose-measure ink-soft mt-6 text-base"
          style={{ lineHeight: "var(--leading-loose)" }}
        >
          Brands are added based on craft reputation in r/dabs, r/Dabs, and the
          broader hash-head community — plus first-hand reviews of each
          piece&apos;s airflow geometry, weld quality, and thermal behavior.
          Inactive brands are kept on file for archival reference; you&apos;ll
          see a clear status badge.
        </p>
      </section>

      <section className="section-y">
        <div className="surface-flat rounded-[var(--radius-md)] p-6">
          <p className="eyebrow eyebrow-mute">Disclaimer</p>
          <p className="ink-soft mt-3 text-sm">
            {meta.disclaimer} Nothing on this site is legal, medical, or
            financial advice. Consult local law before any purchase.
          </p>
        </div>
      </section>
    </div>
  );
}
