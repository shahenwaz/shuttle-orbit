import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CategoryCardActions } from "@/components/admin/tournaments/category-card-actions";
import type { TournamentCategoryRow } from "@/components/admin/tournaments/tournament-categories-list";

type TournamentCategoryCardProps = {
  tournamentId: string;
  category: TournamentCategoryRow;
};

export function TournamentCategoryCard({
  tournamentId,
  category,
}: TournamentCategoryCardProps) {
  const totalGroups = category.stages.reduce(
    (sum: number, stage: TournamentCategoryRow["stages"][number]) =>
      sum + stage.groups.length,
    0,
  );

  return (
    <article className="group relative overflow-hidden rounded-md border border-white/10 bg-white/4 px-4 py-3 transition hover:border-emerald-400/25 hover:bg-white/6">
      <div className="absolute inset-y-0 left-0 w-1.5 bg-linear-to-b from-emerald-300 via-primary to-cyan-500 opacity-75 transition group-hover:opacity-100" />

      <div className="flex flex-col gap-2.5 pl-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <h3 className="truncate text-base font-semibold tracking-tight text-foreground">
            {category.name}
          </h3>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">
                {totalGroups}
              </span>{" "}
              groups
            </span>

            <span className="text-white/20">•</span>

            <span>
              <span className="font-semibold text-foreground">
                {category._count.teamEntries}
              </span>{" "}
              teams
            </span>

            <span className="text-white/20">•</span>

            <span>
              <span className="font-semibold text-foreground">
                {category._count.matches}
              </span>{" "}
              matches
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-white/8 pt-2 sm:border-t-0 sm:pt-0">
          <Link
            href={`/admin/tournaments/${tournamentId}/categories/${category.id}/fixtures`}
            className="inline-flex h-8 items-center justify-center rounded-md border border-emerald-300/20 bg-emerald-300/10 px-3 text-xs font-semibold text-emerald-100 transition hover:border-emerald-300/35 hover:bg-emerald-300/15"
          >
            Manage
            <ArrowRight className="ml-1.5 size-3.5" />
          </Link>

          <CategoryCardActions
            tournamentId={tournamentId}
            category={{
              id: category.id,
              name: category.name,
              code: category.code,
              rulesSummary: category.rulesSummary,
            }}
          />
        </div>
      </div>
    </article>
  );
}
