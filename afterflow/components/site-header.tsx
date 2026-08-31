"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateScrolledState = () => setScrolled(window.scrollY > 24);
    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolledState);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const handleBreakpoint = () => {
      if (!media.matches) setMobileOpen(false);
    };

    media.addEventListener("change", handleBreakpoint);
    return () => media.removeEventListener("change", handleBreakpoint);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setMobileOpen(false);
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !mobileNavRef.current?.contains(target)) setMobileOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [mobileOpen]);

  const closeMobileNavigation = () => {
    setMobileOpen(false);
  };

  return (
    <header className={scrolled ? "site-header is-scrolled" : "site-header"}>
      <div className="shell site-header__inner">
        <Link className="brand-lockup" href="/#top" aria-label="Afterflow home">
          <span className="brand-mark">
            <Image src="/logo.png" alt="" width={24} height={24} priority />
          </span>
          <span>Afterflow</span>
        </Link>

        <nav className="site-nav" aria-label="Primary navigation">
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#why-afterflow">Why Afterflow</Link>
          <Link href="/#features">Features</Link>
          <Link href="/insights">Insights</Link>
        </nav>

        <a
          className="header-cta"
          href="https://calendly.com/mika-afterflow/afterflow-intro"
          target="_blank"
          rel="noreferrer"
        >
          Book a simulation
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5 15 15 5M7 5h8v8" />
          </svg>
        </a>

        <div className={mobileOpen ? "mobile-nav is-open" : "mobile-nav"} ref={mobileNavRef}>
          <button
            className="mobile-nav__trigger"
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen((open) => !open)}
            ref={triggerRef}
          >
            <span />
            <span />
          </button>
          {mobileOpen ? (
            <nav id="mobile-navigation" aria-label="Mobile navigation">
              <Link href="/#how-it-works" onClick={closeMobileNavigation}>
                How it works
              </Link>
              <Link href="/#why-afterflow" onClick={closeMobileNavigation}>Why Afterflow</Link>
              <Link href="/#features" onClick={closeMobileNavigation}>Features</Link>
              <Link href="/insights" onClick={closeMobileNavigation}>Insights</Link>
              <a
                href="https://calendly.com/mika-afterflow/afterflow-intro"
                target="_blank"
                rel="noreferrer"
                onClick={closeMobileNavigation}
              >
                Book a simulation
              </a>
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  );
}
