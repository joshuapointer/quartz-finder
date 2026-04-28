import Link from "next/link";
import { getMetadata } from "@/lib/catalog";
import Logo from "./Logo";

export default function Footer() {
  const meta = getMetadata();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-32 bg-[var(--color-bg-sunk)] border-t border-[var(--color-line)]">
      {/* Main grid */}
      <div className="container-wide py-20 grid md:grid-cols-12 gap-y-12 gap-x-10">

        {/* Brand block — col-span-5 */}
        <div className="md:col-span-5">
          <Logo size="md" />
          {/* Editorial italic tagline — copy refresh in scope */}
          <p className="font-display italic text-2xl mt-6 ink-soft">
            A boutique atlas of cannabis-concentrate hardware.
          </p>
          <p className="text-sm ink-mute mt-3 max-w-md">
            Independent, affiliate-supported, never sponsored. We catalog what
            we&rsquo;d buy ourselves.
          </p>
        </div>

        {/* Catalog column — col-span-3 */}
        <div className="md:col-span-3">
          <p className="eyebrow eyebrow-mute">Catalog</p>
          <ul className="mt-4 space-y-3 text-sm ink-soft">
            <li>
              <Link
                href="/shop"
                className="focus-ring rounded-[2px] hover:text-[var(--color-amber)] transition-colors"
              >
                Shop all
              </Link>
            </li>
            <li>
              <Link
                href="/brands"
                className="focus-ring rounded-[2px] hover:text-[var(--color-amber)] transition-colors"
              >
                Brands
              </Link>
            </li>
            <li>
              <Link
                href="/glossary"
                className="focus-ring rounded-[2px] hover:text-[var(--color-amber)] transition-colors"
              >
                Glossary
              </Link>
            </li>
            <li>
              <Link
                href="/wishlist"
                className="focus-ring rounded-[2px] hover:text-[var(--color-amber)] transition-colors"
              >
                Wishlist
              </Link>
            </li>
          </ul>
        </div>

        {/* Site column — col-span-2 */}
        <div className="md:col-span-2">
          <p className="eyebrow eyebrow-mute">Site</p>
          <ul className="mt-4 space-y-3 text-sm ink-soft">
            <li>
              <Link
                href="/about"
                className="focus-ring rounded-[2px] hover:text-[var(--color-amber)] transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <a
                href="/api/products"
                className="focus-ring rounded-[2px] hover:text-[var(--color-amber)] transition-colors"
                rel="nofollow"
                target="_blank"
              >
                JSON API ↗
              </a>
            </li>
          </ul>
        </div>

        {/* Dispatch column — col-span-2 (NEW: editorial cadence signal) */}
        <div className="md:col-span-2">
          <p className="eyebrow eyebrow-mute">Dispatch · forthcoming</p>
          <div className="rule mt-4" />
          <p className="text-xs ink-mute mt-3">
            Editorial cadence, no inbox spam. Mailing list returns Q3.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--color-line)]">
        <div className="container-wide py-7 grid md:grid-cols-12 items-center text-xs gap-y-3">
          {/* Disclaimer — left at desktop, centered mobile */}
          <p className="md:col-span-8 ink-mute text-center md:text-left">
            {meta.disclaimer}
          </p>
          {/* Copyright + mono build tag — right */}
          <div className="md:col-span-4 text-center md:text-right">
            <p className="ink-mute">
              © {year} Pillar &amp; Pearl. Editorial; not legal, medical, or
              financial advice.
            </p>
            <p className="mt-1">
              <span className="font-mono text-[10px] ink-faint">
                v0.x · Apr 2026
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
