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
    <div className="flex flex-wrap gap-x-4 gap-y-3 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-primary" />
        <span>{eventDate}</span>
      </div>

      {location ? (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{location}</span>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" />
        <span>{teamCount} teams</span>
      </div>

      <div className="flex items-center gap-2">
        <Swords className="h-4 w-4 text-primary" />
        <span>{matchCount} matches</span>
      </div>
    </div>
  );
}
