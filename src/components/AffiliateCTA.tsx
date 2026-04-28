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
      <div className="surface rounded-2xl p-5">
        <p className="text-sm text-[var(--color-ink-soft)]">
          No direct retail link on file.
        </p>
        <p className="mt-1 text-xs text-[var(--color-ink-mute)]">
          Contact {brandName} or check trusted dab forums for current stock.
        </p>
      </div>
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
            new CustomEvent("qf:affiliate-out", {
              detail: { href: safeHref, brand: brandName },
            }),
          );
        }
      }}
      className={`group inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
        soldOut
          ? "border border-[var(--color-line)] bg-[var(--color-bg-elev)] text-[var(--color-ink-soft)]"
          : "bg-[var(--color-amber)] text-[var(--color-bg)]"
      }`}
    >
      {soldOut ? "Check restock at " : "Buy direct from "}
      <span className="font-display">{brandName}</span>
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
        ↗
      </span>
    </a>
  );
}
