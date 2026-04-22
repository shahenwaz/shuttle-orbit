"use client";

import { useState, useTransition } from "react";
import { PenSquare, Undo2 } from "lucide-react";

import { resetMatchResultAction } from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/results/actions";
import { CreateSheet } from "@/components/admin/create-sheet";
import { RecordMatchResultForm } from "@/components/admin/results/record-match-result-form";
import { EmptyState } from "@/components/shared/empty-state";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { MatchCard } from "@/components/tournaments/match-card";
import { Button } from "@/components/ui/button";
import { formatTeamName } from "@/lib/utils/format";
import { CreateDialog } from "../create-dialog";

type MatchRow = {
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
};

type GroupResultRow = {
  id: string;
  name: string;
  matches: MatchRow[];
};

type ResultsGroupListProps = {
  tournamentId: string;
  categoryId: string;
  groups: GroupResultRow[];
};

export function ResultsGroupList({
  tournamentId,
  categoryId,
  groups,
}: ResultsGroupListProps) {
  if (groups.length === 0) {
    return (
      <EmptyState message="No groups available yet. Create groups and fixtures first." />
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4">
      {groups.map((group) => {
        const completedCount = group.matches.filter(
          (match) => match.status === "completed",
        ).length;

        return (
          <div key={group.id} className="surface-card overflow-hidden">
            <div className="border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                <h4 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
                  {group.name}
                </h4>

                <span className="text-xs text-muted-foreground sm:text-sm">
                  ⁜
                </span>

                <span className="text-xs text-muted-foreground sm:text-sm">
                  {group.matches.length} matches
                </span>

                <span className="text-xs text-muted-foreground sm:text-sm">
                  ⁜
                </span>

                <span className="text-xs text-muted-foreground sm:text-sm">
                  {completedCount} completed
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {group.matches.length === 0 ? (
                <EmptyState message="No fixtures generated yet for this group." />
              ) : (
                <div className="grid gap-1.5 sm:gap-2 xl:grid-cols-2">
                  {group.matches.map((match) => {
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
                      <GroupResultMatchCard
                        key={match.id}
                        tournamentId={tournamentId}
                        categoryId={categoryId}
                        match={match}
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

function GroupResultMatchCard({
  tournamentId,
  categoryId,
  match,
  teamALabel,
  teamBLabel,
}: {
  tournamentId: string;
  categoryId: string;
  match: MatchRow;
  teamALabel: string;
  teamBLabel: string;
}) {
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState(false);
  const [isResetPending, startResetTransition] = useTransition();

  return (
    <div className="space-y-2">
      <MatchCard match={match} />

      <div className="flex flex-wrap justify-end gap-1.5">
        <CreateSheet
          open={isResultOpen}
          onOpenChange={setIsResultOpen}
          triggerLabel={
            match.status === "completed" ? "Edit result" : "Record result"
          }
          title="Record match result"
          description="Enter the match score carefully. This updates the winner and standings."
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

        {match.status === "completed" ? (
          <CreateDialog
            open={isResetOpen}
            onOpenChange={setIsResetOpen}
            triggerLabel="Reset result"
            title="Reset match result"
            description="This will clear the saved score and set the match back to scheduled."
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
                formData.set("tournamentId", tournamentId);
                formData.set("categoryId", categoryId);
                formData.set("matchId", match.id);

                setResetMessage("");
                setResetError(false);

                startResetTransition(async () => {
                  const result = await resetMatchResultAction(formData);
                  setResetError(!result.success);
                  setResetMessage(result.message);

                  if (result.success) {
                    setIsResetOpen(false);
                  }
                });
              }}
            >
              <p className="text-sm text-muted-foreground">
                Are you sure you want to reset this match result?
              </p>

              {resetMessage ? (
                <div
                  className={`rounded-xl border px-3 py-2 text-sm ${
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
