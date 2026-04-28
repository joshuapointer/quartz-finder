import type { Metadata } from "next";
import { GLOSSARY } from "@/lib/glossary";
import { slugify } from "@/lib/catalog";

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
    <div className="container-narrow section-y-lg">
      <p className="eyebrow">Glossary · The dab dialect</p>
      <div className="rule-amber mt-2 w-1/4" />
      <h1 className="font-display mt-6 text-4xl md:text-5xl">
        Speak the dialect
      </h1>
      <p className="prose-measure ink-soft mt-6 text-lg">
        The vocabulary of modern low-temp dabbing — distilled for newcomers,
        cross-referenced for veterans.
      </p>

      <nav
        aria-label="Glossary index"
        className="mt-10 flex flex-wrap gap-2"
      >
        {ALPHABET.map((letter) => {
          const slug = firstTermByLetter.get(letter);
          if (slug) {
            return (
              <a
                key={letter}
                href={`#${slug}`}
                className="font-mono focus-ring inline-flex w-6 justify-center rounded-[2px] text-sm text-[var(--color-amber)] hover:underline"
              >
                {letter}
              </a>
            );
          }
          return (
            <span
              key={letter}
              className="font-mono ink-faint inline-flex w-6 justify-center text-sm"
            >
              {letter}
            </span>
          );
        })}
      </nav>

      <dl className="mt-16 space-y-16">
        {GLOSSARY.map((g) => {
          const id = slugify(g.term);
          return (
            <div key={g.term} id={id} className="scroll-mt-24">
              <div className="rule" />
              <dt className="font-display mt-6 text-3xl">
                <a
                  href={`#${id}`}
                  className="focus-ring rounded-[2px] hover:text-[var(--color-amber)]"
                >
                  {g.term}
                </a>
              </dt>
              <dd className="eyebrow eyebrow-mute mt-3">{g.short}</dd>
              <p
                className="ink-soft prose-measure mt-4 text-base"
                style={{ lineHeight: "var(--leading-loose)" }}
              >
                {g.full}
              </p>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
