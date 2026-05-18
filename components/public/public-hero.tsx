import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

type PublicHeroProps = {
  badge: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

export function PublicHero({
  badge,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: PublicHeroProps) {
  return (
    <section className="relative space-y-4 py-1 sm:space-y-6 sm:py-4 lg:py-8">
      <div className="pointer-events-none absolute -top-10 left-0 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative space-y-4 sm:space-y-5">
        <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary sm:px-4 sm:text-sm">
          <Sparkles className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          <span className="truncate">{badge}</span>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <h1 className="max-w-3xl text-[2rem] font-bold leading-[1.08] tracking-[-0.045em] sm:text-5xl sm:leading-[1.05] lg:text-6xl">
            {title}
          </h1>

          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-lg sm:leading-8">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1 sm:gap-3">
          <Button
            asChild
            className="h-10 rounded-full px-4 text-sm font-semibold sm:h-11 sm:px-5 sm:text-base"
          >
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-10 rounded-full border-white/10 bg-white/4 px-4 text-sm font-semibold hover:bg-white/8 sm:h-11 sm:px-5 sm:text-base"
          >
            <Link href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
