"use client";

import { useEffect, useRef } from "react";
import { useAgeGate } from "@/store/age-gate";
import { PPMark } from "./editorial";

export default function AgeGate() {
  const verified = useAgeGate((s) => s.verified);
  const hydrated = useAgeGate((s) => s.hydrated);
  const verify = useAgeGate((s) => s.verify);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hydrated) return;
    document.body.style.overflow = !verified ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [verified, hydrated]);

  useEffect(() => {
    if (!hydrated || verified) return;
    confirmRef.current?.focus();
  }, [hydrated, verified]);

  useEffect(() => {
    if (!hydrated || verified) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (typeof window !== "undefined") {
          if (window.history.length > 1) window.history.back();
          else window.location.replace("about:blank");
        }
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hydrated, verified]);

  if (!hydrated || verified) return null;

  const decline = () => {
    if (typeof window === "undefined") return;
    if (window.history.length > 1) window.history.back();
    else window.location.replace("about:blank");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-desc"
      className="age-gate-enter fixed inset-0 z-[100]"
      style={{
        background: "var(--color-bg)",
        color: "var(--color-fg)",
        fontFamily: "var(--font-sans)",
        overflow: "hidden",
      }}
    >
      {/* Gold halo background */}
      <div
        aria-hidden
        className="pp-bg"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      />

      <div
        ref={dialogRef}
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 640,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 0,
          }}
        >
          {/* Logo */}
          <div style={{ marginBottom: 32 }}>
            <PPMark size="lg" />
          </div>

          {/* Headline */}
          <h1
            id="age-gate-title"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(48px, 8vw, 80px)",
              fontWeight: 400,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "var(--color-fg)",
              margin: 0,
              marginBottom: 20,
            }}
          >
            Are you{" "}
            <em
              style={{
                fontStyle: "italic",
                color: "var(--color-gold-light)",
              }}
            >
              21+?
            </em>
          </h1>

          {/* Subhead */}
          <p
            id="age-gate-desc"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(15px, 2vw, 18px)",
              fontStyle: "italic",
              fontWeight: 400,
              color: "var(--color-muted)",
              lineHeight: 1.5,
              margin: 0,
              marginBottom: 40,
              maxWidth: 480,
            }}
          >
            Pillar &amp; Pearl is for adults in places where dabbing is legal.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              width: "100%",
              maxWidth: 320,
              marginBottom: 28,
            }}
          >
            <button
              ref={confirmRef}
              type="button"
              onClick={() => verify()}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Yes — I&apos;m 21+
            </button>
            <button
              type="button"
              onClick={decline}
              className="btn btn-ghost"
              style={{ width: "100%" }}
            >
              No — take me back
            </button>
          </div>

          {/* Legal line */}
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--color-dim)",
              margin: 0,
            }}
          >
            21+ Only · Not for sale to minors
          </p>
        </div>
      </div>
    </div>
  );
}
