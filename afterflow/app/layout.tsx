import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { absoluteUrl, serializeJsonLd, siteConfig, siteUrl } from "@/lib/site";

const solare = localFont({
  src: [
    {
      path: "../assets/fonts/SolareVF.woff2",
      weight: "200 900",
      style: "normal",
    },
    {
      path: "../assets/fonts/SolareItalicVF.woff2",
      weight: "200 900",
      style: "italic",
    },
  ],
  variable: "--font-solare",
  display: "swap",
});

const novela = localFont({
  src: [
    { path: "../assets/fonts/Novela-Regular.otf", weight: "400", style: "normal" },
    { path: "../assets/fonts/Novela-Semibold.otf", weight: "600", style: "normal" },
    { path: "../assets/fonts/Novela-RegularItalic.otf", weight: "400", style: "italic" },
  ],
  variable: "--font-novela",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteConfig.title,
    template: "%s — Afterflow",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico?v=20", sizes: "16x16 32x32 48x48" },
      { url: "/favicon/favicon-96x96.png?v=20", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.svg?v=20", sizes: "any", type: "image/svg+xml" },
    ],
    apple: [{ url: "/favicon/apple-icon-180x180.png?v=20", sizes: "180x180" }],
  },
  manifest: "/favicon/manifest.json?v=20",
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.socialTitle,
    description: siteConfig.socialDescription,
    url: "/",
    images: [siteConfig.socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.socialTitle,
    description: siteConfig.socialDescription,
    images: [siteConfig.socialImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const entityJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": absoluteUrl("/#organization"),
        name: siteConfig.name,
        legalName: siteConfig.legalName,
        url: absoluteUrl("/"),
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/favicon/android-icon-512x512.png"),
          width: 512,
          height: 512,
        },
        description: siteConfig.description,
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: absoluteUrl("/"),
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: "en",
        publisher: { "@id": absoluteUrl("/#organization") },
      },
    ],
  };

  return (
    <html lang="en" className={`${solare.variable} ${novela.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(entityJsonLd) }}
        />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
