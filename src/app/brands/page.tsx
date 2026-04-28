import type { Metadata } from "next";
import { getBrandSummaries, getMetadata } from "@/lib/catalog";
import BrandCard from "@/components/BrandCard";

export const metadata: Metadata = {
  title: "Brands · Glass houses & artisans",
  description:
    "Every banger brand we track — import, US-made, active, dormant. Curated, ranked by craft.",
};

export default function BrandsPage() {
  const meta = getMetadata();
  const brands = getBrandSummaries();
  const usmade = brands.filter((b) => b.tier === "usmade");
  const imports = brands.filter((b) => b.tier === "import");

  return (
    <div className="container-wide section-y-lg">
      <p className="eyebrow">Directory</p>
      <div className="rule mt-2" />
      <h1 className="font-display mt-6 text-4xl md:text-5xl">
        {meta.summary.total_brands} brands tracked
      </h1>
      <p className="prose-measure ink-soft mt-6 text-lg">
        {meta.summary.active_brands} actively shipping ·{" "}
        {meta.summary.usmade_tier_count} US-made artisans ·{" "}
        {meta.summary.import_tier_count} import-tier value picks.
      </p>

      <section className="mt-24">
        <div className="flex items-baseline justify-between border-b border-[var(--color-line)] pb-4">
          <h2 className="font-display text-3xl">US-Made</h2>
          <span className="font-mono ink-mute text-xs uppercase tracking-[0.04em]">
            {meta.tiers.usmade.price_range}
          </span>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {usmade.map((b) => (
            <BrandCard key={b.slug} brand={b} />
          ))}
        </div>
      </section>

      <div className="rule my-24" />

      <section>
        <div className="flex items-baseline justify-between border-b border-[var(--color-line)] pb-4">
          <h2 className="font-display text-3xl">Import</h2>
          <span className="font-mono ink-mute text-xs uppercase tracking-[0.04em]">
            {meta.tiers.import.price_range}
          </span>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {imports.map((b) => (
            <BrandCard key={b.slug} brand={b} />
          ))}
        </div>
      </section>
    </div>
  );
}
