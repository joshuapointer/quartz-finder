import Link from "next/link";
import {
  CATEGORY_META,
  getAllProducts,
  getBrandSummaries,
  getMetadata,
} from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import BrandCard from "@/components/BrandCard";
import { GLOSSARY } from "@/lib/glossary";

export default function HomePage() {
  const meta = getMetadata();
  const products = getAllProducts();
  const brands = getBrandSummaries();
  const featuredBrands = brands
    .filter((b) => b.status === "active" && b.tier === "usmade")
    .slice(0, 4);
  const featuredProducts = products.filter((p) => !p.soldOut).slice(0, 6);
  const teaserGlossary = GLOSSARY.slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-20 lg:pt-28">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-amber)]">
            {meta.subtitle}
          </p>
          <h1 className="font-display mt-5 max-w-3xl text-5xl leading-[1.05] md:text-7xl">
            Every banger worth dabbing,{" "}
            <em className="text-[var(--color-amber-soft)]">curated</em> in one
            atlas.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            Control towers, terp slurpers, dunking stations — sourced from{" "}
            {meta.summary.active_brands} active glass houses across import and
            US-made tiers. Independent. Affiliate-supported. Never sponsored.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="focus-ring rounded-full bg-[var(--color-amber)] px-7 py-3.5 text-sm font-semibold text-[var(--color-bg)] transition-transform hover:-translate-y-0.5"
            >
              Browse the catalog
            </Link>
            <Link
              href="/glossary"
              className="focus-ring rounded-full border border-[var(--color-line)] px-7 py-3.5 text-sm text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-amber)] hover:text-[var(--color-amber)]"
            >
              New to dabs? Start here →
            </Link>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { label: "Active brands", value: meta.summary.active_brands },
              { label: "Total brands", value: meta.summary.total_brands },
              { label: "US-made houses", value: meta.summary.usmade_tier_count },
              { label: "Catalogued products", value: products.length },
            ].map((s) => (
              <div key={s.label} className="surface rounded-2xl p-5">
                <dt className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
                  {s.label}
                </dt>
                <dd className="font-display mt-2 text-3xl text-[var(--color-amber-soft)]">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-amber)]">
              By style
            </p>
            <h2 className="font-display mt-2 text-4xl">Three ways to dab</h2>
          </div>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {(Object.keys(CATEGORY_META) as Array<keyof typeof CATEGORY_META>).map(
            (key) => {
              const cat = CATEGORY_META[key];
              return (
                <Link
                  key={key}
                  href={{ pathname: "/shop", query: { category: cat.slug } }}
                  className="surface group flex flex-col rounded-2xl p-7 transition-all hover:-translate-y-0.5 hover:border-[var(--color-amber)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-amber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
                    Category
                  </p>
                  <h3 className="font-display mt-3 text-3xl">{cat.label}</h3>
                  <p className="mt-3 text-sm text-[var(--color-ink-soft)]">
                    {cat.tagline}
                  </p>
                  <span className="mt-8 text-sm text-[var(--color-amber)]">
                    Browse {cat.label} →
                  </span>
                </Link>
              );
            },
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-amber)]">
              Featured
            </p>
            <h2 className="font-display mt-2 text-4xl">In rotation right now</h2>
          </div>
          <Link
            href="/shop"
            className="focus-ring hidden rounded-md text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-amber)] md:inline"
          >
            See all →
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-amber)]">
              US-made
            </p>
            <h2 className="font-display mt-2 text-4xl">Heritage glass houses</h2>
          </div>
          <Link
            href="/brands"
            className="focus-ring hidden rounded-md text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-amber)] md:inline"
          >
            All brands →
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredBrands.map((b) => (
            <BrandCard key={b.slug} brand={b} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="surface rounded-3xl p-10 md:p-14">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-amber)]">
            Glossary
          </p>
          <h2 className="font-display mt-2 text-4xl">Speak the dialect</h2>
          <p className="mt-3 max-w-xl text-[var(--color-ink-soft)]">
            From terp pearls to ISO stations — the language of low-temp dabs,
            distilled.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {teaserGlossary.map((g) => (
              <div key={g.term} className="border-l border-[var(--color-amber)]/40 pl-5">
                <p className="font-display text-2xl">{g.term}</p>
                <p className="mt-1.5 text-sm text-[var(--color-ink-soft)]">
                  {g.short}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/glossary"
            className="focus-ring mt-9 inline-flex rounded-full border border-[var(--color-line)] px-6 py-3 text-sm transition-colors hover:border-[var(--color-amber)] hover:text-[var(--color-amber)]"
          >
            Full glossary →
          </Link>
        </div>
      </section>
    </>
  );
}
