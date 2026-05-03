/* ──────────────────────────────────────────────────────────────
 * PPMark — logo mark using the IconSprite #pp symbol.
 * ────────────────────────────────────────────────────────────── */
export function PPMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <svg
      className={`pp-mark pp-mark-${size}`}
      aria-hidden
      style={{ display: "block" }}
    >
      <use href="#pp" />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────
 * PearlDot — tiny brass-radial dot (separator / pulse).
 * ────────────────────────────────────────────────────────────── */
export function PearlDot({
  size = 6,
  color = "var(--color-gold)",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 30% 30%, var(--color-fg), ${color} 70%)`,
        boxShadow: `0 0 6px ${color}`,
      }}
    />
  );
}
