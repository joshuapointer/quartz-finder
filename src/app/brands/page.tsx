import type { Metadata } from "next";
import Link from "next/link";
import { getBrandSummaries } from "@/lib/catalog";
import BrandCard from "@/components/BrandCard";
import type { BrandSummary } from "@/types";

export const metadata: Metadata = {
  title: "Brands — Makers & Glass Houses",
  description:
    "Independent shops, US benches, and the imports we trust. Every brand here has been vetted on the bench.",
};

function makeInitials(name: string): string {
  const SKIP = new Set(["quartz", "glass", "tubes"]);
  const words = name.split(/\s+/).filter((w) => !SKIP.has(w.toLowerCase()));
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words
    .slice(0, 3)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function splitName(name: string): { first: string; rest: string } {
  const idx = name.indexOf(" ");
  if (idx === -1) return { first: name, rest: "" };
  return { first: name.slice(0, idx), rest: name.slice(idx + 1) };
}

function getSpecialty(b: BrandSummary): string {
  const parts: string[] = [];
  if (b.hasControlTower) parts.push("Control Towers");
  if (b.hasTerpSlurper) parts.push("Terp Slurpers");
  if (b.hasDunkingStation) parts.push("Dunking Stations");
  if (parts.length === 0) return "Accessories";
  return parts.join(", ");
}

function getOrigin(b: BrandSummary): string {
  return b.tier === "usmade" ? "US-Made" : "Import";
}

function getCity(b: BrandSummary): string {
  return b.tier === "usmade" ? "United States" : "Imported";
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function BrandsPage() {
  const brands = getBrandSummaries();

  // Pick spotlight: first US-made brand with products, else first overall
  const spotlight =
    brands.find((b) => b.tier === "usmade" && b.productCount > 0) ??
    brands[0] ??
    null;

  // Group alphabetically
  const grouped = new Map<string, BrandSummary[]>();
  const sorted = [...brands].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
  for (const b of sorted) {
    const letter = b.name[0].toUpperCase();
    if (!grouped.has(letter)) grouped.set(letter, []);
    grouped.get(letter)!.push(b);
  }

  const activeLetters = new Set(grouped.keys());

  return (
    <>
      {/* Crumbs */}
      <nav
        className="crumbs"
        aria-label="Breadcrumb"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "22px 0 14px",
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--color-muted)",
          fontWeight: 500,
        }}
      >
        <Link href="/" style={{ color: "var(--color-muted)", transition: "color .2s" }}>
          Home
        </Link>
        <span style={{ color: "var(--color-dim)" }}>/</span>
        <b style={{ color: "var(--color-gold-light)", fontWeight: 600 }}>Brands</b>
      </nav>

      {/* Page head */}
      <section
        style={{
          padding: "36px 0 56px",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 56,
          alignItems: "end",
          borderBottom: "1px solid var(--color-line)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(64px, 9vw, 156px)",
            fontWeight: 500,
            letterSpacing: "-0.045em",
            lineHeight: 0.92,
            margin: 0,
          }}
        >
          The{" "}
          <em
            style={{
              fontWeight: 400,
              fontStyle: "italic",
              background: "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            makers.
          </em>
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            color: "var(--color-muted)",
            maxWidth: "42ch",
            lineHeight: 1.6,
            paddingBottom: 12,
          }}
        >
          Independent shops, US benches, and the imports we trust. Every brand here
          has been vetted on the bench — we don&apos;t carry anyone we wouldn&apos;t smoke
          from ourselves.
        </p>
      </section>

      {/* Spotlight */}
      {spotlight && (
        <SpotlightSection brand={spotlight} />
      )}

      {/* Jump bar */}
      <nav
        aria-label="Jump to letter"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          padding: "32px 36px 22px",
          borderBottom: "1px solid var(--color-line)",
          fontFamily: "var(--font-sans)",
          position: "sticky",
          top: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.6))",
          backdropFilter: "blur(16px)",
          zIndex: 10,
          marginLeft: -36,
          marginRight: -36,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginRight: 4,
          }}
        >
          Jump
        </span>
        {ALPHABET.map((letter) => {
          const has = activeLetters.has(letter);
          return (
            <a
              key={letter}
              href={has ? `#${letter}` : undefined}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                fontSize: 11,
                fontWeight: 600,
                color: has ? "var(--color-fg)" : "var(--color-muted)",
                border: has ? "1px solid var(--color-line)" : "1px solid transparent",
                transition: "all .2s",
                cursor: has ? "pointer" : "default",
                textDecoration: "none",
              }}
            >
              {letter}
            </a>
          );
        })}
        {/* Filter toggle — visual links only, no client filter */}
        <div
          style={{
            marginLeft: "auto",
            display: "inline-flex",
            gap: 4,
            padding: 3,
            borderRadius: 999,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--color-line)",
          }}
        >
          {(
            [
              { label: "All", href: "/brands" },
              { label: "US-Made", href: "/brands?tier=usmade" },
              { label: "Imported", href: "/brands?tier=import" },
            ] as const
          ).map(({ label, href }, i) => (
            <Link
              key={label}
              href={href}
              style={{
                padding: "7px 14px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: i === 0 ? 600 : 500,
                letterSpacing: "0.06em",
                color: i === 0 ? "#000" : "var(--color-muted)",
                background:
                  i === 0
                    ? "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))"
                    : "transparent",
                transition: "all .2s",
                textDecoration: "none",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Alphabetical groups */}
      {ALPHABET.filter((l) => grouped.has(l)).map((letter) => {
        const group = grouped.get(letter)!;
        const first = group[0].name;
        const last = group[group.length - 1].name;
        const range = group.length > 1 ? `${first} — ${last}` : first;
        return (
          <section
            key={letter}
            id={letter}
            style={{ paddingTop: 56 }}
          >
            {/* Letter head */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 24,
                paddingBottom: 20,
                marginBottom: 28,
                borderBottom: "1px solid var(--color-line)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(60px, 7vw, 96px)",
                  fontWeight: 500,
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  background:
                    "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  margin: 0,
                }}
              >
                {letter}
              </h3>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                }}
              >
                {range}
              </span>
            </div>

            {/* Cards grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
              }}
            >
              {group.map((b) => (
                <BrandCard key={b.slug} brand={b} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Bottom spacer */}
      <div style={{ height: 96 }} />
    </>
  );
}

function SpotlightSection({ brand }: { brand: BrandSummary }) {
  const { first, rest } = splitName(brand.name);
  const initials = makeInitials(brand.name);
  const specialty = getSpecialty(brand);
  const origin = getOrigin(brand);
  const city = getCity(brand);

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 56,
        padding: "64px 0",
        alignItems: "center",
        borderBottom: "1px solid var(--color-line)",
      }}
    >
      {/* Left: image stage */}
      <div
        style={{
          position: "relative",
          aspectRatio: "5/4",
          borderRadius: 28,
          background:
            "radial-gradient(120% 100% at 50% 8%, rgba(255,255,255,0.07), rgba(255,255,255,0.015) 55%, transparent 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          overflow: "hidden",
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7)",
        }}
      >
        {/* Violet glow halo */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: "-10% -20%",
            aspectRatio: "1",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, var(--color-c-violet), transparent 65%)",
            filter: "blur(80px)",
            opacity: 0.5,
            pointerEvents: "none",
          }}
        />
        {/* Initials watermark */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "clamp(80px, 12vw, 160px)",
            fontWeight: 500,
            background:
              "linear-gradient(180deg, rgba(232,184,90,0.18), rgba(232,184,90,0.06))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.04em",
            userSelect: "none",
          }}
        >
          {initials}
        </span>
      </div>

      {/* Right: copy */}
      <div>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--color-gold-light)",
            display: "inline-flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 32,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, var(--color-line-gold-2))",
              alignSelf: "center",
            }}
          />
          Maker of the moment
        </span>

        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(44px, 5.4vw, 72px)",
            fontWeight: 500,
            letterSpacing: "-0.034em",
            lineHeight: 1.0,
            marginTop: 24,
            margin: "24px 0 0",
          }}
        >
          {first}{" "}
          {rest && (
            <em
              style={{
                fontStyle: "italic",
                background:
                  "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {rest}.
            </em>
          )}
          {!rest && "."}
        </h2>

        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            color: "var(--color-muted)",
            lineHeight: 1.65,
            marginTop: 22,
            maxWidth: "46ch",
          }}
        >
          {origin} maker on the bench.{" "}
          {brand.productCount} piece{brand.productCount === 1 ? "" : "s"},{" "}
          {brand.accessoryCount > 0
            ? `${brand.accessoryCount} accessor${brand.accessoryCount === 1 ? "y" : "ies"} on file.`
            : "catalogued and verified."}
        </p>

        <div
          style={{
            display: "flex",
            gap: 28,
            marginTop: 28,
            flexWrap: "wrap",
          }}
        >
          {[
            { lbl: "City", val: city },
            { lbl: "Origin", val: origin },
            { lbl: "Specialty", val: specialty },
          ].map(({ lbl, val }) => (
            <div key={lbl} style={{ fontFamily: "var(--font-sans)", fontSize: 11 }}>
              <span
                style={{
                  color: "var(--color-dim)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  display: "block",
                }}
              >
                {lbl}
              </span>
              <span
                style={{
                  display: "block",
                  color: "var(--color-fg)",
                  marginTop: 4,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                }}
              >
                {val}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 32,
            flexWrap: "wrap",
          }}
        >
          <Link
            href={`/brands/${brand.slug}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 22px",
              borderRadius: 999,
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: "#000",
              background:
                "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))",
              border: "1px solid rgba(255,255,255,0.4)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
              textDecoration: "none",
              transition: "transform .3s",
            }}
          >
            View the bench →
          </Link>
          <a
            href="#"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 22px",
              borderRadius: 999,
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: "var(--color-fg)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--color-line)",
              textDecoration: "none",
            }}
          >
            Read the interview
          </a>
        </div>
      </div>
    </section>
  );
}
