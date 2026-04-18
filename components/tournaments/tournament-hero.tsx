import { CalendarDays, MapPin } from "lucide-react";

import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { CompactStatRow } from "@/components/shared/stats/compact-stat-row";
import { formatDate } from "@/lib/utils/format";

type TournamentHeroProps = {
  tournament: {
    name: string;
    slug: string;
    description: string | null;
    eventDate: Date;
    location: string | null;
    _count: {
      teamEntries: number;
      matches: number;
    };
    categories: Array<{
      id: string;
      code: string;
      name: string;
    }>;
  };
};

export function TournamentHero({ tournament }: TournamentHeroProps) {
  return (
    <section className="space-y-5 sm:space-y-6">
      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {tournament.name}
          </h1>

          {tournament.description ? (
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
              {tournament.description}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground sm:text-sm">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>{formatDate(tournament.eventDate)}</span>
          </div>

          {tournament.location ? (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{tournament.location}</span>
            </div>
          ) : null}
        </div>
      </div>

      <CompactStatRow className="justify-start">
        <CompactStatPill
          label="Categories"
          value={tournament.categories.length}
        />
        <CompactStatPill label="Teams" value={tournament._count.teamEntries} />
        <CompactStatPill label="Matches" value={tournament._count.matches} />
      </CompactStatRow>
    </section>
  );
}
