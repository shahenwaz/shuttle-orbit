import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { surfaceCardClassName } from "@/components/shared/surface-card";

export type PublicTournamentCategoryCardData = {
  id: string;
  name: string;
  code: string;
  _count: {
    teamEntries: number;
    matches: number;
  };
  stages: Array<{
    groups: Array<{
      id: string;
    }>;
  }>;
};

type PublicTournamentCategoryCardProps = {
  category: PublicTournamentCategoryCardData;
  href?: string;
};

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return count === 1 ? singular : plural;
}

export function PublicTournamentCategoryCard({
  category,
  href,
}: PublicTournamentCategoryCardProps) {
  const totalGroups = category.stages.reduce(
    (sum: number, stage: PublicTournamentCategoryCardData["stages"][number]) =>
      sum + stage.groups.length,
    0,
  );

  const teamLabel = pluralize(category._count.teamEntries, "team");
  const groupLabel = pluralize(totalGroups, "group");
  const matchLabel = pluralize(category._count.matches, "match", "matches");

  const content = (
    <div className="flex min-w-0 items-center justify-between gap-3">
      <div className="min-w-0 flex-1 space-y-2.5">
        <h3 className="truncate text-base font-semibold tracking-tight text-purple-400 transition group-hover:text-purple-100">
          {category.name}
        </h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span className="inline-flex items-baseline gap-1">
            <span className="text-sm font-semibold text-foreground">
              {totalGroups}
            </span>
            <span className="font-medium text-muted-foreground">
              {groupLabel}
            </span>
          </span>

          <span className="h-1 w-1 rounded-full bg-white/20" />

          <span className="inline-flex items-baseline gap-1">
            <span className="text-sm font-semibold text-foreground">
              {category._count.teamEntries}
            </span>
            <span className="font-medium text-muted-foreground">
              {teamLabel}
            </span>
          </span>

          <span className="h-1 w-1 rounded-full bg-white/20" />

          <span className="inline-flex items-baseline gap-1">
            <span className="text-sm font-semibold text-foreground">
              {category._count.matches}
            </span>
            <span className="font-medium text-muted-foreground">
              {matchLabel}
            </span>
          </span>
        </div>
      </div>

      {href ? (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-purple-300/15 bg-purple-300/8 text-purple-200 transition group-hover:border-purple-300/30 group-hover:bg-purple-300/12 group-hover:text-purple-100">
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      ) : null}
    </div>
  );

  const className = surfaceCardClassName({
    variant: "elevated",
    interactive: Boolean(href),
    accent: "purple",
    className:
      "group relative overflow-hidden px-4 py-3 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/35 sm:py-3.5",
  });

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <article className={className}>{content}</article>;
}
