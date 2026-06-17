import { LeagueFixtureResults } from "@/components/admin/leagues/league-fixture-results";
import type { LeagueSectionTab } from "@/components/admin/leagues/league-section-tabs";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { formatLeagueDisplayName } from "@/lib/leagues/display";
import { LeagueStandings } from "@/components/admin/leagues/league-standings";

type LeagueDetailFormat =
  | "ROUND_ROBIN"
  | "TEAM_PAIR_MATRIX"
  | "FIXED_DOUBLES"
  | "MANUAL";

type Player = {
  fullName: string;
  nickname: string | null;
};

type Entry = {
  id?: string;
  displayName: string | null;
  entryOrder?: number;
  player1: Player;
  player2: Player | null;
};

type Side = {
  id: string;
  name: string;
  sideOrder: number;
  entries: {
    id: string;
    displayName: string | null;
    entryOrder: number;
    player1: Player;
    player2: Player | null;
  }[];
};

type Match = {
  id: string;
  matchOrder: number;
  roundLabel: string | null;
  scoreSummary: string | null;
  entryAId: string | null;
  entryBId: string | null;
  winnerEntryId: string | null;
  entryA: Entry | null;
  entryB: Entry | null;
  sets: {
    id: string;
    setNumber: number;
    entryAScore: number;
    entryBScore: number;
  }[];
};

type LeagueDetailSectionsProps = {
  leagueId: string;
  activeTab: LeagueSectionTab;
  leagueFormat: LeagueDetailFormat;
  rulesNote: string | null;
  sides: Side[];
  matches: Match[];
  playerStats: PlayerStat[];
};

type PlayerStat = {
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

function getPlayerName(player: Player) {
  return formatLeagueDisplayName(player.nickname || player.fullName);
}

function getEntryName(entry: Entry | null) {
  if (!entry) return "TBC";

  if (entry.displayName) {
    return formatLeagueDisplayName(entry.displayName);
  }

  if (!entry.player2) {
    return getPlayerName(entry.player1);
  }

  return `${getPlayerName(entry.player1)} + ${getPlayerName(entry.player2)}`;
}

export function LeagueDetailSections({
  leagueId,
  activeTab,
  leagueFormat,
  rulesNote,
  sides,
  matches,
  playerStats,
}: LeagueDetailSectionsProps) {
  const completedMatches = matches.filter(
    (match) => match.winnerEntryId,
  ).length;

  const entryCount = sides.reduce(
    (total, side) => total + side.entries.length,
    0,
  );

  const isFixedDoubles = leagueFormat === "FIXED_DOUBLES";
  const entryLabel = isFixedDoubles ? "teams" : "pairs";
  const entryStatLabel = isFixedDoubles ? "Teams" : "Pairs";

  if (activeTab === "sides") {
    return (
      <div className="grid gap-3 lg:grid-cols-2">
        {sides.map((side) => (
          <section key={side.id} className="surface-card overflow-hidden">
            <div className="border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {side.name}
                  </h3>
                </div>

                <span className="text-xs text-muted-foreground">
                  {side.entries.length} {entryLabel}
                </span>
              </div>
            </div>

            <div className="space-y-2 p-4 sm:p-5">
              {side.entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-background/50 px-3 py-2"
                >
                  <span className="text-sm font-medium text-foreground">
                    {getEntryName(entry)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    #{entry.entryOrder}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  if (activeTab === "fixtures") {
    return (
      <LeagueFixtureResults
        leagueId={leagueId}
        leagueFormat={leagueFormat}
        matches={matches}
      />
    );
  }

  return (
    <div className="space-y-4">
      <section className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {isFixedDoubles ? null : (
          <CompactStatPill label="Sides" value={sides.length} />
        )}
        <CompactStatPill label={entryStatLabel} value={entryCount} />
        <CompactStatPill label="Fixtures" value={matches.length} />
        <CompactStatPill label="Completed" value={completedMatches} />
      </section>

      {rulesNote ? (
        <p className="rounded-md border border-white/10 bg-white/4 px-4 py-3 text-sm leading-6 text-muted-foreground">
          {rulesNote}
        </p>
      ) : null}

      <LeagueStandings playerStats={playerStats} />
    </div>
  );
}
