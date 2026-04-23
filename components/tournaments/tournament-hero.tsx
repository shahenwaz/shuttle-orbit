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
    <section className="space-y-4 sm:space-y-5">
      <div className="space-y-3">
        <div className="space-y-2.5">
          <h1 className="max-w-4xl text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            {tournament.name}
          </h1>

          {tournament.description ? (
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
              {tournament.description}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground sm:gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
            <span className="leading-6 text-foreground/90">
              {formatDate(tournament.eventDate)}
            </span>
          </div>

          {tournament.location ? (
            <div className="flex min-w-0 items-center gap-1.5 text-muted-foreground sm:gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate leading-6 text-foreground/90">
                {tournament.location}
              </span>
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
