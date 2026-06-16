import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { cn } from "@/lib/utils";
import { surfaceCardClassName } from "@/components/shared/surface-card";

type AdminOverviewCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  cta: string;
  ctaVariant?: "link" | "create" | "neutral";
  className?: string;
};

export function AdminOverviewCard({
  title,
  description,
  icon: Icon,
  href,
  cta,
  ctaVariant = "neutral",
  className,
}: AdminOverviewCardProps) {
  return (
    <div
      className={surfaceCardClassName({
        className: cn("p-3.5 sm:p-4", className),
      })}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-background/60">
              <Icon className="h-4 w-4 text-primary" />
            </div>

            <h3 className="truncate text-sm font-semibold tracking-tight text-foreground sm:text-base">
              {title}
            </h3>
          </div>

          <Link
            href={href}
            className={actionPillButtonClassName({
              variant: ctaVariant,
              className:
                "shrink-0 gap-1.5 px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
            })}
          >
            {cta}
          </Link>
        </div>

        <p className="text-sm leading-5 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
