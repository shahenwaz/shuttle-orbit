import Link from "next/link";
import { FolderKanban, LayoutGrid, Pencil, Swords, Users } from "lucide-react";

import { CreateDialog } from "@/components/admin/create-dialog";
import { EditCategoryForm } from "@/components/admin/tournaments/edit-category-form";
import { EmptyState } from "@/components/shared/empty-state";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { CompactStatRow } from "@/components/shared/stats/compact-stat-row";
import { Button } from "@/components/ui/button";

type TournamentCategoryRow = {
  id: string;
  name: string;
  code: string;
  rulesSummary: string | null;
  status: string;
  stages: Array<{
    id: string;
    groups: Array<{
      id: string;
    }>;
  }>;
  _count: {
    teamEntries: number;
    matches: number;
  };
};

type TournamentCategoriesListProps = {
  tournamentId: string;
  categories: TournamentCategoryRow[];
};

export function TournamentCategoriesList({
  tournamentId,
  categories,
}: TournamentCategoriesListProps) {
  if (categories.length === 0) {
    return (
      <EmptyState message="No categories added yet. Add the first category for this tournament." />
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4">
      {categories.map((category) => {
        const totalGroups = category.stages.reduce(
          (sum, stage) => sum + stage.groups.length,
          0,
        );

        return (
          <div key={category.id} className="surface-card p-4 sm:p-5">
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-2 border-b border-white/10 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                    {category.name}
                  </h4>
                </div>

                <p className="text-sm text-muted-foreground">
                  {category.rulesSummary || "No rules summary added yet."}
                </p>
              </div>

              <CompactStatRow className="justify-start">
                <CompactStatPill label="Groups" value={totalGroups} />
                <CompactStatPill
                  label="Teams"
                  value={category._count.teamEntries}
                />
                <CompactStatPill
                  label="Matches"
                  value={category._count.matches}
                />
              </CompactStatRow>

              <div className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
                <CreateDialog
                  triggerLabel="Edit"
                  title="Edit category"
                  description="Update category details."
                  triggerClassName={actionPillButtonClassName({
                    variant: "edit",
                    className: "w-full justify-center sm:w-auto",
                  })}
                  triggerIcon={<Pencil className="h-3.5 w-3.5" />}
                >
                  <EditCategoryForm
                    tournamentId={tournamentId}
                    category={{
                      id: category.id,
                      name: category.name,
                      code: category.code,
                      rulesSummary: category.rulesSummary,
                    }}
                  />
                </CreateDialog>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={actionPillButtonClassName({
                    variant: "link",
                    className: "w-full justify-center sm:w-auto",
                  })}
                >
                  <Link
                    href={`/admin/tournaments/${tournamentId}/categories/${category.id}/groups`}
                  >
                    <FolderKanban className="mr-1 h-3.5 w-3.5" />
                    Groups
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={actionPillButtonClassName({
                    variant: "link",
                    className: "w-full justify-center sm:w-auto",
                  })}
                >
                  <Link
                    href={`/admin/tournaments/${tournamentId}/categories/${category.id}/fixtures`}
                  >
                    <LayoutGrid className="mr-1 h-3.5 w-3.5" />
                    Fixtures
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={actionPillButtonClassName({
                    variant: "link",
                    className: "w-full justify-center sm:w-auto",
                  })}
                >
                  <Link
                    href={`/admin/tournaments/${tournamentId}/categories/${category.id}/results`}
                  >
                    <Swords className="mr-1 h-3.5 w-3.5" />
                    Results
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={actionPillButtonClassName({
                    variant: "create",
                    className: "w-full justify-center sm:w-auto",
                  })}
                >
                  <Link
                    href={`/admin/tournaments/${tournamentId}/categories/${category.id}/teams`}
                  >
                    <Users className="mr-1 h-3.5 w-3.5" />
                    Teams
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
