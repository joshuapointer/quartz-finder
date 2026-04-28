"use client";

import { safeExternalUrl } from "@/lib/url";

interface Props {
  href: string | null;
  brandName: string;
  soldOut?: boolean;
}

export default function AffiliateCTA({ href, brandName, soldOut }: Props) {
  const safeHref = safeExternalUrl(href);
  if (!safeHref) {
    return (
      <div className="surface-flat p-6 rounded-[var(--radius-md)]">
        <p className="text-sm text-[var(--color-ink-soft)]">
          No direct retail link on file.
        </p>
        <p className="mt-1 text-xs text-[var(--color-ink-mute)]">
          Contact {brandName} or check trusted dab forums for current stock.
        </p>
      </div>
    );
  }

  if (soldOut) {
    return (
      <a
        href={safeHref}
        target="_blank"
        rel="noopener noreferrer nofollow"
        onClick={() => {
          if (typeof window !== "undefined" && "dispatchEvent" in window) {
            window.dispatchEvent(
              new CustomEvent("pp:affiliate-out", {
                detail: { href: safeHref, brand: brandName },
              }),
            );
          }
        }}
        className="btn btn-ghost focus-ring group flex w-full h-14 flex-col items-center justify-center text-sm tracking-[0.04em] uppercase"
      >
        <span>
          Restock at{" "}
          <span className="font-display italic normal-case tracking-normal">
            {brandName}
          </span>
        </span>
        <span className="font-mono text-2xs ink-faint normal-case tracking-normal mt-1">
          (verify on site)
        </span>
      </a>
    );
  }

  return (
    <a
      href={safeHref}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={() => {
        if (typeof window !== "undefined" && "dispatchEvent" in window) {
          window.dispatchEvent(
            new CustomEvent("pp:affiliate-out", {
              detail: { href: safeHref, brand: brandName },
            }),
          );
        }
      }}
      className="btn btn-primary focus-ring group w-full h-14 text-sm tracking-[0.04em] uppercase font-medium"
    >
      Buy direct from{" "}
      <span className="font-display italic normal-case tracking-normal">
        {brandName}
      </span>
      {/* 14×14 SVG external arrow — replaces ↗ glyph */}
      <svg
        viewBox="0 0 14 14"
        width="14"
        height="14"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        aria-hidden="true"
        className="transition-transform group-hover:translate-x-0.5"
      >
        <path d="M3 11L11 3M5 3h6v6" />
      </svg>
    </a>
  );
}
