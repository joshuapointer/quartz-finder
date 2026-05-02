import Link from "next/link";
import { getMetadata } from "@/lib/catalog";
import { toRoman } from "@/lib/roman";

const COLS: { h: string; items: { label: string; href?: string }[] }[] = [
  {
    h: "§1 Marketplace",
    items: [
      { label: "All Quartz", href: "/shop" },
      { label: "New This Week", href: "/shop" },
      { label: "By Category", href: "/shop" },
      { label: "By Maker", href: "/brands" },
      { label: "API", href: "/api/products" },
    ],
  },
  {
    h: "§2 Knowledge",
    items: [
      { label: "Quartz Index", href: "/glossary" },
      { label: "Glossary", href: "/glossary" },
      { label: "Heat & Timing", href: "/glossary" },
      { label: "Authentication" },
      { label: "Care" },
    ],
  },
  {
    h: "§3 Bench",
    items: [
      { label: "My Bench", href: "/wishlist" },
      { label: "Saved", href: "/wishlist" },
      { label: "Concierge" },
      { label: "Trade-In" },
      { label: "Orders" },
    ],
  },
  {
    h: "§4 House",
    items: [
      { label: "About", href: "/about" },
      { label: "Editorial" },
      { label: "Press" },
      { label: "Contact" },
      { label: "Disclosures" },
    ],
  },
];

export default function Footer() {
  const meta = getMetadata();
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "2px solid var(--color-brass-2)",
        background: "var(--color-ink)",
        padding: "56px 32px 24px",
        position: "relative",
        overflow: "hidden",
        marginTop: 96,
      }}
    >
      {/* watermark wordmark */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -40,
          left: 0,
          right: 0,
          fontFamily: "var(--font-display)",
          fontSize: 280,
          fontWeight: 300,
          fontStyle: "italic",
          color: "var(--color-pearl)",
          opacity: 0.025,
          lineHeight: 0.85,
          letterSpacing: "-0.04em",
          textAlign: "center",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        Pillar &amp; Pearl
      </div>

      <div style={{ position: "relative" }} className="container-wide">
        {/* colophon row */}
        <div
          className="grid gap-12 pb-9"
          style={{
            gridTemplateColumns: "1fr",
            borderBottom: "1px solid var(--color-hairline)",
          }}
        >
          <div className="grid gap-12 md:grid-cols-3">
            <div>
              <div className="kicker">Colophon</div>
              <div
                className="font-display ink"
                style={{
                  fontSize: 28,
                  fontWeight: 300,
                  marginTop: 12,
                  lineHeight: 1.1,
                }}
              >
                Pillar{" "}
                <em
                  className="ink-brass-l"
                  style={{ fontStyle: "italic" }}
                >
                  &amp;
                </em>{" "}
                Pearl
              </div>
              <div
                className="font-mono ink-faint"
                style={{
                  fontSize: 10,
                  marginTop: 8,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                Established MMXXVI · Brooklyn, NY
              </div>
            </div>

            <p
              className="font-display ink-soft"
              style={{
                fontSize: 18,
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: 1.6,
                maxWidth: 560,
              }}
            >
              &ldquo;Set in Fraunces and Geist. Printed in dark mode. Indexed
              nightly against the eighteen authorized vendors of these United
              States. Issued every other Thursday to those who keep a bench.&rdquo;
            </p>

            <div className="md:text-right">
              <div className="kicker">The Dispatch</div>
              <form className="mt-4 flex gap-2 md:justify-end" action="#">
                <input
                  type="email"
                  placeholder="Address"
                  aria-label="Email address"
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid var(--color-brass-2)",
                    padding: "8px 0",
                    color: "var(--color-pearl)",
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--color-brass-light)",
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    fontStyle: "italic",
                    cursor: "pointer",
                    padding: "0 4px",
                  }}
                >
                  →
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* link grid */}
        <div
          className="grid grid-cols-2 gap-8 py-8 md:grid-cols-4"
          style={{
            borderBottom: "1px solid var(--color-hairline)",
          }}
        >
          {COLS.map((col) => (
            <div key={col.h}>
              <div
                className="font-mono ink-brass"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                {col.h}
              </div>
              <ul className="flex flex-col gap-2">
                {col.items.map((item) =>
                  item.href ? (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="focus-ring ink-soft hover:ink-brass-l transition-colors"
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: 13,
                        }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ) : (
                    <li
                      key={item.label}
                      className="ink-soft"
                      style={{ fontFamily: "var(--font-sans)", fontSize: 13 }}
                    >
                      {item.label}
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* legal row */}
        <div
          className="mt-5 flex flex-col gap-2 md:flex-row md:justify-between md:items-center"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "var(--color-smoke)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          <span>© {toRoman(year)} · Vol. 01 · No. 0247</span>
          <span className="md:text-center">{meta.disclaimer}</span>
          <span className="md:text-right">Privacy / Terms / A11y</span>
        </div>
      </div>
    </footer>
  );
}

