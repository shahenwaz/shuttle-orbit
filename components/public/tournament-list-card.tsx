import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CategoryChipList } from "@/components/public/category-chip-list";
import { TournamentMetaList } from "@/components/public/tournament-meta-list";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/format";

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
      <Card className="group rounded-[1.75rem] border-white/10 bg-white/4 shadow-[0_14px_40px_rgba(0,0,0,0.16)] transition duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white/5">
        <CardContent className="space-y-5 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {tournament.name}
              </h2>

              {tournament.description ? (
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                  {tournament.description}
                </p>
              ) : null}
            </div>

            <div className="hidden rounded-full border border-white/10 bg-white/4 p-2 text-muted-foreground transition group-hover:text-foreground sm:flex">
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
