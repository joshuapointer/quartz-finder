"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useWishlist } from "@/store/wishlist";
import type { NormalizedProduct } from "@/types";

const GLOWS = [
  "var(--color-c-gold)",
  "var(--color-c-magenta)",
  "var(--color-c-violet)",
  "var(--color-c-cyan)",
];

function glowForId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return GLOWS[h % GLOWS.length];
}

function HeartButton({ productId }: { productId: string }) {
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

  const inWishlist = hydrated && has;

  return (
    <button
      type="button"
      className="save"
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={hydrated ? has : false}
      data-on={inWishlist || undefined}
      onClick={handleClick}
      style={
        bumping ? { transform: "scale(1.12)", transition: "transform 0.15s" } : undefined
      }
    >
      <svg className="pp-icon" aria-hidden="true">
        <use href="#i-heart" />
      </svg>
    </button>
  );
}

export default function ProductCard({ product }: { product: NormalizedProduct }) {
  const glow = glowForId(product.id);
  const imageSrc = product.imageHash ? `/img/${product.imageHash}` : null;

  return (
    <Link
      href={`/products/${product.id}`}
      className="pp-product"
      style={{ "--c-glow": glow } as React.CSSProperties}
    >
      <div className="photo">
        {imageSrc ? (
          <img src={imageSrc} alt={product.name} loading="lazy" />
        ) : (
          <div className="photo-empty">No image</div>
        )}
        <HeartButton productId={product.id} />
      </div>
      <div className="info">
        <div className="brand-line">
          <span className="maker">{product.brandName}</span>
          {product.brandTier === "usmade" && (
            <span className="us-made">US-Made</span>
          )}
        </div>
        <div className="name">{product.name}</div>
        <div className="price-row">
          <div className="price">{product.price}</div>
        </div>
      </div>
    </Link>
  );
}
