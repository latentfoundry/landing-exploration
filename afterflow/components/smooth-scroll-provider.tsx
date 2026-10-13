"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

const exponentialEaseOut = (progress: number) =>
  Math.min(1, 1.001 - 2 ** (-10 * progress));

const routePath = (path: string) => path.replace(/\/$/, "") || "/";

function ScrollOnNavigation() {
  const pathname = usePathname();
  const lenis = useLenis();
  const destination = useRef<string | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement) || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const url = new URL(link.href);
      if (url.origin === location.origin && !url.hash && routePath(url.pathname) === routePath(location.pathname)) {
        destination.current = null;
        if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
        else window.scrollTo({ top: 0, behavior: "instant" });
        return;
      }
      // Only fresh page visits reset scroll. Hash links and browser history keep
      // their normal positioning, including Product and Company on the homepage.
      destination.current = url.origin === location.origin && !url.hash && routePath(url.pathname) !== routePath(location.pathname)
        ? routePath(url.pathname)
        : null;
    };
    const onPopState = () => { destination.current = null; };
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, [lenis]);

  useEffect(() => {
    if (destination.current !== routePath(pathname)) return;
    destination.current = null;
    // Run after the new route commits, resetting both the document and Lenis's
    // target so old momentum cannot pull the new page down again.
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, lenis]);

  return null;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        anchors: { duration: 0.9, easing: exponentialEaseOut },
        autoRaf: true,
        duration: 1,
        easing: exponentialEaseOut,
        respectReducedMotion: true,
        smoothWheel: true,
        stopInertiaOnNavigate: true,
        syncTouch: false,
      }}
    >
      <ScrollOnNavigation />
      {children}
    </ReactLenis>
  );
}
