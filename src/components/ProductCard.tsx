import Link from "next/link";
import type { NormalizedProduct } from "@/types";
import WishlistButton from "./WishlistButton";
import { PlatePlaceholder } from "./editorial";

const ACCENTS: Record<NormalizedProduct["category"], string> = {
  control_tower: "var(--color-quartz)",
  terp_slurper: "var(--color-brass-light)",
  dunking_station: "var(--color-quartz-light)",
};

// deterministic vendor-count signal from product id (stable across renders)
function vendorSignal(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return 3 + (h % 10); // 3..12
}

export default function ProductCard({
  product,
}: {
  product: NormalizedProduct;
}) {
  const accent = ACCENTS[product.category];
  const vendors = vendorSignal(product.id);
  const filledBars = Math.min(3, Math.ceil(vendors / 4));
  const showCount = Math.min(vendors, 5);
  const imageSrc = product.imageHash ? `/img/${product.imageHash}` : null;
  const tag = product.soldOut
    ? "Sold out"
    : product.brandTier === "usmade"
      ? "Bench Pick"
      : null;

  return (
    <Link
      href={`/products/${product.id}`}
      className="heavy-glass lift focus-ring group relative flex flex-col overflow-hidden"
      style={{
        borderRadius: 8,
        padding: 14,
        gap: 14,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: -60,
          right: -60,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`,
          opacity: 0.18,
          filter: "blur(20px)",
        }}
      />
      {tag ? (
        <span
          className="glass-card"
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            zIndex: 2,
            color: "var(--color-brass-light)",
            padding: "6px 12px",
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            borderRadius: 999,
          }}
        >
          {tag}
        </span>
      ) : null}
      <div className="absolute right-5 top-5 z-10">
        <WishlistButton productId={product.id} />
      </div>
      <div className="relative">
        <PlatePlaceholder
          label={`${product.brandName} · ${product.name}`}
          height={240}
          imageSrc={imageSrc}
          imageAlt={product.name}
        />
      </div>
      <div className="relative flex justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div
            className="kicker kicker-light"
            style={{ marginBottom: 6 }}
          >
            {product.brandName}
          </div>
          <div
            className="font-display ink"
            style={{
              fontSize: 24,
              fontStyle: "italic",
              fontWeight: 400,
              lineHeight: 1.05,
            }}
          >
            {product.name}
          </div>
          <div
            className="font-mono ink-mute"
            style={{ fontSize: 10, marginTop: 8 }}
          >
            {product.categoryLabel}
          </div>
        </div>
      </div>
      <div
        className="relative mt-auto flex items-end justify-between"
        style={{
          paddingTop: 14,
          borderTop: "1px solid var(--color-hairline)",
        }}
      >
        <div>
          <div
            className="font-mono ink-faint"
            style={{
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {product.soldOut ? "Last seen" : "From"}
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span
              className="font-display ink tabular-nums"
              style={{
                fontSize: 28,
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              {product.price}
            </span>
            {product.originalPrice ? (
              <span
                className="font-mono ink-faint line-through"
                style={{ fontSize: 10 }}
              >
                {product.originalPrice}
              </span>
            ) : null}
          </div>
        </div>
        <div className="text-right">
          <div className="mb-1.5 flex justify-end gap-[3px]">
            {Array.from({ length: showCount }).map((_, k) => (
              <span
                key={k}
                aria-hidden
                style={{
                  width: 4,
                  height: 14,
                  borderRadius: 999,
                  background:
                    k < filledBars
                      ? "linear-gradient(to top, var(--color-brass), var(--color-brass-light))"
                      : "var(--color-bone)",
                  opacity: k < filledBars ? 1 : 0.4,
                }}
              />
            ))}
          </div>
          <div
            className="font-mono ink-mute"
            style={{
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {vendors} vendors
          </div>
        </div>
      </div>
    </Link>
  );
}
