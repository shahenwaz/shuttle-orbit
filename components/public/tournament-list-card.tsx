import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CategoryChipList } from "@/components/public/category-chip-list";
import { TournamentMetaList } from "@/components/public/tournament-meta-list";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/format";
import { surfaceCardClassName } from "../shared/surface-card";

type TournamentListCardProps = {
  tournament: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    eventDate: Date | string;
    location: string | null;
    _count: {
      teamEntries: number;
      matches: number;
    };
    categories: Array<{
      id: string;
      code: string;
    }>;
  };
};

export function TournamentListCard({ tournament }: TournamentListCardProps) {
  return (
    <Link href={`/tournaments/${tournament.slug}`} className="block">
      <Card
        className={surfaceCardClassName({
          variant: "elevated",
          interactive: true,
          className: "group",
        })}
      >
        <CardContent className="space-y-4 px-4 py-2.5 sm:px-4.5 sm:py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1.5">
              <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                {tournament.name}
              </h2>

              {tournament.description ? (
                <p className="line-clamp-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {tournament.description}
                </p>
              ) : null}
            </div>

            <div className="hidden rounded-md border border-white/10 bg-white/4 p-2 text-muted-foreground transition group-hover:text-foreground sm:flex">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          <TournamentMetaList
            eventDate={formatDate(tournament.eventDate)}
            location={tournament.location}
            teamCount={tournament._count.teamEntries}
            matchCount={tournament._count.matches}
          />

          <CategoryChipList
            categories={tournament.categories.map((category) => ({
              id: category.id,
              label: category.code,
            }))}
          />
        </CardContent>
      </Card>
    </Link>
  );
}
