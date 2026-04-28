import type { Metadata } from "next";
import { getAllProducts } from "@/lib/catalog";
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
  const sp = await searchParams;
  const initialCategory =
    sp.category && (VALID_CATEGORIES as string[]).includes(sp.category)
      ? (sp.category as ProductCategory)
      : undefined;

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-amber)]">
        Catalog
      </p>
      <h1 className="font-display mt-3 text-5xl">Shop the atlas</h1>
      <p className="mt-3 max-w-2xl text-[var(--color-ink-soft)]">
        Search by brand, filter by tier, or dial in a category. Every link routes
        to the artist or authorized retailer — we never resell.
      </p>
      <div className="mt-10">
        <Filters products={products} initialCategory={initialCategory} />
      </div>
    </div>
  );
}
