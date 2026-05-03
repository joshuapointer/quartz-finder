"use client";

import { useState, useMemo } from "react";
import { useWishlist } from "@/store/wishlist";

interface Props {
  productId: string;
  size?: "sm" | "md";
}

export default function WishlistButton({ productId, size = "sm" }: Props) {
  const has = useWishlist((s) => s.ids.includes(productId));
  const hydrated = useWishlist((s) => s.hydrated);
  const toggle = useWishlist((s) => s.toggle);
  const [bumping, setBumping] = useState(false);

  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const inWishlist = hydrated && has;
  const dim = size === "md" ? 40 : 30;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const willBeActive = !has;
    toggle(productId);
    if (willBeActive && !reducedMotion) {
      setBumping(true);
      setTimeout(() => setBumping(false), 250);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={hydrated ? has : false}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      style={{
        width: dim,
        height: dim,
        borderRadius: "50%",
        border: `1px solid ${inWishlist ? "var(--color-gold)" : "var(--color-line-strong)"}`,
        background: "rgba(10,9,8,0.65)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "border-color 0.2s, transform 0.15s",
        transform: bumping ? "scale(1.12)" : "scale(1)",
        color: inWishlist ? "var(--color-gold-light)" : "var(--color-muted)",
        flexShrink: 0,
      }}
    >
      <svg
        width={size === "md" ? 18 : 14}
        height={size === "md" ? 18 : 14}
        viewBox="0 0 24 24"
        fill={inWishlist ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
      </svg>
    </button>
  );
}
