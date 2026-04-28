import type { Metadata } from "next";
import { getMetadata } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Quartz Finder exists, how we curate, and the boundaries of what we do.",
};

export default function AboutPage() {
  const meta = getMetadata();
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-amber)]">
        About
      </p>
      <h1 className="font-display mt-3 text-5xl">Made for hash heads.</h1>
      <p className="mt-6 text-lg leading-relaxed text-[var(--color-ink-soft)]">
        Quartz Finder is an editorial atlas of cannabis-concentrate hardware. It
        was built because shopping for a serious banger means tab-juggling forty
        glass-house websites, half of which are dead, broken, or wholesale-only.
      </p>
      <p className="mt-4 text-lg leading-relaxed text-[var(--color-ink-soft)]">
        We catalog{" "}
        <span className="text-[var(--color-amber)]">{meta.summary.total_brands}</span>{" "}
        brands across two tiers: import-priced workhorses and US-made artisan
        glass. Pricing is verified ~April 2026 and surfaced alongside brand
        status, sold-out warnings, and trustworthy retail links.
      </p>

      <h2 className="font-display mt-14 text-3xl">What we don&apos;t do</h2>
      <ul className="mt-4 space-y-3 text-[var(--color-ink-soft)]">
        <li>· Sell, ship, or handle product. Every link routes outward.</li>
        <li>· Hide affiliate relationships — disclosed where they exist.</li>
        <li>· Promote sponsored placements over organic curation.</li>
        <li>· Serve users under 21 or those outside legal jurisdictions.</li>
      </ul>

      <h2 className="font-display mt-14 text-3xl">How we curate</h2>
      <p className="mt-4 text-[var(--color-ink-soft)]">
        Brands are added based on craft reputation in r/dabs, r/Dabs, and the
        broader hash-head community — plus first-hand reviews of each piece&apos;s
        airflow geometry, weld quality, and thermal behavior. Inactive brands are
        kept on file for archival reference; you&apos;ll see a clear status badge.
      </p>

      <h2 className="font-display mt-14 text-3xl">Disclaimer</h2>
      <p className="mt-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] p-5 text-sm text-[var(--color-ink-soft)]">
        {meta.disclaimer} Nothing on this site is legal, medical, or financial
        advice. Consult local law before any purchase.
      </p>
    </div>
  );
}
