"use client";

import { useEffect, useRef } from "react";

type BenchmarkModule = { mount: (root: HTMLElement) => () => void };

/** Keep the visible page's particle enhancements scoped to this mounted root. */
export function InterventionBench({ html }: { html: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    async function enhance() {
      const url = "/interventionbench/story.js";
      try {
        const enhancement: BenchmarkModule = await import(/* webpackIgnore: true */ url);
        if (disposed) return;
        cleanup = enhancement.mount(root!);
      } catch (error) {
        if (!disposed) {
          root!.querySelector(".particle-story")?.classList.add("cinema-fallback");
        }
        // Static illustrations and complete results remain available without motion.
        console.error("Unable to enhance InterventionBench", error);
      }
    }
    void enhance();
    return () => { disposed = true; cleanup?.(); };
  }, [html]);

  return <div className="intervention-bench" ref={rootRef} dangerouslySetInnerHTML={{ __html: html }} />;
}
