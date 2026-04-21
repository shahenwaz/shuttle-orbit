"use client";

import { useState, useTransition } from "react";
import { MoreVertical, PenSquare, RotateCcw, Users2 } from "lucide-react";

import { resetKnockoutMatchTeamsAction } from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/knockout-actions";
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

type KnockoutStageListProps = {
  tournamentId: string;
  categoryId: string;
  teams: Array<{
    id: string;
    label: string;
  }>;
  stages: Array<{
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
      teamA: {
        teamName: string | null;
        player1: {
          fullName: string;
          nickname: string;
        };
        player2: {
          fullName: string;
          nickname: string;
        };
      } | null;
      teamB: {
        teamName: string | null;
        player1: {
          fullName: string;
          nickname: string;
        };
        player2: {
          fullName: string;
          nickname: string;
        };
      } | null;
    }>;
  }>;
  mode: "fixtures" | "results";
  knockoutStartStageType: KnockoutStageType | null;
};

export function KnockoutStageList({
  tournamentId,
  categoryId,
  teams,
  stages,
  mode,
  knockoutStartStageType,
}: KnockoutStageListProps) {
  if (stages.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:gap-4">
      {stages.map((stage) => {
        const canManageTeams =
          mode === "fixtures" &&
          knockoutStartStageType !== null &&
          stage.stageType === knockoutStartStageType;

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

                    return (
                      <KnockoutMatchCard
                        key={match.id}
                        tournamentId={tournamentId}
                        categoryId={categoryId}
                        teams={teams}
                        match={match}
                        mode={mode}
                        canManageTeams={canManageTeams}
                        teamALabel={teamALabel}
                        teamBLabel={teamBLabel}
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

function KnockoutMatchCard({
  tournamentId,
  categoryId,
  teams,
  match,
  mode,
  canManageTeams,
  teamALabel,
  teamBLabel,
}: {
  tournamentId: string;
  categoryId: string;
  teams: Array<{ id: string; label: string }>;
  match: KnockoutStageListProps["stages"][number]["matches"][number];
  mode: "fixtures" | "results";
  canManageTeams: boolean;
  teamALabel: string;
  teamBLabel: string;
}) {
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState(false);
  const [isResetPending, startResetTransition] = useTransition();

  return (
    <div className="relative space-y-2">
      {canManageTeams ? (
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
                  setResetMessage("");
                  setResetError(false);
                  setIsAssignOpen(true);
                }}
                className="cursor-pointer"
              >
                <Users2 className="mr-2 h-4 w-4" />
                Assign teams
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => {
                  setResetMessage("");
                  setResetError(false);

                  startResetTransition(async () => {
                    try {
                      await resetKnockoutMatchTeamsAction({
                        tournamentId,
                        categoryId,
                        matchId: match.id,
                      });

                      setResetError(false);
                      setResetMessage(
                        "Knockout match teams reset successfully.",
                      );
                    } catch (error) {
                      setResetError(true);
                      setResetMessage(
                        error instanceof Error
                          ? error.message
                          : "Failed to reset knockout match teams.",
                      );
                    }
                  });
                }}
                className="cursor-pointer"
                disabled={isResetPending}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset teams
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : null}

      <MatchCard match={match} />

      {resetMessage ? (
        <p
          className={`text-sm ${
            resetError ? "text-red-400" : "text-emerald-400"
          }`}
        >
          {resetMessage}
        </p>
      ) : null}

      {mode === "results" ? (
        <div className="flex justify-end">
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
          >
            <RecordMatchResultForm
              tournamentId={tournamentId}
              categoryId={categoryId}
              matchId={match.id}
              teamALabel={teamALabel}
              teamBLabel={teamBLabel}
            />
          </CreateSheet>
        </div>
      ) : null}

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
          teams={teams}
          defaultTeamAId={match.teamAId}
          defaultTeamBId={match.teamBId}
        />
      </CreateSheet>
    </div>
  );
}
