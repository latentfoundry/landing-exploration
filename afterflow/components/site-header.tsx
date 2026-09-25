"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileClosing, setMobileClosing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
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
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const opening = document.querySelector<HTMLElement>("[data-header-stick]");
    let openingVisible = opening ? opening.getBoundingClientRect().bottom > 0 : false;
    let previousY = window.scrollY;
    let anchorY = previousY;
    let direction = 0;
    let pointerAtTop = false;
    let isHidden = headerRef.current?.classList.contains("is-hidden") ?? false;
    let frame = 0;

    const reveal = (shouldHide: boolean) => {
      if (isHidden === shouldHide) return;
      isHidden = shouldHide;
      setHidden(shouldHide);
    };

    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const nextDirection = Math.sign(y - previousY);
      if (nextDirection && nextDirection !== direction) {
        anchorY = previousY;
        direction = nextDirection;
      }
      previousY = y;
      setScrolled(y > 24);

      if (openingVisible || y <= 5 || pointerAtTop) {
        reveal(false);
      } else if (Math.abs(y - anchorY) >= 12) {
        // Beyond the opening chapter, deliberate scroll direction controls navigation.
        reveal(direction > 0);
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!hover.matches || event.pointerType !== "mouse") return;
      const revealHeight = isHidden ? 24 : (headerRef.current?.offsetHeight ?? 96);
      const atTop = event.clientY <= revealHeight;
      if (atTop === pointerAtTop) return;
      pointerAtTop = atTop;
      reveal(!openingVisible && window.scrollY > 5 && !atTop);
    };
    const onPointerLeave = () => {
      pointerAtTop = false;
      if (!openingVisible && window.scrollY > 5) reveal(true);
    };

    // Observe the actual opening section so the trigger follows its responsive height.
    const openingObserver = new IntersectionObserver(([entry]) => {
      openingVisible = entry.isIntersecting;
      reveal(!openingVisible && window.scrollY > 5 && !pointerAtTop && direction >= 0);
    });
    if (opening) openingObserver.observe(opening);
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    return () => {
      window.cancelAnimationFrame(frame);
      openingObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [pathname]);

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
      ref={headerRef}
      className={`site-header${scrolled ? " is-scrolled" : ""}${hidden ? " is-hidden" : ""}${mobileVisible ? " is-menu-open" : ""}`}
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
