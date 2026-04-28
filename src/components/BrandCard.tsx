import Link from "next/link";
import type { BrandSummary } from "@/types";
import TierBadge from "./TierBadge";
import StatusBadge from "./StatusBadge";

export default function BrandCard({ brand }: { brand: BrandSummary }) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="surface group flex h-full flex-col rounded-2xl p-6 transition-all hover:-translate-y-0.5 hover:border-[var(--color-amber)]/60"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl leading-tight">{brand.name}</h3>
        <TierBadge tier={brand.tier} />
      </div>
      <p className="mt-2 text-xs text-[var(--color-ink-mute)]">{brand.url}</p>

      <div className="mt-3">
        <StatusBadge status={brand.status} label={brand.statusLabel} />
      </div>

      <ul className="mt-5 space-y-1.5 text-sm text-[var(--color-ink-soft)]">
        <li className="flex items-center gap-2">
          <Dot on={brand.hasControlTower} /> Control Tower
        </li>
        <li className="flex items-center gap-2">
          <Dot on={brand.hasTerpSlurper} /> Terp Slurper
        </li>
        <li className="flex items-center gap-2">
          <Dot on={brand.hasDunkingStation} /> Dunking Station
        </li>
      </ul>

      <div className="mt-auto flex items-center justify-between pt-5 text-xs">
        <span className="text-[var(--color-ink-mute)]">
          {brand.productCount} product{brand.productCount === 1 ? "" : "s"} ·{" "}
          {brand.accessoryCount} accessor{brand.accessoryCount === 1 ? "y" : "ies"}
        </span>
        <span className="text-[var(--color-ink-soft)] transition-colors group-hover:text-[var(--color-amber)]">
          Explore →
        </span>
      </div>
    </Link>
  );
}

function Dot({ on }: { on: boolean }) {
  return (
    <span
      className={`inline-block h-1.5 w-1.5 rounded-full ${
        on ? "bg-[var(--color-amber)]" : "bg-[var(--color-line)]"
      }`}
      aria-hidden="true"
    />
  );
}
