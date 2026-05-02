"use client";

import { useEffect, useRef } from "react";
import { useAgeGate } from "@/store/age-gate";
import {
  Caustics,
  PPMark,
  QuartzOrb,
  VerticalMark,
} from "./editorial";

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
        background: "var(--color-ink)",
        color: "var(--color-pearl)",
        fontFamily: "var(--font-sans)",
        overflow: "hidden",
      }}
    >
      <Caustics opacity={0.7} />

      <div ref={dialogRef} className="relative h-full w-full">
        <div
          className="hidden md:grid h-full"
          style={{
            gridTemplateColumns: "60px minmax(0,1fr) minmax(0,1.2fr) 80px",
            gridTemplateRows: "60px 1fr 60px",
          }}
        >
          {/* TL — vertical mark column */}
          <div
            style={{
              gridColumn: "1",
              gridRow: "1 / 4",
              borderRight: "1px solid var(--color-hairline)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "24px 0",
            }}
          >
            <PPMark size={22} />
            <VerticalMark height={200} color="var(--color-bone)" />
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "var(--color-smoke)",
                letterSpacing: "0.3em",
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              MMXXVI
            </div>
          </div>

          {/* top rule */}
          <div
            style={{
              gridColumn: "2 / 5",
              gridRow: "1",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 32px",
              borderBottom: "1px solid var(--color-hairline)",
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "var(--color-smoke)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            <span>The Threshold</span>
            <span>Folio I · Plate 0001</span>
            <span style={{ color: "var(--color-brass)" }}>An Index of Quartz</span>
          </div>

          {/* LEFT — text panel */}
          <div
            style={{
              gridColumn: "2",
              gridRow: "2",
              padding: "64px 48px 48px 48px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRight: "1px solid var(--color-hairline)",
              minHeight: 0,
            }}
          >
            <div>
              <div
                className="kicker"
                style={{ marginBottom: 24 }}
              >
                No. 0001 — Threshold
              </div>
              <h1
                id="age-gate-title"
                className="font-display"
                style={{
                  fontSize: "clamp(56px, 7vw, 96px)",
                  fontWeight: 400,
                  margin: 0,
                  lineHeight: 0.88,
                  letterSpacing: "-0.04em",
                  color: "var(--color-pearl)",
                }}
              >
                A measured
                <br />
                pursuit of
                <br />
                <em
                  style={{
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "var(--color-brass-light)",
                    fontSize: "clamp(72px, 9vw, 132px)",
                    display: "block",
                    marginTop: -4,
                    marginLeft: -4,
                  }}
                >
                  finer fire.
                </em>
              </h1>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 22,
                paddingTop: 32,
                borderTop: "1px solid var(--color-hairline)",
                marginTop: 32,
              }}
            >
              <p
                id="age-gate-desc"
                className="font-display ink-soft"
                style={{
                  fontSize: 19,
                  fontWeight: 400,
                  fontStyle: "italic",
                  lineHeight: 1.55,
                  margin: 0,
                  maxWidth: 480,
                }}
              >
                Pillar &amp; Pearl curates quartz from a small bench of artisans
                &amp; makers. By entering, you affirm legal age and assume
                responsibility for what follows.
              </p>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <button
                  ref={confirmRef}
                  type="button"
                  onClick={() => verify()}
                  className="btn btn-primary focus-ring"
                >
                  I am 21 / Cross the Threshold
                </button>
                <button
                  type="button"
                  onClick={decline}
                  className="btn btn-ghost focus-ring"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT — orb panel */}
          <div
            style={{
              gridColumn: "3",
              gridRow: "2",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRight: "1px solid var(--color-hairline)",
            }}
          >
            <QuartzOrb size={420} />
            <svg
              aria-hidden
              style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
              width="100%"
              height="100%"
            >
              <line x1="50%" y1="22%" x2="92%" y2="14%" stroke="var(--color-brass)" strokeWidth="0.5" opacity="0.6" />
              <line x1="32%" y1="50%" x2="6%" y2="50%" stroke="var(--color-brass)" strokeWidth="0.5" opacity="0.6" />
              <line x1="68%" y1="78%" x2="92%" y2="86%" stroke="var(--color-brass)" strokeWidth="0.5" opacity="0.6" />
            </svg>
            <div
              style={{
                position: "absolute",
                top: "8%",
                right: "4%",
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "var(--color-brass-light)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              ① Specular highlight
            </div>
            <div
              style={{
                position: "absolute",
                top: "46%",
                left: "2%",
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "var(--color-brass-light)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              ② Refractive core
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "10%",
                right: "4%",
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "var(--color-brass-light)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              ③ Caustic shadow
            </div>
          </div>

          {/* TR — vertical scale */}
          <div
            style={{
              gridColumn: "4",
              gridRow: "1 / 4",
              borderLeft: "1px solid var(--color-hairline)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "24px 0",
              alignItems: "center",
            }}
          >
            {(["I", "II", "III", "IV", "V"] as const).map((n, i) => (
              <div
                key={n}
                className="font-display"
                style={{
                  fontSize: 18,
                  color: i === 0 ? "var(--color-brass-light)" : "var(--color-smoke)",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                {n}
              </div>
            ))}
          </div>

          {/* bottom rule */}
          <div
            style={{
              gridColumn: "2 / 4",
              gridRow: "3",
              padding: "0 32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid var(--color-hairline)",
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "var(--color-smoke)",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
            }}
          >
            <span>pillarpearl.com</span>
            <span>For tobacco &amp; legal use · Not for sale to minors</span>
            <span style={{ color: "var(--color-brass)" }}>↓ Continue</span>
          </div>
        </div>

        {/* ───── mobile fallback ───── */}
        <div className="md:hidden flex h-full flex-col items-center justify-center px-6 py-10 text-center relative">
          <div className="mb-8">
            <PPMark size={28} />
          </div>
          <div
            className="kicker"
            style={{ marginBottom: 16 }}
          >
            No. 0001 — Threshold
          </div>
          <h1
            className="font-display"
            style={{
              fontSize: 56,
              fontWeight: 400,
              margin: 0,
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              color: "var(--color-pearl)",
            }}
          >
            A measured pursuit of{" "}
            <em
              style={{
                fontStyle: "italic",
                color: "var(--color-brass-light)",
              }}
            >
              finer fire.
            </em>
          </h1>
          <div className="my-8">
            <QuartzOrb size={220} />
          </div>
          <p
            className="font-display ink-soft"
            style={{
              fontSize: 16,
              fontStyle: "italic",
              lineHeight: 1.55,
              maxWidth: 440,
            }}
          >
            Pillar &amp; Pearl curates quartz from a small bench of artisans
            &amp; makers. By entering, you affirm legal age.
          </p>
          <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
            <button
              type="button"
              onClick={() => verify()}
              className="btn btn-primary focus-ring w-full"
            >
              I am 21 / Cross the Threshold
            </button>
            <button
              type="button"
              onClick={decline}
              className="btn btn-ghost focus-ring w-full"
            >
              Decline
            </button>
          </div>
          <p
            className="font-mono ink-faint mt-8"
            style={{
              fontSize: 9,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            For tobacco &amp; legal use · Not for sale to minors
          </p>
        </div>
      </div>
    </div>
  );
}
