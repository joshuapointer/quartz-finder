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

export const revalidate = 86400;

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

  return (
    <article className="mx-auto max-w-7xl px-6 py-14">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 text-xs uppercase tracking-[0.2em] text-[var(--color-ink-mute)]"
      >
        <Link href="/brands" className="focus-ring rounded-md hover:text-[var(--color-amber)]">
          Brands
        </Link>{" "}
        <span aria-hidden>/</span>{" "}
        <span className="text-[var(--color-ink-soft)]">{brand.name}</span>
      </nav>

      <header className="surface rounded-3xl p-10">
        <div className="flex flex-wrap items-center gap-3">
          <TierBadge tier={brand.tier} />
          <StatusBadge status={brand.status} label={brand.status_label} />
        </div>
        <h1 className="font-display mt-4 text-5xl">{brand.name}</h1>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
          {homepage ? (
            <a
              href={homepage}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="focus-ring rounded-md hover:text-[var(--color-amber)]"
            >
              {brand.url} ↗
            </a>
          ) : (
            <span className="text-[var(--color-ink-mute)]">{brand.url}</span>
          )}
        </p>
        {brand.url_note ? (
          <p className="mt-3 text-xs text-[var(--color-ink-mute)]">
            Note: {brand.url_note}
          </p>
        ) : null}
        <dl className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Products" value={summary.productCount} />
          <Stat label="Accessories" value={summary.accessoryCount} />
          <Stat label="Tier" value={brand.tier === "usmade" ? "US-Made" : "Import"} />
          <Stat
            label="Status"
            value={brand.status === "active" ? "Active" : brand.status_label ?? "Inactive"}
          />
        </dl>
      </header>

      <section className="mt-14">
        <h2 className="font-display text-3xl">Lineup</h2>
        {products.length === 0 ? (
          <p className="mt-4 text-[var(--color-ink-soft)]">
            No quartz pieces are currently catalogued for this brand.
          </p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {brand.accessories && brand.accessories.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-display text-3xl">Accessories on file</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {brand.accessories.map((a) => (
              <li
                key={a.name}
                className="surface flex items-start justify-between gap-4 rounded-xl p-5"
              >
                <span className="text-sm text-[var(--color-ink)]">{a.name}</span>
                <span className="font-display whitespace-nowrap text-lg text-[var(--color-amber-soft)]">
                  {a.price}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
        {label}
      </dt>
      <dd className="font-display mt-1.5 text-2xl text-[var(--color-amber-soft)]">
        {value}
      </dd>
    </div>
  );
}
