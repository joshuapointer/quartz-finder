"use client";

import { useEffect, useRef } from "react";
import { useAgeGate } from "@/store/age-gate";
import Logo from "./Logo";

export default function AgeGate() {
  const verified = useAgeGate((s) => s.verified);
  const hydrated = useAgeGate((s) => s.hydrated);
  const verify = useAgeGate((s) => s.verify);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Body scroll lock
  useEffect(() => {
    if (!hydrated) return;
    document.body.style.overflow = !verified ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [verified, hydrated]);

  // Auto-focus confirm button
  useEffect(() => {
    if (!hydrated || verified) return;
    confirmRef.current?.focus();
  }, [hydrated, verified]);

  // Focus trap + Esc handler
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-desc"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(6,5,4,0.92)] backdrop-blur-[20px]"
    >
      <div
        ref={dialogRef}
        className="age-gate-enter surface-elev shadow-[var(--shadow-modal)] rounded-[var(--radius-lg)] p-10 max-w-[460px] w-full mx-6"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo size="md" />
        </div>

        {/* 21+ rule label between two short hairlines */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="rule w-12 shrink-0" />
          <span className="rule-label">21+</span>
          <span className="rule w-12 shrink-0" />
        </div>

        {/* Headline — "twenty-one" spelled out per spec */}
        <h2
          id="age-gate-title"
          className="font-display text-3xl leading-tight text-center"
        >
          Are you twenty-one or older?
        </h2>

        {/* Body copy — editorial refresh */}
        <p
          id="age-gate-desc"
          className="prose-measure mx-auto text-sm text-center mt-4 ink-soft"
        >
          Pillar &amp; Pearl is an editorial atlas of cannabis-concentrate
          hardware. We catalog; we don&rsquo;t sell. Every link routes to an
          independent retailer, and entry is restricted to adults of legal age
          in their jurisdiction.
        </p>

        {/* Confirm — primary button */}
        <button
          ref={confirmRef}
          type="button"
          onClick={() => verify()}
          className="btn btn-primary focus-ring w-full mt-8"
        >
          I am 21 or older
        </button>

        {/* Decline — text-only, asymmetric weight intentional */}
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined") {
              if (window.history.length > 1) window.history.back();
              else window.location.replace("about:blank");
            }
          }}
          className="block mx-auto mt-4 text-2xs uppercase tracking-[0.22em] ink-mute hover:ink transition-colors focus-ring rounded-[2px] px-2 py-1"
        >
          Take me back
        </button>

        {/* Footer — mono privacy note */}
        <p className="font-mono text-2xs ink-faint text-center mt-8">
          Verification cached locally · No data leaves your device
        </p>
      </div>
    </div>
  );
}
