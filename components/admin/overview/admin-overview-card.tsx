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
        className: cn("p-4 sm:p-5", className),
      })}
    >
      <div className="flex h-full flex-col gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-background/60">
              <Icon className="h-4.5 w-4.5 text-primary" />
            </div>

            <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
              {title}
            </h3>
          </div>

          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="mt-auto">
          <Link
            href={href}
            className={actionPillButtonClassName({
              variant: ctaVariant,
              className: "gap-1.5 text-xs sm:text-sm",
            })}
          >
            {cta}
          </Link>
        </div>
      </div>
    </div>
  );
}
