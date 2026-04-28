import Link from "next/link";
import { Crown, Star, Trophy } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type LeaderboardEntry = {
  rank: number;
  playerId: string;
  fullName: string;
  totalPoints: number;
  tournamentsCount: number;
  bestCategory: string | null;
};

type LeaderboardTableProps = {
  entries: LeaderboardEntry[];
};

function getTopRankStyles(rank: number) {
  if (rank === 1) {
    return {
      badgeClassName: "border-yellow-400/30 bg-yellow-500/14 text-yellow-100",
      accentClassName: "text-yellow-300",
      Icon: Trophy,
    };
  }

  if (rank === 2) {
    return {
      badgeClassName: "border-slate-300/25 bg-slate-300/12 text-slate-100",
      accentClassName: "text-slate-200",
      Icon: Crown,
    };
  }

  if (rank === 3) {
    return {
      badgeClassName: "border-orange-400/25 bg-orange-500/12 text-orange-100",
      accentClassName: "text-orange-200",
      Icon: Star,
    };
  }

  return {
    badgeClassName: "border-white/10 bg-[#111821] text-foreground",
    accentClassName: "text-foreground/90",
    Icon: null,
  };
}

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <div className="hidden md:block">
      <div className="overflow-hidden rounded-md border border-white/10 bg-[#0d141b] shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
        <Table className="min-w-170 border-collapse">
          <TableHeader className="bg-[#121a22]">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="px-4 py-3 text-[11px] font-medium text-muted-foreground">
                Rank
              </TableHead>
              <TableHead className="px-4 py-3 text-[11px] font-medium text-muted-foreground">
                Player
              </TableHead>
              <TableHead className="px-4 py-3 text-[11px] font-medium text-muted-foreground">
                Best
              </TableHead>
              <TableHead className="px-4 py-3 text-[11px] font-medium text-muted-foreground">
                Points
              </TableHead>
              <TableHead className="px-4 py-3 text-[11px] font-medium text-muted-foreground">
                Played
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {entries.map((entry, index) => {
              const topRankStyles = getTopRankStyles(entry.rank);
              const RankIcon = topRankStyles.Icon;

              return (
                <TableRow
                  key={entry.playerId}
                  className={cn(
                    "border-white/8 bg-transparent hover:bg-white/4",
                    index % 2 === 0 ? "bg-white/1.5" : "bg-transparent",
                  )}
                >
                  <TableCell className="px-4 py-3.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold",
                        topRankStyles.badgeClassName,
                      )}
                    >
                      {RankIcon ? <RankIcon className="h-3.5 w-3.5" /> : null}#
                      {entry.rank}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3.5">
                    <Link
                      href={`/players/${entry.playerId}`}
                      className="font-medium text-foreground transition hover:text-primary"
                    >
                      {entry.fullName}
                    </Link>
                  </TableCell>

                  <TableCell className="px-4 py-3.5">
                    <span
                      className={cn(
                        "font-medium",
                        entry.bestCategory
                          ? topRankStyles.accentClassName
                          : "text-muted-foreground",
                      )}
                    >
                      {entry.bestCategory ?? "—"}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3.5">
                    <span className="font-semibold text-foreground">
                      {entry.totalPoints}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3.5 text-muted-foreground">
                    {entry.tournamentsCount}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
