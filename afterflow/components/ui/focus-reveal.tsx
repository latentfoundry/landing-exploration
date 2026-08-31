"use client";

import { useLayoutEffect } from "react";

const REVEAL_SELECTOR = "[data-reveal]";
const OBSERVER_THRESHOLDS = [0, 0.12, 0.24, 0.36, 0.5];

function readNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Applies the page's once-only focus choreography without changing semantic markup.
 * Content is visible by default; the prepared state is enabled only after hydration.
 */
export function FocusRevealController() {
  useLayoutEffect(() => {
    const root = document.getElementById("main-content");
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const settleTimers = new Map<HTMLElement, number>();

    if (reduceMotion) {
      targets.forEach((target) => target.classList.add("is-revealed", "reveal-settled"));
      return () => {
        targets.forEach((target) => target.classList.remove("is-revealed", "reveal-settled"));
      };
    }

    const reveal = (target: HTMLElement) => {
      if (target.classList.contains("is-revealed")) return;
      target.classList.add("is-revealed");
      const delay = Math.min(Math.max(readNumber(target.dataset.revealDelay, 0), 0), 500);
      const duration = Math.min(
        Math.max(readNumber(target.dataset.revealDuration, 1000), 400),
        1800,
      );
      const timer = window.setTimeout(() => {
        target.classList.add("reveal-settled");
        settleTimers.delete(target);
      }, delay + duration + 120);
      settleTimers.set(target, timer);
    };

    const revealFocusedTarget = (event: FocusEvent) => {
      const focused = event.target;
      if (!(focused instanceof Element)) return;
      const target = focused.closest<HTMLElement>(REVEAL_SELECTOR);
      if (!target || !root.contains(target)) return;
      observer.unobserve(target);
      reveal(target);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const threshold = Math.min(
            Math.max(readNumber(target.dataset.revealThreshold, 0.24), 0),
            0.5,
          );

          if (!entry.isIntersecting || entry.intersectionRatio < threshold) return;
          reveal(target);
          observer.unobserve(target);
        });
      },
      {
        rootMargin: "0px",
        threshold: OBSERVER_THRESHOLDS,
      },
    );

    targets.forEach((target) => {
      const delay = Math.min(Math.max(readNumber(target.dataset.revealDelay, 0), 0), 500);
      const duration = Math.min(
        Math.max(readNumber(target.dataset.revealDuration, 1000), 400),
        1800,
      );
      target.style.setProperty("--reveal-delay", `${delay}ms`);
      target.style.setProperty("--reveal-duration", `${duration}ms`);
      target.classList.add("reveal-ready");
      observer.observe(target);
    });
    root.addEventListener("focusin", revealFocusedTarget);

    return () => {
      observer.disconnect();
      root.removeEventListener("focusin", revealFocusedTarget);
      settleTimers.forEach((timer) => window.clearTimeout(timer));
      targets.forEach((target) => {
        target.classList.remove("reveal-ready", "is-revealed", "reveal-settled");
        target.style.removeProperty("--reveal-delay");
        target.style.removeProperty("--reveal-duration");
      });
    };
  }, []);

  return null;
}

export default FocusRevealController;
