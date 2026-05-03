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
        style={{
          padding: "64px 0",
          textAlign: "center",
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--color-muted)",
          borderTop: "1px solid var(--color-line)",
          borderBottom: "1px solid var(--color-line)",
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
        body="Tap the heart on any piece to start a list."
        action={
          <Link href="/shop" className="btn btn-ghost">
            Browse the bench →
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
          borderBottom: "1px solid var(--color-line)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
          }}
        >
          {items.length} on the bench
        </span>
        <button
          type="button"
          onClick={() => {
            if (confirm("Clear all bench items?")) clear();
          }}
          className="btn btn-ghost"
          style={{ fontSize: 11, padding: "10px 18px" }}
        >
          Clear all
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
