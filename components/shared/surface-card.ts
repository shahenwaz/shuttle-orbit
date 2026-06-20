import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const surfaceCardVariants = cva(
  "rounded-md border border-white/12 bg-card text-card-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.055),0_10px_24px_rgba(0,0,0,0.16)]",
  {
    variants: {
      variant: {
        default: "",
        elevated:
          "border-white/14 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_16px_36px_rgba(0,0,0,0.22)]",
        subtle:
          "border-white/10 bg-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.045)]",
        panel:
          "border-white/10 bg-card shadow-[inset_0_1px_0_rgba(255,255,255,0.045)]",
      },
      accent: {
        none: "",
        brand: "border-l-[5px] border-l-primary",
        info: "border-l-[5px] border-l-sky-300",
        success: "border-l-[5px] border-l-emerald-300",
        warning: "border-l-[5px] border-l-amber-300",
        danger: "border-l-[5px] border-l-red-400",
      },
      interactive: {
        true: "transition duration-200 hover:border-white/20 hover:bg-accent",
        false: "",
      },
      compact: {
        true: "px-3 py-2.5",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      interactive: false,
      compact: false,
      accent: "none",
    },
  },
);

type SurfaceCardClassNameProps = {
  className?: string;
} & VariantProps<typeof surfaceCardVariants>;

export function surfaceCardClassName({
  variant,
  interactive,
  compact,
  accent,
  className,
}: SurfaceCardClassNameProps = {}) {
  return cn(
    surfaceCardVariants({ variant, interactive, compact, accent }),
    className,
  );
}
