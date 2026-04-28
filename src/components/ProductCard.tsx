import Link from "next/link";
import type { NormalizedProduct } from "@/types";
import TierBadge from "./TierBadge";
import StatusBadge from "./StatusBadge";
import WishlistButton from "./WishlistButton";

const CATEGORY_GLYPH: Record<NormalizedProduct["category"], string> = {
  control_tower: "▮",
  terp_slurper: "◐",
  dunking_station: "◍",
};

export default function ProductCard({ product }: { product: NormalizedProduct }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group surface focus-ring relative flex h-full flex-col overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--color-amber)]/60"
    >
      <div className="absolute right-4 top-4 z-10">
        <WishlistButton productId={product.id} />
      </div>

      <div
        aria-hidden="true"
        className="flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-bg-elev)] to-[var(--color-bg)] text-5xl text-[var(--color-amber-soft)]/70 ring-1 ring-inset ring-[var(--color-line)]"
      >
        {CATEGORY_GLYPH[product.category]}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <TierBadge tier={product.brandTier} />
        <StatusBadge status={product.brandStatus} soldOut={product.soldOut} />
      </div>

      <h3 className="font-display mt-3 text-lg leading-tight text-[var(--color-ink)]">
        {product.name}
      </h3>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{product.brandName}</p>

      <div className="mt-auto flex items-end justify-between pt-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-mute)]">
            {product.categoryLabel}
          </p>
          <p className="font-display mt-1 text-xl text-[var(--color-amber-soft)]">
            {product.price}
            {product.originalPrice ? (
              <span className="ml-2 text-sm text-[var(--color-ink-mute)] line-through">
                {product.originalPrice}
              </span>
            ) : null}
          </p>
        </div>
        <span className="text-xs text-[var(--color-ink-soft)] transition-colors group-hover:text-[var(--color-amber)]">
          View →
        </span>
      </div>
    </Link>
  );
}
