import { CalendarDays, MapPin, Swords, Users } from "lucide-react";

type TournamentMetaListProps = {
  eventDate: string;
  location?: string | null;
  teamCount: number;
  matchCount: number;
};

export function TournamentMetaList({
  eventDate,
  location,
  teamCount,
  matchCount,
}: TournamentMetaListProps) {
  return (
    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 bg-secondary px-2.5 py-1">
        <CalendarDays className="h-3.5 w-3.5 text-primary/85" />
        {eventDate}
      </span>

      {location ? (
        <span className="inline-flex max-w-full items-center gap-1.5 rounded-sm border border-white/10 bg-secondary px-2.5 py-1">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/85" />
          <span className="truncate">{location}</span>
        </span>
      ) : null}

      <span className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 bg-secondary px-2.5 py-1">
        <Users className="h-3.5 w-3.5 text-primary/85" />
        {teamCount} teams
      </span>

      <span className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 bg-secondary px-2.5 py-1">
        <Swords className="h-3.5 w-3.5 text-primary/85" />
        {matchCount} matches
      </span>
    </div>
  );
}
