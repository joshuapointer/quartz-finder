import type { BrandStatus } from "@/types";

interface Props {
  status: BrandStatus;
  label?: string | null;
  soldOut?: boolean;
}

export default function StatusBadge({ status, label, soldOut }: Props) {
  if (soldOut) {
    return (
      <span className="inline-flex items-center rounded-full border border-[var(--color-rose)]/50 bg-[var(--color-rose)]/10 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.18em] text-[var(--color-rose)]">
        Sold Out
      </span>
    );
  }
  if (status === "dead") {
    return (
      <span className="inline-flex items-center rounded-full border border-[var(--color-line)] bg-[var(--color-bg-elev)] px-2.5 py-0.5 text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-mute)]">
        {label ?? "Inactive"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--color-jade)]/40 bg-[var(--color-jade)]/10 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.18em] text-[var(--color-jade)]">
      Active
    </span>
  );
}
