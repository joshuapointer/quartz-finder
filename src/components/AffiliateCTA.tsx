"use client";

import { safeExternalUrl } from "@/lib/url";

interface Props {
  href: string | null;
  brandName: string;
  soldOut?: boolean;
}

function dispatchAffiliateEvent(href: string, brand: string) {
  if (typeof window !== "undefined" && "dispatchEvent" in window) {
    window.dispatchEvent(
      new CustomEvent("pp:affiliate-out", {
        detail: { href, brand },
      }),
    );
  }
}

export default function AffiliateCTA({ href, brandName, soldOut }: Props) {
  const safeHref = safeExternalUrl(href);

  if (!safeHref) {
    return (
      <div
        style={{
          padding: "20px 24px",
          borderRadius: 12,
          border: "1px solid var(--color-line)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            color: "var(--color-muted)",
            margin: 0,
          }}
        >
          No direct retail link on file.
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            color: "var(--color-dim)",
            margin: "6px 0 0",
          }}
        >
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
        onClick={() => dispatchAffiliateEvent(safeHref, brandName)}
        className="btn btn-ghost"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: 56,
          gap: 2,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Restock at{" "}
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              textTransform: "none",
              letterSpacing: "normal",
            }}
          >
            {brandName}
          </span>
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--color-dim)",
            textTransform: "none",
            letterSpacing: "0.02em",
          }}
        >
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
      onClick={() => dispatchAffiliateEvent(safeHref, brandName)}
      className="btn btn-primary"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 56,
        gap: 8,
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      Buy direct from{" "}
      <span
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          textTransform: "none",
          letterSpacing: "normal",
          fontWeight: 400,
        }}
      >
        {brandName}
      </span>
      <svg
        className="pp-icon"
        aria-hidden="true"
        style={{ width: 16, height: 16 }}
      >
        <use href="#i-arrow" />
      </svg>
    </a>
  );
}
