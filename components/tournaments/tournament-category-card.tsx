import Link from "next/link";
import { ArrowRight, Layers3, Swords, Users } from "lucide-react";

import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { MetaInfoPill } from "@/components/shared/meta-info-pill";
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
  const firstGroupStage = category.stages.find(
    (stage) =>
      stage.groups.length > 0 &&
      (stage.stageType.toLowerCase().includes("round_robin") ||
        stage.name.toLowerCase().includes("round robin") ||
        stage.name.toLowerCase().includes("group")),
  );

  const totalGroups = firstGroupStage?.groups.length ?? 0;

  return (
    <Link
      href={`/tournaments/${tournamentSlug}/categories/${category.code}`}
      className="group block h-full rounded-md border-2 border-white/10 transition duration-200 hover:border-primary/50"
    >
      <Card className="flex h-full flex-col rounded-md border-white/10 bg-white/5 transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/6">
        <CardHeader className="px-4 pt-2 sm:px-5 sm:pt-4">
          <CardTitle className="text-lg tracking-tight sm:text-xl">
            {category.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col space-y-4 px-4 pb-4 pt-0 sm:px-5 sm:pb-5">
          <p className="line-clamp-2 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
            {category.rulesSummary ||
              "View players, teams, matches, and standings for this category."}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <MetaInfoPill icon={Users} className="[&_svg]:text-primary">
              {category._count.teamEntries} teams
            </MetaInfoPill>

            <MetaInfoPill icon={Swords} className="[&_svg]:text-primary">
              {category._count.matches} matches
            </MetaInfoPill>

            <MetaInfoPill icon={Layers3} className="[&_svg]:text-primary">
              {totalGroups} groups
            </MetaInfoPill>
          </div>

          <div className="mt-auto pt-1">
            <div
              className={actionPillButtonClassName({
                variant: "link",
                className:
                  "pointer-events-none gap-1.5 text-xs group-hover:opacity-100 sm:text-sm",
              })}
            >
              <span>Open category</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
