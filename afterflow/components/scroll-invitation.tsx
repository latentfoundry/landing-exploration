"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollInvitation() {
  const link = useRef<HTMLAnchorElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = link.current;
    if (!element) return;
    let visible = false;
    const update = () => setActive(visible && document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <a ref={link} className="scroll-invitation" data-active={active} href="#introduction" aria-label="Explore how Afterflow works">
      <svg viewBox="0 0 24 48" fill="none" aria-hidden="true"><path d="M12 1v44M4 37l8 8 8-8" /></svg>
    </a>
  );
}
