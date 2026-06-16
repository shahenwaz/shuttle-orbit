import { Trophy } from "lucide-react";

import { formatLeagueDisplayName } from "@/lib/leagues/display";

type LeagueStanding = {
  id: string;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  pointsFor: number;
  pointsAgainst: number;
  player: {
    fullName: string;
    nickname: string | null;
  };
};

type LeagueStandingsProps = {
  playerStats: LeagueStanding[];
};

function getPlayerName(player: LeagueStanding["player"]) {
  return formatLeagueDisplayName(player.nickname || player.fullName);
}

export function LeagueStandings({ playerStats }: LeagueStandingsProps) {
  const sortedStats = [...playerStats].sort((a, b) => {
    const aDiff = a.pointsFor - a.pointsAgainst;
    const bDiff = b.pointsFor - b.pointsAgainst;

    return (
      b.matchesWon - a.matchesWon ||
      bDiff - aDiff ||
      b.pointsFor - a.pointsFor ||
      b.matchesPlayed - a.matchesPlayed
    );
  });

  return (
    <section className="surface-card overflow-hidden">
      <div className="border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
            Player standings
          </h3>

          <span className="text-xs text-muted-foreground sm:text-sm">⁜</span>

          <span className="text-xs text-muted-foreground sm:text-sm">
            Ranked by matches won
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {sortedStats.length === 0 ? (
          <div className="rounded-md border border-dashed border-white/15 bg-white/4 p-4">
            <div className="flex gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
                <Trophy className="size-4" />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  No standings yet
                </h4>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Record fixture results first. Player standings will update
                  automatically.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border border-white/10">
            <div className="grid grid-cols-[44px_1fr_56px_56px_56px_64px] border-b border-white/10 bg-white/4 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <span>#</span>
              <span>Player</span>
              <span className="text-right">P</span>
              <span className="text-right">W</span>
              <span className="text-right">L</span>
              <span className="text-right">Diff</span>
            </div>

            <div className="divide-y divide-white/10">
              {sortedStats.map((stat, index) => {
                const pointDiff = stat.pointsFor - stat.pointsAgainst;

                return (
                  <div
                    key={stat.id}
                    className="grid grid-cols-[44px_1fr_56px_56px_56px_64px] items-center px-3 py-2.5 text-sm"
                  >
                    <span className="text-muted-foreground">{index + 1}</span>

                    <span className="truncate font-medium text-foreground">
                      {getPlayerName(stat.player)}
                    </span>

                    <span className="text-right text-muted-foreground">
                      {stat.matchesPlayed}
                    </span>
                    <span className="text-right text-primary">
                      {stat.matchesWon}
                    </span>
                    <span className="text-right text-muted-foreground">
                      {stat.matchesLost}
                    </span>
                    <span className="text-right text-muted-foreground">
                      {pointDiff > 0 ? `+${pointDiff}` : pointDiff}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
