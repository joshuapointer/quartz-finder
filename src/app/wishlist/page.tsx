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
    <div className="container-base section-y-lg">
      <p className="eyebrow">Saved</p>
      <div className="rule mt-2" />
      <h1 className="font-display mt-6 text-4xl md:text-5xl">Your wishlist</h1>
      <p className="font-mono ink-mute mt-4 text-xs">
        Stored locally on this device. Clear cache and it&apos;s gone — no
        account, no tracking.
      </p>
      <div className="mt-12">
        <WishlistView products={products} />
      </div>
    </div>
  );
}
