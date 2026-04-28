import type { Tier } from "@/types";

const META: Record<Tier, { label: string; cls: string }> = {
  import: {
    label: "Import",
    cls: "border-[var(--color-quartz)]/40 text-[var(--color-quartz)] bg-[var(--color-quartz)]/5",
  },
  usmade: {
    label: "US-Made",
    cls: "border-[var(--color-amber)]/50 text-[var(--color-amber-soft)] bg-[var(--color-amber)]/10",
  },
};

export default function TierBadge({ tier }: { tier: Tier }) {
  const m = META[tier];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] uppercase tracking-[0.18em] ${m.cls}`}
    >
      {m.label}
    </span>
  );
}
