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
    <div className="container-narrow section-y-lg flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="eyebrow eyebrow-mute">Cracked quartz</p>
      <h1 className="font-display mt-4 text-4xl md:text-5xl">
        Something fractured.
      </h1>
      <p className="prose-measure ink-soft mx-auto mt-4 max-w-md text-base">
        An unexpected error tripped this page. We&apos;ve been notified — try
        again, or head back to the catalog.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="btn btn-primary focus-ring"
        >
          Try again
        </button>
        <a href="/shop" className="btn btn-ghost focus-ring">
          Back to catalog
        </a>
      </div>
      {error.digest ? (
        <p className="ink-mute font-mono mt-6 text-2xs uppercase tracking-[0.04em]">
          ref · {error.digest}
        </p>
      ) : null}
    </div>
  );
}
