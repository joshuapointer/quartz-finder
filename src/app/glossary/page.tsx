import type { Metadata } from "next";
import { GLOSSARY } from "@/lib/glossary";
import { slugify } from "@/lib/catalog";
import { Caustics, RotatedKicker } from "@/components/editorial";

export const metadata: Metadata = {
  title: "Glossary · The dab dialect",
  description:
    "From terp slurpers to ISO stations — the language of low-temp dab culture, defined.",
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function GlossaryPage() {
  const firstTermByLetter = new Map<string, string>();
  for (const g of GLOSSARY) {
    const letter = g.term[0]?.toUpperCase();
    if (letter && !firstTermByLetter.has(letter)) {
      firstTermByLetter.set(letter, slugify(g.term));
    }
  }

  return (
    <section
      className="bs-3"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <Caustics opacity={0.4} />
      <div className="bs-gutter">
        <RotatedKicker>§ Knowledge · The dab dialect</RotatedKicker>
      </div>

      <div style={{ padding: "80px 32px 96px", position: "relative" }}>
        <div className="kicker" style={{ marginBottom: 16 }}>
          Folio · Glossary · {GLOSSARY.length} entries
        </div>
        <h1
          className="font-display ink"
          style={{
            fontSize: "clamp(56px, 8vw, 116px)",
            fontWeight: 400,
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            margin: 0,
          }}
        >
          Speak the{" "}
          <em
            className="ink-brass-l"
            style={{ fontStyle: "italic", fontWeight: 400 }}
          >
            dialect.
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
          The vocabulary of low-temp dabbing — for newcomers and veterans.
        </p>

        <nav
          aria-label="Glossary index"
          style={{
            marginTop: 48,
            paddingTop: 24,
            paddingBottom: 24,
            borderTop: "1px solid var(--color-hairline)",
            borderBottom: "1px solid var(--color-hairline)",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {ALPHABET.map((letter) => {
            const slug = firstTermByLetter.get(letter);
            const enabled = !!slug;
            return enabled ? (
              <a
                key={letter}
                href={`#${slug}`}
                className="focus-ring font-mono"
                style={{
                  display: "inline-flex",
                  width: 28,
                  height: 28,
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  color: "var(--color-brass-light)",
                  border: "1px solid var(--color-hairline-strong)",
                  borderRadius: 2,
                  letterSpacing: "0.04em",
                }}
              >
                {letter}
              </a>
            ) : (
              <span
                key={letter}
                aria-hidden
                className="font-mono"
                style={{
                  display: "inline-flex",
                  width: 28,
                  height: 28,
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  color: "var(--color-smoke)",
                  border: "1px solid var(--color-hairline-soft)",
                  borderRadius: 2,
                }}
              >
                {letter}
              </span>
            );
          })}
        </nav>

        <dl style={{ marginTop: 64 }}>
          {GLOSSARY.map((g, i) => {
            const id = slugify(g.term);
            return (
              <div
                key={g.term}
                id={id}
                className="scroll-mt-24"
                style={{
                  padding: "40px 0",
                  borderTop:
                    i === 0
                      ? "1px solid var(--color-hairline-strong)"
                      : "1px solid var(--color-hairline)",
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 16,
                }}
              >
                <div
                  className="md:contents"
                  style={{
                    display: "grid",
                  }}
                >
                  <div
                    className="md:[grid-column:1] md:max-w-[260px]"
                    style={{ minWidth: 0 }}
                  >
                    <div
                      className="font-mono ink-brass"
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.32em",
                        textTransform: "uppercase",
                        marginBottom: 6,
                      }}
                    >
                      № {(i + 1).toString().padStart(3, "0")}
                    </div>
                    <dt
                      className="font-display ink"
                      style={{
                        fontSize: 36,
                        fontStyle: "italic",
                        fontWeight: 400,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.05,
                      }}
                    >
                      <a
                        href={`#${id}`}
                        className="focus-ring"
                        style={{ color: "inherit" }}
                      >
                        {g.term}
                      </a>
                    </dt>
                  </div>
                  <div className="md:[grid-column:2]">
                    <dd
                      className="font-display ink-soft"
                      style={{
                        fontSize: 18,
                        fontStyle: "italic",
                        fontWeight: 400,
                        lineHeight: 1.45,
                      }}
                    >
                      {g.short}
                    </dd>
                    <p
                      className="ink-mute"
                      style={{
                        fontSize: 14,
                        lineHeight: 1.75,
                        marginTop: 14,
                      }}
                    >
                      {g.full}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </dl>
      </div>

      <div className="bs-gutter bs-gutter-r">
        <RotatedKicker color="var(--color-smoke)">
          End of folio · {GLOSSARY.length} entries · Set in Fraunces
        </RotatedKicker>
      </div>

      {/* responsive grid layout via CSS-in-JS using broadsheet 2-col on md+ */}
      <style>{`
        @media (min-width: 768px) {
          dl > div { grid-template-columns: 260px 1fr !important; }
        }
      `}</style>
    </section>
  );
}
