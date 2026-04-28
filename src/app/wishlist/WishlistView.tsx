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
      <div className="ink-mute font-mono border-y border-[var(--color-line)] py-16 text-center text-sm">
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
          <Link href="/shop" className="btn btn-ghost focus-ring">
            Browse the catalog
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <p className="font-mono ink-mute text-xs">
          {items.length} saved item{items.length === 1 ? "" : "s"}
        </p>
        <button
          type="button"
          onClick={() => {
            if (confirm("Clear all wishlist items?")) clear();
          }}
          className="btn btn-ghost focus-ring text-xs"
        >
          Clear all
        </button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
