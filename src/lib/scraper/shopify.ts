import { fetchJson, FetchError } from "./http";
import { classifyProduct, isQuartzHardware } from "./classify";
import type { ScrapedProduct, ScrapeResult } from "./types";

interface ShopifyVariant {
  id: number | string;
  price?: string;
  compare_at_price?: string | null;
  available?: boolean;
}

interface ShopifyImage {
  src?: string;
  position?: number;
}

interface ShopifyProduct {
  id: number | string;
  handle: string;
  title: string;
  body_html?: string;
  product_type?: string;
  tags?: string[] | string;
  variants?: ShopifyVariant[];
  images?: ShopifyImage[];
  published_at?: string | null;
}

interface ShopifyFeed {
  products: ShopifyProduct[];
}

export async function probeShopify(baseUrl: string): Promise<boolean> {
  try {
    const data = await fetchJson<ShopifyFeed>(joinUrl(baseUrl, "/products.json?limit=1"), {
      retries: 0,
      timeoutMs: 8000,
    });
    return Array.isArray(data?.products);
  } catch {
    return false;
  }
}

export async function scrapeShopify(baseUrl: string): Promise<ScrapeResult> {
  const products: ScrapedProduct[] = [];
  let page = 1;
  for (;;) {
    if (page > 12) break;
    const url = joinUrl(baseUrl, `/products.json?limit=250&page=${page}`);
    let feed: ShopifyFeed;
    try {
      feed = await fetchJson<ShopifyFeed>(url);
    } catch (e) {
      if (e instanceof FetchError && page > 1) break;
      throw e;
    }
    if (!feed?.products?.length) break;
    for (const p of feed.products) {
      const tagsText = Array.isArray(p.tags) ? p.tags.join(" ") : (p.tags ?? "");
      const haystack = [p.title, p.product_type, tagsText, p.body_html].filter(Boolean);
      if (!isQuartzHardware(...haystack)) continue;
      const category = classifyProduct(...haystack);
      const variants = p.variants ?? [];
      const firstVariant = variants[0];
      const available = variants.some((v) => v.available !== false);
      const price = firstVariant?.price ? formatPrice(firstVariant.price) : null;
      const compareAt = firstVariant?.compare_at_price
        ? formatPrice(firstVariant.compare_at_price)
        : null;
      const originalPrice =
        compareAt && price && Number(stripPrice(compareAt)) > Number(stripPrice(price))
          ? compareAt
          : null;
      const image = (p.images ?? [])
        .slice()
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))[0]?.src ?? null;
      products.push({
        externalId: String(p.id),
        handle: p.handle,
        name: p.title,
        price,
        originalPrice,
        soldOut: !available,
        available: true,
        link: joinUrl(baseUrl, `/products/${p.handle}`),
        imageUrl: image,
        category,
      });
    }
    if (feed.products.length < 250) break;
    page += 1;
  }
  return { strategy: "shopify", products };
}

function joinUrl(base: string, path: string): string {
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!/^https?:\/\//i.test(b)) return `https://${b.replace(/^\/+/, "")}${p}`;
  return `${b}${p}`;
}

function stripPrice(price: string): string {
  return price.replace(/[^\d.]/g, "");
}

function formatPrice(raw: string): string {
  const n = Number(raw);
  if (!Number.isFinite(n)) return raw;
  return `$${n.toFixed(2).replace(/\.00$/, "")}`;
}
