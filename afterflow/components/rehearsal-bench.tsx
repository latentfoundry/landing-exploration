"use client";

import { useEffect, useRef } from "react";

type PageModule = { mount: (root: HTMLElement) => () => void };

/** Mount the RehearsalBench page's particles, leaderboard sorting and chart reveals on this root. */
export function RehearsalBench({ html }: { html: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    async function enhance() {
      const url = "/research/rehearsalbench/js/page.js";
      try {
        const enhancement: PageModule = await import(/* webpackIgnore: true */ url);
        if (disposed) return;
        cleanup = enhancement.mount(root!);
      } catch (error) {
        if (!disposed) root!.querySelectorAll(".particle-story").forEach((story) => story.classList.add("cinema-fallback"));
        // Static diagrams, the leaderboard and every chart remain readable without the enhancement.
        console.error("Unable to enhance RehearsalBench", error);
      }
    }
    void enhance();
    return () => { disposed = true; cleanup?.(); };
  }, [html]);

  return <div className="rehearsal-bench" ref={rootRef} dangerouslySetInnerHTML={{ __html: html }} />;
}
