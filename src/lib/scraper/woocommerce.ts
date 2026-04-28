import { fetchJson, FetchError } from "./http";
import { classifyProduct, isQuartzHardware } from "./classify";
import type { ScrapedProduct, ScrapeResult } from "./types";

interface WCPrice {
  price?: string;
  regular_price?: string;
  sale_price?: string;
  currency_symbol?: string;
}

interface WCImage {
  src?: string;
  thumbnail?: string;
}

interface WCProduct {
  id: number;
  name: string;
  slug: string;
  permalink?: string;
  is_in_stock?: boolean;
  prices?: WCPrice;
  short_description?: string;
  description?: string;
  images?: WCImage[];
  categories?: Array<{ name: string; slug: string }>;
}

export async function probeWoocommerce(baseUrl: string): Promise<boolean> {
  try {
    const data = await fetchJson<WCProduct[]>(
      joinUrl(baseUrl, "/wp-json/wc/store/v1/products?per_page=1"),
      { retries: 0, timeoutMs: 8000 },
    );
    return Array.isArray(data);
  } catch {
    return false;
  }
}

export async function scrapeWoocommerce(baseUrl: string): Promise<ScrapeResult> {
  const products: ScrapedProduct[] = [];
  let page = 1;
  for (;;) {
    if (page > 12) break;
    const url = joinUrl(
      baseUrl,
      `/wp-json/wc/store/v1/products?per_page=100&page=${page}`,
    );
    let feed: WCProduct[];
    try {
      feed = await fetchJson<WCProduct[]>(url);
    } catch (e) {
      if (e instanceof FetchError && page > 1) break;
      throw e;
    }
    if (!Array.isArray(feed) || feed.length === 0) break;
    for (const p of feed) {
      const haystack = [
        p.name,
        p.short_description,
        p.description,
        ...(p.categories?.map((c) => c.name) ?? []),
      ].filter(Boolean);
      if (!isQuartzHardware(...haystack)) continue;
      const category = classifyProduct(...haystack);
      const symbol = p.prices?.currency_symbol ?? "$";
      const price = p.prices?.price ? formatMinor(p.prices.price, symbol) : null;
      const regular =
        p.prices?.regular_price && p.prices.regular_price !== p.prices?.price
          ? formatMinor(p.prices.regular_price, symbol)
          : null;
      const image = p.images?.[0]?.src ?? p.images?.[0]?.thumbnail ?? null;
      products.push({
        externalId: String(p.id),
        handle: p.slug,
        name: p.name,
        price,
        originalPrice: regular,
        soldOut: p.is_in_stock === false,
        available: true,
        link: p.permalink ?? joinUrl(baseUrl, `/product/${p.slug}`),
        imageUrl: image,
        category,
      });
    }
    if (feed.length < 100) break;
    page += 1;
  }
  return { strategy: "woocommerce", products };
}

function joinUrl(base: string, path: string): string {
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!/^https?:\/\//i.test(b)) return `https://${b.replace(/^\/+/, "")}${p}`;
  return `${b}${p}`;
}

function formatMinor(raw: string, symbol: string): string {
  const n = Number(raw);
  if (!Number.isFinite(n)) return `${symbol}${raw}`;
  const dollars = n / 100;
  return `${symbol}${dollars.toFixed(2).replace(/\.00$/, "")}`;
}
