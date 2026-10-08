import type { ComponentPropsWithoutRef, ReactNode } from "react";

type SharedProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "compact";
};

type AnimatedButtonProps =
  | (Omit<ComponentPropsWithoutRef<"button">, "children"> & SharedProps & { as?: "button" })
  | (Omit<ComponentPropsWithoutRef<"a">, "children"> & SharedProps & { as: "a" });

export default function AnimatedButton(props: AnimatedButtonProps) {
  const {
    as,
    children,
    className = "",
    variant = "default",
    ...rest
  } = props;
  const classes = ["animated-button", variant === "compact" && "animated-button--compact", className].filter(Boolean).join(" ");

  const content = (
    <span className="animated-button__label">{children}</span>
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
      type="button"
      {...(rest as ComponentPropsWithoutRef<"button">)}
      className={classes}
    >
      {content}
    </button>
  );
}
