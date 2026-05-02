import Link from "next/link";
import { Caustics, QuartzOrb } from "@/components/editorial";

export default function NotFound() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "96px 32px",
        textAlign: "center",
      }}
    >
      <Caustics opacity={0.55} />
      <div style={{ position: "relative", maxWidth: 720 }}>
        <div style={{ display: "inline-flex" }} aria-hidden>
          <QuartzOrb size={140} />
        </div>
        <div
          className="kicker"
          style={{ marginTop: 28, marginBottom: 16 }}
        >
          № 404 · Plate vacated
        </div>
        <h1
          className="font-display ink"
          style={{
            fontSize: "clamp(56px, 8vw, 96px)",
            fontWeight: 400,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            margin: 0,
          }}
        >
          Lost in the{" "}
          <em
            className="ink-brass-l"
            style={{ fontStyle: "italic", fontWeight: 400 }}
          >
            slits.
          </em>
        </h1>
        <p
          className="font-display ink-soft"
          style={{
            fontSize: 22,
            fontStyle: "italic",
            fontWeight: 400,
            lineHeight: 1.55,
            marginTop: 20,
            maxWidth: 560,
            marginInline: "auto",
          }}
        >
          That plate evaporated like a low-temp dab. The index is still on the
          bench.
        </p>
        <div
          style={{
            marginTop: 32,
            display: "flex",
            justifyContent: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <Link href="/shop" className="btn btn-primary focus-ring">
            Back to the index →
          </Link>
          <Link href="/" className="btn btn-ghost focus-ring">
            The masthead
          </Link>
        </div>
      </div>
    </section>
  );
}
