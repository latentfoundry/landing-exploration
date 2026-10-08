"use client";

import { motion } from "motion/react";
import { Fragment, type CSSProperties } from "react";
import { useReveal } from "./use-reveal";
const textTags = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p };
const revealStates = { hidden: {}, visible: {} };

// Adapted from Motion Primitives TextEffect, used by Vengeance UI's hero blocks.
// Keep character/word/line variants and stagger orchestration; preserve real emphasis,
// native word kerning, and visible HTML instead of an initially hidden document.
type TextEffectProps = {
  children: string;
  as?: "h1" | "h2" | "h3" | "p";
  per?: "char" | "word" | "line";
  preset?: "fade" | "slide" | "fade-in-blur";
  emphasis?: string;
  id?: string;
  className?: string;
  duration?: number;
  delay?: number;
  stagger?: number;
};

export function TextEffect({ children, as = "p", per = "word", preset = "fade", emphasis, id, className, duration = 0.6, delay = 0, stagger = per === "char" ? 0.018 : per === "line" ? 0.16 : 0.09 }: TextEffectProps) {
  // Start inside the reading zone, rather than at the viewport's bottom edge.
  const { ref, controls } = useReveal(0.75, 0.14);
  const MotionTag = textTags[as];
  const lines = children.split("\n");
  const emphasisStart = emphasis ? children.indexOf(emphasis) : -1;
  const emphasisEnd = emphasisStart + (emphasis?.length ?? 0);
  const letterStagger = Math.min(stagger, 0.6 / Math.max(Array.from(children).length - 1, 1));
  const timing = (offset: number) => ({ "--text-delay": `${delay + offset}s` } as CSSProperties);
  const style = {
    "--text-duration": `${duration}s`,
    "--text-distance": preset === "fade" ? "0px" : per === "char" ? "4px" : "6px",
  } as CSSProperties;

  return (
    <MotionTag ref={ref} initial={false} animate={controls} variants={revealStates} id={id} className={className} style={style} data-text-effect={per} data-text-preset={preset}>
      <span className="sr-only">{children.replace(/\n/g, " ")}</span>
      {lines.map((line, lineIndex) => {
        const start = lines.slice(0, lineIndex).join("\n").length + (lineIndex > 0 ? 1 : 0);
        if (per === "line") {
          return <span className="text-effect-line" aria-hidden="true" style={timing(lineIndex * stagger)} key={lineIndex}>{line}</span>;
        }
        return <Fragment key={lineIndex}>
          {lineIndex > 0 && " "}
          <span className="text-effect-line" aria-hidden="true">
            {[...line.matchAll(/\S+|\s+/g)].map((match, index) => {
              const segment = match[0];
              const offset = start + match.index;
              if (!segment.trim()) return segment;
              const highlighted = emphasisStart >= 0 && offset < emphasisEnd && offset + segment.length > emphasisStart;
              const characterStart = Array.from(children.slice(0, offset)).length;
              // Native keyframes handle each letter without per-frame React/
              // Motion updates. Inline letters retain Tiempos kerning.
              const content = per === "char" ? Array.from(segment).map((character, characterIndex) =>
                <span className="text-effect-letter" style={timing((characterStart + characterIndex) * letterStagger)} key={characterIndex}>{character}</span>
              ) : segment;
              const wordIndex = [...children.slice(0, offset).matchAll(/\S+/g)].length;
              return <span className="text-effect-word" style={timing(per === "char" ? characterStart * letterStagger : wordIndex * stagger)} key={index}>
                {highlighted ? <em>{content}</em> : content}
              </span>;
            })}
          </span>
        </Fragment>;
      })}
    </MotionTag>
  );
}
