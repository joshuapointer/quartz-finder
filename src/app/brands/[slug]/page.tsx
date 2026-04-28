import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllBrands,
  getBrandBySlug,
  getProductsByBrandSlug,
  slugify,
  toBrandSummary,
} from "@/lib/catalog";
import { safeExternalUrl } from "@/lib/url";
import ProductCard from "@/components/ProductCard";
import TierBadge from "@/components/TierBadge";
import StatusBadge from "@/components/StatusBadge";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllBrands().map((b) => ({ slug: slugify(b.name) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return { title: "Brand not found" };
  return {
    title: `${brand.name} — quartz lineup & accessories`,
    description: `Full quartz lineup from ${brand.name}: control towers, terp slurpers, dunking stations, and signature accessories.`,
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();
  const summary = toBrandSummary(brand);
  const products = getProductsByBrandSlug(slug);

  const homepage = safeExternalUrl(brand.url);

  const stats: { label: string; value: string | number }[] = [
    { label: "Products", value: summary.productCount },
    { label: "Accessories", value: summary.accessoryCount },
    { label: "Tier", value: brand.tier === "usmade" ? "US-Made" : "Import" },
    {
      label: "Status",
      value:
        brand.status === "active"
          ? "Active"
          : brand.status_label ?? "Inactive",
    },
  ];

  return (
    <article className="container-wide section-y">
      <nav
        aria-label="Breadcrumb"
        className="font-mono ink-mute mb-6 text-2xs uppercase tracking-[0.04em]"
      >
        <Link
          href="/brands"
          className="focus-ring rounded-[2px] hover:text-[var(--color-amber)]"
        >
          Brands
        </Link>{" "}
        <span aria-hidden>/</span>{" "}
        <span className="ink-soft">{brand.name}</span>
      </nav>

      <header className="grid gap-8 border-y border-[var(--color-line)] py-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="flex flex-wrap gap-3">
            <TierBadge tier={brand.tier} />
            <StatusBadge status={brand.status} label={brand.status_label} />
          </div>
          <h1 className="font-display mt-6 text-4xl leading-tight md:text-5xl">
            {brand.name}
          </h1>
          <p className="mt-3 text-sm">
            {homepage ? (
              <a
                href={homepage}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="font-mono ink-mute focus-ring rounded-[2px] hover:text-[var(--color-amber)]"
              >
                {brand.url} ↗
              </a>
            ) : (
              <span className="font-mono ink-mute">{brand.url}</span>
            )}
          </p>
          {brand.url_note ? (
            <p className="ink-mute mt-3 text-sm">Note: {brand.url_note}</p>
          ) : null}
        </div>
        <div className="md:col-span-5">
          <dl className="space-y-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex items-baseline justify-between border-b border-[var(--color-line-soft)] pb-3"
              >
                <dt className="ink-soft text-sm">{s.label}</dt>
                <dd className="font-display ink tabular-nums text-xl">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <section className="section-y">
        <p className="eyebrow">Lineup · {products.length} pieces</p>
        <div className="rule mt-2" />
        <h2 className="font-display mt-6 text-3xl">Lineup</h2>
        {products.length === 0 ? (
          <p className="ink-soft mt-6">
            No quartz pieces are currently catalogued for this brand.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {brand.accessories && brand.accessories.length > 0 ? (
        <section className="section-y">
          <p className="eyebrow">Accessories</p>
          <div className="rule mt-2" />
          <h2 className="font-display mt-6 text-3xl">Accessories on file</h2>
          <dl className="mt-8 grid grid-cols-1 gap-x-12 gap-y-0 md:grid-cols-2">
            {brand.accessories.map((a) => (
              <div
                key={a.name}
                className="flex items-baseline justify-between gap-6 border-b border-[var(--color-line-soft)] py-3"
              >
                <dt className="ink text-sm">{a.name}</dt>
                <dd className="font-mono ink-soft tabular-nums text-sm">
                  {a.price}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </article>
  );
}
