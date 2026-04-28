"use client";

import { useWishlist } from "@/store/wishlist";

interface Props {
  productId: string;
  size?: "sm" | "md";
}

export default function WishlistButton({ productId, size = "sm" }: Props) {
  const has = useWishlist((s) => s.ids.includes(productId));
  const hydrated = useWishlist((s) => s.hydrated);
  const toggle = useWishlist((s) => s.toggle);

  const dim = size === "md" ? "h-10 w-10" : "h-8 w-8";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      aria-pressed={hydrated && has}
      aria-label={has ? "Remove from wishlist" : "Add to wishlist"}
      className={`${dim} focus-ring inline-flex items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-bg-elev)]/80 text-[var(--color-ink-soft)] backdrop-blur transition-all hover:border-[var(--color-amber)] hover:text-[var(--color-amber)] ${
        hydrated && has ? "border-[var(--color-amber)] text-[var(--color-amber)]" : ""
      }`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={hydrated && has ? "currentColor" : "none"}
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
