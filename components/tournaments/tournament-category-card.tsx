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
      className="group block h-full rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary/30"
    >
      <Card className="flex h-full flex-col rounded-3xl border-white/10 bg-white/5 transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/6">
        <CardHeader className="px-4 pb-1 pt-2 text-center sm:px-5 sm:pb-1.5 sm:pt-2.5">
          <CardTitle className="truncate text-lg tracking-tight sm:text-xl">
            {category.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col space-y-3 px-4 pb-2 pt-0 text-center sm:px-5 sm:pb-3">
          {category.rulesSummary ? (
            <p className="line-clamp-2 text-left text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
              {category.rulesSummary}
            </p>
          ) : (
            <p className="line-clamp-2 text-left text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
              View players, teams, matches, and standings for this category.
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-muted-foreground sm:text-xs">
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

          <div className="mt-auto flex items-center justify-center pt-1">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/40 px-3 py-1.5 text-xs font-medium text-foreground transition group-hover:border-primary/30 group-hover:text-primary sm:text-sm">
              <span>Open category</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
