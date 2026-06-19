import { TournamentCategoryCard } from "@/components/admin/tournaments/tournament-category-card";
import { EmptyState } from "@/components/shared/empty-state";

export type TournamentCategoryRow = {
  id: string;
  name: string;
  code: string;
  rulesSummary: string | null;
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
    <section className="space-y-3 sm:space-y-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Categories
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage each category workspace from one place.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {categories.map((category) => (
          <TournamentCategoryCard
            key={category.id}
            tournamentId={tournamentId}
            category={category}
          />
        ))}
      </div>
    </section>
  );
}
