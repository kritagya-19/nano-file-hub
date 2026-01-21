import React from "react";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const glowVariants = cva("absolute w-full", {
  variants: {
    variant: {
      top: "top-0",
      above: "-top-[128px]",
      bottom: "bottom-0",
      below: "-bottom-[128px]",
      center: "top-[50%]",
    },
  },
  defaultVariants: {
    variant: "top",
  },
});

const Glow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof glowVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(glowVariants({ variant }), className)}
    {...props}
  >
    <div className="absolute left-1/2 h-[256px] w-[60%] -translate-x-1/2 rounded-full bg-brand/30 blur-[128px]" />
    <div className="absolute left-1/2 h-[128px] w-[40%] -translate-x-1/2 rounded-full bg-brand-foreground/40 blur-[64px]" />
  </div>
));
Glow.displayName = "Glow";

export { Glow };
