import type { Metadata } from "next";
import { getAllProducts, getMetadata } from "@/lib/catalog";
import type { ProductCategory } from "@/types";
import Filters from "@/components/Filters";

export const metadata: Metadata = {
  title: "Shop · The full quartz catalog",
  description:
    "Filter and compare every quartz banger, terp slurper, control tower, and dunking station in our atlas.",
};

export const revalidate = 3600;

const VALID_CATEGORIES: ProductCategory[] = [
  "control_tower",
  "terp_slurper",
  "dunking_station",
];

interface SearchParams {
  category?: string;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const products = getAllProducts();
  const meta = getMetadata();
  const sp = await searchParams;
  const initialCategory =
    sp.category && (VALID_CATEGORIES as string[]).includes(sp.category)
      ? (sp.category as ProductCategory)
      : undefined;

  return (
    <div className="container-wide section-y-lg">
      <p className="eyebrow">Catalog · Issue 01</p>
      <div className="rule mt-2" />
      <h1 className="font-display mt-6 text-4xl md:text-5xl">
        Shop the atlas
      </h1>
      <p className="prose-measure ink-soft mt-6 text-lg">
        Search by brand, filter by tier, or dial in a category. Every link
        routes to the artist or authorized retailer — we never resell.
      </p>
      <p className="font-mono ink-mute mt-4 text-xs">
        {meta.summary.total_brands} brands · {products.length} pieces ·
        refreshed April 2026
      </p>
      <div className="mt-14">
        <Filters products={products} initialCategory={initialCategory} />
      </div>
    </div>
  );
}
