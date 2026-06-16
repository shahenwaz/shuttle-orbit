"use client";

import { useState, useTransition } from "react";
import { PenSquare, Undo2 } from "lucide-react";

import { resetLeagueResultAction } from "@/app/admin/leagues/[leagueId]/actions";
import { CreateDialog } from "@/components/admin/create-dialog";
import { CreateSheet } from "@/components/admin/create-sheet";
import { LeagueResultForm } from "@/components/admin/leagues/league-result-form";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { Button } from "@/components/ui/button";
import { MatchCard } from "@/components/tournaments/match-card";
import { formatLeagueDisplayName } from "@/lib/leagues/display";

type Player = {
  fullName: string;
  nickname: string | null;
};

type Entry = {
  displayName: string | null;
  player1: Player;
  player2: Player | null;
};

type LeagueMatch = {
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

type LeagueFixtureResultsProps = {
  leagueId: string;
  matches: LeagueMatch[];
};

function getPlayerName(player: Player) {
  return formatLeagueDisplayName(player.nickname || player.fullName);
}

function getEntryName(entry: Entry | null) {
  if (!entry) return "TBD";

  if (entry.displayName) {
    return formatLeagueDisplayName(entry.displayName);
  }

  if (!entry.player2) {
    return getPlayerName(entry.player1);
  }

  return `${getPlayerName(entry.player1)} + ${getPlayerName(entry.player2)}`;
}

function toMatchCardMatch(match: LeagueMatch) {
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

export function LeagueFixtureResults({
  leagueId,
  matches,
}: LeagueFixtureResultsProps) {
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
                <ClubLeagueResultMatchCard
                  key={match.id}
                  leagueId={leagueId}
                  match={match}
                  entryALabel={entryALabel}
                  entryBLabel={entryBLabel}
                  isCompleted={isCompleted}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function ClubLeagueResultMatchCard({
  leagueId,
  match,
  entryALabel,
  entryBLabel,
  isCompleted,
}: {
  leagueId: string;
  match: LeagueMatch;
  entryALabel: string;
  entryBLabel: string;
  isCompleted: boolean;
}) {
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState(false);
  const [isResetPending, startResetTransition] = useTransition();

  return (
    <div className="space-y-2">
      <MatchCard match={toMatchCardMatch(match)} />

      <div className="flex flex-wrap justify-end gap-1.5">
        <CreateSheet
          open={isResultOpen}
          onOpenChange={setIsResultOpen}
          triggerLabel={isCompleted ? "Edit result" : "Record result"}
          title="Record fixture result"
          description={`${entryALabel} vs ${entryBLabel}`}
          triggerClassName={actionPillButtonClassName({
            variant: isCompleted ? "edit" : "create",
            className:
              "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
          })}
          triggerIcon={<PenSquare className="h-3.5 w-3.5" />}
        >
          <LeagueResultForm
            leagueId={leagueId}
            matchId={match.id}
            entryALabel={entryALabel}
            entryBLabel={entryBLabel}
            existingSets={match.sets}
          />
        </CreateSheet>

        {isCompleted ? (
          <CreateDialog
            open={isResetOpen}
            onOpenChange={setIsResetOpen}
            triggerLabel="Reset result"
            title="Reset fixture result"
            description="This will clear the saved score and set the fixture back to pending."
            triggerClassName={actionPillButtonClassName({
              variant: "neutral",
              className:
                "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
            })}
            triggerIcon={<Undo2 className="h-3.5 w-3.5" />}
          >
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();

                const formData = new FormData();
                formData.set("leagueId", leagueId);
                formData.set("matchId", match.id);

                setResetMessage("");
                setResetError(false);

                startResetTransition(async () => {
                  const result = await resetLeagueResultAction(formData);
                  setResetError(!result.success);
                  setResetMessage(result.message);

                  if (result.success) {
                    setIsResetOpen(false);
                  }
                });
              }}
            >
              <p className="text-sm text-muted-foreground">
                Are you sure you want to reset this fixture result?
              </p>

              {resetMessage ? (
                <div
                  className={`rounded-md border px-3 py-2 text-sm ${
                    resetError
                      ? "border-red-500/20 bg-red-500/10 text-red-300"
                      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                  }`}
                >
                  {resetMessage}
                </div>
              ) : null}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsResetOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isResetPending}
                >
                  {isResetPending ? "Resetting..." : "Reset result"}
                </Button>
              </div>
            </form>
          </CreateDialog>
        ) : null}
      </div>
    </div>
  );
}
