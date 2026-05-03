import * as cheerio from "cheerio";
import { fetchText } from "./http";
import { classifyProduct, isQuartzHardware } from "./classify";
import type { ScrapedProduct, ScrapeResult } from "./types";

interface JsonLdNode {
  "@type"?: string | string[];
  "@graph"?: JsonLdNode[];
  name?: string;
  description?: string;
  url?: string;
  image?: string | string[] | { url?: string };
  sku?: string;
  productID?: string;
  offers?: JsonLdOffer | JsonLdOffer[];
}

interface JsonLdOffer {
  price?: string | number;
  priceCurrency?: string;
  priceSpecification?: { price?: string | number; priceCurrency?: string };
  availability?: string;
  url?: string;
}

export async function scrapeJsonLd(baseUrl: string): Promise<ScrapeResult> {
  const products: ScrapedProduct[] = [];
  const homepage = await fetchText(baseUrl);
  const links = collectProductLinks(homepage, baseUrl);
  const visited = new Set<string>();
  for (const link of links.slice(0, 30)) {
    if (visited.has(link)) continue;
    visited.add(link);
    try {
      const html = await fetchText(link);
      const product = extractProductFromHtml(html, link);
      if (product) products.push(product);
    } catch {
      continue;
    }
  }
  return { strategy: "jsonld", products };
}

function collectProductLinks(html: string, baseUrl: string): string[] {
  const $ = cheerio.load(html);
  const out = new Set<string>();
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    if (!/\/products?\//i.test(href) && !/\/shop\//i.test(href)) return;
    try {
      const abs = new URL(href, baseUrl).toString();
      if (!abs.startsWith("http")) return;
      out.add(abs.split("#")[0].split("?")[0]);
    } catch {}
  });
  return Array.from(out);
}

function extractProductFromHtml(html: string, url: string): ScrapedProduct | null {
  const $ = cheerio.load(html);
  const blocks: JsonLdNode[] = [];
  $("script[type='application/ld+json']").each((_, el) => {
    const raw = $(el).contents().text();
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) blocks.push(...parsed);
      else blocks.push(parsed);
    } catch (e) {
      if (process.env.NODE_ENV !== "test") {
        console.warn(`[jsonld] parse failed for ${url}: ${String(e)}`);
      }
    }
  });
  const product = findProductNode(blocks);
  if (!product) return null;
  const haystack = [product.name, product.description].filter(Boolean);
  if (!isQuartzHardware(...haystack)) return null;
  const offer = pickOffer(product.offers);
  const price = offerPrice(offer);
  const image = pickImage(product.image);
  const handle = url.split("/").filter(Boolean).pop() ?? url;
  return {
    externalId: String(product.sku ?? product.productID ?? handle),
    handle,
    name: product.name ?? handle,
    price,
    originalPrice: null,
    soldOut: offer?.availability
      ? !/in.?stock|preorder/i.test(offer.availability)
      : false,
    available: true,
    link: url,
    imageUrl: image,
    category: classifyProduct(...haystack),
  };
}

function findProductNode(nodes: JsonLdNode[]): JsonLdNode | null {
  const queue = [...nodes];
  while (queue.length) {
    const n = queue.shift();
    if (!n) continue;
    if (Array.isArray(n["@graph"])) queue.push(...n["@graph"]);
    const t = n["@type"];
    const types = Array.isArray(t) ? t : t ? [t] : [];
    if (types.some((x) => /Product/i.test(x))) return n;
  }
  return null;
}

function pickOffer(o: JsonLdNode["offers"]): JsonLdOffer | undefined {
  if (!o) return undefined;
  if (Array.isArray(o)) return o[0];
  return o;
}

function offerPrice(offer?: JsonLdOffer): string | null {
  if (!offer) return null;
  const raw = offer.price ?? offer.priceSpecification?.price;
  if (raw == null) return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  const sym = "$";
  return `${sym}${n.toFixed(2).replace(/\.00$/, "")}`;
}

function pickImage(img: JsonLdNode["image"]): string | null {
  if (!img) return null;
  if (typeof img === "string") return img;
  if (Array.isArray(img)) return img[0] ?? null;
  if (typeof img === "object" && img.url) return img.url;
  return null;
}
