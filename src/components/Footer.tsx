import Link from "next/link";

const SHOP_LINKS = [
  { label: "Control Towers", href: "/shop?category=control_tower" },
  { label: "Terp Slurpers", href: "/shop?category=terp_slurper" },
  { label: "Dunking Stations", href: "/shop?category=dunking_station" },
  { label: "Pearls & Inserts", href: "/shop" },
  { label: "Tools", href: "/shop" },
];

const BRAND_LINKS = [
  { label: "Joel Halen", href: "/brands/joel-halen" },
  { label: "710 Coils", href: "/brands" },
  { label: "AFM Glass", href: "/brands" },
  { label: "GeeWest", href: "/brands" },
  { label: "All brands", href: "/brands", strong: true as const },
];

const DISCOVER_LINKS: { label: string; href: string; external?: boolean }[] = [
  { label: "New arrivals", href: "/shop?sort=new" },
  { label: "The Journal", href: "#", external: true },
  { label: "Glossary", href: "/glossary" },
  { label: "Care & cleaning", href: "#", external: true },
  { label: "Contact", href: "#", external: true },
];

const ACCOUNT_LINKS: { label: string; href: string; external?: boolean }[] = [
  { label: "Sign in", href: "#", external: true },
  { label: "Create account", href: "#", external: true },
  { label: "Order status", href: "#", external: true },
  { label: "Wishlist", href: "/wishlist" },
];

const LEGAL_LINKS = ["Privacy", "Terms", "Accessibility", "Do not sell my info"];

function FootLink({
  href,
  external,
  strong,
  children,
}: {
  href: string;
  external?: boolean;
  strong?: boolean;
  children: React.ReactNode;
}) {
  const cls = `foot-link focus-ring${strong ? " foot-link-strong" : ""}`;
  return external ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="pp-footer">
      <div className="foot-grid">
        {/* Col 1: Brand */}
        <div className="foot-brand">
          <Link href="/" aria-label="Pillar and Pearl, home" className="focus-ring foot-mark">
            <svg className="pp-mark pp-mark-md" aria-hidden="true">
              <use href="#pp" />
            </svg>
            <span className="foot-wordmark">
              Pillar
              <span className="foot-amp">&amp;</span>
              Pearl
            </span>
          </Link>

          <p className="foot-tagline">
            Quartz, banger sets, and dab tools for people who care about how
            their oil tastes.
          </p>

          <span className="age-pill">21+ ONLY</span>
        </div>

        {/* Col 2: Shop */}
        <div>
          <h4 className="foot-heading">Shop</h4>
          <ul className="foot-list">
            {SHOP_LINKS.map((item) => (
              <li key={item.label}>
                <FootLink href={item.href}>{item.label}</FootLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Brands */}
        <div>
          <h4 className="foot-heading">Brands</h4>
          <ul className="foot-list">
            {BRAND_LINKS.map((item) => (
              <li key={item.label}>
                <FootLink href={item.href} strong={item.strong}>
                  {item.label}
                </FootLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Discover */}
        <div>
          <h4 className="foot-heading">Discover</h4>
          <ul className="foot-list">
            {DISCOVER_LINKS.map((item) => (
              <li key={item.label}>
                <FootLink href={item.href} external={item.external}>
                  {item.label}
                </FootLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 5: Account */}
        <div>
          <h4 className="foot-heading">Account</h4>
          <ul className="foot-list">
            {ACCOUNT_LINKS.map((item) => (
              <li key={item.label}>
                <FootLink href={item.href} external={item.external}>
                  {item.label}
                </FootLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="foot-bottom">
        <span>© {year} Pillar &amp; Pearl</span>
        <ul className="foot-legal">
          {LEGAL_LINKS.map((label) => (
            <li key={label}>
              <a href="#" className="foot-legal-link focus-ring">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .pp-footer {
          border-top: 1px solid var(--color-line);
          padding-top: 56px;
          padding-bottom: 40px;
          margin-top: 96px;
          font-family: var(--font-sans);
        }
        .foot-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr 1fr;
          gap: 40px 32px;
        }
        .foot-brand { display: flex; flex-direction: column; gap: 16px; }
        .foot-mark {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          width: fit-content;
        }
        .foot-wordmark {
          font-family: var(--font-serif);
          font-size: 20px;
          font-weight: 500;
          letter-spacing: -0.02em;
          color: var(--color-fg);
          line-height: 1;
        }
        .foot-amp {
          font-style: italic;
          font-weight: 400;
          color: var(--color-gold-light);
          font-size: 22px;
          margin: 0 0.07em;
        }
        .foot-tagline {
          font-size: 13px;
          color: var(--color-muted);
          line-height: 1.6;
          max-width: 260px;
        }
        .foot-heading {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--color-gold-light);
          margin-bottom: 16px;
        }
        .foot-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .foot-link {
          font-size: 13px;
          color: var(--color-muted);
          transition: color 150ms ease;
        }
        .foot-link:hover { color: var(--color-fg); }
        .foot-link-strong { color: var(--color-gold); }
        .foot-link-strong:hover { color: var(--color-gold-light); }
        .foot-bottom {
          margin-top: 48px;
          padding-top: 20px;
          border-top: 1px solid var(--color-line);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 11px;
          color: var(--color-dim);
          letter-spacing: 0.04em;
        }
        .foot-legal {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .foot-legal-link {
          color: var(--color-dim);
          transition: color 150ms ease;
        }
        .foot-legal-link:hover { color: var(--color-muted); }
        @media (max-width: 1024px) {
          .foot-grid {
            grid-template-columns: 1fr 1fr 1fr 1fr;
          }
          .foot-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 640px) {
          .foot-grid {
            grid-template-columns: 1fr 1fr;
          }
          .foot-brand { grid-column: 1 / -1; }
        }
      `}</style>
    </footer>
  );
}
