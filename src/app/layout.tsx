import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display-loaded",
});

const sans = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans-loaded",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono-loaded",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Pillar & Pearl — The Quartz Index",
    template: "%s · Pillar & Pearl",
  },
  description:
    "An aggregate marketplace for high-end quartz cannabis accessories — bangers, slurpers, pearls, and rigs from forty-two lapidaries, indexed nightly against eighteen authorized vendors.",
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
    title: "Pillar & Pearl — The Quartz Index",
    description:
      "Aggregate marketplace for high-end quartz — bangers, slurpers, pearls, rigs.",
    siteName: "Pillar & Pearl",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#06070A",
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
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
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
