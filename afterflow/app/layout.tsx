import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { absoluteUrl, serializeJsonLd, siteConfig, siteUrl } from "@/lib/site";

const tiempos = localFont({
  src: [
    {
      path: "../assets/fonts/TestTiemposHeadline-Light-BF66457a50df5a0.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/TestTiemposHeadline-LightItalic-BF66457a5088153.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../assets/fonts/TestTiemposHeadline-Regular-BF66457a508e31a.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/TestTiemposHeadline-RegularItalic-BF66457a5091d70.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/fonts/TestTiemposHeadline-Medium-BF66457a509b4ec.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/TestTiemposHeadline-MediumItalic-BF66457a50b4260.otf",
      weight: "500",
      style: "italic",
    },
  ],
  variable: "--font-tiempos",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  // Let the browser request the faces each page actually uses.
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
  themeColor: "#f9f9f9",
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
    <html lang="en" className={tiempos.variable}>
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
