import type { Tier } from "@/types";

const META: Record<Tier, { label: string; color: string; borderColor: string }> = {
  usmade: {
    label: "US-Made",
    color: "var(--color-gold-light)",
    borderColor: "var(--color-line-gold)",
  },
  import: {
    label: "Import",
    color: "var(--color-muted)",
    borderColor: "var(--color-line)",
  },
};

export default function TierBadge({ tier }: { tier: Tier }) {
  const m = META[tier];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: m.color,
        border: `1px solid ${m.borderColor}`,
        borderRadius: 2,
        padding: "3px 8px",
        background: "transparent",
      }}
    >
      {m.label}
    </span>
  );
}
