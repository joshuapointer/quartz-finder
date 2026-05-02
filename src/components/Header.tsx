"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PPMark } from "./editorial";
import { toRoman } from "@/lib/roman";
import { useWishlist } from "@/store/wishlist";

type NavItem = { href: string; label: string; n: string; group: "L" | "R" };

const NAV: NavItem[] = [
  { href: "/", label: "Index", n: "0.0", group: "L" },
  { href: "/shop", label: "Bangers", n: "1.0", group: "L" },
  { href: "/brands", label: "Makers", n: "2.0", group: "L" },
  { href: "/glossary", label: "Glossary", n: "3.0", group: "R" },
  { href: "/about", label: "House", n: "4.0", group: "R" },
];

function formatLedgerDate(d: Date) {
  const day = d.toLocaleDateString("en-US", { weekday: "long" });
  const date = d.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  // crude roman numeral conversion for years 2000-2999
  const romanYear = toRoman(year);
  return `${day}, ${date} ${month} ${romanYear}`;
}

export default function Header() {
  const pathname = usePathname();
  const count = useWishlist((s) => s.ids.length);
  const hydrated = useWishlist((s) => s.hydrated);
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

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

  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);
  const ledgerDate = useMemo(
    () => (now ? formatLedgerDate(now) : null),
    [now],
  );
  const leftNav = NAV.filter((n) => n.group === "L");
  const rightNav = NAV.filter((n) => n.group === "R");

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: "rgba(6,7,10,0.85)",
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
      }}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-[var(--color-pearl)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--color-ink)]"
      >
        Skip to content
      </a>

      {/* ledger strip */}
      <div
        className="hidden md:flex"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 32px",
          borderBottom: "1px solid var(--color-hairline)",
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          color: "var(--color-smoke)",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
        }}
      >
        <span suppressHydrationWarning>
          Edition № 0247
          {ledgerDate ? ` · ${ledgerDate}` : ""} · Indexed 04:12 PT
        </span>
        <span style={{ display: "flex", gap: 22 }}>
          <span>$ USD</span>
          <span>EN</span>
          <span style={{ color: "var(--color-brass)" }}>Concierge</span>
        </span>
      </div>

      {/* main row (desktop) */}
      <div
        className="hidden md:grid"
        style={{
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "14px 32px",
          gap: 28,
          borderBottom: "1px solid var(--color-hairline)",
        }}
      >
        <nav aria-label="Main left" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {leftNav.map((i) => {
            const active = isActive(i.href);
            return (
              <Link
                key={i.href}
                href={i.href}
                aria-current={active ? "page" : undefined}
                className="focus-ring"
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 6,
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: active ? "var(--color-pearl)" : "var(--color-bone)",
                  paddingBottom: 4,
                  borderBottom: active
                    ? "1px solid var(--color-brass)"
                    : "1px solid transparent",
                  transition: "color var(--duration-fast) var(--ease-standard)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: active ? "var(--color-brass)" : "var(--color-smoke)",
                  }}
                >
                  §{i.n}
                </span>
                {i.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/"
          aria-label="Pillar & Pearl home"
          className="focus-ring"
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <PPMark size={26} />
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              lineHeight: 1,
            }}
          >
            <span
              className="font-display"
              style={{
                fontSize: 22,
                fontWeight: 400,
                color: "var(--color-pearl)",
                letterSpacing: "-0.01em",
              }}
            >
              Pillar{" "}
              <em className="ink-brass-l" style={{ fontStyle: "italic", fontWeight: 300 }}>
                &amp;
              </em>{" "}
              Pearl
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 8,
                color: "var(--color-smoke)",
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                marginTop: 4,
              }}
            >
              The Quartz Index
            </span>
          </span>
        </Link>

        <nav
          aria-label="Main right"
          style={{
            display: "flex",
            gap: 24,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {rightNav.map((i) => {
            const active = isActive(i.href);
            return (
              <Link
                key={i.href}
                href={i.href}
                aria-current={active ? "page" : undefined}
                className="focus-ring"
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 6,
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: active ? "var(--color-pearl)" : "var(--color-bone)",
                  paddingBottom: 4,
                  borderBottom: active
                    ? "1px solid var(--color-brass)"
                    : "1px solid transparent",
                  transition: "color var(--duration-fast) var(--ease-standard)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: active ? "var(--color-brass)" : "var(--color-smoke)",
                  }}
                >
                  §{i.n}
                </span>
                {i.label}
              </Link>
            );
          })}
          <span
            aria-hidden
            style={{
              width: 1,
              height: 18,
              background: "var(--color-hairline-strong)",
            }}
          />
          <Link
            href="/shop"
            className="focus-ring"
            aria-label="Search the catalog"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--color-pearl)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Search
          </Link>
          <Link
            href="/wishlist"
            className="focus-ring"
            aria-label={`Bench${hydrated && count > 0 ? ` (${count} items)` : ""}`}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--color-pearl)",
              display: "flex",
              alignItems: "baseline",
              gap: 4,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Bench
            <span
              style={{
                color: "var(--color-brass)",
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontStyle: "italic",
              }}
            >
              ({hydrated ? count : 0})
            </span>
          </Link>
        </nav>
      </div>

      {/* mobile row */}
      <div className="md:hidden flex items-center justify-between border-b border-[var(--color-hairline)] px-5 py-3">
        <Link href="/" aria-label="Pillar & Pearl home" className="focus-ring flex items-center gap-2">
          <PPMark size={24} />
          <span
            className="font-display"
            style={{ fontSize: 18, color: "var(--color-pearl)", letterSpacing: "-0.01em" }}
          >
            Pillar{" "}
            <em className="ink-brass-l" style={{ fontStyle: "italic", fontWeight: 300 }}>
              &amp;
            </em>{" "}
            Pearl
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/wishlist"
            className="focus-ring inline-flex items-center gap-1 px-3 py-1.5 text-xs"
            aria-label={`Bench${hydrated && count > 0 ? ` (${count})` : ""}`}
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-pearl)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              border: "1px solid var(--color-hairline-strong)",
              borderRadius: 2,
            }}
          >
            Bench
            <span style={{ color: "var(--color-brass)", fontFamily: "var(--font-display)", fontStyle: "italic" }}>
              ({hydrated ? count : 0})
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="focus-ring inline-flex h-10 w-10 items-center justify-center"
            style={{
              border: "1px solid var(--color-hairline-strong)",
              borderRadius: 2,
              color: "var(--color-pearl)",
            }}
          >
            <svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              aria-hidden
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
          className="md:hidden border-b border-[var(--color-hairline)] bg-[var(--color-ink-2)]"
        >
          <ul className="flex flex-col px-5 py-2">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="focus-ring flex items-baseline gap-3 border-b border-[var(--color-hairline-soft)] py-4 last:border-b-0"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      color: active ? "var(--color-pearl)" : "var(--color-bone)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: active ? "var(--color-brass)" : "var(--color-smoke)",
                      }}
                    >
                      §{item.n}
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
