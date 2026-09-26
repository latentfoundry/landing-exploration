"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore, type KeyboardEvent, type PointerEvent } from "react";
import "./audience-benefits.css";

// Buyer benefits, not claims about delivered customer projects.
const audiences = [
  { role: "COOs & Operations", benefit: "For mid-market teams with growing backlogs. Start with one workflow, reduce manual work and measure the time saved." },
  { role: "Customer Support", benefit: "Help teams find answers in internal knowledge. Improve a support workflow and track resolution time." },
  { role: "Service Operations", benefit: "Target slow document handling and case processing. Compare turnaround time before and after rollout." },
  { role: "Risk & Governance", benefit: "Build controls into the workflow. Agree on data access, human review and approvals before production." },
  { role: "Fintech & Banking", benefit: "Streamline onboarding documents and service cases. Connect internal knowledge with clear human review controls." },
] as const;
const cycleDelay = 6000;
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const audienceIndex = (position: number) => (position % audiences.length + audiences.length) % audiences.length;

type Drag = {
  pointerId: number;
  startX: number;
  startY: number;
  lastX: number;
  lastTime: number;
  velocity: number;
  width: number;
  horizontal: boolean;
};

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
  const [motion, setMotion] = useState({ position: 0, first: -2, last: 2, announcement: "" });
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getServerReducedMotion);
  const documentVisible = useSyncExternalStore(subscribeVisibility, getDocumentVisible, getServerVisible);
  const carousel = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const instructionsId = useId();
  const selected = audienceIndex(motion.position);
  const playing = !paused && !reducedMotion && inView && documentVisible && !hovered && !focused && !touching;

  const select = useCallback((offset: number, manual = true) => {
    setMotion(current => {
      const position = current.position + offset;
      const index = audienceIndex(position);
      const audience = audiences[index];
      return {
        position,
        // Keep the whole travelling strip until it settles, including rapid reversals.
        first: reducedMotion ? position - 2 : Math.min(current.first, position - 2),
        last: reducedMotion ? position + 2 : Math.max(current.last, position + 2),
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

  function finishDrag(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;

    if (!cancelled && current.horizontal) {
      const distance = event.clientX - current.startX;
      const velocity = event.timeStamp - current.lastTime < 120 ? current.velocity : 0;
      const travelled = Math.abs(distance) >= Math.min(80, current.width * 0.2);
      const flicked = Math.abs(distance) > 12 && Math.abs(velocity) > 0.45 && Math.sign(velocity) === Math.sign(distance);
      if (travelled || flicked) select(distance < 0 ? 1 : -1);
    }

    drag.current = null;
    setDragOffset(0);
    setDragging(false);
    setTouching(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return <>
    <div
      ref={carousel}
      className="audience-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Who Afterflow is for"
      aria-describedby={instructionsId}
      data-playing={playing}
      data-dragging={dragging}
      onKeyDown={navigate}
      onPointerEnter={event => { if (event.pointerType !== "touch") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    >
      <div
        className="audience-slide"
        onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0 || drag.current) return;
          drag.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            lastX: event.clientX,
            lastTime: event.timeStamp,
            velocity: 0,
            width: track.current?.getBoundingClientRect().width || event.currentTarget.clientWidth,
            horizontal: false,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
          setTouching(true);
        }}
        onPointerMove={event => {
          const current = drag.current;
          if (!current || current.pointerId !== event.pointerId) return;
          const dx = event.clientX - current.startX;
          const dy = event.clientY - current.startY;

          if (!current.horizontal) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
            if (Math.abs(dy) > Math.abs(dx)) {
              finishDrag(event, true);
              return;
            }
            current.horizontal = true;
            setDragging(true);
          }

          const elapsed = event.timeStamp - current.lastTime;
          if (elapsed > 0) current.velocity = (event.clientX - current.lastX) / elapsed;
          current.lastX = event.clientX;
          current.lastTime = event.timeStamp;
          setDragOffset(Math.max(-current.width, Math.min(current.width, dx)));
        }}
        onPointerUp={event => finishDrag(event)}
        onPointerCancel={event => finishDrag(event, true)}
        onLostPointerCapture={event => finishDrag(event, true)}
      >
        <div className="audience-slide-size" aria-hidden="true">
          {audiences.map(audience => <div className="audience-card" key={audience.role}>
            <h3>{audience.role}</h3><p>{audience.benefit}</p>
          </div>)}
        </div>
        <div
          ref={track}
          className="audience-track"
          style={{ transform: `translateX(calc(${-motion.position * 100}% + ${dragOffset}px))` }}
          onTransitionEnd={event => {
            if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
            setMotion(current => ({ ...current, first: current.position - 2, last: current.position + 2 }));
          }}
        >
          {Array.from({ length: motion.last - motion.first + 1 }, (_, offset) => {
            const position = motion.first + offset;
            const index = audienceIndex(position);
            const audience = audiences[index];
            return <div
              key={position}
              className="audience-slide-copy audience-card"
              style={{ left: `${position * 100}%` }}
              data-active={position === motion.position}
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
      <p id={instructionsId} className="sr-only">Use the previous and next buttons, arrow keys, or swipe to explore. Automatic cycling pauses while you hover, focus, or touch this section. Use the pause button to stop automatic cycling.</p>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{motion.announcement}</p>
      <div className="audience-controls">
        <div className="audience-pagination" role="group" aria-label="Choose an audience">
          {audiences.map((audience, index) => <button
            key={audience.role}
            type="button"
            aria-label={`Show ${audience.role}`}
            aria-current={index === selected ? true : undefined}
            onClick={() => {
              const forward = audienceIndex(index - selected);
              select(forward > audiences.length / 2 ? forward - audiences.length : forward);
            }}
          ><span className="audience-dot" aria-hidden="true" /></button>)}
        </div>
        <div className="audience-navigation">
          <button
            type="button"
            className="audience-playback"
            aria-label={reducedMotion ? "Automatic cycling disabled for reduced motion" : paused ? "Resume automatic cycling" : "Pause automatic cycling"}
            disabled={reducedMotion}
            onClick={() => setPaused(current => !current)}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {paused || reducedMotion ? <path d="m9 5 10 7-10 7V5Z" /> : <path d="M9 6v12M15 6v12" />}
            </svg>
          </button>
          <button type="button" aria-label="Previous audience" onClick={() => select(-1)}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12H4m6-6-6 6 6 6" /></svg>
          </button>
          <button type="button" aria-label="Next audience" onClick={() => select(1)}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    </div>
    <noscript>
      <style>{".audience-carousel { display: none !important; }"}</style>
      <div className="audience-fallback">
        {audiences.map(audience => <div className="audience-card" key={audience.role}>
          <h3>{audience.role}</h3><p>{audience.benefit}</p>
        </div>)}
      </div>
    </noscript>
  </>;
}
