import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { TeamCard } from "@/components/tournaments/team-card";
import { formatDate } from "@/lib/utils/format";

type PlayerAppearanceCardProps = {
  entry: {
    id: string;
    teamName: string | null;
    player1: {
      fullName: string;
      nickname: string;
    };
    player2: {
      fullName: string;
      nickname: string;
    };
    category: {
      code: string;
      tournament: {
        name: string;
        slug: string;
        eventDate: Date;
      };
    };
    ranking: {
      finishLabel: string | null;
      rankingPoints: number;
      matchesPlayed: number;
      matchesWon: number;
    } | null;
  };
};

export function PlayerAppearanceCard({ entry }: PlayerAppearanceCardProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/4 p-3 sm:p-4">
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground sm:text-xs">
        <Link
          href={`/tournaments/${entry.category.tournament.slug}`}
          className="font-medium text-foreground transition hover:text-primary"
        >
          {entry.category.tournament.name}
        </Link>

        <span>•</span>

        <Link
          href={`/tournaments/${entry.category.tournament.slug}/categories/${entry.category.code}`}
          className="font-medium text-primary transition hover:opacity-80"
        >
          {entry.category.code}
        </Link>

        <span>•</span>

        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(entry.category.tournament.eventDate)}
        </span>
      </div>

      {entry.ranking ? (
        <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/50 px-2.5 py-1.5 text-foreground">
            {entry.ranking.finishLabel ?? "Result"}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/50 px-2.5 py-1.5 text-foreground">
            {entry.ranking.rankingPoints} pts
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/50 px-2.5 py-1.5 text-muted-foreground">
            {entry.ranking.matchesWon}/{entry.ranking.matchesPlayed} wins
          </span>
        </div>
      ) : null}

      <TeamCard
        team={{
          id: entry.id,
          teamName: entry.teamName,
          player1: {
            fullName: entry.player1.fullName,
            nickname: entry.player1.nickname,
          },
          player2: {
            fullName: entry.player2.fullName,
            nickname: entry.player2.nickname,
          },
        }}
        badgeLabel={entry.category.code}
      />
    </div>
  );
}
