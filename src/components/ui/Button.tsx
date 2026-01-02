import Link from "next/link";
import { cn } from "@/components/ui/cn";
import * as React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4";
  const variants: Record<string, string> = {
    primary:
      "bg-app-accent text-white shadow-soft hover:opacity-95 focus:ring-app-accentRing",
    secondary:
      "bg-app-accentSoft text-app-text border border-app-border hover:bg-white focus:ring-app-accentRing",
    ghost:
      "bg-transparent text-app-text hover:bg-app-accentSoft focus:ring-app-accentRing",
    danger:
      "bg-red-600 text-white hover:opacity-95 focus:ring-red-200",
  };
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

type AProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "primary" | "secondary" | "ghost";
  href: string;
};

export function ButtonLink({ className, variant = "primary", href, ...props }: AProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4";
  const variants: Record<string, string> = {
    primary:
      "bg-app-accent text-white shadow-soft hover:opacity-95 focus:ring-app-accentRing",
    secondary:
      "bg-app-accentSoft text-app-text border border-app-border hover:bg-white focus:ring-app-accentRing",
    ghost:
      "bg-transparent text-app-text hover:bg-app-accentSoft focus:ring-app-accentRing",
  };
  return <Link className={cn(base, variants[variant], className)} href={href} {...props} />;
}
