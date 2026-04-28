import Link from "next/link";
import { getMetadata } from "@/lib/catalog";

export default function Footer() {
  const meta = getMetadata();
  return (
    <footer className="mt-24 border-t border-[var(--color-line)] bg-[var(--color-bg-soft)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="font-display text-2xl">Quartz Finder</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--color-ink-soft)]">
            A boutique atlas built for hash heads, flavor chasers, and anyone who
            dabs with intention. Independent, affiliate-supported, never sponsored.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
            21+ only · Verify before purchase
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
            Catalog
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/shop" className="hover:text-[var(--color-amber)]">
                Shop all
              </Link>
            </li>
            <li>
              <Link href="/brands" className="hover:text-[var(--color-amber)]">
                Brands
              </Link>
            </li>
            <li>
              <Link href="/glossary" className="hover:text-[var(--color-amber)]">
                Glossary
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="hover:text-[var(--color-amber)]">
                Wishlist
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
            Site
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-[var(--color-amber)]">
                About
              </Link>
            </li>
            <li>
              <a
                href="/api/products"
                className="hover:text-[var(--color-amber)]"
                rel="nofollow"
              >
                JSON API
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--color-line)] px-6 py-6 text-center text-xs text-[var(--color-ink-mute)]">
        <p>{meta.disclaimer}</p>
        <p className="mt-2">
          © {new Date().getFullYear()} Quartz Finder. Editorial; not legal,
          medical, or financial advice.
        </p>
      </div>
    </footer>
  );
}
