# Pillar & Pearl

> A boutique editorial atlas of quartz bangers, terp slurpers, control towers, and dunking stations — for cannabis-concentrate enthusiasts who care about flavor, craft, and pedigree.

Named for the two unsung accessories that quietly define a proper low-temp dab: the hollow quartz **pillar** that wicks oil up off the dish, and the **pearl** that spins inside the banger to even-out heat.

Pillar & Pearl is **not** a storefront. It is a curated, affiliate-supported reference site that catalogues 30+ glass houses across import and US-made tiers, surfaces live retail links, and explains the dialect of low-temp dabbing.

![21+ only](https://img.shields.io/badge/audience-21%2B%20only-d39a3e)
![Next.js](https://img.shields.io/badge/Next.js-15-000000)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)
![License: MIT](https://img.shields.io/badge/license-MIT-green)

---

## Features

- **Brand directory** — every catalogued house with tier, status, and live retail link
- **Filterable shop** — category, tier, in-stock toggle, fuzzy search (Fuse.js)
- **Per-brand pages** — full lineup, accessories on file, status badges
- **Per-product pages** — affiliate-out CTA, related items, retail metadata
- **Glossary** — 13+ terms covering control towers, terp pearls, ISO stations, low-temp dabs
- **Wishlist** — local-only, zero-tracking save list (Zustand + localStorage)
- **Age gate** — 21+ verification modal cached on-device
- **JSON API** — `/api/products` for downstream integrations
- **SEO** — sitemap, robots, OpenGraph, structured metadata
- **Hardened headers** — CSP, HSTS, `X-Frame-Options`, `Permissions-Policy`

## Stack

- [Next.js 15](https://nextjs.org) (App Router, RSC)
- TypeScript strict mode
- [Tailwind CSS v4](https://tailwindcss.com) + custom dark "smoked-glass" palette
- [Zustand 5](https://zustand-demo.pmnd.rs) for client state
- [Fuse.js 7](https://fusejs.io) for fuzzy product search
- [Vitest](https://vitest.dev) + Testing Library for unit/component tests
- ESLint (next/core-web-vitals) + Prettier + prettier-plugin-tailwindcss

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Start the built server |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest in single-run mode |
| `npm run test:watch` | Vitest watch |
| `npm run format` | Prettier write |

## Project layout

```
src/
  app/                  Next.js App Router routes
    api/products/       JSON catalog endpoint
    brands/[slug]/      Per-brand page
    products/[id]/      Per-product page
    glossary/           Editorial glossary
    wishlist/           Local-only saved list
    error.tsx           Error boundary
    loading.tsx         Loading skeleton
  components/           UI primitives (cards, badges, filters, age gate)
  data/catalog.json     Source catalog (mock — replace w/ CMS later)
  lib/
    catalog.ts          Normalization, filtering, slug helpers (memoized)
    search.ts           Fuse-backed search index (WeakMap-cached)
    glossary.ts         Glossary corpus
    url.ts              External URL validation
  store/
    wishlist.ts         Wishlist (Zustand + persist)
    age-gate.ts         21+ verification (Zustand + persist)
  types/                Strict types for the catalog
tests/                  Vitest unit + component tests
```

## Data source

Catalog data lives in `src/data/catalog.json`. The shape is fully typed in
`src/types/index.ts` (`Catalog`, `Brand`, `ProductEntry`, `Accessory`).

Replacing the JSON with a CMS or live scraper is a drop-in swap: build the same
shape and feed it through `src/lib/catalog.ts`.

## Deploying

### Coolify + Traefik (recommended self-host)

1. Push the repo to GitHub.
2. In Coolify → New Resource → Public/Private Repository → point at this repo.
3. Build pack: **Dockerfile** (auto-detected).
4. Set environment variables:
   - `NEXT_PUBLIC_SITE_URL=https://pillarpearl.com`
5. Set domain to `pillarpearl.com` (and optionally `www.pillarpearl.com`).
   Coolify auto-attaches Traefik labels and provisions a Let's Encrypt cert.
6. Cloudflare DNS: add `A pillarpearl.com → <vps-ip>` and `A www → <vps-ip>`.
   Set Cloudflare proxy to **DNS only** (gray cloud) if you want Traefik to
   handle TLS directly; **Proxied** (orange cloud) if you want CF in front.
7. Deploy.

The Dockerfile is multi-stage and ships only `.next/standalone` + static
assets — final image is ~150 MB.

### Vercel

1. Import on [vercel.com/new](https://vercel.com/new)
2. Set `NEXT_PUBLIC_SITE_URL`
3. Deploy

The catalog is statically built with 1-day ISR; trigger a redeploy when
`catalog.json` changes for an immediate refresh.

### Plain Docker

```bash
docker build -t pillar-and-pearl --build-arg NEXT_PUBLIC_SITE_URL=https://pillarpearl.com .
docker run --rm -p 3000:3000 pillar-and-pearl
```

Or via Compose:

```bash
docker compose up -d
```

### Bare-metal

```bash
npm run build
npm start            # listens on :3000 by default
```

Pair with a reverse proxy (Caddy, nginx, Traefik) and HTTPS termination.

## Compliance & disclaimer

- For users **21+** in jurisdictions where cannabis concentrates are legal.
- Pillar & Pearl does **not** sell, ship, or handle product. Every link routes
  to an independent retailer or brand.
- Pricing is verified ~April 2026. Always confirm before purchasing.
- Nothing on this site is legal, medical, or financial advice.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Brand additions, accessory updates, and
glossary refinements welcome.

## License

[MIT](./LICENSE)
