import Link from "next/link";
import { Crown, Star, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";

type LeaderboardEntry = {
  rank: number;
  playerId: string;
  fullName: string;
  totalPoints: number;
  tournamentsCount: number;
  bestCategory: string | null;
};

type LeaderboardMobileListProps = {
  entries: LeaderboardEntry[];
};

function getTopRankStyles(rank: number) {
  if (rank === 1) {
    return {
      cardClassName:
        "border-yellow-500/25 bg-linear-to-br from-yellow-500/12 via-amber-500/8 to-white/4",
      badgeClassName: "border-yellow-400/30 bg-yellow-500/15 text-yellow-100",
      accentClassName: "text-yellow-300",
      Icon: Trophy,
    };
  }

  if (rank === 2) {
    return {
      cardClassName:
        "border-slate-300/20 bg-linear-to-br from-slate-200/10 via-slate-400/6 to-white/4",
      badgeClassName: "border-slate-300/25 bg-slate-300/12 text-slate-100",
      accentClassName: "text-slate-200",
      Icon: Crown,
    };
  }

  if (rank === 3) {
    return {
      cardClassName:
        "border-orange-400/20 bg-linear-to-br from-orange-500/10 via-amber-700/8 to-white/4",
      badgeClassName: "border-orange-400/25 bg-orange-500/12 text-orange-100",
      accentClassName: "text-orange-200",
      Icon: Star,
    };
  }

  return {
    cardClassName: "",
    badgeClassName: "border-white/10 bg-background/50 text-foreground",
    accentClassName: "text-primary",
    Icon: null,
  };
}

export function LeaderboardMobileList({ entries }: LeaderboardMobileListProps) {
  return entries.map((entry) => {
    const topRankStyles = getTopRankStyles(entry.rank);
    const RankIcon = topRankStyles.Icon;

    return (
      <Link
        key={entry.playerId}
        href={`/players/${entry.playerId}`}
        className={cn(
          "mb-1.5 block rounded-md border border-white/10 bg-white/4 p-3 transition hover:border-primary/25 hover:bg-white/6 last:mb-0",
          topRankStyles.cardClassName,
        )}
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex min-w-8 items-center justify-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold",
                    topRankStyles.badgeClassName,
                  )}
                >
                  {RankIcon ? <RankIcon className="h-3.5 w-3.5" /> : null}#
                  {entry.rank}
                </span>

                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-medium">
                  {entry.bestCategory ? (
                    <span className={cn(topRankStyles.accentClassName)}>
                      {entry.bestCategory}
                    </span>
                  ) : null}

                  <span className="text-muted-foreground">※</span>

                  <span className="text-muted-foreground">
                    Tournament - {entry.tournamentsCount}
                  </span>
                </div>
              </div>

              <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
                {entry.fullName}
              </h3>
            </div>

            <div className="text-right">
              <p className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                Points
              </p>
              <p className="text-base font-bold tracking-tight text-foreground">
                {entry.totalPoints}
              </p>
            </div>
          </div>
        </div>
      </Link>
    );
  });
}
