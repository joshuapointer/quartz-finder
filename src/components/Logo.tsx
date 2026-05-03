import Link from "next/link";

interface Props {
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Logo({ href = "/", size = "md", className = "" }: Props) {
  const markClass = size === "lg" ? "pp-mark pp-mark-lg" : size === "sm" ? "pp-mark pp-mark-sm" : "pp-mark pp-mark-md";
  const wordSize = size === "lg" ? 26 : size === "sm" ? 16 : 20;
  const ampSize = size === "lg" ? 28 : size === "sm" ? 18 : 22;

  return (
    <Link
      href={href}
      aria-label="Pillar and Pearl, home"
      className={`focus-ring ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        textDecoration: "none",
      }}
    >
      <svg className={markClass} aria-hidden="true">
        <use href="#pp" />
      </svg>
      <span
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: wordSize,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: "var(--color-fg)",
          lineHeight: 1,
        }}
      >
        Pillar
        <span
          style={{
            fontStyle: "italic",
            fontWeight: 400,
            color: "var(--color-gold-light)",
            fontSize: ampSize,
            margin: "0 0.08em",
          }}
        >
          &amp;
        </span>
        Pearl
      </span>
    </Link>
  );
}
