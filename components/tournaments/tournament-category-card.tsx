import Link from "next/link";
import { ArrowRight, Layers3, Swords, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TournamentCategoryCardProps = {
  tournamentSlug: string;
  category: {
    id: string;
    code: string;
    name: string;
    rulesSummary: string | null;
    stages: Array<{
      id: string;
      name: string;
      stageType: string;
      groups: Array<{ id: string }>;
    }>;
    _count: {
      teamEntries: number;
      matches: number;
    };
  };
};

export function TournamentCategoryCard({
  tournamentSlug,
  category,
}: TournamentCategoryCardProps) {
  const totalGroups = category.stages.reduce(
    (count, stage) => count + stage.groups.length,
    0,
  );

  return (
    <Link
      href={`/tournaments/${tournamentSlug}/categories/${category.code}`}
      className="block h-full"
    >
      <Card className="h-full rounded-3xl border-white/10 bg-white/5 transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/[0.07]">
        <CardHeader className="space-y-3 px-4 py-4 sm:px-5 sm:py-5">
          <div className="min-w-0 space-y-2">
            <div className="inline-flex rounded-full border border-white/10 bg-background/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:px-3 sm:text-[11px]">
              {category.code}
            </div>

            <CardTitle className="truncate text-lg tracking-tight sm:text-xl">
              {category.name}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 px-4 pb-4 pt-0 sm:px-5 sm:pb-5">
          {category.rulesSummary ? (
            <p className="line-clamp-2 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
              {category.rulesSummary}
            </p>
          ) : (
            <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
              View players, teams, matches, and standings for this category.
            </p>
          )}

          <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground sm:text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/50 px-2.5 py-1.5">
              <Users className="h-3.5 w-3.5" />
              {category._count.teamEntries} teams
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/50 px-2.5 py-1.5">
              <Swords className="h-3.5 w-3.5" />
              {category._count.matches} matches
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/50 px-2.5 py-1.5">
              <Layers3 className="h-3.5 w-3.5" />
              {totalGroups} groups
            </span>
          </div>

          <div className="flex items-center gap-1.5 pt-0.5 text-xs font-medium text-foreground sm:text-sm">
            Open category
            <ArrowRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
