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
    <section className="space-y-2.5">
      <h3 className="text-sm text-center font-semibold uppercase tracking-[0.18em] text-purple-400">
        League standings
      </h3>

      {sortedStats.length === 0 ? (
        <div className="rounded-md border border-dashed border-white/15 bg-white/4 p-4">
          <div className="flex gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-purple-400/25 bg-purple-400/10 text-purple-300">
              <Trophy className="size-4" />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground">
                No standings yet
              </h4>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Record fixture results first. League standings will update
                automatically.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="overflow-x-auto rounded-md border border-white/10 bg-white/4">
            <div className="min-w-97.5">
              <div className="grid grid-cols-[36px_minmax(145px,210px)_38px_38px_38px_52px] border-b border-white/10 bg-purple-400/8 px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <span>#</span>
                <span>Player</span>
                <span className="text-right">P</span>
                <span className="text-right">W</span>
                <span className="text-right">L</span>
                <span className="text-right">Diff</span>
              </div>

              <div className="divide-y divide-white/8">
                {sortedStats.map((stat, index) => {
                  const pointDiff = stat.pointsFor - stat.pointsAgainst;
                  const rank = index + 1;
                  const isTopThree = rank <= 3;

                  return (
                    <div
                      key={stat.id}
                      className="grid grid-cols-[36px_minmax(145px,210px)_38px_38px_38px_52px] items-center px-2.5 py-2 text-sm transition hover:bg-white/4"
                    >
                      <span
                        className={
                          isTopThree
                            ? "font-semibold text-purple-300"
                            : "text-muted-foreground"
                        }
                      >
                        {rank}
                      </span>

                      <span className="truncate pr-2 font-medium text-foreground">
                        {getPlayerName(stat.player)}
                      </span>

                      <span className="text-right text-muted-foreground">
                        {stat.matchesPlayed}
                      </span>

                      <span className="text-right font-semibold text-primary">
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
          </div>

          <p className="px-1 text-[10px] leading-4 text-muted-foreground/70">
            Ranked by matches won, then point difference, points scored, and
            matches played.
          </p>
        </div>
      )}
    </section>
  );
}
