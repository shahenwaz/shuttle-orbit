import Link from "next/link";
import { CalendarDays, Swords, UsersRound } from "lucide-react";

type LeagueCardProps = {
  league: {
    id: string;
    title: string;
    playedAt: Date;
    format: string;
    hostClub: {
      name: string;
      shortName: string | null;
    } | null;
    _count: {
      teams: number;
      matches: number;
    };
  };
};

export function LeagueCard({ league }: LeagueCardProps) {
  const hostLabel =
    league.hostClub?.shortName || league.hostClub?.name || "Community";

  return (
    <Link
      href={`/admin/leagues/${league.id}`}
      className="group block rounded-md border border-white/10 bg-white/4 px-4 py-3 transition hover:border-primary/35 hover:bg-white/6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
              <Swords className="size-3" />
              {league.format.replaceAll("_", " ")}
            </span>

            <span className="text-xs text-muted-foreground">{hostLabel}</span>
          </div>

          <h2 className="mt-2 truncate text-base font-semibold text-foreground">
            {league.title}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground sm:justify-end">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/70 px-3 py-1.5">
            <CalendarDays className="size-3.5" />
            {league.playedAt.toLocaleDateString("en-IE", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/70 px-3 py-1.5">
            <UsersRound className="size-3.5" />
            {league._count.teams} teams
          </span>

          <span className="rounded-full border border-white/10 bg-background/70 px-3 py-1.5">
            {league._count.matches} fixtures
          </span>
        </div>
      </div>
    </Link>
  );
}
