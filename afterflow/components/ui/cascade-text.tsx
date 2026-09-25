import type { CSSProperties } from "react";

/** Keep the readable label on the parent heading; these letters are visual only. */
export function CascadeText({ text, offset = 0 }: { text: string; offset?: number }) {
  let index = offset;
  return <span className="cascade-text" aria-hidden="true">{text.split(" ").map((word, wordIndex) => (
    <span className="cascade-word" key={`${word}-${wordIndex}`}>
      {[...word].map((letter, letterIndex) => <span className="cascade-letter" key={letterIndex} style={{ "--letter-index": index++ } as CSSProperties}>{letter}</span>)}
      {wordIndex < text.split(" ").length - 1 && <span className="cascade-space"> </span>}
    </span>
  ))}</span>;
}
