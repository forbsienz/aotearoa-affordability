import { SiteFooter, SiteHeader } from "@/components/layout/SiteChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SHELL_CLASS,
  SITE_TAGLINE,
  absoluteUrl,
  getSiteUrl,
} from "@/lib/site";
import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "New Zealand cost of living",
    "NZ wages by city",
    "rent vs wages New Zealand",
    "Territorial Authority affordability",
    "Stats NZ open data",
  ],
  openGraph: {
    type: "website",
    locale: "en_NZ",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: absoluteUrl("/"),
  inLanguage: "en-NZ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NZ" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body>
        <JsonLd data={websiteJsonLd} />
        <SiteHeader />
        <main className={`${SITE_SHELL_CLASS} min-h-screen py-6 sm:py-8`}>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
