import type { Tier } from "@/types";

const META: Record<Tier, { label: string; cls: string }> = {
  import: {
    label: "Import",
    cls: "border-[var(--color-quartz)]/50 text-[var(--color-quartz-soft)] bg-transparent",
  },
  usmade: {
    label: "US-Made",
    cls: "border-[var(--color-amber)]/60 text-[var(--color-amber-soft)] bg-transparent",
  },
};

export default function TierBadge({ tier }: { tier: Tier }) {
  const m = META[tier];
  return (
    <span
      className={`font-mono inline-flex items-center rounded-[2px] border px-2 py-[3px] text-[10px] uppercase tracking-[0.22em] font-medium ${m.cls}`}
    >
      {m.label}
    </span>
  );
}
