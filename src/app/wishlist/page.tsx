import type { Metadata } from "next";
import Link from "next/link";
import WishlistView from "./WishlistView";
import { getAllProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "The Bench — Pillar & Pearl",
  description: "Your saved quartz pieces, stored locally on this device. No account, no tracking.",
};

export default function WishlistPage() {
  const products = getAllProducts();
  return (
    <div className="pp-shell">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">/</span>
        <b>Bench</b>
      </nav>

      <div
        className="page-head"
        style={{
          paddingBottom: "48px",
          borderBottom: "1px solid var(--color-line)",
          marginBottom: "48px",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(64px, 9vw, 132px)",
            fontWeight: 500,
            letterSpacing: "-0.045em",
            lineHeight: 0.92,
          }}
        >
          The <em>bench.</em>
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            color: "var(--color-muted)",
            lineHeight: 1.65,
            maxWidth: "42ch",
            paddingBottom: "12px",
            alignSelf: "end",
          }}
        >
          Stored locally on this device. Clear cache and it&apos;s gone — no
          account, no tracking.
        </p>
      </div>

      <WishlistView products={products} />

      <div style={{ height: "96px" }} />
    </div>
  );
}
