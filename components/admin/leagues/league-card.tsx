import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { formatLeagueFormat } from "@/lib/leagues/format";

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

  const playedAtLabel = league.playedAt.toLocaleDateString("en-IE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/admin/leagues/${league.id}`}
      className="group relative block overflow-hidden rounded-md border border-white/10 bg-white/4 px-4 py-3 transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/6"
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-primary/60 opacity-60 transition group-hover:opacity-100" />

      <div className="flex flex-col gap-2.5 pl-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <h2 className="truncate text-base font-semibold tracking-tight text-foreground">
            {league.title}
          </h2>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span className="font-medium text-primary/90">
              {formatLeagueFormat(league.format)}
            </span>
            <span className="text-white/20">•</span>
            <span>{hostLabel}</span>
            <span className="text-white/20">•</span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-3.5" />
              {playedAtLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/8 pt-2 sm:border-t-0 sm:pt-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground sm:justify-end">
            <span>
              <span className="font-semibold text-foreground">
                {league._count.teams}
              </span>{" "}
              teams
            </span>

            <span className="text-white/20">•</span>

            <span>
              <span className="font-semibold text-foreground">
                {league._count.matches}
              </span>{" "}
              fixtures
            </span>
          </div>

          <div className="hidden size-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-background/50 text-muted-foreground transition group-hover:border-primary/25 group-hover:text-primary sm:flex">
            <ArrowUpRight className="size-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
