"use client";

import Link from "next/link";
import type { NormalizedProduct } from "@/types";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import { useWishlist } from "@/store/wishlist";

export default function WishlistView({
  products,
}: {
  products: NormalizedProduct[];
}) {
  const ids = useWishlist((s) => s.ids);
  const hydrated = useWishlist((s) => s.hydrated);
  const clear = useWishlist((s) => s.clear);

  if (!hydrated) {
    return (
      <div
        className="font-mono ink-mute"
        style={{
          padding: "64px 0",
          textAlign: "center",
          fontSize: 12,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          borderTop: "1px solid var(--color-hairline)",
          borderBottom: "1px solid var(--color-hairline)",
        }}
      >
        Loading bench…
      </div>
    );
  }

  const items = products.filter((p) => ids.includes(p.id));

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing on the bench yet"
        body="Tap the heart on any piece to start a list. Stored locally — no account, no tracking."
        action={
          <Link href="/shop" className="btn btn-ghost focus-ring">
            Browse the index →
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 32,
          paddingBottom: 24,
          borderBottom: "1px solid var(--color-hairline)",
        }}
      >
        <span
          className="font-mono ink-mute"
          style={{
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          {items.length} on the bench
        </span>
        <button
          type="button"
          onClick={() => {
            if (confirm("Clear all bench items?")) clear();
          }}
          className="btn btn-ghost focus-ring"
          style={{ fontSize: 11, padding: "10px 18px" }}
        >
          Clear all
        </button>
      </div>
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        }}
      >
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
