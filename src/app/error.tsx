"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <>
      <style>{`
        @keyframes pulse-dot-err { 0%, 100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }
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
              animation: "pulse-dot-err 3s ease-in-out infinite",
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
            № 500 · Something fractured
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
            Something{" "}
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
              fractured.
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
            An unexpected error tripped the page. Try again, or head back to
            the shop.
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
            <button
              type="button"
              onClick={reset}
              className="btn btn-primary"
            >
              Try again
            </button>
            <a href="/shop" className="btn btn-ghost">
              Back to shop
            </a>
          </div>

          {error.digest && (
            <p
              style={{
                marginTop: 32,
                fontFamily: "var(--font-sans)",
                fontSize: 9,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "var(--color-dim)",
              }}
            >
              ref · {error.digest}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
