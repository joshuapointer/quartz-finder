import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";
import IconSprite from "@/components/IconSprite";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Pillar & Pearl — Quartz, banger sets, and dab tools.",
    template: "%s · Pillar & Pearl",
  },
  description:
    "Quartz, banger sets, and dab tools for people who care about how their oil tastes. An editorial atlas of independent makers, compared across vendors and updated nightly.",
  keywords: [
    "quartz banger",
    "terp slurper",
    "control tower",
    "dab",
    "low temp",
    "concentrate",
    "rosin",
    "pillar and pearl",
  ],
  openGraph: {
    type: "website",
    title: "Pillar & Pearl — Quartz, banger sets, and dab tools.",
    description:
      "Quartz, banger sets, and dab tools for people who care about how their oil tastes.",
    siteName: "Pillar & Pearl",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f%5B%5D=boska@400,500,600,700,900,400i,500i,700i&f%5B%5D=switzer@400,500,600,700&display=swap"
        />
      </head>
      <body>
        <AgeGate />
        <div className="pp-bg" aria-hidden="true" />
        <IconSprite />
        <div className="pp-shell flex min-h-screen flex-col">
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Script
          id="reveal-observer"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        if (window.scrollY > 24) {
          document.documentElement.setAttribute('data-scrolled', '');
        } else {
          document.documentElement.removeAttribute('data-scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '-40px 0px' }
  );

  function observeReveal() {
    document.querySelectorAll('.reveal').forEach(function(el) {
      observer.observe(el);
    });
  }

  observeReveal();
  var mo = new MutationObserver(observeReveal);
  mo.observe(document.body, { childList: true, subtree: true });
})();`,
          }}
        />
      </body>
    </html>
  );
}
