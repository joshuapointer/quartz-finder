import Link from "next/link";
import type { BrandSummary } from "@/types";
import TierBadge from "./TierBadge";
import StatusBadge from "./StatusBadge";

interface DotProps {
  on: boolean;
  "aria-label": string;
}

function Dot({ on, "aria-label": ariaLabel }: DotProps) {
  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={`inline-block h-1.5 w-1.5 rounded-full ${
        on ? "bg-[var(--color-amber)]" : "bg-[var(--color-line-strong)]"
      }`}
    />
  );
}

export default function BrandCard({ brand }: { brand: BrandSummary }) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="surface lift focus-ring group flex h-full flex-col p-7 rounded-[var(--radius-md)]"
    >
      {/* Top row: brand name + tier badge */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-2xl tracking-[-0.005em] leading-tight">
          {brand.name}
        </h3>
        <TierBadge tier={brand.tier} />
      </div>

      {/* URL line — mono for catalog-card feel */}
      <p className="font-mono text-2xs ink-mute mt-2 break-all">{brand.url}</p>

      {/* Status badge */}
      <div className="mt-3">
        <StatusBadge status={brand.status} label={brand.statusLabel} />
      </div>

      {/* Capability table — 2-col grid with hairlines */}
      <dl className="mt-5 grid grid-cols-[1fr_auto] text-sm">
        <dt className="ink-soft py-2 border-b border-[var(--color-line-soft)]">
          Control Tower
        </dt>
        <dd className="ml-4 self-center border-b border-[var(--color-line-soft)] py-2">
          <Dot
            on={brand.hasControlTower}
            aria-label={brand.hasControlTower ? "In stock" : "Out of stock"}
          />
        </dd>

        <dt className="ink-soft py-2 border-b border-[var(--color-line-soft)]">
          Terp Slurper
        </dt>
        <dd className="ml-4 self-center border-b border-[var(--color-line-soft)] py-2">
          <Dot
            on={brand.hasTerpSlurper}
            aria-label={brand.hasTerpSlurper ? "In stock" : "Out of stock"}
          />
        </dd>

        <dt className="ink-soft py-2">Dunking Station</dt>
        <dd className="ml-4 self-center py-2">
          <Dot
            on={brand.hasDunkingStation}
            aria-label={brand.hasDunkingStation ? "In stock" : "Out of stock"}
          />
        </dd>
      </dl>

      {/* Footer row */}
      <div className="mt-auto flex items-center justify-between pt-5 text-xs">
        <span className="font-mono text-2xs ink-mute">
          {brand.productCount} product{brand.productCount === 1 ? "" : "s"} ·{" "}
          {brand.accessoryCount} accessor
          {brand.accessoryCount === 1 ? "y" : "ies"}
        </span>
        <span className="text-sm ink-soft transition-colors group-hover:text-[var(--color-amber)]">
          Explore →
        </span>
      </div>
    </Link>
  );
}
