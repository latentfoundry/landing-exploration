"use client";

import { useAnimationControls } from "motion/react";
import { useCallback, useLayoutEffect, useRef, useSyncExternalStore } from "react";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
export function useReducedMotionPreference() {
  return useSyncExternalStore(subscribeMotion, () => window.matchMedia(motionQuery).matches, () => true);
}

/** Enhance visible server markup; only prepare motion after hydration. */
export function useReveal(amount = 0.2, viewportInset = 0) {
  const ref = useRef<HTMLElement>(null);
  const attach = useCallback((element: HTMLElement | null) => { ref.current = element; }, []);
  const controls = useAnimationControls();

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const preference = window.matchMedia(motionQuery);
    let revealed = false;

    const finish = () => {
      revealed = true;
      controls.stop();
      controls.set("visible");
      element.classList.add("is-revealed", "is-reveal-instant");
    };
    if (preference.matches || !("IntersectionObserver" in window)) {
      finish();
      return;
    }

    element.classList.add("is-reveal-ready");
    controls.set("hidden");
    const onIntersection: IntersectionObserverCallback = entries => {
      if (revealed || !entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= amount)) return;
      revealed = true;
      element.classList.add("is-revealed");
      void controls.start("visible");
      observer.disconnect();
    };
    const createObserver = () => new IntersectionObserver(onIntersection, {
      threshold: [0, amount],
      // Pixels keep the reading zone proportional to height, including landscape.
      rootMargin: `0px 0px -${Math.round(window.innerHeight * viewportInset)}px 0px`,
    });
    let observer = createObserver();
    const onResize = () => {
      if (revealed) return;
      observer.disconnect();
      observer = createObserver();
      observer.observe(element);
    };

    // Keyboard users never wait for a focused link or control to become legible.
    const onFocus = () => { finish(); observer.disconnect(); };
    const onPreference = () => { if (preference.matches) onFocus(); };
    observer.observe(element);
    element.addEventListener("focusin", onFocus);
    preference.addEventListener("change", onPreference);
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      controls.stop();
      element.removeEventListener("focusin", onFocus);
      preference.removeEventListener("change", onPreference);
      window.removeEventListener("resize", onResize);
      element.classList.remove("is-revealed", "is-reveal-ready", "is-reveal-instant");
    };
  }, [amount, controls, viewportInset]);

  return { ref: attach, controls };
}
