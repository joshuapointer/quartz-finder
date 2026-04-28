import type { BrandStatus } from "@/types";

interface Props {
  status: BrandStatus;
  label?: string | null;
  soldOut?: boolean;
}

export default function StatusBadge({ status, label, soldOut }: Props) {
  if (soldOut) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--color-rose)]/60 bg-transparent px-2 py-[3px] text-[10px] uppercase tracking-[0.22em] font-medium text-[var(--color-rose)]"
        aria-label="Sold out"
      >
        {/* 6px square dot — non-color affordance */}
        <span role="img" aria-label="Out of stock" className="block h-1.5 w-1.5 bg-[var(--color-rose)]" />
        Sold Out
      </span>
    );
  }
  if (status === "dead") {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--color-line-strong)] bg-transparent px-2 py-[3px] text-[10px] uppercase tracking-[0.22em] font-medium text-[var(--color-ink-mute)]"
        aria-label={label ?? "Inactive"}
      >
        {label ?? "Inactive"}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--color-sage)] bg-transparent px-2 py-[3px] text-[10px] uppercase tracking-[0.22em] font-medium text-[var(--color-sage-soft)]"
      aria-label="Brand active"
    >
      {/* 6px square dot — non-color affordance */}
      <span role="img" aria-label="In stock" className="block h-1.5 w-1.5 bg-[var(--color-sage-soft)]" />
      Active
    </span>
  );
}
