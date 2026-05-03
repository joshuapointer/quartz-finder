import Link from "next/link";
import type { BrandSummary } from "@/types";

function makeInitials(name: string): string {
  const SKIP = new Set(["quartz", "glass", "tubes"]);
  const words = name.split(/\s+/).filter((w) => !SKIP.has(w.toLowerCase()));
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words
    .slice(0, 3)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function splitName(name: string): { first: string; rest: string } {
  const idx = name.indexOf(" ");
  if (idx === -1) return { first: name, rest: "" };
  return { first: name.slice(0, idx), rest: name.slice(idx + 1) };
}

export default function BrandCard({ brand }: { brand: BrandSummary }) {
  const initials = makeInitials(brand.name);
  const { first, rest } = splitName(brand.name);
  const plural = brand.productCount === 1 ? "" : "s";
  const isUs = brand.tier === "usmade";

  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="pp-brand-card"
      style={
        {
          "--c-glow": "var(--color-c-cyan)",
          position: "relative",
          padding: 24,
          borderRadius: 22,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid var(--color-line)",
          display: "flex",
          gap: 18,
          overflow: "hidden",
          transition: "border-color .3s, transform .35s",
          textDecoration: "none",
          color: "inherit",
        } as React.CSSProperties
      }
    >
      {/* glow orb */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: "-30%",
          right: "-20%",
          width: "60%",
          aspectRatio: "1",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--color-c-cyan), transparent 65%)",
          filter: "blur(50px)",
          opacity: 0.35,
          pointerEvents: "none",
        }}
      />

      {/* circle mark */}
      <div
        className="mark"
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3))",
          border: "1px solid var(--color-line-gold-2)",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 18,
            fontWeight: 500,
            background:
              "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {initials}
        </span>
      </div>

      {/* body */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          flex: 1,
          minWidth: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* top row: name + country */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 20,
              fontWeight: 500,
              letterSpacing: "-0.018em",
              lineHeight: 1.1,
            }}
          >
            {first}{" "}
            {rest && (
              <em style={{ fontStyle: "italic", color: "var(--color-gold-light)" }}>
                {rest}
              </em>
            )}
          </div>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: isUs ? "var(--color-gold-light)" : "var(--color-muted)",
              whiteSpace: "nowrap",
            }}
          >
            {isUs ? "US" : "Import"}
          </span>
        </div>

        {/* blurb */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            color: "var(--color-muted)",
            lineHeight: 1.55,
            marginTop: 4,
            margin: 0,
          }}
        >
          {brand.productCount} piece{plural} on file
        </p>

        {/* arrow */}
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-gold-light)",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginTop: 6,
          }}
        >
          View pieces →
        </span>
      </div>
    </Link>
  );
}
