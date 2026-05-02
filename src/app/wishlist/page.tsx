import type { Metadata } from "next";
import WishlistView from "./WishlistView";
import { getAllProducts } from "@/lib/catalog";
import { Caustics, RotatedKicker } from "@/components/editorial";

export const metadata: Metadata = {
  title: "Bench",
  description: "Your saved quartz pieces, all in one place.",
};

export default function WishlistPage() {
  const products = getAllProducts();
  return (
    <section
      className="bs-3"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <Caustics opacity={0.45} />
      <div className="bs-gutter">
        <RotatedKicker>§ Bench · Saved on this device</RotatedKicker>
      </div>
      <div style={{ padding: "80px 32px 96px", position: "relative" }}>
        <div className="kicker" style={{ marginBottom: 16 }}>
          Folio · The Bench · Local to this device
        </div>
        <h1
          className="font-display ink"
          style={{
            fontSize: "clamp(64px, 10vw, 132px)",
            fontWeight: 200,
            lineHeight: 0.9,
            letterSpacing: "-0.045em",
            margin: 0,
          }}
        >
          The{" "}
          <em
            className="ink-brass-l"
            style={{ fontStyle: "italic", fontWeight: 300 }}
          >
            Bench.
          </em>
        </h1>
        <p
          className="font-display ink-soft"
          style={{
            fontSize: 22,
            fontStyle: "italic",
            fontWeight: 400,
            lineHeight: 1.5,
            marginTop: 24,
            maxWidth: 640,
          }}
        >
          Stored locally on this device. Clear cache and it&apos;s gone — no
          account, no tracking.
        </p>
        <div style={{ marginTop: 56 }}>
          <WishlistView products={products} />
        </div>
      </div>
      <div className="bs-gutter bs-gutter-r">
        <RotatedKicker color="var(--color-smoke)">
          Local · No account · No tracking
        </RotatedKicker>
      </div>
    </section>
  );
}
