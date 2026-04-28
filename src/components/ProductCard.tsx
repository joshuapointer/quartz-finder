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
      className="group surface lift focus-ring relative overflow-hidden rounded-[var(--radius-md)] p-0 flex flex-col h-full"
    >
      {/* Image area — edge-to-edge, WishlistButton floated inside */}
      <div className="relative aspect-[4/5] md:aspect-square bg-[var(--color-bg)] overflow-hidden after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-[var(--color-line-soft)]">
        {product.imageHash ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={`/img/${product.imageHash}`}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[400ms] ease-[var(--ease-expressive)] group-hover:scale-[1.03]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full items-center justify-center font-display text-7xl ink-faint"
          >
            {CATEGORY_GLYPH[product.category]}
          </div>
        )}
        {/* WishlistButton lives inside the image panel */}
        <div className="absolute right-3 top-3 z-10">
          <WishlistButton productId={product.id} />
        </div>
      </div>

      {/* Body */}
      <div className="p-5 md:p-6 flex flex-col flex-1">
        {/* Badge row — TierBadge + StatusBadge only; FreshBadge removed */}
        <div className="flex flex-wrap items-center gap-1.5">
          <TierBadge tier={product.brandTier} />
          <StatusBadge status={product.brandStatus} soldOut={product.soldOut} />
        </div>

        <h3 className="font-display text-xl leading-tight ink mt-3">
          {product.name}
        </h3>
        <p className="text-sm ink-soft mt-1">{product.brandName}</p>

        {/* Footer row */}
        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <p className="eyebrow eyebrow-mute">{product.categoryLabel}</p>
            <p className="font-display text-2xl ink mt-1">
              {product.price}
              {product.originalPrice ? (
                <span className="font-mono text-xs ink-faint ml-2 line-through">
                  {product.originalPrice}
                </span>
              ) : null}
            </p>
          </div>
          {/* Amber dot grows on hover — replaces "View →" */}
          <span
            aria-hidden
            className="block h-1 w-1 rounded-full bg-[var(--color-amber)] transition-all duration-[var(--duration-base)] ease-[var(--ease-expressive)] group-hover:h-1.5 group-hover:w-1.5"
          />
          <span className="sr-only">View product</span>
        </div>
      </div>
    </Link>
  );
}
