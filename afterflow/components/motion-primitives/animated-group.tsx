"use client";

import { motion, stagger as staggerDelay, type Variants } from "motion/react";
import { Children, type ReactNode } from "react";
import { useReveal } from "./use-reveal";
const groupTags = { div: motion.div, ul: motion.ul, p: motion.p, figure: motion.figure };
const itemTags = { div: motion.div, li: motion.li, article: motion.article };

// Adapted from Motion Primitives AnimatedGroup, used by Vengeance UI's blocks.
// Retain semantic container/child tags and variant propagation. Add once-only
// viewport entry and reduced-motion/focus handling for Afterflow's reading flow.
type AnimatedGroupProps = {
  children: ReactNode;
  as?: "div" | "ul" | "p" | "figure";
  asChild?: keyof typeof itemTags;
  className?: string;
  id?: string;
  "aria-label"?: string;
  preset?: "fade" | "slide" | "none";
  animateChildren?: boolean;
  stagger?: number;
  duration?: number;
  delay?: number;
  amount?: number;
};

export function AnimatedGroup({ children, as = "div", asChild = "div", className, id, "aria-label": label, preset = "fade", animateChildren = true, stagger = 0.09, duration = 0.45, delay = 0, amount = 0.55 }: AnimatedGroupProps) {
  const { ref, controls } = useReveal(amount);
  const MotionTag = groupTags[as];
  const MotionChild = itemTags[asChild];
  const item: Variants = {
    hidden: { opacity: preset === "none" ? 1 : 0, ...(preset === "slide" ? { transform: "translateY(6px)" } : {}) },
    visible: { opacity: 1, ...(preset === "slide" ? { transform: "translateY(0px)" } : {}), transition: { duration, ...(!animateChildren ? { delay } : {}), ease: [0.22, 0.61, 0.36, 1] } },
  };
  const container: Variants = {
    hidden: {},
    visible: { transition: { delayChildren: staggerDelay(stagger, { startDelay: delay }) } },
  };

  return <MotionTag ref={ref} initial={false} animate={controls} variants={animateChildren ? container : item} className={className} id={id} aria-label={label} data-animated-group={preset}>
    {animateChildren ? Children.map(children, (child, index) => <MotionChild key={index} variants={item} data-motion-item>{child}</MotionChild>) : children}
  </MotionTag>;
}
