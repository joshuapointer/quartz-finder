import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllProducts,
  getProductById,
  getRelatedProducts,
  getBrandBySlug,
} from "@/lib/catalog";
import TierBadge from "@/components/TierBadge";
import StatusBadge from "@/components/StatusBadge";
import WishlistButton from "@/components/WishlistButton";
import AffiliateCTA from "@/components/AffiliateCTA";
import ProductCard from "@/components/ProductCard";

interface Props {
  params: Promise<{ id: string }>;
}

export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllProducts().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} — ${product.brandName}`,
    description: `${product.name} from ${product.brandName}. ${product.categoryLabel} catalogued by Pillar & Pearl.`,
  };
}

const CATEGORY_GLYPH = {
  control_tower: "▮",
  terp_slurper: "◐",
  dunking_station: "◍",
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  const related = getRelatedProducts(id);
  const brand = getBrandBySlug(product.brandSlug);

  return (
    <article className="mx-auto max-w-6xl px-6 py-14">
      <nav className="mb-6 text-xs uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
        <Link href="/shop" className="hover:text-[var(--color-amber)]">
          Shop
        </Link>{" "}
        <span aria-hidden>/</span>{" "}
        <Link
          href={`/brands/${product.brandSlug}`}
          className="hover:text-[var(--color-amber)]"
        >
          {product.brandName}
        </Link>{" "}
        <span aria-hidden>/</span>{" "}
        <span className="text-[var(--color-ink-soft)]">{product.categoryLabel}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="surface relative flex aspect-square items-center justify-center rounded-3xl">
          <div className="absolute right-5 top-5">
            <WishlistButton productId={product.id} size="md" />
          </div>
          <div
            className="font-display text-[12rem] leading-none text-[var(--color-amber-soft)]/70"
            aria-hidden="true"
          >
            {CATEGORY_GLYPH[product.category]}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            <TierBadge tier={product.brandTier} />
            <StatusBadge
              status={product.brandStatus}
              soldOut={product.soldOut}
              label={brand?.status_label ?? null}
            />
          </div>
          <h1 className="font-display mt-4 text-4xl leading-tight md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-2 text-[var(--color-ink-soft)]">
            By{" "}
            <Link
              href={`/brands/${product.brandSlug}`}
              className="text-[var(--color-amber)] hover:underline"
            >
              {product.brandName}
            </Link>
          </p>

          <div className="mt-7 flex items-baseline gap-3">
            <span className="font-display text-4xl text-[var(--color-amber-soft)]">
              {product.price}
            </span>
            {product.originalPrice ? (
              <span className="text-lg text-[var(--color-ink-mute)] line-through">
                {product.originalPrice}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
            {product.categoryLabel} · MSRP via brand
          </p>

          {product.statusNote ? (
            <p className="mt-5 rounded-lg border border-[var(--color-line)] bg-[var(--color-bg-elev)] p-3 text-xs text-[var(--color-ink-soft)]">
              {product.statusNote}
            </p>
          ) : null}
          {product.note ? (
            <p className="mt-3 text-sm text-[var(--color-ink-soft)]">{product.note}</p>
          ) : null}

          <div className="mt-8">
            <AffiliateCTA
              href={product.link}
              brandName={product.brandName}
              soldOut={product.soldOut}
            />
          </div>

          <div className="mt-6 grid gap-2 text-xs text-[var(--color-ink-mute)]">
            <p>
              ✦ Pricing scraped ~April 2026. Final price + availability live on the
              brand&apos;s site.
            </p>
            <p>
              ✦ Pillar &amp; Pearl earns nothing on the click unless explicitly
              disclosed on a brand&apos;s page.
            </p>
            <p>✦ For 21+ legal-jurisdiction use only.</p>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-20">
          <h2 className="font-display text-3xl">More {product.categoryLabel}s</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
