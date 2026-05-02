"use client";

import { useEffect } from "react";
import { Caustics, QuartzOrb } from "@/components/editorial";

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
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "96px 32px",
        textAlign: "center",
      }}
    >
      <Caustics opacity={0.55} />
      <div style={{ position: "relative", maxWidth: 720 }}>
        <div style={{ display: "inline-flex" }} aria-hidden>
          <QuartzOrb size={140} intensity={0.85} />
        </div>
        <div className="kicker" style={{ marginTop: 28, marginBottom: 16 }}>
          № 500 · Cracked quartz
        </div>
        <h1
          className="font-display ink"
          style={{
            fontSize: "clamp(56px, 8vw, 96px)",
            fontWeight: 200,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            margin: 0,
          }}
        >
          Something{" "}
          <em
            className="ink-brass-l"
            style={{ fontStyle: "italic", fontWeight: 300 }}
          >
            fractured.
          </em>
        </h1>
        <p
          className="font-display ink-soft"
          style={{
            fontSize: 22,
            fontStyle: "italic",
            fontWeight: 400,
            lineHeight: 1.55,
            marginTop: 20,
            maxWidth: 560,
            marginInline: "auto",
          }}
        >
          An unexpected error tripped the page. The bench is still there — try
          again, or head back to the index.
        </p>
        <div
          style={{
            marginTop: 32,
            display: "flex",
            justifyContent: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={reset}
            className="btn btn-primary focus-ring"
          >
            Try again
          </button>
          <a href="/shop" className="btn btn-ghost focus-ring">
            Back to the index
          </a>
        </div>
        {error.digest ? (
          <p
            className="font-mono ink-faint"
            style={{
              marginTop: 28,
              fontSize: 9,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
            }}
          >
            ref · {error.digest}
          </p>
        ) : null}
      </div>
    </section>
  );
}
