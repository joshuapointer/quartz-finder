import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/catalog";
import type { ProductCategory } from "@/types";
import Filters from "@/components/Filters";

export const metadata: Metadata = {
  title: "Shop the bench · Pillar & Pearl",
  description:
    "A curated marketplace for quartz enthusiasts and terp heads. Control towers, slurpers, and dunking stations from the makers we trust.",
};

export const revalidate = 3600;

const VALID_CATEGORIES: ProductCategory[] = [
  "control_tower",
  "terp_slurper",
  "dunking_station",
];

interface SearchParams {
  category?: string;
  usmade?: string;
}

const goldEm: React.CSSProperties = {
  fontStyle: "italic",
  fontWeight: 400,
  background: "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

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
    <div>
      {/* Crumbs */}
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">/</span>
        <b>Shop</b>
      </nav>

      {/* Page head */}
      <section
        className="page-head"
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "40px 60px",
          alignItems: "end",
          paddingBottom: 40,
          borderBottom: "1px solid var(--color-line)",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(64px, 9vw, 156px)",
            lineHeight: 0.88,
            margin: 0,
          }}
        >
          Shop the <em style={goldEm}>bench.</em>
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 15,
            lineHeight: 1.7,
            color: "var(--color-muted)",
            maxWidth: 400,
          }}
        >
          A curated marketplace for quartz enthusiasts and terp heads. Three
          categories of glass &mdash; control towers, slurpers, and stations
          &mdash; and the makers we trust.
        </p>

        <style>{`
          @media (max-width: 720px) {
            .pp-shop-head { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* Filters — handles sidebar + chip toolbar + grid + pagination */}
      <Filters products={products} initialCategory={initialCategory} />
    </div>
  );
}
