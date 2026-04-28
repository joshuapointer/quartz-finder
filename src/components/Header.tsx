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

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Esc closes mobile drawer
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[rgba(10,9,8,0.78)] backdrop-blur-md">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[2px] focus:bg-[var(--color-amber)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--color-bg)]"
      >
        Skip to content
      </a>

      <div className="container-wide flex items-center justify-between py-5">
        <Link
          href="/"
          aria-label="Pillar &amp; Pearl home"
          className="rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-amber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
        >
          <Logo size="sm" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-9 md:flex" aria-label="Main">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative text-sm tracking-[0.04em] transition-colors focus-ring rounded-[2px] ${
                  active
                    ? "text-[var(--color-ink)]"
                    : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
                }`}
              >
                {item.label}
                {/* Amber underbar — active state (non-color affordance) */}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-[6px] left-0 h-px w-6 bg-[var(--color-amber)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Wishlist control — hairline bordered, no rounded-full */}
          <Link
            href="/wishlist"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[2px] border border-[var(--color-line)] hover:border-[var(--color-line-strong)] transition-colors focus-ring"
            aria-label={`Wishlist${hydrated && count > 0 ? ` (${count} items)` : ""}`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
            </svg>
            <span className="hidden text-sm text-[var(--color-ink-soft)] sm:inline">
              Wishlist
            </span>
            {hydrated && count > 0 ? (
              <span className="rounded-full bg-[var(--color-amber)] text-[var(--color-bg)] text-[10px] font-medium px-1.5 leading-[18px]">
                {count}
              </span>
            ) : null}
          </Link>

          {/* Mobile burger — squared, hairline border */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[2px] border border-[var(--color-line)] text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-line-strong)] hover:text-[var(--color-ink)] focus-ring md:hidden"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
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

      {/* Mobile drawer — bookshop menu feel */}
      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-[var(--color-line)] bg-[var(--color-bg-soft)] md:hidden"
        >
          <ul className="container-wide flex flex-col py-2">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`block px-1 py-4 font-display text-base tracking-[-0.005em] border-b border-[var(--color-line-soft)] last:border-b-0 transition-colors ${
                      active
                        ? "text-[var(--color-ink)]"
                        : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
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
      {/* hairline-grad bar REMOVED per spec B.2 */}
    </header>
  );
}
