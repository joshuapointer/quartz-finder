import type { Metadata } from "next";
import WishlistView from "./WishlistView";
import { getAllProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved quartz pieces, all in one place.",
};

export default function WishlistPage() {
  const products = getAllProducts();
  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-amber)]">
        Saved
      </p>
      <h1 className="font-display mt-3 text-5xl">Your wishlist</h1>
      <p className="mt-3 text-[var(--color-ink-soft)]">
        Stored locally on this device. Clear cache and it&apos;s gone — no account,
        no tracking.
      </p>
      <div className="mt-10">
        <WishlistView products={products} />
      </div>
    </div>
  );
}
