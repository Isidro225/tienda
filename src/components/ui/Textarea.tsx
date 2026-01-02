import * as React from "react";
import { cn } from "@/components/ui/cn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full min-h-[110px] rounded-xl border border-app-border bg-white px-3 py-2 text-sm text-app-text shadow-sm outline-none",
        "placeholder:text-slate-400 focus:ring-4 focus:ring-app-accentRing",
        className
      )}
      {...props}
    />
  );
});
