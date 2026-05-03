import type { BrandStatus } from "@/types";

interface Props {
  status: BrandStatus;
  label?: string | null;
  soldOut?: boolean;
}

const pillBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  borderRadius: 2,
  padding: "3px 8px",
  background: "transparent",
};

export default function StatusBadge({ status, label, soldOut }: Props) {
  if (soldOut) {
    return (
      <span
        style={{
          ...pillBase,
          color: "var(--color-rose)",
          border: "1px solid var(--color-rose)",
        }}
        aria-label="Sold out"
      >
        <span
          aria-hidden
          style={{
            display: "block",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--color-rose)",
          }}
        />
        Sold Out
      </span>
    );
  }

  if (status === "dead") {
    return (
      <span
        style={{
          ...pillBase,
          color: "var(--color-muted)",
          border: "1px solid var(--color-line-strong)",
        }}
        aria-label={label ?? "Dormant"}
      >
        {label ?? "Dormant"}
      </span>
    );
  }

  return (
    <span
      style={{
        ...pillBase,
        color: "var(--color-good)",
        border: "1px solid var(--color-good)",
      }}
      aria-label="Active"
    >
      <span
        aria-hidden
        style={{
          display: "block",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "var(--color-good)",
        }}
      />
      Active
    </span>
  );
}
