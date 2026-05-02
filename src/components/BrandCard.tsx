import Link from "next/link";
import type { BrandSummary } from "@/types";

const TIER_LABEL: Record<BrandSummary["tier"], string> = {
  import: "Import",
  usmade: "US-Made",
};

interface DotProps {
  on: boolean;
  "aria-label": string;
}

function Dot({ on, "aria-label": ariaLabel }: DotProps) {
  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className="inline-block"
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: on
          ? "radial-gradient(circle at 30% 30%, var(--color-pearl), var(--color-brass) 70%)"
          : "var(--color-hairline-strong)",
        boxShadow: on ? "0 0 6px rgba(212, 174, 110, 0.5)" : undefined,
      }}
    />
  );
}

export default function BrandCard({ brand }: { brand: BrandSummary }) {
  const dead = brand.status === "dead";
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="heavy-glass lift focus-ring group relative flex h-full flex-col overflow-hidden"
      style={{
        borderRadius: 8,
        padding: 28,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: -60,
          right: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--color-quartz) 0%, transparent 70%)",
          opacity: 0.14,
          filter: "blur(24px)",
        }}
      />

      <div className="relative flex items-baseline justify-between gap-3">
        <div
          className="kicker kicker-light"
          style={{ marginBottom: 0 }}
        >
          {TIER_LABEL[brand.tier]}
        </div>
        {dead ? (
          <span
            className="font-mono"
            style={{
              fontSize: 9,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--color-ember)",
            }}
          >
            Dormant
          </span>
        ) : null}
      </div>

      <h3
        className="font-display ink relative mt-3"
        style={{
          fontSize: 32,
          fontStyle: "italic",
          fontWeight: 400,
          letterSpacing: "-0.01em",
          lineHeight: 1.05,
        }}
      >
        {brand.name}
      </h3>

      <p
        className="font-mono ink-faint relative mt-2 break-all"
        style={{ fontSize: 10, letterSpacing: "0.04em" }}
      >
        {brand.url}
      </p>

      <dl
        className="relative mt-6 grid"
        style={{ gridTemplateColumns: "1fr auto", fontSize: 13 }}
      >
        <dt
          className="ink-soft py-2"
          style={{ borderBottom: "1px solid var(--color-hairline-soft)" }}
        >
          Control Tower
        </dt>
        <dd
          className="ml-4 self-center py-2"
          style={{ borderBottom: "1px solid var(--color-hairline-soft)" }}
        >
          <Dot
            on={brand.hasControlTower}
            aria-label={brand.hasControlTower ? "In stock" : "Out of stock"}
          />
        </dd>

        <dt
          className="ink-soft py-2"
          style={{ borderBottom: "1px solid var(--color-hairline-soft)" }}
        >
          Terp Slurper
        </dt>
        <dd
          className="ml-4 self-center py-2"
          style={{ borderBottom: "1px solid var(--color-hairline-soft)" }}
        >
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

      <div
        className="relative mt-auto flex items-end justify-between"
        style={{
          paddingTop: 18,
          borderTop: "1px solid var(--color-hairline)",
        }}
      >
        <span
          className="font-mono ink-mute"
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {brand.productCount} piece{brand.productCount === 1 ? "" : "s"}
        </span>
        <span
          className="font-display ink-brass-l"
          style={{
            fontSize: 22,
            fontStyle: "italic",
            fontWeight: 300,
            lineHeight: 1,
            transition: "transform var(--duration-base) var(--ease-expressive)",
          }}
        >
          ↗
        </span>
      </div>
    </Link>
  );
}
