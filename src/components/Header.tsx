"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { useWishlist } from "@/store/wishlist";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/brands", label: "Brands" },
  { href: "/glossary", label: "Glossary" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const count = useWishlist((s) => s.ids.length);
  const hydrated = useWishlist((s) => s.hydrated);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[rgba(11,10,15,0.85)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Pillar &amp; Pearl home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm tracking-wide transition-colors ${
                  active
                    ? "text-[var(--color-amber)]"
                    : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/wishlist"
          className="group relative inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-bg-elev)] px-4 py-2 text-sm transition-colors hover:border-[var(--color-amber)]"
          aria-label={`Wishlist (${count} items)`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
          </svg>
          <span className="text-[var(--color-ink)]">Wishlist</span>
          {hydrated && count > 0 ? (
            <span className="ml-1 rounded-full bg-[var(--color-amber)] px-2 py-0.5 text-xs font-semibold text-[var(--color-bg)]">
              {count}
            </span>
          ) : null}
        </Link>
      </div>
      <div className="hairline-grad h-px w-full" />
    </header>
  );
}
