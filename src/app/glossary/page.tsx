import type { Metadata } from "next";
import { GLOSSARY } from "@/lib/glossary";
import { slugify } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Glossary · The dab dialect",
  description:
    "From terp slurpers to ISO stations — the language of low-temp dab culture, defined.",
};

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-amber)]">
        Glossary
      </p>
      <h1 className="font-display mt-3 text-5xl">Speak the dialect</h1>
      <p className="mt-4 text-lg text-[var(--color-ink-soft)]">
        The vocabulary of modern low-temp dabbing — distilled for newcomers,
        cross-referenced for veterans.
      </p>

      <dl className="mt-12 space-y-10">
        {GLOSSARY.map((g) => {
          const id = slugify(g.term);
          return (
            <div
              key={g.term}
              id={id}
              className="scroll-mt-24 border-l-2 border-[var(--color-amber)]/30 pl-6"
            >
              <dt className="font-display text-3xl">
                <a
                  href={`#${id}`}
                  className="focus-ring rounded-md hover:text-[var(--color-amber)]"
                >
                  {g.term}
                </a>
              </dt>
              <dd className="mt-2 text-sm uppercase tracking-[0.2em] text-[var(--color-amber)]">
                {g.short}
              </dd>
              <p className="mt-3 leading-relaxed text-[var(--color-ink-soft)]">
                {g.full}
              </p>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
