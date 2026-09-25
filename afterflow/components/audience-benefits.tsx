"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";

// Buyer benefits, not claims about delivered customer projects.
const audiences = [
  { role: "COOs & Operations", benefit: "For mid-market teams with a high-volume workflow to improve. Start with one focused deployment and measure the result." },
  { role: "Customer Support", benefit: "Help teams find answers in internal knowledge. Improve a support workflow and track resolution time." },
  { role: "Service Operations", benefit: "Target slow document handling and case processing. Compare turnaround time before and after rollout." },
  { role: "Risk & Governance", benefit: "Build controls into the workflow. Agree on data access, human review and approvals before production." },
  { role: "Fintech & Banking", benefit: "Streamline onboarding documents and service cases. Connect internal knowledge with clear human review controls." },
] as const;
const cycleDelay = 6000;
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const audienceIndex = (position: number) => (position % audiences.length + audiences.length) % audiences.length;

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}
const getReducedMotion = () => window.matchMedia(reducedMotionQuery).matches;
const getDocumentVisible = () => document.visibilityState === "visible";
const getServerReducedMotion = () => true;
const getServerVisible = () => false;

export function AudienceBenefits() {
  const [motion, setMotion] = useState({ position: 0, first: -1, last: 1, announcement: "" });
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getServerReducedMotion);
  const documentVisible = useSyncExternalStore(subscribeVisibility, getDocumentVisible, getServerVisible);
  const carousel = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const instructionsId = useId();
  const selected = audienceIndex(motion.position);
  const playing = !reducedMotion && inView && documentVisible && !hovered && !focused && !touching;

  const select = useCallback((offset: number, manual = true) => {
    setMotion(current => {
      const position = current.position + offset;
      const index = audienceIndex(position);
      const audience = audiences[index];
      return {
        position,
        // Keep the whole travelling strip until it settles, including rapid reversals.
        first: reducedMotion ? position - 1 : Math.min(current.first, position - 1),
        last: reducedMotion ? position + 1 : Math.max(current.last, position + 1),
        announcement: manual ? `${index + 1} of ${audiences.length}. ${audience.role}. ${audience.benefit}` : current.announcement,
      };
    });
  }, [reducedMotion]);

  useEffect(() => {
    const element = carousel.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting && entry.intersectionRatio >= 0.35);
    }, { threshold: [0, 0.35] });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    // Every selection or pause gets a fresh, silent six-second interval.
    const timer = window.setTimeout(() => select(1, false), cycleDelay);
    return () => window.clearTimeout(timer);
  }, [playing, motion.position, select]);

  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      select(event.key === "ArrowRight" ? 1 : -1);
    }
  }

  return (
    <div
      ref={carousel}
      className="audience-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Who Afterflow is for"
      aria-describedby={instructionsId}
      data-playing={playing}
      onKeyDown={navigate}
      onPointerEnter={event => { if (event.pointerType !== "touch") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    >
      <div
        className="audience-slide"
        onTouchStart={event => {
          touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
          setTouching(true);
        }}
        onTouchEnd={event => {
          if (touch.current) {
            const dx = event.changedTouches[0].clientX - touch.current.x;
            const dy = event.changedTouches[0].clientY - touch.current.y;
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) select(dx < 0 ? 1 : -1);
          }
          touch.current = null;
          setTouching(false);
        }}
        onTouchCancel={() => { touch.current = null; setTouching(false); }}
      >
        <div className="audience-slide-size" aria-hidden="true">
          {audiences.map(audience => <div key={audience.role}>
            <h3>{audience.role}</h3><p>{audience.benefit}</p>
          </div>)}
        </div>
        <div
          className="audience-track"
          style={{ transform: `translateX(${-motion.position * 100}%)` }}
          onTransitionEnd={event => {
            if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
            setMotion(current => ({ ...current, first: current.position - 1, last: current.position + 1 }));
          }}
        >
          {Array.from({ length: motion.last - motion.first + 1 }, (_, offset) => {
            const position = motion.first + offset;
            const index = audienceIndex(position);
            const audience = audiences[index];
            return <div
              key={position}
              className="audience-slide-copy"
              style={{ transform: `translateX(${position * 100}%)` }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${audiences.length}`}
              aria-hidden={position !== motion.position}
            >
              <h3>{audience.role}</h3><p>{audience.benefit}</p>
            </div>;
          })}
        </div>
      </div>
      <p id={instructionsId} className="sr-only">Use the previous and next buttons, arrow keys, or swipe to explore. Automatic cycling pauses while you hover, focus, or touch this section.</p>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{motion.announcement}</p>
      <div className="audience-controls">
        <span aria-hidden="true">{String(selected + 1).padStart(2, "0")} <span>/ {String(audiences.length).padStart(2, "0")}</span></span>
        <div>
          <button type="button" aria-label="Previous audience" onClick={() => select(-1)}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12H4m6-6-6 6 6 6" /></svg>
          </button>
          <button type="button" aria-label="Next audience" onClick={() => select(1)}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
