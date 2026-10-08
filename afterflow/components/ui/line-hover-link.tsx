import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

// Vengeance UI's slide underline variant, shared without per-instance style tags.
export function LineHoverLink({ children, icon, className = "", href, ...props }: ComponentPropsWithoutRef<"a"> & { href: string; icon?: ReactNode }) {
  const content = <><span className="line-hover-label">{children}</span>{icon}</>;
  const classes = ["line-hover-link", className].filter(Boolean).join(" ");
  return href.startsWith("/")
    ? <Link href={href} className={classes} {...props}>{content}</Link>
    : <a href={href} className={classes} {...props}>{content}</a>;
}
