import Link from "next/link";
import { BarChart3, CalendarDays, Database, Trophy } from "lucide-react";

import { RecalculateRankingsButton } from "@/components/admin/rankings/recalculate-rankings-button";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { MetaInfoPill } from "@/components/shared/meta-info-pill";
import { formatDate } from "@/lib/utils/format";

type AdminRankingTournamentCardProps = {
  tournament: {
    id: string;
    slug: string;
    name: string;
    eventDate: Date;
    _count: {
      categories: number;
      rankingLedger: number;
      playerStats: number;
    };
  };
};

export function AdminRankingTournamentCard({
  tournament,
}: AdminRankingTournamentCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-4 sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <MetaInfoPill icon={CalendarDays}>
              {formatDate(tournament.eventDate)}
            </MetaInfoPill>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {tournament.name}
            </h3>

            <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
              Review ranking data for this tournament and rebuild player points
              if results have changed.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <MetaInfoPill icon={Trophy}>
            {tournament._count.categories}{" "}
            {tournament._count.categories === 1 ? "category" : "categories"}
          </MetaInfoPill>

          <MetaInfoPill icon={Database}>
            {tournament._count.playerStats} player stats
          </MetaInfoPill>

          <MetaInfoPill icon={BarChart3}>
            {tournament._count.rankingLedger} ledger rows
          </MetaInfoPill>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <RecalculateRankingsButton tournamentId={tournament.id} />

          <Link
            href={`/admin/tournaments/${tournament.id}`}
            className={actionPillButtonClassName({
              variant: "link",
              className: "gap-1.5 text-xs sm:text-sm",
            })}
          >
            Open tournament
          </Link>
        </div>
      </div>
    </div>
  );
}
