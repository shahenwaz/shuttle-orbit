import Link from "next/link";

import { Button } from "@/components/ui/button";

type TournamentCategoryRow = {
  id: string;
  name: string;
  code: string;
  rulesSummary: string | null;
  status: string;
  _count: {
    teamEntries: number;
    matches: number;
    stages: number;
  };
};

type TournamentCategoriesListProps = {
  tournamentId: string;
  categories: TournamentCategoryRow[];
};

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "published":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "completed":
      return "border-violet-500/20 bg-violet-500/10 text-violet-300";
    default:
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
  }
}

export function TournamentCategoriesList({
  tournamentId,
  categories,
}: TournamentCategoriesListProps) {
  if (categories.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No categories added yet. Add the first category for this tournament.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {categories.map((category) => (
        <div key={category.id} className="surface-panel p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-base font-semibold text-foreground">
                  {category.name}
                </h4>

                <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-foreground">
                  {category.code}
                </span>

                <span
                  className={`rounded-full border px-2.5 py-1 text-xs ${getStatusBadgeClass(
                    category.status,
                  )}`}
                >
                  {category.status}
                </span>
              </div>

              {category.rulesSummary ? (
                <p className="text-sm text-muted-foreground">
                  {category.rulesSummary}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No rules summary added yet.
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-[auto_auto] sm:items-center">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Stages</p>
                  <p className="mt-1 text-base font-semibold">
                    {category._count.stages}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Teams</p>
                  <p className="mt-1 text-base font-semibold">
                    {category._count.teamEntries}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Matches</p>
                  <p className="mt-1 text-base font-semibold">
                    {category._count.matches}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link
                    href={`/admin/tournaments/${tournamentId}/categories/${category.id}/teams`}
                  >
                    Manage teams
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
