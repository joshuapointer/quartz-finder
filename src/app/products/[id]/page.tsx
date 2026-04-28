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

export const revalidate = 3600;

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
    <article className="container-base section-y">
      <nav
        aria-label="Breadcrumb"
        className="font-mono ink-mute mb-6 text-2xs uppercase tracking-[0.04em]"
      >
        <Link
          href="/shop"
          className="focus-ring rounded-[2px] hover:text-[var(--color-amber)]"
        >
          Shop
        </Link>{" "}
        <span aria-hidden>/</span>{" "}
        <Link
          href={`/brands/${product.brandSlug}`}
          className="focus-ring rounded-[2px] hover:text-[var(--color-amber)]"
        >
          {product.brandName}
        </Link>{" "}
        <span aria-hidden>/</span>{" "}
        <span className="ink-soft">{product.categoryLabel}</span>
      </nav>

      <div className="grid gap-12 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-transparent">
          <div className="absolute right-5 top-5 z-10">
            <WishlistButton productId={product.id} size="md" />
          </div>
          {product.imageHash ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/img/${product.imageHash}`}
              alt={product.name}
              className="h-full w-full object-contain p-6"
              loading="eager"
              decoding="async"
            />
          ) : (
            <div
              className="font-display ink-faint flex h-full items-center justify-center text-[9rem] leading-none"
              aria-hidden="true"
            >
              {CATEGORY_GLYPH[product.category]}
            </div>
          )}
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
          <h1 className="font-display mt-6 text-4xl leading-tight tracking-[-0.015em] md:text-5xl">
            {product.name}
          </h1>
          <p className="ink-soft mt-2 text-sm">
            By{" "}
            <Link
              href={`/brands/${product.brandSlug}`}
              className="ink focus-ring rounded-[2px] hover:text-[var(--color-amber)]"
            >
              {product.brandName}
            </Link>
          </p>

          <div className="mt-8">
            <p className="eyebrow eyebrow-mute">MSRP · via brand</p>
            <div className="mt-2 flex items-baseline gap-4">
              <span className="font-display ink tabular-nums text-5xl">
                {product.price}
              </span>
              {product.originalPrice ? (
                <span className="font-mono ink-faint text-base line-through">
                  {product.originalPrice}
                </span>
              ) : null}
            </div>
          </div>

          <div className="rule mt-8" />

          {product.statusNote ? (
            <p className="surface-flat ink-soft mt-6 rounded-[var(--radius-sm)] px-4 py-3 text-sm">
              {product.statusNote}
            </p>
          ) : null}
          {product.note ? (
            <p className="ink-soft prose-measure mt-4 text-base">
              {product.note}
            </p>
          ) : null}

          <div className="mt-8">
            <AffiliateCTA
              href={product.link}
              brandName={product.brandName}
              soldOut={product.soldOut}
            />
          </div>

          <div className="ink-mute mt-8 grid gap-3 text-xs">
            <p>
              <span className="mr-2 text-[var(--color-amber)]">▍</span>
              {product.brandLastFetchedOkAt
                ? `Last verified ${new Date(product.brandLastFetchedOkAt).toUTCString()}.`
                : "Pricing scraped editorially. Final price + availability live on the brand's site."}
            </p>
            <p>
              <span className="mr-2 text-[var(--color-amber)]">▍</span>
              Pillar &amp; Pearl earns nothing on the click unless explicitly
              disclosed on a brand&apos;s page.
            </p>
            <p>
              <span className="mr-2 text-[var(--color-amber)]">▍</span>
              For 21+ legal-jurisdiction use only.
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="section-y">
          <p className="eyebrow">More {product.categoryLabel}</p>
          <div className="rule mt-2" />
          <h2 className="font-display mt-6 text-3xl">
            More {product.categoryLabel}s
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
