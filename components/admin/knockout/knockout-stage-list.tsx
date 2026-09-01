"use client";

import { useState, useTransition } from "react";
import {
  MoreVertical,
  PenSquare,
  RotateCcw,
  Undo2,
  Users2,
} from "lucide-react";
import { resetKnockoutMatchTeamsAction } from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/knockout-actions";
import { resetMatchResultAction } from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/results/actions";
import { CreateDialog } from "@/components/admin/create-dialog";
import { CreateSheet } from "@/components/admin/create-sheet";
import { AssignKnockoutMatchForm } from "@/components/admin/knockout/assign-knockout-match-form";
import { RecordMatchResultForm } from "@/components/admin/results/record-match-result-form";
import { EmptyState } from "@/components/shared/empty-state";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { MatchCard } from "@/components/tournaments/match-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatTeamName } from "@/lib/utils/format";
import type { KnockoutStageType } from "@/lib/knockout/types";

type TeamOption = {
  id: string;
  label: string;
};

type KnockoutStage = {
  id: string;
  name: string;
  stageType: string;
  matches: Array<{
    id: string;
    roundLabel: string | null;
    status: string;
    scoreSummary: string | null;
    winnerId: string | null;
    teamAId: string | null;
    teamBId: string | null;
    sets: Array<{
      setNumber: number;
      teamAScore: number;
      teamBScore: number;
    }>;
    teamA: {
      teamName: string | null;
      player1: {
        fullName: string;
      };
      player2: {
        fullName: string;
      };
    } | null;
    teamB: {
      teamName: string | null;
      player1: {
        fullName: string;
      };
      player2: {
        fullName: string;
      };
    } | null;
  }>;
};

type KnockoutStageListProps = {
  tournamentId: string;
  categoryId: string;
  stages: KnockoutStage[];
} & (
  | {
      mode: "fixtures";
      teams: TeamOption[];
      knockoutStartStageType: KnockoutStageType | null;
    }
  | {
      mode: "results";
      teams?: never;
      knockoutStartStageType?: never;
    }
);

