import type { Metadata } from "next";
import Link from "next/link";
import { GLOSSARY } from "@/lib/glossary";
import { slugify } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Glossary · Pillar & Pearl",
  description:
    "Plain-English definitions for the gear, the technique, and the slang. From bangers to terp slurpers — the language of low-temp dab culture.",
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const goldEm: React.CSSProperties = {
  fontStyle: "italic",
  fontWeight: 400,
  background: "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

export default function GlossaryPage() {
  // Sort GLOSSARY alphabetically
  const sorted = [...GLOSSARY].sort((a, b) =>
    a.term.localeCompare(b.term, "en", { sensitivity: "base" })
  );

  // Group by first letter
  const byLetter = new Map<string, typeof sorted>();
  for (const g of sorted) {
    const letter = g.term[0]?.toUpperCase() ?? "#";
    if (!byLetter.has(letter)) byLetter.set(letter, []);
    byLetter.get(letter)!.push(g);
  }

  const activeLetters = new Set(byLetter.keys());

  // First term slug per letter (for alphabet jumper links)
  const firstSlugByLetter = new Map<string, string>();
  for (const [letter, terms] of byLetter) {
    if (terms.length > 0) firstSlugByLetter.set(letter, slugify(terms[0].term));
  }

  return (
    <div>
      {/* Crumbs */}
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">/</span>
        <b>Glossary</b>
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
          The <em style={goldEm}>glossary.</em>
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
          Plain-English definitions for the gear, the technique, and the slang.
          New to dabbing? Start with{" "}
          <a
            href={`#${firstSlugByLetter.get("B") ?? "B"}`}
            style={{ color: "var(--color-gold-light)" }}
          >
            Banger
          </a>
          ,{" "}
          <a
            href={`#${firstSlugByLetter.get("D") ?? "D"}`}
            style={{ color: "var(--color-gold-light)" }}
          >
            Dab
          </a>
          , and{" "}
          <a
            href={`#${firstSlugByLetter.get("L") ?? "L"}`}
            style={{ color: "var(--color-gold-light)" }}
          >
            Low-temp
          </a>
          .
        </p>
      </section>

      {/* Sticky tools bar */}
      <div
        className="glossary-tools"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "rgba(0, 0, 0, 0.72)",
          backdropFilter: "blur(20px) saturate(140%)",
          WebkitBackdropFilter: "blur(20px) saturate(140%)",
          borderBottom: "1px solid var(--color-line)",
          marginLeft: "calc(-1 * var(--shell-px))",
          marginRight: "calc(-1 * var(--shell-px))",
          paddingLeft: "var(--shell-px)",
          paddingRight: "var(--shell-px)",
          paddingTop: 14,
          paddingBottom: 14,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* Search input */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--color-line)",
            borderRadius: 999,
            padding: "9px 16px",
            maxWidth: 480,
            cursor: "text",
          }}
        >
          <svg
            className="pp-icon"
            aria-hidden="true"
            style={{ flexShrink: 0, color: "var(--color-muted)" }}
          >
            <use href="#i-search" />
          </svg>
          <input
            type="search"
            placeholder="Search a term — e.g. carb cap, slurper, terp"
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--color-fg)",
              flex: 1,
              minWidth: 0,
            }}
          />
        </label>

        {/* Alphabet jumper */}
        <nav
          className="alphabet"
          aria-label="Alphabet"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          {ALPHABET.map((letter) => {
            const slug = firstSlugByLetter.get(letter);
            const has = activeLetters.has(letter);
            return has && slug ? (
              <a
                key={letter}
                href={`#${slug}`}
                className="has"
                style={{
                  display: "inline-flex",
                  width: 26,
                  height: 26,
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--color-gold-light)",
                  border: "1px solid var(--color-line-gold)",
                  borderRadius: 4,
                  letterSpacing: "0.04em",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                {letter}
              </a>
            ) : (
              <span
                key={letter}
                aria-hidden="true"
                style={{
                  display: "inline-flex",
                  width: 26,
                  height: 26,
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--color-dim)",
                  border: "1px solid var(--color-line-soft)",
                  borderRadius: 4,
                  letterSpacing: "0.04em",
                }}
              >
                {letter}
              </span>
            );
          })}
        </nav>
      </div>

      {/* Layout: side rail + terms */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr",
          gap: "0 40px",
          paddingTop: 48,
          paddingBottom: 80,
        }}
      >
        {/* Left letter rail */}
        <nav
          aria-label="Letter rail"
          style={{
            position: "sticky",
            top: 100,
            alignSelf: "start",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {ALPHABET.filter((l) => activeLetters.has(l)).map((letter) => {
            const slug = firstSlugByLetter.get(letter);
            return slug ? (
              <a
                key={letter}
                href={`#${slug}`}
                className="has"
                style={{
                  display: "flex",
                  width: 36,
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--color-gold-light)",
                  border: "1px solid var(--color-line-gold)",
                  borderRadius: 6,
                  letterSpacing: "0.04em",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                {letter}
              </a>
            ) : null;
          })}
        </nav>

        {/* Terms */}
        <div className="terms">
          {ALPHABET.filter((l) => activeLetters.has(l)).map((letter) => {
            const terms = byLetter.get(letter)!;
            return (
              <section
                key={letter}
                className="term-section"
                id={letter}
                style={{ marginBottom: 56 }}
              >
                {/* Letter head */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 16,
                    marginBottom: 24,
                    paddingBottom: 16,
                    borderBottom: "1px solid var(--color-line)",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(56px, 8vw, 96px)",
                      fontWeight: 700,
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      background:
                        "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      margin: 0,
                    }}
                  >
                    {letter}
                  </h2>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 11,
                      color: "var(--color-muted)",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    {terms.length} {terms.length === 1 ? "term" : "terms"}
                  </span>
                </div>

                {/* Terms within this letter */}
                {terms.map((g) => {
                  const id = slugify(g.term);
                  const showExample =
                    g.short && g.short !== g.full;
                  return (
                    <article
                      key={g.term}
                      className="term"
                      id={id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "240px 1fr",
                        gap: "0 40px",
                        padding: "28px 0",
                        borderTop: "1px solid var(--color-line)",
                      }}
                    >
                      {/* Left: word + meta */}
                      <div className="head" style={{ paddingTop: 2 }}>
                        <div
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: 22,
                            fontWeight: 500,
                            lineHeight: 1.15,
                            letterSpacing: "-0.02em",
                            marginBottom: 8,
                          }}
                        >
                          <a
                            href={`#${id}`}
                            style={{ color: "inherit" }}
                          >
                            {g.term}
                          </a>
                        </div>
                      </div>

                      {/* Right: definition + example */}
                      <div className="body">
                        <p
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: 15,
                            lineHeight: 1.7,
                            color: "var(--color-muted)",
                            margin: 0,
                          }}
                        >
                          {g.full}
                        </p>
                        {showExample && (
                          <p
                            style={{
                              fontFamily: "var(--font-serif)",
                              fontSize: 15,
                              fontStyle: "italic",
                              fontWeight: 400,
                              lineHeight: 1.6,
                              color: "var(--color-muted)",
                              marginTop: 14,
                              paddingLeft: 16,
                              borderLeft: "2px solid var(--color-gold-deep)",
                            }}
                          >
                            &ldquo;{g.short}&rdquo;
                          </p>
                        )}
                      </div>

                      <style>{`
                        @media (max-width: 720px) {
                          article.term { grid-template-columns: 1fr !important; }
                        }
                      `}</style>
                    </article>
                  );
                })}
              </section>
            );
          })}
        </div>
      </div>

      {/* Help band */}
      <section
        className="help-band"
        style={{
          background:
            "linear-gradient(135deg, rgba(232,184,90,0.08) 0%, rgba(232,184,90,0.04) 100%)",
          border: "1px solid var(--color-line-gold)",
          borderRadius: 32,
          padding: "48px 56px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px 60px",
          alignItems: "center",
          marginBottom: 80,
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(24px, 3.5vw, 40px)",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: "0 0 14px",
            }}
          >
            Don&apos;t see a term?{" "}
            <em style={goldEm}>Suggest one.</em>
          </h3>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              lineHeight: 1.7,
              color: "var(--color-muted)",
              margin: 0,
              maxWidth: 360,
            }}
          >
            The glossary grows from the questions readers send in. If
            you&apos;re stuck on a piece of slang, a spec, or a maker&apos;s
            lingo &mdash; tell us, and we&apos;ll add it.
          </p>
        </div>

        <div
          className="actions"
          style={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <a
            href="#"
            className="row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 0",
              borderBottom: "1px solid var(--color-line)",
              color: "inherit",
              transition: "color 0.2s",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: 14,
                  marginBottom: 3,
                }}
              >
                Read the gear breakdowns
              </div>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  color: "var(--color-muted)",
                }}
              >
                Long-form on the Journal
              </span>
            </div>
            <span
              style={{
                color: "var(--color-gold-light)",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              →
            </span>
          </a>
          <a
            href="#"
            className="row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 0",
              color: "inherit",
              transition: "color 0.2s",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: 14,
                  marginBottom: 3,
                }}
              >
                Suggest a term
              </div>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  color: "var(--color-muted)",
                }}
              >
                One-line form, no signup
              </span>
            </div>
            <span
              style={{
                color: "var(--color-gold-light)",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              →
            </span>
          </a>
        </div>

        <style>{`
          @media (max-width: 720px) {
            .help-band { grid-template-columns: 1fr !important; padding: 32px 28px !important; }
          }
        `}</style>
      </section>

      {/* Layout responsive style */}
      <style>{`
        @media (max-width: 720px) {
          .glossary-tools {
            margin-left: calc(-1 * var(--shell-px-mobile)) !important;
            margin-right: calc(-1 * var(--shell-px-mobile)) !important;
            padding-left: var(--shell-px-mobile) !important;
            padding-right: var(--shell-px-mobile) !important;
          }
          .terms-layout { grid-template-columns: 1fr !important; }
          .terms-layout > nav:first-child { display: none !important; }
        }
      `}</style>
    </div>
  );
}
