import React, { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type SharedProps = {
  children?: React.ReactNode;
  className?: string;
};

type AnimatedButtonProps =
  | (Omit<ComponentPropsWithoutRef<"button">, "children"> & SharedProps & { as?: "button" })
  | (Omit<ComponentPropsWithoutRef<"a">, "children"> & SharedProps & { as: "a" });

export default function AnimatedButton(props: AnimatedButtonProps) {
  const {
    as,
    children = "Browse components",
    className = "",
    ...rest
  } = props;
  const classes = cn(
    "animated-button",
    "group relative inline-flex items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 px-6 py-2",
    "font-medium text-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950",
    "disabled:pointer-events-none disabled:opacity-50 dark:border-[#222] dark:bg-black dark:text-neutral-100",
    className,
  );

  const content = (
    <>
      <span className="relative z-10 flex h-full w-full items-center justify-center tracking-wide">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="animated-button__gloss pointer-events-none absolute inset-y-[-40%] left-[-35%] w-1/3 -translate-x-[120%] rotate-12 opacity-0 transition-[transform,opacity] duration-700 ease-out group-hover:translate-x-[520%] group-hover:opacity-70"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,.48), transparent)",
          filter: "blur(2px)",
        }}
      />
    </>
  );

  if (as === "a") {
    return (
      <a
        {...(rest as ComponentPropsWithoutRef<"a">)}
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      {...(rest as ComponentPropsWithoutRef<"button">)}
      className={classes}
    >
      {content}
    </button>
  );
}
