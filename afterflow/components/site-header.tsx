"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const navigationItems = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#why-afterflow", label: "Why Afterflow" },
  { href: "/#features", label: "Features" },
  { href: "/insights", label: "Insights" },
] as const;

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 15 15 5M7 5h8v8" />
    </svg>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
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

    const panel = mobilePanelRef.current;
    const backgroundElements = Array.from(
      document.querySelectorAll<HTMLElement>("main, .site-footer, .skip-link, .brand-lockup"),
    );
    const previousInertStates = backgroundElements.map((element) => element.inert);

    document.documentElement.classList.add("has-mobile-navigation-open");
    backgroundElements.forEach((element) => {
      element.inert = true;
    });

    const focusFrame = window.requestAnimationFrame(() => {
      panel?.querySelector<HTMLElement>("a[href]")?.focus({ preventScroll: true });
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        triggerRef.current?.focus({ preventScroll: true });
        setMobileOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = [
        triggerRef.current,
        ...Array.from(panel?.querySelectorAll<HTMLElement>("a[href]") ?? []),
      ].filter((element): element is HTMLElement => element !== null);

      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
      document.documentElement.classList.remove("has-mobile-navigation-open");
      backgroundElements.forEach((element, index) => {
        element.inert = previousInertStates[index];
      });
    };
  }, [mobileOpen]);

  const closeMobileNavigation = () => {
    triggerRef.current?.focus({ preventScroll: true });
    setMobileOpen(false);
  };

  return (
    <header
      className={`site-header${scrolled ? " is-scrolled" : ""}${mobileOpen ? " is-menu-open" : ""}`}
    >
      <div className="shell site-header__inner">
        <Link className="brand-lockup" href="/#top" aria-label="Afterflow home">
          <span className="brand-mark">
            <Image src="/logo.png" alt="" width={24} height={24} priority />
          </span>
          <span>Afterflow</span>
        </Link>

        <nav className="site-nav" aria-label="Primary navigation">
          {navigationItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          className="header-cta"
          href="https://calendly.com/mika-afterflow/afterflow-intro"
          target="_blank"
          rel="noreferrer"
        >
          Book a simulation
          <ArrowUpRight />
        </a>

        <div className={mobileOpen ? "mobile-nav is-open" : "mobile-nav"}>
          <button
            className="mobile-nav__trigger"
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => (mobileOpen ? closeMobileNavigation() : setMobileOpen(true))}
            ref={triggerRef}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={mobileOpen ? "mobile-nav__panel is-open" : "mobile-nav__panel"}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
        data-lenis-prevent=""
        ref={mobilePanelRef}
      >
        <div className="mobile-nav__world" aria-hidden="true">
          <Image
            src="/afterflow-decision-ridge.png"
            alt=""
            fill
            quality={70}
            sizes="(max-width: 900px) 100vw, 1px"
          />
        </div>
        <div className="mobile-nav__shade" aria-hidden="true" />
        <div className="mobile-nav__sweep" aria-hidden="true" />

        <div className="mobile-nav__content">
          <nav className="mobile-nav__links" aria-label="Primary navigation">
            {navigationItems.map((item) => (
              <Link href={item.href} onClick={closeMobileNavigation} key={item.href}>
                <span>{item.label}</span>
                <ArrowUpRight />
              </Link>
            ))}
          </nav>

          <a
            className="mobile-nav__cta"
            href="https://calendly.com/mika-afterflow/afterflow-intro"
            target="_blank"
            rel="noreferrer"
            onClick={closeMobileNavigation}
          >
            Book a simulation
            <ArrowUpRight />
          </a>
        </div>
      </div>
    </header>
  );
}
