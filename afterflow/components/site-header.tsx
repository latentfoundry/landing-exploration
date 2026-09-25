"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const MOBILE_NAV_CLOSE_DURATION = 200;

const navigationItems = [
  { href: "/#product", label: "Product" },
  { href: "/insights/", label: "Research" },
  { href: "/#company", label: "Company" },
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
  const [mobileClosing, setMobileClosing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const mobileVisible = mobileOpen || mobileClosing;

  const closeMobileNavigation = useCallback(() => {
    triggerRef.current?.focus({ preventScroll: true });

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setMobileOpen(false);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMobileClosing(false);
      return;
    }

    setMobileClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setMobileClosing(false);
      closeTimerRef.current = null;
    }, MOBILE_NAV_CLOSE_DURATION);
  }, []);

  const openMobileNavigation = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setMobileClosing(false);
    setMobileOpen(true);
  };

  useEffect(() => {
    const updateScrolledState = () => setScrolled(window.scrollY > 24);
    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolledState);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const handleBreakpoint = () => {
      if (media.matches) return;

      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }

      setMobileOpen(false);
      setMobileClosing(false);
    };

    media.addEventListener("change", handleBreakpoint);
    return () => media.removeEventListener("change", handleBreakpoint);
  }, []);

  useEffect(() => {
    if (!mobileVisible) return;

    const backgroundElements = Array.from(
      document.querySelectorAll<HTMLElement>("main, .site-footer, .skip-link, .brand-lockup"),
    );
    const previousInertStates = backgroundElements.map((element) => element.inert);

    document.documentElement.classList.add("has-mobile-navigation-open");
    backgroundElements.forEach((element) => {
      element.inert = true;
    });

    return () => {
      document.documentElement.classList.remove("has-mobile-navigation-open");
      backgroundElements.forEach((element, index) => {
        element.inert = previousInertStates[index];
      });
    };
  }, [mobileVisible]);

  useEffect(() => {
    if (!mobileOpen) return;

    const panel = mobilePanelRef.current;

    const focusFrame = window.requestAnimationFrame(() => {
      panel?.querySelector<HTMLElement>("a[href]")?.focus({ preventScroll: true });
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileNavigation();
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
    };
  }, [closeMobileNavigation, mobileOpen]);

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    },
    [],
  );

  return (
    <header
      className={`site-header${scrolled ? " is-scrolled" : ""}${mobileVisible ? " is-menu-open" : ""}`}
    >
      <div className="shell site-header__inner">
        <Link className="brand-lockup" data-arrive="brand" href="/#top" aria-label="Afterflow home">
          <span className="brand-mark"><Image src="/brand-mark.svg" alt="" width={29} height={25} priority /></span>
          <span>Afterflow</span>
        </Link>

        <nav className="site-nav" data-arrive="navigation" aria-label="Primary navigation">
          {navigationItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          className="header-cta"
          data-arrive="navigation"
          href="https://calendly.com/mika-afterflow/afterflow-intro"
          target="_blank"
          rel="noreferrer"
        >
          Book a demo
          <ArrowUpRight />
        </a>

        <div className={mobileOpen ? "mobile-nav is-open" : "mobile-nav"}>
          <button
            className="mobile-nav__trigger"
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => (mobileOpen ? closeMobileNavigation() : openMobileNavigation())}
            ref={triggerRef}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={`mobile-nav__panel${mobileOpen ? " is-open" : ""}${mobileClosing ? " is-closing" : ""}`}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
        data-lenis-prevent=""
        ref={mobilePanelRef}
      >
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
            Book a demo
            <ArrowUpRight />
          </a>
        </div>
      </div>
    </header>
  );
}
