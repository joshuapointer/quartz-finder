export default function Loading() {
  return (
    <>
      <style>{`
        .pp-loading-ring {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.08);
          border-top-color: var(--color-gold-light);
          animation: pp-loading-spin 900ms linear infinite;
          display: block;
        }
        @keyframes pp-loading-spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pp-loading-ring {
            animation: none;
            border-top-color: var(--color-line-gold-2);
          }
        }
      `}</style>
      <div
        style={{
          minHeight: "40vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <span className="pp-loading-ring" aria-hidden="true" />
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 10,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
          }}
        >
          Loading…
        </span>
      </div>
    </>
  );
}
