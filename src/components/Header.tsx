"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[rgba(11,10,15,0.85)] backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--color-amber)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--color-bg)]"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          aria-label="Pillar &amp; Pearl home"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-amber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
        >
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md text-sm tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-amber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] ${
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
        <div className="flex items-center gap-2">
          <Link
            href="/wishlist"
            className="group relative inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-bg-elev)] px-4 py-2 text-sm transition-colors hover:border-[var(--color-amber)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-amber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
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
            <span className="hidden text-[var(--color-ink)] sm:inline">
              Wishlist
            </span>
            {hydrated && count > 0 ? (
              <span className="ml-1 rounded-full bg-[var(--color-amber)] px-2 py-0.5 text-xs font-semibold text-[var(--color-bg)]">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-bg-elev)] text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-amber)] hover:text-[var(--color-amber)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-amber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] md:hidden"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <>
                  <path d="M6 6 18 18" />
                  <path d="M18 6 6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-[var(--color-line)] bg-[var(--color-bg-soft)] md:hidden"
        >
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg px-4 py-3 text-sm transition-colors ${
                      active
                        ? "bg-[var(--color-bg-elev)] text-[var(--color-amber)]"
                        : "text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-elev)] hover:text-[var(--color-ink)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
      <div className="hairline-grad h-px w-full" />
    </header>
  );
}
