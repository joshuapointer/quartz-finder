import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display-loaded",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans-loaded",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Pillar & Pearl — A Boutique Quartz Atlas",
    template: "%s · Pillar & Pearl",
  },
  description:
    "Pillar & Pearl is a curated atlas of quartz bangers, terp slurpers, control towers, and dunking stations from the most respected glass artists in dab culture.",
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
    title: "Pillar & Pearl",
    description:
      "A boutique quartz atlas — control towers, terp slurpers, dunking stations.",
    siteName: "Pillar & Pearl",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0908",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <AgeGate />
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <Script
          id="reveal-observer"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Scroll: toggle data-scrolled on <html> when scrollY > 24 (rAF-throttled)
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        document.documentElement.dataset.scrolled = window.scrollY > 24 ? '' : undefined;
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

  // Reveal: IntersectionObserver toggles .is-in on .reveal elements
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

  // Observe elements already in DOM, then watch for new ones via MutationObserver
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
