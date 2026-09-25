"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { useLenis } from "lenis/react";
import { EngineStageArt } from "@/components/engine-stage-art";

const steps = [
  {
    label: "Model",
    title: "See what depends on what.",
    copy: "Connect your systems, documents and team knowledge. Map who does the work, where it gets stuck and what each change would affect.",
  },
  {
    label: "Simulate",
    title: "Test thousands of futures.",
    copy: "Compare ways to solve the same problem. Vary adoption, cost and rollout pace to see which plan holds up—and what could change its return.",
  },
  {
    label: "Build",
    title: "Turn the plan into software.",
    copy: "The chosen scenario defines the integrations, approval rules and success measures. Our engineers build and test the solution with your team, then deploy it.",
  },
  {
    label: "Learn",
    title: "Correct the next forecast.",
    copy: "Compare predicted savings and adoption with the rollout. Use the gaps to correct the assumptions behind the next forecast.",
  },
] as const;

// Render a readable document on the server; enhance every viewport after hydration.
const subscribeHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function EngineExperience() {
  const [{ stage, phase, seen }, setScene] = useState({ stage: 0, phase: "idle", seen: 0 });
  const enhanced = useSyncExternalStore(subscribeHydration, getClientSnapshot, getServerSnapshot);
  const track = useRef<HTMLDivElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!enhanced) return;
    let frame = 0;
    let transitionTimer = 0;
    let currentStage = 0;
    let requestedStage = 0;
    let exiting = false;
    let initialized = false;
    let sceneVisible = false;
    let geometryDirty = true;
    let stickyTop = 0;
    let scrollDistance = 1;
    const segments = Array.from(progress.current?.children ?? []) as HTMLElement[];
    const segmentProgress = segments.map(() => -1);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const changeStage = (nextStage: number, immediate = false) => {
      requestedStage = nextStage;
      if (immediate || reducedMotion.matches) {
        window.clearTimeout(transitionTimer);
        currentStage = nextStage;
        exiting = false;
        setScene(current => current.stage === nextStage && current.phase === "idle"
          ? current : { ...current, stage: nextStage, phase: "idle" });
        return;
      }
      if (nextStage === currentStage) {
        // Reversing a small wheel movement should restore the current scene,
        // rather than commit a transition the reader has already moved away from.
        if (exiting) {
          window.clearTimeout(transitionTimer);
          exiting = false;
          setScene(current => ({ ...current, phase: "idle" }));
        }
        return;
      }
      if (exiting) return;
      exiting = true;
      setScene(current => ({ ...current, phase: "leaving" }));
      transitionTimer = window.setTimeout(() => {
        const destinationStage = requestedStage;
        currentStage = destinationStage;
        exiting = false;
        setScene(current => ({
          stage: destinationStage,
          phase: "idle",
          seen: current.seen | (1 << current.stage),
        }));
      }, 160);
    };

    const updateStage = () => {
      frame = 0;
      if (!track.current || !sticky.current) return;
      // Sizes and the sticky offset only change with layout, not each scroll frame.
      if (geometryDirty) {
        stickyTop = Number.parseFloat(getComputedStyle(sticky.current).top) || 0;
        scrollDistance = Math.max(1, track.current.offsetHeight - sticky.current.offsetHeight);
        geometryDirty = false;
      }
      const position = Math.max(0, Math.min(0.9999,
        (stickyTop - track.current.getBoundingClientRect().top) / scrollDistance));
      const scenePosition = position * steps.length;
      // A small deadband prevents trackpad drift from repeatedly swapping scenes.
      const margin = scenePosition >= requestedStage + 1 ? -0.025
        : scenePosition < requestedStage ? 0.025 : 0;
      const nextStage = Math.max(0, Math.min(steps.length - 1,
        Math.floor(scenePosition + (initialized ? margin : 0))));
      if (!initialized || nextStage !== requestedStage) changeStage(nextStage, !initialized);
      initialized = true;
      segments.forEach((segment, index) => {
        const value = Math.max(0, Math.min(1, scenePosition - index));
        if (value === segmentProgress[index]) return;
        segment.style.setProperty("--stage-progress", String(value));
        segmentProgress[index] = value;
      });
    };
    const scheduleUpdate = () => {
      if (!frame && document.visibilityState === "visible") frame = requestAnimationFrame(updateStage);
    };
    const handleScroll = () => {
      if (sceneVisible) scheduleUpdate();
    };
    const invalidateGeometry = () => {
      geometryDirty = true;
      if (sceneVisible || !initialized) scheduleUpdate();
    };
    const updateVisibility = () => {
      if (track.current) {
        track.current.dataset.sceneVisible = String(sceneVisible && document.visibilityState === "visible");
      }
      if (document.visibilityState !== "visible") {
        cancelAnimationFrame(frame);
        frame = 0;
        return;
      }
      // Also settle the first/last stage when the section leaves the viewport.
      scheduleUpdate();
    };
    // Layout can change after fonts load or a mobile browser's chrome retracts.
    const resizeObserver = new ResizeObserver(invalidateGeometry);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      sceneVisible = entry.isIntersecting;
      updateVisibility();
    }, { threshold: [0, .25] });
    if (track.current) resizeObserver.observe(track.current);
    if (sticky.current) {
      resizeObserver.observe(sticky.current);
      visibilityObserver.observe(sticky.current);
    }
    scheduleUpdate();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", invalidateGeometry);
    window.visualViewport?.addEventListener("resize", invalidateGeometry);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(transitionTimer);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", invalidateGeometry);
      window.visualViewport?.removeEventListener("resize", invalidateGeometry);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, [enhanced]);

  function goToStage(index: number) {
    if (!track.current || !sticky.current || index < 0 || index >= steps.length) return;
    const top = Number.parseFloat(getComputedStyle(sticky.current).top) || 0;
    const distance = track.current.offsetHeight - sticky.current.offsetHeight;
    // Land a little inside each scene so rounding cannot select its neighbour.
    const destination = window.scrollY + track.current.getBoundingClientRect().top - top
      + distance * (index + 0.16) / steps.length;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (lenis) {
      lenis.scrollTo(destination, { duration: 0.8, immediate: reducedMotion });
    } else {
      window.scrollTo({ top: destination, behavior: reducedMotion ? "instant" : "smooth" });
    }
  }

  function handleKey(event: KeyboardEvent<HTMLDivElement>) {
    const next = event.key === "ArrowRight" ? Math.min(stage + 1, steps.length - 1)
      : event.key === "ArrowLeft" ? Math.max(stage - 1, 0)
      : event.key === "Home" ? 0 : event.key === "End" ? steps.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    goToStage(next);
  }

  return (
    <div ref={track} className="scroll-engine" data-enhanced={enhanced} data-phase={phase}>
      <div
        ref={sticky}
        className="scroll-engine__sticky"
        role={enhanced ? "region" : undefined}
        aria-label={enhanced ? "Explore the Afterflow process" : undefined}
        aria-describedby={enhanced ? "engine-instructions" : undefined}
        tabIndex={enhanced ? 0 : undefined}
        onKeyDown={handleKey}
      >
        <p id="engine-instructions" className="sr-only">
          Scroll to move through four stages, choose a stage above, or use the left and right arrow keys when this section is focused.
        </p>
        <div className="scroll-engine__header">
          <nav ref={progress} className="scroll-engine__progress" aria-label="Process stages">
            {steps.map((item, index) => <button
              key={item.label}
              className="scroll-engine__step"
              type="button"
              data-state={index === stage ? "current" : index < stage ? "complete" : "upcoming"}
              aria-current={index === stage ? "step" : undefined}
              aria-label={`${item.label}, stage ${index + 1} of ${steps.length}`}
              aria-controls={`engine-panel-${index}`}
              onClick={() => goToStage(index)}
            >
              <span className="scroll-engine__step-label">{item.label}</span>
              <span className="scroll-engine__step-track" aria-hidden="true" />
            </button>)}
          </nav>
          <div className="scroll-engine__navigation">
            <div className="scroll-engine__stage-actions">
              <div className="scroll-engine__stage" aria-live="polite" aria-atomic="true">
                <span className="scroll-engine__stage-name sr-only">{steps[stage].label}</span>
                <span className="sr-only">, stage {stage + 1} of {steps.length}</span>
                <span className="scroll-engine__number" aria-hidden="true">0{stage + 1}<span> / 04</span></span>
              </div>
              <div className="scroll-engine__controls" aria-label="Change process stage">
                <button
                  type="button"
                  aria-label="Previous stage"
                  aria-disabled={stage === 0}
                  aria-controls={`engine-panel-${stage}`}
                  onClick={() => goToStage(stage - 1)}
                ><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12H4m6-6-6 6 6 6" /></svg></button>
                <button
                  type="button"
                  aria-label="Next stage"
                  aria-disabled={stage === steps.length - 1}
                  aria-controls={`engine-panel-${stage}`}
                  onClick={() => goToStage(stage + 1)}
                ><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg></button>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-engine__panels">
          {steps.map((item, index) => <article
            className="scroll-engine__panel"
            key={item.label}
            id={`engine-panel-${index}`}
            aria-labelledby={`engine-title-${index}`}
            aria-roledescription={enhanced ? "slide" : undefined}
            aria-label={enhanced ? `${item.label}, stage ${index + 1} of ${steps.length}` : undefined}
            hidden={enhanced && stage !== index}
            data-seen={Boolean(seen & (1 << index))}
          >
            <div className="scroll-engine__story">
              <p className="scroll-engine__fallback-label">{item.label}</p>
              <h3 id={`engine-title-${index}`}>{item.title}</h3>
              <p className="scroll-engine__copy">{item.copy}</p>
            </div>
            <div className="scroll-engine__artwork">
              <EngineStageArt stage={index} />
            </div>
          </article>)}
        </div>
      </div>
    </div>
  );
}
