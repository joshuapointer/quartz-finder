# Contributing to Quartz Finder

Thanks for caring enough about quartz to send a PR.

## Adding or updating a brand

1. Edit `src/data/quartz-finder.json`.
2. Match the existing schema exactly. The full type signature lives in
   `src/types/index.ts` — TypeScript will catch shape errors at typecheck time.
3. Verify retail links resolve to a current product page (no homepage redirects).
4. If the brand is dormant or wholesale-only, set `status: "dead"` and add a
   `status_label` (e.g. `"Wholesale Only"`).

## Adding a glossary term

`src/lib/glossary.ts` — append to `GLOSSARY` with `term`, `short`, and `full`
fields. Keep `short` to one sentence; reserve detail for `full`.

## Code style

- Run `npm run format` before pushing.
- Strict TypeScript — no `any`, no `// @ts-ignore`.
- Tailwind classes go in JSX; if a class set repeats, hoist into the
  `globals.css` `@layer utilities` block.
- Server components by default; only mark `"use client"` when stateful.

## Quality gates

Every PR must pass:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

CI mirrors these locally — see `.github/workflows/ci.yml`.

## Tone

Editorial, not promotional. We document the culture, we don't market product.
Avoid superlatives that read like a spec sheet copied from a vendor.

## Reporting issues

Open a GitHub issue with:
- Brand or product affected
- The page URL where you saw it
- A screenshot or terminal output if relevant

## Code of conduct

Be civil. Hash heads disagree about almost everything (rosin vs. live, ruby vs.
sapphire, marble caps vs. domeless) — disagreements stay technical.
