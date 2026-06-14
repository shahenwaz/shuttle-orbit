import Link from "next/link";
import { CalendarDays, Swords } from "lucide-react";

type ClubLeagueCardProps = {
  league: {
    id: string;
    title: string;
    playedAt: Date;
    format: string;
    club: {
      name: string;
      shortName: string | null;
    };
    _count: {
      entries: number;
      matches: number;
    };
  };
};

export function ClubLeagueCard({ league }: ClubLeagueCardProps) {
  return (
    <Link
      href={`/admin/club-leagues/${league.id}`}
      className="group rounded-2xl border border-white/10 bg-white/4 p-4 transition hover:border-emerald-300/40 hover:bg-white/6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-emerald-200/70">
            <Swords className="size-3.5" />
            {league.format.replaceAll("_", " ")}
          </div>
          <h2 className="mt-2 text-lg font-semibold text-white">
            {league.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {league.club.shortName || league.club.name}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-1">
            <CalendarDays className="size-3.5" />
            {league.playedAt.toLocaleDateString("en-IE", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">
            {league._count.entries} entries
          </span>
          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">
            {league._count.matches} matches
          </span>
        </div>
      </div>
    </Link>
  );
}
