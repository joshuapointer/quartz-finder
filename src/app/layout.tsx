import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
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
  themeColor: "#0b0a0f",
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
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
