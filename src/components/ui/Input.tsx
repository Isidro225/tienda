import * as React from "react";
import { cn } from "@/components/ui/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-app-border bg-white px-3 py-2 text-sm text-app-text shadow-sm outline-none",
        "placeholder:text-slate-400 focus:ring-4 focus:ring-app-accentRing",
        className
      )}
      {...props}
    />
  );
});
