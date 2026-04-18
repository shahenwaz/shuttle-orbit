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

function getCategoryProgressLabel(
  category: TournamentCategoryCardProps["category"],
) {
  const completedMatches = 0;
  const totalMatches = category._count.matches;

  if (totalMatches === 0) {
    return "Setup pending";
  }

  if (completedMatches === totalMatches) {
    return "Completed";
  }

  return "In progress";
}

export function TournamentCategoryCard({
  tournamentSlug,
  category,
}: TournamentCategoryCardProps) {
  const totalGroups = category.stages.reduce(
    (count, stage) => count + stage.groups.length,
    0,
  );

  return (
    <Link href={`/tournaments/${tournamentSlug}/categories/${category.code}`}>
      <Card className="h-full rounded-3xl border-white/10 bg-white/5 transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/[0.07]">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex rounded-full border border-white/10 bg-background/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {category.code}
              </div>
              <CardTitle className="text-xl sm:text-2xl">
                {category.name}
              </CardTitle>
            </div>

            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
              {getCategoryProgressLabel(category)}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {category.rulesSummary ? (
            <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
              {category.rulesSummary}
            </p>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              View teams, standings, players, and matches for this category.
            </p>
          )}

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/50 px-3 py-1.5">
              <Users className="h-3.5 w-3.5" />
              {category._count.teamEntries} teams
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/50 px-3 py-1.5">
              <Swords className="h-3.5 w-3.5" />
              {category._count.matches} matches
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/50 px-3 py-1.5">
              <Layers3 className="h-3.5 w-3.5" />
              {totalGroups} groups
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1 text-sm font-medium text-foreground">
            Open category
            <ArrowRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
