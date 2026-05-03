interface Props {
  title: string;
  body?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title, body, action }: Props) {
  return (
    <div
      style={{
        padding: "96px 24px",
        textAlign: "center",
        borderTop: "1px solid var(--color-line)",
        borderBottom: "1px solid var(--color-line)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* gold halo */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--color-c-gold) 0%, transparent 70%)",
          opacity: 0.08,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <h3
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(36px, 5vw, 48px)",
          fontStyle: "italic",
          fontWeight: 500,
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
          color: "var(--color-fg)",
          position: "relative",
        }}
      >
        {title}
      </h3>

      {body ? (
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            lineHeight: 1.65,
            color: "var(--color-muted)",
            maxWidth: 440,
            margin: "16px auto 0",
            position: "relative",
          }}
        >
          {body}
        </p>
      ) : null}

      {action ? (
        <div style={{ marginTop: 32, position: "relative" }}>{action}</div>
      ) : null}
    </div>
  );
}
