import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const actionPillButtonVariants = cva(
  "inline-flex h-auto items-center rounded-full border px-3 py-1.5 text-[11px] font-medium shadow-none transition",
  {
    variants: {
      variant: {
        neutral:
          "border-white/10 bg-background/70 text-foreground hover:bg-white/8 hover:text-foreground",
        link: "border-violet-500/20 bg-violet-500/12 text-violet-100 hover:bg-violet-500/18 hover:text-violet-50",
        edit: "border-sky-500/20 bg-sky-500/10 text-sky-100 hover:bg-sky-500/15 hover:text-sky-50",
        create:
          "border-emerald-500/20 bg-emerald-500/12 text-emerald-100 hover:bg-emerald-500/18 hover:text-emerald-50",
        danger:
          "border-red-500/20 bg-red-500/10 text-red-100 hover:bg-red-500/15 hover:text-red-50",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

type ActionPillButtonProps = {
  className?: string;
} & VariantProps<typeof actionPillButtonVariants>;

export function actionPillButtonClassName({
  variant,
  className,
}: ActionPillButtonProps = {}) {
  return cn(actionPillButtonVariants({ variant }), className);
}
