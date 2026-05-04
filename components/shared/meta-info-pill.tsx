import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type MetaInfoPillProps = {
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
};

export function MetaInfoPill({
  icon: Icon,
  children,
  className,
}: MetaInfoPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/50 px-2.5 py-1.5 text-[11px] text-muted-foreground sm:text-xs",
        className,
      )}
    >
      {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" /> : null}
      <span>{children}</span>
    </span>
  );
}
