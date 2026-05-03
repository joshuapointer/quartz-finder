import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getAllProducts,
  getProductById,
  getRelatedProducts,
  getBrandBySlug,
} from "@/lib/catalog";
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
    title: `${product.name} — ${product.brandName} | Pillar & Pearl`,
    description: `${product.name} from ${product.brandName}. ${product.categoryLabel} catalogued by Pillar & Pearl.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const related = getRelatedProducts(id);
  const brand = getBrandBySlug(product.brandSlug);

  const heroImage = product.imageHash ? `/img/${product.imageHash}` : null;
  const isUsMade = brand?.tier === "usmade";

  const fetchedDate = product.brandLastFetchedOkAt
    ? new Date(product.brandLastFetchedOkAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "recently";

  // Split product name: first word + rest
  const nameParts = product.name.trim().split(/\s+/);
  const nameFirst = nameParts[0];
  const nameRest = nameParts.slice(1).join(" ");

  return (
    <>
      <style>{`
        .product-hero { display: grid; grid-template-columns: 1.15fr 1fr; gap: 64px; padding: 24px 0 80px; align-items: start; }
        .gallery { position: relative; }
        .gallery::before { content: ""; position: absolute; inset: -6% -6% auto -6%; aspect-ratio: 1; border-radius: 50%; background: radial-gradient(ellipse at 50% 50%, var(--color-c-violet) 0%, transparent 60%); filter: blur(80px); opacity: 0.45; z-index: 0; pointer-events: none; }
        .gallery .stage { position: relative; z-index: 1; aspect-ratio: 1; border-radius: 36px; background: radial-gradient(120% 100% at 50% 6%, rgba(255,255,255,0.06), rgba(255,255,255,0.012) 60%, transparent 100%); border: 1px solid rgba(255,255,255,0.08); overflow: hidden; box-shadow: 0 30px 60px -20px rgba(0,0,0,0.7); }
        .gallery .stage::after { content: ""; position: absolute; top: 4%; left: 14%; right: 14%; height: 14%; border-radius: 50%; background: radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.22), transparent 70%); filter: blur(3px); pointer-events: none; z-index: 3; }
        .gallery .stage img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; padding: 56px; z-index: 1; filter: drop-shadow(2px 0 0 rgba(255,143,233,0.18)) drop-shadow(-2px 0 0 rgba(116,229,255,0.18)) drop-shadow(0 30px 40px rgba(0,0,0,0.7)); }
        .gallery .stage .empty-state { position: absolute; inset: 0; display: grid; place-items: center; color: var(--color-dim); font-family: var(--font-sans); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; z-index: 1; }
        .gallery .badge { position: absolute; top: 18px; left: 18px; z-index: 4; display: inline-flex; align-items: center; gap: 8px; padding: 7px 14px; border-radius: 999px; background: linear-gradient(180deg, var(--color-gold-light), var(--color-gold)); color: #000; font-family: var(--font-sans); font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; box-shadow: inset 0 1px 0 rgba(255,255,255,0.55), 0 4px 14px rgba(232,184,90,0.30); }
        .gallery .save-btn { position: absolute; top: 18px; right: 18px; z-index: 4; }
        .thumbs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 16px; }
        .thumb { position: relative; aspect-ratio: 1; border-radius: 14px; background: rgba(255,255,255,0.03); border: 1px solid var(--color-line); overflow: hidden; }
        .thumb.on { border-color: var(--color-line-gold-2); box-shadow: 0 0 0 1px var(--color-line-gold-2); }
        .thumb img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .thumb .ph { position: absolute; inset: 0; display: grid; place-items: center; color: var(--color-dim); font-family: var(--font-sans); font-size: 10px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; }
        .thumb .ph::before { content: ""; position: absolute; inset: 14%; border-radius: 50%; background: radial-gradient(circle, var(--color-c-violet), transparent 65%); filter: blur(20px); opacity: 0.4; }
        .thumb.t-cyan .ph::before { background: radial-gradient(circle, var(--color-c-cyan), transparent 65%); }
        .thumb.t-gold .ph::before { background: radial-gradient(circle, var(--color-c-gold), transparent 65%); }
        .info { padding-top: 8px; }
        .info .brand-line { font-family: var(--font-sans); font-size: 11px; color: var(--color-muted); font-weight: 600; letter-spacing: 0.22em; margin-bottom: 14px; text-transform: uppercase; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .info .brand-line .maker { color: var(--color-fg); }
        .info .brand-line .us-made { display: inline-flex; align-items: center; gap: 6px; color: var(--color-gold-light); }
        .info .brand-line .us-made::before { content: ""; width: 4px; height: 4px; border-radius: 50%; background: var(--color-gold-light); box-shadow: 0 0 6px rgba(244,216,154,0.7); }
        .info h1 { font-family: var(--font-serif); font-size: clamp(40px, 4.6vw, 64px); font-weight: 500; letter-spacing: -0.034em; line-height: 1.0; margin-bottom: 14px; }
        .info h1 em { font-style: italic; font-weight: 400; background: linear-gradient(180deg, var(--color-gold-light), var(--color-gold)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .info .tagline { font-family: var(--font-serif); font-size: 18px; color: var(--color-muted); line-height: 1.45; margin-bottom: 24px; max-width: 38ch; font-style: italic; font-weight: 400; }
        .price-block { display: flex; align-items: baseline; gap: 14px; padding: 20px 0; border-top: 1px solid var(--color-line); border-bottom: 1px solid var(--color-line); margin-bottom: 28px; }
        .price-block .price { font-family: var(--font-serif); font-weight: 600; font-size: 44px; letter-spacing: -0.034em; font-variant-numeric: tabular-nums; background: linear-gradient(180deg, var(--color-gold-light), var(--color-gold)); -webkit-background-clip: text; background-clip: text; color: transparent; line-height: 1; }
        .price-block .meta-pill { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-sans); font-size: 11px; color: var(--color-gold-light); letter-spacing: 0.12em; text-transform: uppercase; font-weight: 500; padding: 4px 10px; border: 1px solid var(--color-line-gold); border-radius: 999px; }
        .price-block .meta-pill.in-stock::before { content: ""; width: 5px; height: 5px; border-radius: 50%; background: var(--color-good); box-shadow: 0 0 8px var(--color-good); }
        .price-block .meta-pill.sold-out { color: var(--color-muted); }
        .cta-row { display: flex; gap: 10px; margin-bottom: 22px; }
        .ship-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 32px; }
        .ship-card { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border: 1px solid var(--color-line); border-radius: 12px; background: rgba(255,255,255,0.02); }
        .ship-card .ship-icon { width: 16px; height: 16px; color: var(--color-gold-light); flex-shrink: 0; margin-top: 1px; stroke: currentColor; fill: none; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
        .ship-card .text { font-family: var(--font-sans); font-size: 11px; line-height: 1.45; }
        .ship-card .text b { display: block; color: var(--color-fg); font-weight: 600; margin-bottom: 2px; letter-spacing: 0.02em; }
        .ship-card .text span { color: var(--color-muted); }
        .accordion { border-top: 1px solid var(--color-line); }
        .accordion details { border-bottom: 1px solid var(--color-line); padding: 16px 0; }
        .accordion summary { display: flex; justify-content: space-between; align-items: center; cursor: pointer; list-style: none; font-family: var(--font-sans); font-size: 12px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--color-fg); }
        .accordion summary::-webkit-details-marker { display: none; }
        .accordion summary::after { content: "+"; color: var(--color-gold-light); font-weight: 400; font-size: 18px; font-family: var(--font-serif); }
        .accordion details[open] summary::after { content: "−"; }
        .accordion .body { padding: 14px 0 6px; font-family: var(--font-sans); font-size: 13px; color: var(--color-muted); line-height: 1.65; max-width: 56ch; }
        .accordion .body p + p { margin-top: 10px; }
        .specs-section { padding: 64px 0; border-top: 1px solid var(--color-line); border-bottom: 1px solid var(--color-line); }
        .specs-section h2 { font-family: var(--font-sans); font-size: 11px; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase; color: var(--color-gold-light); margin-bottom: 24px; }
        .specs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px 32px; }
        .spec dt { font-family: var(--font-sans); font-size: 10px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--color-muted); margin-bottom: 8px; }
        .spec dd { font-family: var(--font-serif); font-size: 22px; font-weight: 500; letter-spacing: -0.018em; line-height: 1.15; }
        .spec dd em { font-style: italic; color: var(--color-gold-light); font-weight: 400; }
        .about-piece { padding: 80px 0 64px; display: grid; grid-template-columns: 0.6fr 1fr; gap: 64px; }
        .about-piece h2 { font-family: var(--font-serif); font-size: clamp(32px, 4vw, 52px); font-weight: 500; letter-spacing: -0.028em; line-height: 1; }
        .about-piece h2 em { font-style: italic; color: var(--color-gold-light); }
        .about-piece .body p { font-family: var(--font-serif); font-size: 17px; color: var(--color-fg); line-height: 1.65; max-width: 56ch; }
        .about-piece .body p + p { margin-top: 18px; }
        .about-piece .body .lead { font-size: 22px; line-height: 1.5; color: var(--color-gold-light); font-style: italic; font-weight: 400; margin-bottom: 28px; }
        .maker-card { margin-top: 32px; padding: 24px; border: 1px solid var(--color-line-gold); border-radius: 18px; background: rgba(232,184,90,0.04); display: flex; gap: 18px; align-items: center; max-width: 56ch; }
        .maker-card .av { width: 56px; height: 56px; border-radius: 50%; background: radial-gradient(circle at 32% 30%, var(--color-gold-light) 0%, var(--color-gold) 50%, var(--color-gold-deep) 100%); flex-shrink: 0; box-shadow: inset -2px -3px 6px rgba(0,0,0,0.4), inset 2px 2px 4px rgba(255,255,255,0.4); }
        .maker-card .who { font-family: var(--font-sans); font-size: 13px; color: var(--color-muted); line-height: 1.5; }
        .maker-card .who b { color: var(--color-fg); font-weight: 600; display: block; margin-bottom: 2px; font-size: 14px; }
        .related-section { padding: 80px 0 60px; border-top: 1px solid var(--color-line); }
        .related-head { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
        .related-head h2 { font-family: var(--font-serif); font-size: clamp(28px, 3.4vw, 40px); font-weight: 500; letter-spacing: -0.028em; line-height: 1; }
        .related-head h2 em { font-style: italic; color: var(--color-gold-light); }
        .related-head a { font-family: var(--font-sans); font-size: 12px; color: var(--color-gold-light); border-bottom: 1px solid var(--color-line-gold-2); padding-bottom: 3px; letter-spacing: 0.04em; transition: color 0.25s; }
        .related-head a:hover { color: var(--color-fg); }
        .related-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        @media (max-width: 1080px) {
          .product-hero { grid-template-columns: 1fr; gap: 40px; }
          .ship-strip { grid-template-columns: 1fr; }
          .specs-grid { grid-template-columns: repeat(2, 1fr); }
          .about-piece { grid-template-columns: 1fr; gap: 24px; }
          .related-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 720px) {
          .gallery .stage img { padding: 32px; }
          .specs-grid { grid-template-columns: 1fr 1fr; gap: 20px 16px; }
          .info h1 { font-size: 38px; }
          .price-block .price { font-size: 36px; }
        }
      `}</style>

      <article className="pp-shell">
        {/* Breadcrumbs */}
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/shop">Shop</Link>
          <span className="sep">/</span>
          <Link href={`/shop?category=${product.category}`}>{product.categoryLabel}</Link>
          <span className="sep">/</span>
          <Link href={`/brands/${product.brandSlug}`}>{product.brandName}</Link>
          <span className="sep">/</span>
          <b>{product.name}</b>
        </nav>

        {/* Product hero */}
        <section className="product-hero">
          {/* Gallery */}
          <div className="gallery">
            {isUsMade && <span className="badge">US-Made</span>}
            <div className="save-btn">
              <WishlistButton productId={product.id} size="md" />
            </div>
            <div className="stage">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={product.name}
                  fill
                  style={{ objectFit: "contain", padding: "56px" }}
                />
              ) : (
                <div className="empty-state">No image available</div>
              )}
            </div>
            <div className="thumbs" role="tablist" aria-label="Product views">
              <div className="thumb on" aria-label="Front view">
                {heroImage ? (
                  <Image src={heroImage} alt="" fill style={{ objectFit: "cover" }} />
                ) : (
                  <span className="ph">Front</span>
                )}
              </div>
              <div className="thumb t-cyan" aria-label="Side view">
                <span className="ph">Side</span>
              </div>
              <div className="thumb t-gold" aria-label="Top view">
                <span className="ph">Top</span>
              </div>
              <div className="thumb" aria-label="Detail view">
                <span className="ph">Detail</span>
              </div>
            </div>
          </div>

          {/* Info column */}
          <div className="info">
            <div className="brand-line">
              <span className="maker">{product.brandName}</span>
              {isUsMade ? (
                <span className="us-made">US-Made · United States</span>
              ) : (
                <span>Imported</span>
              )}
            </div>

            {nameRest ? (
              <h1>
                {nameFirst}{" "}
                <em>{nameRest}.</em>
              </h1>
            ) : (
              <h1>{nameFirst}.</h1>
            )}

            <p className="tagline">
              {product.note ??
                `Catalogued by Pillar & Pearl. Verified pricing as of ${fetchedDate}.`}
            </p>

            <div className="price-block">
              <div className="price">{product.price}</div>
              {product.soldOut ? (
                <span className="meta-pill sold-out">Sold out</span>
              ) : (
                <span className="meta-pill in-stock">In stock</span>
              )}
            </div>

            <div className="cta-row">
              <AffiliateCTA
                href={product.link}
                brandName={product.brandName}
                soldOut={product.soldOut}
              />
            </div>

            <div className="ship-strip">
              <div className="ship-card">
                <svg className="ship-icon" viewBox="0 0 24 24" aria-hidden>
                  <path d="M3 7h11v9H3z"/>
                  <path d="M14 10h4l3 3v3h-7"/>
                  <circle cx="7" cy="18" r="2"/>
                  <circle cx="17" cy="18" r="2"/>
                </svg>
                <div className="text">
                  <b>Ships from maker</b>
                  <span>Direct to your door</span>
                </div>
              </div>
              <div className="ship-card">
                <svg className="ship-icon" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 3 4 6v6c0 5 4 8 8 9 4-1 8-4 8-9V6z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
                <div className="text">
                  <b>Verified vendor</b>
                  <span>Authorized source</span>
                </div>
              </div>
              <div className="ship-card">
                <svg className="ship-icon" viewBox="0 0 24 24" aria-hidden>
                  <path d="M9 14H4v-5"/>
                  <path d="M4 14a8 8 0 1 0 2-8"/>
                </svg>
                <div className="text">
                  <b>Updated nightly</b>
                  <span>Pricing refreshed daily</span>
                </div>
              </div>
            </div>

            <div className="accordion">
              <details open>
                <summary>The piece</summary>
                <div className="body">
                  <p>
                    {product.note ??
                      product.statusNote ??
                      `The ${product.name} is a ${product.categoryLabel.toLowerCase()} from ${product.brandName}. Catalogued and verified by Pillar & Pearl.`}
                  </p>
                </div>
              </details>
              <details>
                <summary>Where to buy</summary>
                <div className="body">
                  <p>
                    Purchase directly from{" "}
                    {product.link ? (
                      <a
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        style={{ color: "var(--color-gold-light)", borderBottom: "1px solid var(--color-line-gold-2)", paddingBottom: "1px" }}
                      >
                        {product.brandName}&apos;s official store
                      </a>
                    ) : (
                      `${product.brandName}'s official store`
                    )}
                    . Pillar &amp; Pearl links only to authorized vendors.
                  </p>
                </div>
              </details>
              <details>
                <summary>Care &amp; cleaning</summary>
                <div className="body">
                  <p>Iso-soak between sessions. Never torch a wet bucket. Replace pearls every 6 months for best performance.</p>
                </div>
              </details>
              <details>
                <summary>About {product.brandName}</summary>
                <div className="body">
                  <p>
                    {isUsMade
                      ? `${product.brandName} is a US-based maker catalogued by Pillar & Pearl under the US-Made tier.`
                      : `${product.brandName} is an internationally-sourced brand catalogued by Pillar & Pearl.`}
                    {" "}
                    <Link
                      href={`/brands/${product.brandSlug}`}
                      style={{ color: "var(--color-gold-light)", borderBottom: "1px solid var(--color-line-gold-2)", paddingBottom: "1px" }}
                    >
                      View all {product.brandName} pieces →
                    </Link>
                  </p>
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* Specs */}
        <section className="specs-section">
          <h2>Specs</h2>
          <dl className="specs-grid">
            <div className="spec">
              <dt>Brand</dt>
              <dd>{product.brandName}</dd>
            </div>
            <div className="spec">
              <dt>Tier</dt>
              <dd>
                {isUsMade ? (
                  <>US-<em>Made</em></>
                ) : (
                  <><em>Import</em></>
                )}
              </dd>
            </div>
            <div className="spec">
              <dt>Category</dt>
              <dd>{product.categoryLabel}</dd>
            </div>
            <div className="spec">
              <dt>MSRP</dt>
              <dd>{product.price}</dd>
            </div>
          </dl>
        </section>

        {/* About piece */}
        <section className="about-piece">
          <h2>About the <em>piece.</em></h2>
          <div className="body">
            <p className="lead">
              {product.note ??
                `The ${product.name} is ${isUsMade ? "a US-made piece" : "an imported piece"} from ${product.brandName}, catalogued by Pillar & Pearl for the serious collector.`}
            </p>
            <p>
              {product.statusNote ??
                `Every piece in the Pillar & Pearl catalogue has been verified for pricing and availability. The ${product.name} is listed under the ${product.categoryLabel} category.`}
            </p>
            <p>
              Sourced {isUsMade ? "domestically from an American maker" : "from an internationally recognized brand"}.
              Pricing verified as of {fetchedDate}. Links route outward to the maker — we don&apos;t sell, ship, or handle product.
            </p>
            <div className="maker-card">
              <div className="av" aria-hidden />
              <div className="who">
                <b>{product.brandName}</b>
                {isUsMade ? "US-Made · " : "Import · "}
                Working since catalog inception · Verified by Pillar &amp; Pearl.{" "}
                <Link
                  href={`/brands/${product.brandSlug}`}
                  style={{ color: "var(--color-gold-light)" }}
                >
                  View brand →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="related-section">
            <div className="related-head">
              <h2>
                More from <em>{product.brandName}.</em>
              </h2>
              <Link href={`/brands/${product.brandSlug}`}>
                Shop the maker →
              </Link>
            </div>
            <div className="related-grid">
              {related.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
