"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { useReducedMotionPreference } from "@/components/motion-primitives/use-reveal";
import "./audience-benefits.css";

// Buyer benefits, not claims about delivered customer projects.
const audiences = [
  { role: "COOs & Operations", benefit: "For mid-market teams with growing backlogs. Start with one workflow, reduce manual work and measure the time saved." },
  { role: "Customer Support", benefit: "Help teams find answers in internal knowledge. Improve a support workflow and track resolution time." },
  { role: "Service Operations", benefit: "Target slow document handling and case processing. Compare turnaround time before and after rollout." },
  { role: "Risk & Governance", benefit: "Build controls into the workflow. Agree on data access, human review and approvals before production." },
  { role: "Fintech & Banking", benefit: "Streamline onboarding documents and service cases. Connect internal knowledge with clear human review controls." },
] as const;

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

export function AudienceBenefits() {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotionPreference();
  const documentVisible = useSyncExternalStore(subscribeVisibility, () => document.visibilityState === "visible", () => false);
  const carousel = useRef<HTMLDivElement>(null);
  const swiping = useRef(false);
  const instructionsId = useId();
  const playing = Boolean(api) && !paused && !reducedMotion && inView && documentVisible && !hovered && !focused && !touching;

  function announce(index: number) {
    const audience = audiences[index];
    setAnnouncement(`${index + 1} of ${audiences.length}. ${audience.role}. ${audience.benefit}`);
  }

  useEffect(() => {
    const element = carousel.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.35), { threshold: [0, 0.35] });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      const index = api.selectedScrollSnap();
      setSelected(index);
      if (swiping.current) {
        const audience = audiences[index];
        setAnnouncement(`${index + 1} of ${audiences.length}. ${audience.role}. ${audience.benefit}`);
      }
    };
    const onDown = () => { swiping.current = true; setTouching(true); };
    const onUp = () => setTouching(false);
    const onSettle = () => { swiping.current = false; };
    api.on("select", onSelect).on("reInit", onSelect).on("pointerDown", onDown).on("pointerUp", onUp).on("settle", onSettle);
    return () => {
      api.off("select", onSelect).off("reInit", onSelect).off("pointerDown", onDown).off("pointerUp", onUp).off("settle", onSettle);
    };
  }, [api]);

  useEffect(() => {
    if (!playing || !api) return;
    // A fresh silent interval after every selection or temporary pause.
    const timer = window.setTimeout(() => { swiping.current = false; api.scrollNext(); }, 6000);
    return () => window.clearTimeout(timer);
  }, [api, playing, selected]);

  function navigate(direction: number) {
    if (!api) return;
    swiping.current = false;
    if (direction > 0) api.scrollNext(reducedMotion);
    else api.scrollPrev(reducedMotion);
    announce(api.selectedScrollSnap());
  }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    navigate(event.key === "ArrowRight" ? 1 : -1);
  }

  return <>
    <Carousel ref={carousel} setApi={setApi} opts={{ loop: true, align: "center", duration: reducedMotion ? 0 : 20 }}
      className="audience-carousel" aria-label="Who Afterflow is for" aria-describedby={instructionsId}
      data-playing={playing} data-dragging={touching} tabIndex={0} onKeyDown={onKeyDown}
      onPointerEnter={event => { if (event.pointerType !== "touch") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    >
      <CarouselContent className="audience-track" viewportClassName="audience-slide">
        {audiences.map((audience, index) => <CarouselItem key={audience.role} className="audience-card"
          data-active={index === selected} aria-label={`${index + 1} of ${audiences.length}`} aria-hidden={index !== selected}>
          <h3>{audience.role}</h3><p>{audience.benefit}</p>
        </CarouselItem>)}
      </CarouselContent>
      <p id={instructionsId} className="sr-only">Use the previous and next buttons, arrow keys, or swipe to explore. Automatic cycling pauses while you hover, focus, or touch this section. Use the pause button to stop automatic cycling.</p>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
      <div className="audience-controls">
        <div className="audience-pagination" role="group" aria-label="Choose an audience">
          {audiences.map((audience, index) => <button key={audience.role} type="button" aria-label={`Show ${audience.role}`}
            aria-current={index === selected ? true : undefined} onClick={() => {
              if (!api) return;
              swiping.current = false;
              api.scrollTo(index, reducedMotion);
              announce(index);
            }}><span className="audience-dot" aria-hidden="true" /></button>)}
        </div>
        <div className="audience-navigation">
          <button type="button" className="audience-playback"
            aria-label={reducedMotion ? "Automatic cycling disabled for reduced motion" : paused ? "Resume automatic cycling" : "Pause automatic cycling"}
            disabled={reducedMotion} onClick={() => setPaused(current => !current)}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {paused || reducedMotion ? <path d="m9 5 10 7-10 7V5Z" /> : <path d="M9 6v12M15 6v12" />}
            </svg>
          </button>
          <button type="button" aria-label="Previous audience" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12H4m6-6-6 6 6 6" /></svg>
          </button>
          <button type="button" aria-label="Next audience" onClick={() => navigate(1)}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    </Carousel>
    <noscript>
      <style>{".audience-carousel { display: none !important; }"}</style>
      <div className="audience-fallback">
        {audiences.map(audience => <div className="audience-card" key={audience.role}><h3>{audience.role}</h3><p>{audience.benefit}</p></div>)}
      </div>
    </noscript>
  </>;
}
