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
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-rose)]">
        Cracked quartz
      </p>
      <h1 className="font-display mt-4 text-5xl">Something fractured.</h1>
      <p className="mt-4 max-w-md text-[var(--color-ink-soft)]">
        An unexpected error tripped this page. We&apos;ve been notified — try
        again, or head back to the catalog.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-[var(--color-amber)] px-6 py-3 text-sm font-semibold text-[var(--color-bg)]"
        >
          Try again
        </button>
        <a
          href="/shop"
          className="rounded-full border border-[var(--color-line)] px-6 py-3 text-sm text-[var(--color-ink-soft)] hover:border-[var(--color-amber)] hover:text-[var(--color-amber)]"
        >
          Back to catalog
        </a>
      </div>
      {error.digest ? (
        <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
          ref · {error.digest}
        </p>
      ) : null}
    </div>
  );
}
