import type { CSSProperties, ReactNode } from "react";

/* ──────────────────────────────────────────────────────────────
 * QuartzOrb — refined single-spectrum lavender + brass orb.
 * Used as masthead motif on AgeGate, Homepage hero, Dispatch.
 * ────────────────────────────────────────────────────────────── */
export function QuartzOrb({
  size = 200,
  intensity = 1,
}: {
  size?: number;
  intensity?: number;
}) {
  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "-25%",
          borderRadius: "50%",
          background:
            "conic-gradient(from 200deg, var(--color-quartz), var(--color-brass-light), var(--color-quartz-light), var(--color-brass), var(--color-quartz))",
          filter: `blur(${size * 0.18}px)`,
          opacity: 0.55 * intensity,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "15%",
          borderRadius: "50%",
          background: `
            radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 18%),
            radial-gradient(circle at 30% 30%, var(--color-pearl) 0%, var(--color-brass-light) 22%, var(--color-quartz) 50%, var(--color-quartz-dark) 85%, var(--color-ink-2) 100%)
          `,
          boxShadow: `
            inset -8px -12px 32px rgba(0,0,0,0.5),
            inset 4px 6px 16px rgba(255,255,255,0.3),
            0 0 ${size * 0.4}px rgba(184, 168, 232, 0.25),
            0 ${size * 0.05}px ${size * 0.2}px rgba(0,0,0,0.6)
          `,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "22%",
          left: "24%",
          width: "14%",
          height: "8%",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, var(--color-pearl), transparent 70%)",
          filter: "blur(2px)",
        }}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 * Caustics — restrained prismatic glow field + faint grid overlay.
 * ────────────────────────────────────────────────────────────── */