export function KnockoutStageList(props: KnockoutStageListProps) {
  const { tournamentId, categoryId, stages, mode } = props;

  if (stages.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:gap-4">
      {stages.map((stage) => {
        const canManageTeams =
          mode === "fixtures" &&
          props.knockoutStartStageType !== null &&
          (stage.stageType === props.knockoutStartStageType ||
            (props.knockoutStartStageType === "final" &&
              stage.stageType === "third_place"));

        return (
          <div key={stage.id} className="surface-card overflow-hidden">
            <div className="border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                <h4 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
                  {stage.name}
                </h4>

                <span className="text-xs text-muted-foreground sm:text-sm">
                  ⁜
                </span>

                <span className="text-xs text-muted-foreground sm:text-sm">
                  {stage.matches.length} matches
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {stage.matches.length === 0 ? (
                <EmptyState message="No knockout matches available yet." />
              ) : (
                <div className="grid gap-1.5 sm:gap-2 xl:grid-cols-2">
                  {stage.matches.map((match) => {
                    const teamALabel = match.teamA
                      ? formatTeamName(
                          match.teamA.player1.fullName,
                          match.teamA.player2.fullName,
                          match.teamA.teamName,
                        )
                      : "TBD";

                    const teamBLabel = match.teamB
                      ? formatTeamName(
                          match.teamB.player1.fullName,
                          match.teamB.player2.fullName,
                          match.teamB.teamName,
                        )
                      : "TBD";

                    const commonProps = {
                      tournamentId,
                      categoryId,
                      match,
                      teamALabel,
                      teamBLabel,
                    };

                    return mode === "fixtures" ? (
                      <KnockoutMatchCard
                        key={match.id}
                        {...commonProps}
                        teams={props.teams}
                        mode="fixtures"
                        canManageTeams={canManageTeams}
                      />
                    ) : (
                      <KnockoutMatchCard
                        key={match.id}
                        {...commonProps}
                        mode="results"
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

type KnockoutMatchCardProps = {
  tournamentId: string;
  categoryId: string;
  match: KnockoutStage["matches"][number];
  teamALabel: string;
  teamBLabel: string;
} & (
  | {
      mode: "fixtures";
      teams: TeamOption[];
      canManageTeams: boolean;
    }
  | {
      mode: "results";
      teams?: never;
      canManageTeams?: never;
    }
);

function KnockoutMatchCard(props: KnockoutMatchCardProps) {
  const { tournamentId, categoryId, match, mode, teamALabel, teamBLabel } =
    props;
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isResetTeamsOpen, setIsResetTeamsOpen] = useState(false);
  const [isResetResultOpen, setIsResetResultOpen] = useState(false);
  const [resultResetMessage, setResultResetMessage] = useState("");
  const [resultResetError, setResultResetError] = useState(false);
  const [resetTeamsMessage, setResetTeamsMessage] = useState("");
  const [resetTeamsError, setResetTeamsError] = useState(false);
  const [isResetTeamsPending, startResetTeamsTransition] = useTransition();
  const [isResetResultPending, startResetResultTransition] = useTransition();
  const participantsReady = Boolean(
    match.teamAId && match.teamBId && match.teamA && match.teamB,
  );

  return (
    <div className="relative space-y-2">
      {mode === "fixtures" && props.canManageTeams ? (
        <div className="absolute right-2 top-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-pointer rounded-full text-muted-foreground hover:bg-white/6 hover:text-foreground focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 ring-offset-0 focus:ring-offset-0 focus-visible:ring-offset-0"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open knockout match actions</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onSelect={() => {
                  setResetTeamsMessage("");
                  setResetTeamsError(false);
                  setIsAssignOpen(true);
                }}
                className="cursor-pointer"
              >
                <Users2 className="mr-2 h-4 w-4" />
                Assign teams
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => {
                  setResetTeamsMessage("");
                  setResetTeamsError(false);
                  setIsResetTeamsOpen(true);
                }}
                className="cursor-pointer"
                disabled={isResetTeamsPending}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset teams
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : null}

      <MatchCard match={match} />

      {mode === "fixtures" && resetTeamsMessage && !isResetTeamsOpen ? (
        <p
          className={`text-sm ${
            resetTeamsError ? "text-red-400" : "text-emerald-400"
          }`}
        >
          {resetTeamsMessage}
        </p>
      ) : null}

      {resultResetMessage && !isResetResultOpen ? (
        <p
          className={`text-sm ${
            resultResetError ? "text-red-400" : "text-emerald-400"
          }`}
        >
          {resultResetMessage}
        </p>
      ) : null}

      {mode === "results" ? (
        <div className="flex flex-wrap justify-end gap-1.5">
          <CreateSheet
            open={isResultOpen}
            onOpenChange={setIsResultOpen}
            triggerLabel={
              match.status === "completed" ? "Edit result" : "Record result"
            }
            title="Record knockout result"
            description="Enter the knockout match score carefully."
            triggerClassName={actionPillButtonClassName({
              variant: match.status === "completed" ? "edit" : "create",
              className:
                "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
            })}
            triggerIcon={<PenSquare className="h-3.5 w-3.5" />}
            triggerDisabled={!participantsReady}
          >
            {isResultOpen ? (
              <RecordMatchResultForm
                tournamentId={tournamentId}
                categoryId={categoryId}
                matchId={match.id}
                teamALabel={teamALabel}
                teamBLabel={teamBLabel}
                existingSets={match.sets}
                onSuccess={() => setIsResultOpen(false)}
              />
            ) : null}
          </CreateSheet>

          {match.status === "completed" ? (
            <CreateDialog
              open={isResetResultOpen}
              onOpenChange={setIsResetResultOpen}
              triggerLabel="Reset result"
              title="Reset knockout result"
              description="This will permanently remove the recorded result and sets. Downstream participant slots may also be cleared."
              triggerClassName={actionPillButtonClassName({
                variant: "neutral",
                className:
                  "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
              })}
              triggerIcon={<Undo2 className="h-3.5 w-3.5" />}
              triggerDisabled={isResetResultPending}
            >
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();

                  const formData = new FormData();
                  formData.set("tournamentId", tournamentId);
                  formData.set("categoryId", categoryId);
                  formData.set("matchId", match.id);

                  setResultResetMessage("");
                  setResultResetError(false);

                  startResetResultTransition(async () => {
                    const result = await resetMatchResultAction(formData);

                    setResultResetError(!result.success);
                    setResultResetMessage(result.message);

                    if (result.success) {
                      setIsResetResultOpen(false);
                    }
                  });
                }}
              >
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to reset this knockout result? Its
                  recorded result and sets will be removed, and any downstream
                  participant slots supplied by this match may also be cleared.
                </p>

                {resultResetMessage ? (
                  <div
                    className={`rounded-xl border px-3 py-2 text-sm ${
                      resultResetError
                        ? "border-red-500/20 bg-red-500/10 text-red-300"
                        : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                    }`}
                  >
                    {resultResetMessage}
                  </div>
                ) : null}

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsResetResultOpen(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={isResetResultPending}
                  >
                    {isResetResultPending ? "Resetting..." : "Reset result"}
                  </Button>
                </div>
              </form>
            </CreateDialog>
          ) : null}

          {!participantsReady ? (
            <p className="w-full text-right text-[10px] text-muted-foreground sm:text-[11px]">
              Assign both teams before recording a result.
            </p>
          ) : null}
        </div>
      ) : null}

      {mode === "fixtures" && props.canManageTeams ? (
        <>
          <CreateSheet
            open={isAssignOpen}
            onOpenChange={setIsAssignOpen}
            triggerLabel=""
            hideTrigger
            title="Assign knockout teams"
            description="Choose the teams for this knockout match."
          >
            <AssignKnockoutMatchForm
              tournamentId={tournamentId}
              categoryId={categoryId}
              matchId={match.id}
              teams={props.teams}
              defaultTeamAId={match.teamAId}
              defaultTeamBId={match.teamBId}
            />
          </CreateSheet>

          <CreateDialog
            open={isResetTeamsOpen}
            onOpenChange={setIsResetTeamsOpen}
            triggerLabel=""
            hideTrigger
            title="Reset knockout teams"
            description="This will reset both participant slots to TBD."
          >
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                setResetTeamsMessage("");
                setResetTeamsError(false);

                startResetTeamsTransition(async () => {
                  try {
                    await resetKnockoutMatchTeamsAction({
                      tournamentId,
                      categoryId,
                      matchId: match.id,
                    });

                    setResetTeamsError(false);
                    setResetTeamsMessage(
                      "Knockout match teams reset successfully.",
                    );
                    setIsResetTeamsOpen(false);
                  } catch (error) {
                    setResetTeamsError(true);
                    setResetTeamsMessage(
                      error instanceof Error
                        ? error.message
                        : "Failed to reset knockout match teams.",
                    );
                  }
                });
              }}
            >
              <p className="text-sm text-muted-foreground">
                Are you sure you want to reset this knockout match? Team A and
                Team B will both be changed to TBD.
              </p>

              {resetTeamsMessage ? (
                <div
                  className={`rounded-xl border px-3 py-2 text-sm ${
                    resetTeamsError
                      ? "border-red-500/20 bg-red-500/10 text-red-300"
                      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                  }`}
                >
                  {resetTeamsMessage}
                </div>
              ) : null}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsResetTeamsOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isResetTeamsPending}
                >
                  {isResetTeamsPending ? "Resetting..." : "Reset teams"}
                </Button>
              </div>
            </form>
          </CreateDialog>
        </>
      ) : null}
    </div>
  );
}
