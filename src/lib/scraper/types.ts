import type { ProductCategory } from "@/types";

export type ScrapeStrategy = "shopify" | "woocommerce" | "jsonld" | "manual";

export interface ScrapedProduct {
  externalId: string;
  handle: string;
  name: string;
  price: string | null;
  originalPrice: string | null;
  soldOut: boolean;
  available: boolean;
  link: string;
  imageUrl: string | null;
  category: ProductCategory | null;
  description?: string;
}

export interface ScrapeResult {
  strategy: ScrapeStrategy;
  products: ScrapedProduct[];
}