export function Caustics({ opacity = 0.5 }: { opacity?: number }) {
  return (
    <>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity,
          background: `
            radial-gradient(ellipse 30% 20% at 12% 22%, rgba(184,168,232,0.18), transparent 60%),
            radial-gradient(ellipse 26% 18% at 82% 78%, rgba(212,174,110,0.16), transparent 60%)
          `,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.35,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
 * PlatePlaceholder — annotated like a museum plate.
 * Wraps an optional image; if no image, shows registration crosshairs.
 * ────────────────────────────────────────────────────────────── */
export function PlatePlaceholder({
  label,
  sublabel,
  plate,
  width,
  height = 280,
  hero = false,
  imageSrc,
  imageAlt,
  className,
}: {
  label?: string;
  sublabel?: string;
  plate?: string;
  width?: string | number;
  height?: string | number;
  hero?: boolean;
  imageSrc?: string | null;
  imageAlt?: string;
  className?: string;
}) {
  const heightNum = typeof height === "number" ? height : null;
  return (
    <div
      className={className}
      style={{
        width: width ?? "100%",
        height,
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, var(--color-ink-2) 0%, var(--color-ink-3) 50%, var(--color-ink-2) 100%)",
        border: "1px solid var(--color-glass-border)",
      }}
    >
      <Caustics opacity={hero ? 0.6 : 0.4} />
      {hero && !imageSrc && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.4,
          }}
        >
          <QuartzOrb
            size={Math.min(heightNum ? heightNum * 0.55 : 280, 340)}
            intensity={0.7}
          />
        </div>
      )}
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={imageAlt ?? label ?? ""}
          loading="lazy"
          decoding="async"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: 24,
          }}
        />
      ) : null}
      {[
        [0, 0],
        [100, 0],
        [0, 100],
        [100, 100],
      ].map(([x, y], i) => (
        <svg
          key={i}
          width={14}
          height={14}
          aria-hidden
          style={{
            position: "absolute",
            top: y === 0 ? 12 : "auto",
            bottom: y === 100 ? 12 : "auto",
            left: x === 0 ? 12 : "auto",
            right: x === 100 ? 12 : "auto",
            opacity: 0.4,
          }}
        >
          <line x1="7" y1="0" x2="7" y2="14" stroke="var(--color-brass-light)" strokeWidth="0.5" />
          <line x1="0" y1="7" x2="14" y2="7" stroke="var(--color-brass-light)" strokeWidth="0.5" />
          <circle cx="7" cy="7" r="3" stroke="var(--color-brass-light)" strokeWidth="0.5" fill="none" />
        </svg>
      ))}
      {plate ? (
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: 38,
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "var(--color-bone)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            display: "flex",
            gap: 8,
          }}
        >
          <span style={{ color: "var(--color-brass-light)" }}>Pl. {plate}</span>
          {label ? <span style={{ color: "var(--color-smoke)" }}>{label}</span> : null}
        </div>
      ) : !imageSrc ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            color: "var(--color-bone)",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            pointerEvents: "none",
          }}
        >
          {label ? <div style={{ opacity: 0.85 }}>{label}</div> : null}
          {sublabel ? (
            <div style={{ opacity: 0.45, fontSize: 9 }}>{sublabel}</div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 * PriceCorridor — signature data-viz: low/high range with vendor ticks.
 * ────────────────────────────────────────────────────────────── */
export function PriceCorridor({
  low,
  high,
  points,
  height = 32,
  color,
}: {
  low: number;
  high: number;
  points: number[];
  height?: number;
  color?: string;
}) {
  const c = color ?? "var(--color-brass)";
  const range = Math.max(1, high - low);
  return (
    <svg
      viewBox="0 0 200 32"
      width="100%"
      height={height}
      style={{ display: "block", overflow: "visible" }}
      role="img"
      aria-label={`Price corridor: $${low} low to $${high} high across ${points.length} vendors`}
    >
      <line x1="0" y1="22" x2="200" y2="22" stroke="var(--color-hairline-strong)" strokeWidth="0.5" />
      <rect x="0" y="20" width="200" height="4" fill={c} fillOpacity={0.18} />
      {points.map((p, i) => {
        const x = ((p - low) / range) * 200;
        return (
          <line
            key={i}
            x1={x}
            y1="14"
            x2={x}
            y2="30"
            stroke={c}
            strokeWidth="1"
            opacity={0.55}
          />
        );
      })}
      <g transform="translate(0,22)">
        <path d="M 0,-6 L 5,0 L 0,6 L -5,0 Z" fill="var(--color-pearl)" />
      </g>
      <g transform="translate(200,22)">
        <circle r="3" fill="none" stroke="var(--color-bone)" strokeWidth="1" />
      </g>
      <text
        x="0"
        y="6"
        fontFamily="var(--font-mono)"
        fontSize="8"
        fill="var(--color-pearl)"
        letterSpacing="0.1em"
      >
        ${low}
      </text>
      <text
        x="200"
        y="6"
        fontFamily="var(--font-mono)"
        fontSize="8"
        fill="var(--color-smoke)"
        textAnchor="end"
        letterSpacing="0.1em"
      >
        ${high}
      </text>
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────
 * VerticalMark — vertically kerned wordmark.
 * ────────────────────────────────────────────────────────────── */
export function VerticalMark({
  height = 220,
  color = "var(--color-pearl)",
}: {
  height?: number;
  color?: string;
}) {
  const letters = ["P", "I", "L", "L", "A", "R", "·", "P", "E", "A", "R", "L"];
  return (
    <div
      aria-hidden
      style={{
        height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        color,
        letterSpacing: "0.32em",
      }}
    >
      {letters.map((l, i) => (
        <span
          key={i}
          style={{
            opacity: l === "·" ? 0.5 : 1,
            color: l === "·" ? "var(--color-brass)" : color,
          }}
        >
          {l}
        </span>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 * PPMark — small monogram glyph (P + circled pearl).
 * ────────────────────────────────────────────────────────────── */
export function PPMark({ size = 28 }: { size?: number }) {
  const id = `pp-grad-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      style={{ display: "block" }}
      aria-hidden
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="#F2D49A" />
          <stop offset="100%" stopColor="#D4AE6E" />
        </linearGradient>
      </defs>
      <rect x="0.75" y="0.75" width="30.5" height="30.5" stroke={`url(#${id})`} strokeWidth="0.75" />
      <path
        d="M9 9 L9 23 M9 9 L14 9 Q17 9 17 12 Q17 15 14 15 L9 15"
        stroke={`url(#${id})`}
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="22" cy="20" r="3" stroke={`url(#${id})`} strokeWidth="1.4" fill="none" />
      <circle cx="22" cy="20" r="1" fill="#D4AE6E" />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────
 * PearlDot — tiny brass-radial dot (separator / pulse).
 * ────────────────────────────────────────────────────────────── */
export function PearlDot({
  size = 6,
  color = "var(--color-brass)",
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
        background: `radial-gradient(circle at 30% 30%, var(--color-pearl), ${color} 70%)`,
        boxShadow: `0 0 6px ${color}`,
      }}
    />
  );
}

/* ──────────────────────────────────────────────────────────────
 * RotatedKicker — rotated mono caption used in broadsheet gutters.
 * ────────────────────────────────────────────────────────────── */
export function RotatedKicker({
  children,
  color = "var(--color-brass)",
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <div
      style={{
        writingMode: "vertical-rl",
        transform: "rotate(180deg)",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        color,
        letterSpacing: "0.32em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 * DropCap — editorial italic floated drop letter + body text.
 * ────────────────────────────────────────────────────────────── */
export function DropCap({
  children,
  style,
}: {
  children: string;
  style?: CSSProperties;
}) {
  const first = children.charAt(0);
  const rest = children.slice(1);
  return (
    <p
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: 16,
        color: "var(--color-bone)",
        lineHeight: 1.7,
        fontWeight: 400,
        ...(style ?? {}),
      }}
    >
      <span className="drop-cap-letter">{first}</span>
      {rest}
    </p>
  );
}

/* ──────────────────────────────────────────────────────────────
 * SectionRule — broadsheet-style divider with kicker + title + sub.
 * ────────────────────────────────────────────────────────────── */
export function SectionRule({
  kicker,
  title,
  sub,
}: {
  kicker?: string;
  title: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <div
      style={{
        padding: "40px 40px 24px",
        borderTop: "1px solid var(--color-hairline)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 24,
      }}
    >
      <div>
        {kicker ? (
          <div className="kicker" style={{ marginBottom: 12 }}>
            {kicker}
          </div>
        ) : null}
        <h2
          className="font-display"
          style={{
            fontSize: 56,
            fontWeight: 300,
            fontStyle: "italic",
            margin: 0,
            color: "var(--color-pearl)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {title}
        </h2>
      </div>
      {sub ? (
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            color: "var(--color-bone)",
            maxWidth: 360,
            lineHeight: 1.5,
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
}
