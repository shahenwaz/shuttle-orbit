import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const surfaceCardVariants = cva(
  "rounded-md border border-white/10 bg-white/4",
  {
    variants: {
      variant: {
        default: "",
        elevated: "shadow-[0_12px_34px_rgba(0,0,0,0.14)]",
        muted: "bg-background/50",
      },
      interactive: {
        true: "transition duration-200 hover:border-primary/50 hover:bg-white/5",
        false: "",
      },
      blur: {
        true: "backdrop-blur-sm",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      interactive: false,
      blur: false,
    },
  },
);

type SurfaceCardClassNameProps = {
  className?: string;
} & VariantProps<typeof surfaceCardVariants>;

export function surfaceCardClassName({
  variant,
  interactive,
  blur,
  className,
}: SurfaceCardClassNameProps = {}) {
  return cn(surfaceCardVariants({ variant, interactive, blur }), className);
}
