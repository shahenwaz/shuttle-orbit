import { PenSquare } from "lucide-react";

import { CreateSheet } from "@/components/admin/create-sheet";
import { ClubLeagueResultForm } from "@/components/admin/club-leagues/club-league-result-form";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { MatchCard } from "@/components/tournaments/match-card";
import { formatClubLeagueDisplayName } from "@/lib/club-league/display";

type Player = {
  fullName: string;
  nickname: string;
};

type Entry = {
  displayName: string | null;
  player1: Player;
  player2: Player | null;
};

type ClubLeagueMatch = {
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

type ClubLeagueFixtureResultsProps = {
  leagueId: string;
  matches: ClubLeagueMatch[];
};

function getPlayerName(player: Player) {
  return formatClubLeagueDisplayName(player.nickname || player.fullName);
}

function getEntryName(entry: Entry | null) {
  if (!entry) return "TBD";

  if (entry.displayName) {
    return formatClubLeagueDisplayName(entry.displayName);
  }

  if (!entry.player2) {
    return getPlayerName(entry.player1);
  }

  return `${getPlayerName(entry.player1)} + ${getPlayerName(entry.player2)}`;
}

function toMatchCardMatch(match: ClubLeagueMatch) {
  return {
    id: match.id,
    roundLabel: match.roundLabel ?? `Match ${match.matchOrder}`,
    status: match.winnerEntryId ? "completed" : "scheduled",
    scoreSummary: match.scoreSummary,
    winnerId: match.winnerEntryId,
    teamAId: match.entryAId,
    teamBId: match.entryBId,
    teamA:
      match.entryA && match.entryA.player2
        ? {
            teamName: getEntryName(match.entryA),
            player1: match.entryA.player1,
            player2: match.entryA.player2,
          }
        : null,
    teamB:
      match.entryB && match.entryB.player2
        ? {
            teamName: getEntryName(match.entryB),
            player1: match.entryB.player1,
            player2: match.entryB.player2,
          }
        : null,
    sets: match.sets.map((set) => ({
      setNumber: set.setNumber,
      teamAScore: set.entryAScore,
      teamBScore: set.entryBScore,
    })),
  };
}

export function ClubLeagueFixtureResults({
  leagueId,
  matches,
}: ClubLeagueFixtureResultsProps) {
  const completedMatches = matches.filter(
    (match) => match.winnerEntryId,
  ).length;

  return (
    <section className="surface-card overflow-hidden">
      <div className="border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
            Fixtures & results
          </h3>

          <span className="text-xs text-muted-foreground sm:text-sm">⁜</span>

          <span className="text-xs text-muted-foreground sm:text-sm">
            {matches.length} fixtures
          </span>

          <span className="text-xs text-muted-foreground sm:text-sm">⁜</span>

          <span className="text-xs text-muted-foreground sm:text-sm">
            {completedMatches} completed
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {matches.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No fixtures generated yet.
          </p>
        ) : (
          <div className="grid gap-1.5 sm:gap-2 xl:grid-cols-2">
            {matches.map((match) => {
              const entryALabel = getEntryName(match.entryA);
              const entryBLabel = getEntryName(match.entryB);
              const isCompleted = Boolean(match.winnerEntryId);

              return (
                <div key={match.id} className="space-y-2">
                  <MatchCard match={toMatchCardMatch(match)} />

                  <div className="flex flex-wrap justify-end gap-1.5">
                    <CreateSheet
                      triggerLabel={
                        isCompleted ? "Edit result" : "Record result"
                      }
                      title="Record fixture result"
                      description={`${entryALabel} vs ${entryBLabel}`}
                      triggerClassName={actionPillButtonClassName({
                        variant: isCompleted ? "edit" : "create",
                        className:
                          "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
                      })}
                      triggerIcon={<PenSquare className="h-3.5 w-3.5" />}
                    >
                      <ClubLeagueResultForm
                        leagueId={leagueId}
                        matchId={match.id}
                        entryALabel={entryALabel}
                        entryBLabel={entryBLabel}
                        existingSet={match.sets[0] ?? null}
                      />
                    </CreateSheet>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
