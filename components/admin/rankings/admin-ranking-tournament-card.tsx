import Link from "next/link";
import { BarChart3, CalendarDays, Database, Trophy } from "lucide-react";

import { RecalculateRankingsButton } from "@/components/admin/rankings/recalculate-rankings-button";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { MetaInfoPill } from "@/components/shared/meta-info-pill";
import { formatDate } from "@/lib/utils/format";
import { surfaceCardClassName } from "@/components/shared/surface-card";

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
    <div className={surfaceCardClassName({ className: "p-4 sm:p-5" })}>
      <div className="flex flex-col gap-4">
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-400 sm:text-sm">
            <CalendarDays className="h-4 w-4" />
            <span>{formatDate(tournament.eventDate)}</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
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
