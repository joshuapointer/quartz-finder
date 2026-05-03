import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <style>{`
        @keyframes pulse-dot { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.12); } }
      `}</style>
      <section
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "96px 32px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 720, position: "relative" }}>
          {/* Gold dot motif */}
          <div
            aria-hidden
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 32%, var(--color-gold-light), var(--color-gold) 55%, var(--color-gold-deep) 100%)",
              boxShadow:
                "0 0 40px rgba(232,184,90,0.35), inset -2px -3px 6px rgba(0,0,0,0.4)",
              margin: "0 auto 32px",
              animation: "pulse-dot 3s ease-in-out infinite",
            }}
          />

          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--color-gold-light)",
              marginBottom: 20,
            }}
          >
            № 404 · Not found
          </div>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(56px, 8vw, 96px)",
              fontWeight: 500,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              margin: 0,
            }}
          >
            Lost in the{" "}
            <em
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                background:
                  "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              slits.
            </em>
          </h1>

          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 20,
              fontStyle: "italic",
              fontWeight: 400,
              lineHeight: 1.55,
              marginTop: 20,
              color: "var(--color-muted)",
              maxWidth: 480,
              marginInline: "auto",
            }}
          >
            That plate evaporated. The index is still on the bench.
          </p>

          <div
            style={{
              marginTop: 36,
              display: "flex",
              justifyContent: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <Link href="/" className="btn btn-primary">
              Home →
            </Link>
            <Link href="/shop" className="btn btn-ghost">
              Back to shop
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
