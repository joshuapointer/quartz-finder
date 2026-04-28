"use client";

import { useEffect, useRef } from "react";
import { useAgeGate } from "@/store/age-gate";

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
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])',
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-desc"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(11,10,15,0.92)] backdrop-blur"
    >
      <div
        ref={dialogRef}
        className="surface-elev glow-amber mx-6 w-full max-w-md rounded-2xl p-8"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-amber)]">
          Age Verification
        </p>
        <h2 id="age-gate-title" className="font-display mt-3 text-3xl">
          Are you 21 or older?
        </h2>
        <p
          id="age-gate-desc"
          className="mt-4 text-sm leading-relaxed text-[var(--color-ink-soft)]"
        >
          Pillar &amp; Pearl catalogs cannabis-concentrate hardware. Entry is restricted
          to adults of legal age in their jurisdiction. We do not sell, ship, or
          handle product — every link routes to an independent retailer.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            ref={confirmRef}
            type="button"
            onClick={() => verify()}
            className="focus-ring flex-1 rounded-full bg-[var(--color-amber)] px-5 py-3 text-sm font-semibold text-[var(--color-bg)] transition-transform hover:-translate-y-0.5"
          >
            I am 21 or older
          </button>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                if (window.history.length > 1) window.history.back();
                else window.location.replace("about:blank");
              }
            }}
            className="flex-1 rounded-full border border-[var(--color-line)] px-5 py-3 text-center text-sm text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-rose)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rose)]"
          >
            Take me back
          </button>
        </div>
        <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
          Verification cached locally · No data leaves your device
        </p>
      </div>
    </div>
  );
}
