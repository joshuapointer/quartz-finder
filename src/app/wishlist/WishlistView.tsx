"use client";

import Link from "next/link";
import type { NormalizedProduct } from "@/types";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import { useWishlist } from "@/store/wishlist";

export default function WishlistView({ products }: { products: NormalizedProduct[] }) {
  const ids = useWishlist((s) => s.ids);
  const hydrated = useWishlist((s) => s.hydrated);
  const clear = useWishlist((s) => s.clear);

  if (!hydrated) {
    return (
      <div className="surface rounded-2xl px-6 py-16 text-center text-[var(--color-ink-mute)]">
        Loading wishlist…
      </div>
    );
  }

  const items = products.filter((p) => ids.includes(p.id));

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing saved yet"
        body="Tap the heart on any product card to start a list."
        action={
          <Link
            href="/shop"
            className="focus-ring rounded-full bg-[var(--color-amber)] px-6 py-3 text-sm font-semibold text-[var(--color-bg)]"
          >
            Browse the catalog
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-[var(--color-ink-soft)]">
          {items.length} saved item{items.length === 1 ? "" : "s"}
        </p>
        <button
          type="button"
          onClick={() => {
            if (confirm("Clear all wishlist items?")) clear();
          }}
          className="focus-ring rounded-md px-2 py-1 text-xs uppercase tracking-[0.2em] text-[var(--color-ink-mute)] transition-colors hover:text-[var(--color-rose)]"
        >
          Clear all
        </button>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
