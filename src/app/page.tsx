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

  const stats: { label: string; value: number }[] = [
    { label: "Active brands", value: meta.summary.active_brands },
    { label: "Total brands", value: meta.summary.total_brands },
    { label: "US-made houses", value: meta.summary.usmade_tier_count },
    { label: "Catalogued products", value: products.length },
  ];

  return (
    <>
      <section className="section-y-lg relative overflow-hidden">
        <div className="container-base">
          <p className="eyebrow reveal">An editorial atlas — Issue 01</p>
          <div className="rule-amber reveal mt-2 w-1/4" />
          <h1 className="font-display reveal mt-6 max-w-3xl text-5xl leading-[1.02] tracking-[-0.02em] md:text-6xl lg:text-7xl">
            Every banger worth dabbing,{" "}
            <em className="swash">curated</em> in one atlas.
          </h1>
          <p className="prose-measure ink-soft reveal mt-6 text-lg">
            An editorial atlas of cannabis-concentrate hardware.{" "}
            {meta.summary.active_brands} active glass houses across import and
            US-made tiers — independent, affiliate-supported, never sponsored.
          </p>
          <div className="reveal mt-9 flex flex-wrap items-center gap-4">
            <Link href="/shop" className="btn btn-primary focus-ring">
              Browse the catalog →
            </Link>
            <Link href="/glossary" className="btn btn-ghost focus-ring">
              New to dabs? Start here
            </Link>
          </div>

          <div className="mt-14 border-y border-[var(--color-line)] py-7">
            <div className="grid grid-cols-2 gap-y-6 md:grid-cols-4 md:gap-y-0 md:divide-x md:divide-[var(--color-line-soft)]">
              {stats.map((s, idx) => (
                <div
                  key={s.label}
                  className={`px-6 ${idx === 0 ? "md:pl-0" : ""} ${idx === stats.length - 1 ? "md:pr-0" : ""}`}
                >
                  <p className="eyebrow eyebrow-mute">{s.label}</p>
                  <p className="font-display ink tabular-nums mt-2 text-3xl">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-y reveal">
        <div className="container-narrow">
          <p className="eyebrow">Editor&apos;s note · April 2026</p>
          <div className="rule mt-2" />
          <p className="prose-measure ink-soft mt-6 text-base">
            Pillar &amp; Pearl is a curatorial project, not a marketplace. We
            catalog only the bangers worth dabbing — and we publish what
            we&apos;d buy ourselves. Every link routes outward; nothing is
            reviewed under sponsorship.
          </p>
          <p className="prose-measure ink-soft mt-6 text-base">
            This issue tracks {meta.summary.total_brands} brands across import
            and US-made tiers, refreshed quarterly.
          </p>
          <p className="font-display ink-mute mt-6 text-lg italic">
            — J.P., Editor
          </p>
        </div>
      </section>

      <section className="section-y reveal">
        <div className="container-wide">
          <p className="eyebrow">By style</p>
          <div className="rule mt-2" />
          <h2 className="font-display mt-6 text-3xl md:text-[35px]">
            Three ways to dab
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {(Object.keys(CATEGORY_META) as Array<keyof typeof CATEGORY_META>).map(
              (key) => {
                const cat = CATEGORY_META[key];
                return (
                  <Link
                    key={key}
                    href={{ pathname: "/shop", query: { category: cat.slug } }}
                    className="surface-flat lift focus-ring group flex flex-col rounded-[var(--radius-md)] p-7"
                  >
                    <div className="rule mb-3" />
                    <p className="eyebrow eyebrow-mute">Category</p>
                    <h3 className="font-display mt-3 text-3xl">{cat.label}</h3>
                    <p className="ink-soft mt-3 text-sm">{cat.tagline}</p>
                    <span
                      aria-hidden
                      className="mt-8 ml-auto text-[var(--color-amber)] transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                );
              },
            )}
          </div>
        </div>
      </section>

      <section className="section-y reveal">
        <div className="container-wide">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">In rotation · this week</p>
              <div className="rule mt-2" />
              <h2 className="font-display mt-6 text-3xl md:text-[35px]">
                In rotation right now
              </h2>
            </div>
            <Link
              href="/shop"
              className="ink-soft focus-ring hidden text-sm transition-colors hover:text-[var(--color-amber)] md:inline"
            >
              See all →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-y reveal">
        <div className="container-wide">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">US-made artisans</p>
              <div className="rule mt-2" />
              <h2 className="font-display mt-6 text-3xl md:text-[35px]">
                Heritage glass houses
              </h2>
            </div>
            <Link
              href="/brands"
              className="ink-soft focus-ring hidden text-sm transition-colors hover:text-[var(--color-amber)] md:inline"
            >
              All brands →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredBrands.map((b) => (
              <BrandCard key={b.slug} brand={b} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-y reveal border-y border-[var(--color-line)]">
        <div className="container-base grid items-start gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow">Glossary</p>
            <div className="rule mt-2" />
            <h2 className="font-display mt-6 text-3xl">Speak the dialect</h2>
            <p className="prose-measure ink-soft mt-4 text-base">
              From terp pearls to ISO stations — the language of low-temp dabs,
              distilled.
            </p>
            <Link
              href="/glossary"
              className="btn btn-ghost focus-ring mt-7"
            >
              Full glossary →
            </Link>
          </div>
          <ul className="space-y-6">
            {teaserGlossary.map((g) => (
              <li
                key={g.term}
                className="border-t border-[var(--color-line-soft)] pt-4"
              >
                <p className="font-display text-xl">{g.term}</p>
                <p className="ink-soft mt-1 text-sm">{g.short}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
