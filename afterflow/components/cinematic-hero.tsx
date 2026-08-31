"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import AnimatedButton from "@/components/ui/animated-button";
import { useReducedMotion } from "@/components/ui/use-reduced-motion";

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 15 15 5M7 5h8v8" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 3v13m0 0 5-5m-5 5-5-5" />
    </svg>
  );
}

export function CinematicHero() {
  const heroRef = useRef<HTMLElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const hero = heroRef.current;
    const world = worldRef.current;
    const horizon = horizonRef.current;
    if (!hero || !world || !horizon || reduceMotion) return;

    let frame = 0;
    const update = () => {
      const bounds = hero.getBoundingClientRect();
      const progress = Math.min(Math.max(-bounds.top / Math.max(bounds.height, 1), 0), 1);
      world.style.transform = `translate3d(0, ${progress * 30}%, 0)`;
      horizon.style.transform = `translate3d(0, ${progress * -12}%, 0)`;
      frame = 0;
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      world.style.removeProperty("transform");
      horizon.style.removeProperty("transform");
    };
  }, [reduceMotion]);

  return (
    <section className="cinematic-hero" id="top" ref={heroRef}>
      <div className="cinematic-hero__sticky">
        <div
          className="cinematic-hero__world"
          ref={worldRef}
          aria-hidden="true"
        >
          <div className="cinematic-hero__world-intro">
            <Image
              src="/afterflow-decision-ridge.png"
              alt=""
              fill
              priority
              quality={75}
              sizes="100vw"
            />
          </div>
        </div>

        <div
          className="cinematic-hero__horizon"
          ref={horizonRef}
          aria-hidden="true"
        />
        <div className="cinematic-hero__stars" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="cinematic-hero__shade" aria-hidden="true" />

        <div className="cinematic-hero__message">
          <h1>Your sandbox for operational decisions.</h1>
          <p>
            Operational simulation for AI transformation teams. Model how an initiative changes teams, workflows, service levels and customer outcomes before rollout.
          </p>
          <div className="cinematic-hero__actions">
            <AnimatedButton
              as="a"
              href="https://calendly.com/mika-afterflow/afterflow-intro"
              target="_blank"
              rel="noreferrer"
              className="signal-button"
            >
              Book a private simulation <ArrowUpRight />
            </AnimatedButton>
            <a className="text-action" href="#how-it-works">
              See how it works <ArrowDown />
            </a>
          </div>
        </div>

        <a
          className="cinematic-hero__scroll"
          href="#proof"
          aria-label="Continue to the page"
        >
          <span />
        </a>
      </div>
    </section>
  );
}
