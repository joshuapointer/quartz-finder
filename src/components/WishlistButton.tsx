"use client";

import { useMemo, useState } from "react";
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

  const dim = size === "md" ? "h-10 w-10" : "h-8 w-8";

  const activeState = hydrated && has;

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
      aria-label={has ? "Remove from wishlist" : "Add to wishlist"}
      className={`${dim} focus-ring inline-flex items-center justify-center rounded-full border backdrop-blur-md transition-all
        ${bumping ? "scale-[1.05]" : ""}
        ${
          activeState
            ? "border-[var(--color-amber)]/60 text-[var(--color-amber)]"
            : "border-[var(--color-line-strong)] text-[var(--color-ink-mute)] hover:border-[var(--color-amber)] hover:text-[var(--color-amber-soft)]"
        }
      `}
      style={{ backgroundColor: "rgba(10,9,8,0.65)" }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={activeState ? "currentColor" : "none"}
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
