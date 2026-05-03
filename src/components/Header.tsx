"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useWishlist } from "@/store/wishlist";

type NavItem = { href: string; label: string };

const NAV: NavItem[] = [
  { href: "/shop", label: "Shop" },
  { href: "/brands", label: "Brands" },
  { href: "/shop?sort=new", label: "New" },
  { href: "/glossary", label: "Glossary" },
  { href: "#", label: "Journal" },
];

export default function Header() {
  const pathname = usePathname();
  const count = useWishlist((s) => s.ids.length);
  const hydrated = useWishlist((s) => s.hydrated);
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "#") return false;
    if (href.includes("?")) return pathname === href.split("?")[0];
    return pathname === href || pathname.startsWith(`${href}/`);
  };

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
    <header className="pp-header">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: "var(--color-gold)", color: "#000" }}
      >
        Skip to content
      </a>

      {/* Desktop header */}
      <div
        className="hidden md:grid"
        style={{
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "22px 0 18px",
          borderBottom: "1px solid var(--color-line)",
          gap: 32,
        }}
      >
        {/* Left: Logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link
            href="/"
            aria-label="Pillar and Pearl, home"
            className="focus-ring"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <svg className="pp-mark pp-mark-md" aria-hidden="true">
              <use href="#pp" />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 20,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: "var(--color-fg)",
                lineHeight: 1,
              }}
            >
              Pillar
              <span
                style={{
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "var(--color-gold-light)",
                  fontSize: 22,
                  margin: "0 0.07em",
                }}
              >
                &amp;
              </span>
              Pearl
            </span>
          </Link>
        </div>

        {/* Center: Nav pills */}
        <nav aria-label="Primary" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {NAV.map((item) => {
            const active = isActive(item.href);
            return item.href === "#" ? (
              <a
                key={item.label}
                href="#"
                className="focus-ring"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--color-muted)",
                  padding: "7px 14px",
                  borderRadius: "var(--radius-pill)",
                  border: "1px solid transparent",
                  transition: "color 150ms, background 150ms, border-color 150ms",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.color = "var(--color-fg)";
                  el.style.background = "rgba(255,255,255,0.06)";
                  el.style.borderColor = "var(--color-line)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.color = "var(--color-muted)";
                  el.style.background = "";
                  el.style.borderColor = "transparent";
                }}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="focus-ring"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? "#000" : "var(--color-muted)",
                  padding: "7px 14px",
                  borderRadius: "var(--radius-pill)",
                  border: active ? "1px solid rgba(255,255,255,0.4)" : "1px solid transparent",
                  background: active
                    ? "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))"
                    : "transparent",
                  boxShadow: active
                    ? "inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.18), 0 4px 14px rgba(232,184,90,0.30)"
                    : "none",
                  transition: "color 150ms, background 150ms, border-color 150ms",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    const el = e.currentTarget;
                    el.style.color = "var(--color-fg)";
                    el.style.background = "rgba(255,255,255,0.06)";
                    el.style.borderColor = "var(--color-line)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    const el = e.currentTarget;
                    el.style.color = "var(--color-muted)";
                    el.style.background = "transparent";
                    el.style.borderColor = "transparent";
                  }
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Utilities */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            aria-label="Search"
            className="focus-ring"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--color-line)",
              background: "transparent",
              color: "var(--color-muted)",
              cursor: "pointer",
              transition: "color 150ms, border-color 150ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-fg)";
              e.currentTarget.style.borderColor = "var(--color-line-strong)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-muted)";
              e.currentTarget.style.borderColor = "var(--color-line)";
            }}
          >
            <svg className="pp-icon" aria-hidden="true">
              <use href="#i-search" />
            </svg>
          </button>

          <a
            href="#"
            aria-label="Account"
            className="focus-ring"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--color-line)",
              color: "var(--color-muted)",
              transition: "color 150ms, border-color 150ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-fg)";
              e.currentTarget.style.borderColor = "var(--color-line-strong)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-muted)";
              e.currentTarget.style.borderColor = "var(--color-line)";
            }}
          >
            <svg className="pp-icon" aria-hidden="true">
              <use href="#i-user" />
            </svg>
          </a>

          <Link
            href="/wishlist"
            aria-label={`Bag${hydrated && count > 0 ? ` (${count} items)` : ""}`}
            className="focus-ring"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "7px 14px 7px 10px",
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--color-line-strong)",
              color: "var(--color-fg)",
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.01em",
              transition: "border-color 150ms, background 150ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-line-gold)";
              e.currentTarget.style.background = "rgba(232,184,90,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-line-strong)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <svg className="pp-icon" aria-hidden="true">
              <use href="#i-bag" />
            </svg>
            <span>
              Bag
              {hydrated && count > 0 ? (
                <em
                  style={{
                    fontStyle: "italic",
                    color: "var(--color-gold-light)",
                    marginLeft: 4,
                    fontFamily: "var(--font-serif)",
                    fontSize: 14,
                  }}
                >
                  ({count})
                </em>
              ) : null}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile header */}
      <div
        className="md:hidden flex items-center justify-between"
        style={{
          padding: "14px 0",
          borderBottom: open ? "none" : "1px solid var(--color-line)",
        }}
      >
        <Link
          href="/"
          aria-label="Pillar and Pearl, home"
          className="focus-ring"
          style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
        >
          <svg className="pp-mark pp-mark-sm" aria-hidden="true">
            <use href="#pp" />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 17,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "var(--color-fg)",
              lineHeight: 1,
            }}
          >
            Pillar
            <span
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--color-gold-light)",
                fontSize: 19,
                margin: "0 0.07em",
              }}
            >
              &amp;
            </span>
            Pearl
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link
            href="/wishlist"
            aria-label={`Bag${hydrated && count > 0 ? ` (${count})` : ""}`}
            className="focus-ring"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--color-line-strong)",
              color: "var(--color-fg)",
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            <svg className="pp-icon" aria-hidden="true" style={{ width: 15, height: 15 }}>
              <use href="#i-bag" />
            </svg>
            Bag
            {hydrated && count > 0 ? (
              <em
                style={{
                  fontStyle: "italic",
                  color: "var(--color-gold-light)",
                  fontFamily: "var(--font-serif)",
                  fontSize: 13,
                }}
              >
                ({count})
              </em>
            ) : null}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="focus-ring"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--color-line-strong)",
              color: "var(--color-fg)",
              cursor: "pointer",
            }}
          >
            <svg className="pp-icon" aria-hidden="true">
              <use href={open ? "#i-x" : "#i-menu"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="md:hidden"
          style={{
            borderBottom: "1px solid var(--color-line)",
            paddingBottom: 8,
          }}
        >
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.label}>
                  {item.href === "#" ? (
                    <a
                      href="#"
                      style={{
                        display: "block",
                        fontFamily: "var(--font-serif)",
                        fontSize: 26,
                        fontWeight: 400,
                        color: "var(--color-muted)",
                        padding: "14px 0",
                        borderBottom: "1px solid var(--color-line)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="focus-ring"
                      style={{
                        display: "block",
                        fontFamily: "var(--font-serif)",
                        fontSize: 26,
                        fontWeight: 400,
                        color: active ? "var(--color-gold-light)" : "var(--color-fg)",
                        padding: "14px 0",
                        borderBottom: "1px solid var(--color-line)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
