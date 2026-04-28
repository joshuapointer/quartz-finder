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
    <div className="mx-auto max-w-7xl px-6 py-14">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-amber)]">
        Directory
      </p>
      <h1 className="font-display mt-3 text-5xl">{meta.summary.total_brands} brands tracked</h1>
      <p className="mt-3 max-w-2xl text-[var(--color-ink-soft)]">
        {meta.summary.active_brands} actively shipping ·{" "}
        {meta.summary.usmade_tier_count} US-made artisans ·{" "}
        {meta.summary.import_tier_count} import-tier value picks.
      </p>

      <section className="mt-14">
        <h2 className="font-display flex items-baseline gap-3 text-3xl">
          US-Made
          <span className="text-sm uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
            {meta.tiers.usmade.price_range}
          </span>
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {usmade.map((b) => (
            <BrandCard key={b.slug} brand={b} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display flex items-baseline gap-3 text-3xl">
          Import
          <span className="text-sm uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
            {meta.tiers.import.price_range}
          </span>
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {imports.map((b) => (
            <BrandCard key={b.slug} brand={b} />
          ))}
        </div>
      </section>
    </div>
  );
}
