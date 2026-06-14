import { Swords, UsersRound } from "lucide-react";

import type { ClubLeagueSectionTab } from "@/components/admin/club-leagues/club-league-section-tabs";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";

type Player = {
  fullName: string;
  nickname: string;
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

type ClubLeagueDetailSectionsProps = {
  activeTab: ClubLeagueSectionTab;
  rulesNote: string | null;
  sides: Side[];
  matches: Match[];
};

function getPlayerName(player: Player) {
  return player.nickname || player.fullName;
}

function getEntryName(entry: Entry | null) {
  if (!entry) return "TBC";
  if (entry.displayName) return entry.displayName;
  if (!entry.player2) return getPlayerName(entry.player1);

  return `${getPlayerName(entry.player1)} + ${getPlayerName(entry.player2)}`;
}

function getScoreText(match: Match) {
  if (match.scoreSummary) return match.scoreSummary;
  if (match.sets.length === 0) return "Pending";

  return match.sets
    .map((set) => `${set.entryAScore}-${set.entryBScore}`)
    .join(", ");
}

export function ClubLeagueDetailSections({
  activeTab,
  rulesNote,
  sides,
  matches,
}: ClubLeagueDetailSectionsProps) {
  const completedMatches = matches.filter(
    (match) => match.winnerEntryId,
  ).length;
  const entryCount = sides.reduce(
    (total, side) => total + side.entries.length,
    0,
  );

  if (activeTab === "sides") {
    return (
      <div className="grid gap-3 lg:grid-cols-2">
        {sides.map((side) => (
          <section
            key={side.id}
            className="rounded-md border border-white/10 bg-white/4 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-primary/80">
                  Side {side.sideOrder}
                </p>
                <h2 className="mt-1 text-base font-semibold text-foreground">
                  {side.name}
                </h2>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
                <UsersRound className="size-3.5" />
                {side.entries.length} entries
              </span>
            </div>

            <div className="mt-4 space-y-2">
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
      <section className="rounded-md border border-white/10 bg-white/4">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-primary/80">
              Fixtures
            </p>
            <h2 className="mt-1 text-base font-semibold text-foreground">
              Generated match list
            </h2>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
            <Swords className="size-3.5" />
            {matches.length} total
          </span>
        </div>

        <div className="divide-y divide-white/10">
          {matches.map((match) => (
            <div key={match.id} className="px-4 py-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/10 bg-background/70 px-2.5 py-1 text-[11px] text-muted-foreground">
                      Match {match.matchOrder}
                    </span>
                    {match.roundLabel ? (
                      <span className="text-xs text-muted-foreground">
                        {match.roundLabel}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground">
                    <span>{getEntryName(match.entryA)}</span>
                    <span className="text-xs font-medium text-muted-foreground">
                      vs
                    </span>
                    <span>{getEntryName(match.entryB)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
                    {getScoreText(match)}
                  </span>

                  <span
                    className={[
                      "rounded-full border px-3 py-1.5 text-xs",
                      match.winnerEntryId
                        ? "border-primary/20 bg-primary/10 text-primary"
                        : "border-white/10 bg-background/70 text-muted-foreground",
                    ].join(" ")}
                  >
                    {match.winnerEntryId ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <section className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <CompactStatPill label="Sides" value={sides.length} />
        <CompactStatPill label="Entries" value={entryCount} />
        <CompactStatPill label="Fixtures" value={matches.length} />
        <CompactStatPill label="Completed" value={completedMatches} />
      </section>

      {rulesNote ? (
        <p className="rounded-md border border-white/10 bg-white/4 px-4 py-3 text-sm leading-6 text-muted-foreground">
          {rulesNote}
        </p>
      ) : null}
    </div>
  );
}
