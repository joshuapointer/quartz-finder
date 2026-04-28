import type { MetadataRoute } from "next";
import { getAllBrands, getAllProducts, slugify } from "@/lib/catalog";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/shop", "/brands", "/glossary", "/about", "/wishlist"];
  const brandRoutes = getAllBrands().map((b) => `/brands/${slugify(b.name)}`);
  const productRoutes = getAllProducts().map((p) => `/products/${p.id}`);
  return [...staticRoutes, ...brandRoutes, ...productRoutes].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.6,
  }));
}
