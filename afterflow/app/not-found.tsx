import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import AnimatedButton from "@/components/ui/animated-button";
import { ArrowUpRight } from "@/components/ui/arrow-up-right";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <a className="skip-link" href="#not-found-content">Skip to content</a>
      <SiteHeader />
      <main className="not-found-page shell" id="not-found-content" data-header-stick>
        <div>
          <h1>Page not found.</h1>
          <p>This page may have moved, or the link may be incorrect.</p>
          <AnimatedButton as="a" href="/">Back to home <ArrowUpRight /></AnimatedButton>
        </div>
      </main>
      <SiteFooter topHref="#not-found-content" />
    </>
  );
}
