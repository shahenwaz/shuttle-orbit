"use client";

import { useState, useTransition } from "react";
import { Loader2, Save } from "lucide-react";

import { assignKnockoutMatchTeamsAction } from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/knockout-actions";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type TeamOption = {
  id: string;
  label: string;
};

type AssignKnockoutMatchFormProps = {
  tournamentId: string;
  categoryId: string;
  matchId: string;
  teams: TeamOption[];
  defaultTeamAId?: string | null;
  defaultTeamBId?: string | null;
};

export function AssignKnockoutMatchForm({
  tournamentId,
  categoryId,
  matchId,
  teams,
  defaultTeamAId = null,
  defaultTeamBId = null,
}: AssignKnockoutMatchFormProps) {
  const [teamAId, setTeamAId] = useState(defaultTeamAId ?? "");
  const [teamBId, setTeamBId] = useState(defaultTeamBId ?? "");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();

        startTransition(async () => {
          try {
            await assignKnockoutMatchTeamsAction({
              tournamentId,
              categoryId,
              matchId,
              teamAId: teamAId || null,
              teamBId: teamBId || null,
            });

            setIsError(false);
            setMessage("Knockout match teams saved successfully.");
          } catch (error) {
            setIsError(true);
            setMessage(
              error instanceof Error
                ? error.message
                : "Failed to save knockout match teams.",
            );
          }
        });
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`knockout-team-a-${matchId}`}>Team A</Label>
          <select
            id={`knockout-team-a-${matchId}`}
            value={teamAId}
            onChange={(event) => setTeamAId(event.target.value)}
            className="flex h-11 w-full rounded-xl border border-white/10 bg-background/70 px-4 text-sm text-foreground shadow-sm outline-none transition focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/25"
          >
            <option value="">TBD</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`knockout-team-b-${matchId}`}>Team B</Label>
          <select
            id={`knockout-team-b-${matchId}`}
            value={teamBId}
            onChange={(event) => setTeamBId(event.target.value)}
            className="flex h-11 w-full rounded-xl border border-white/10 bg-background/70 px-4 text-sm text-foreground shadow-sm outline-none transition focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/25"
          >
            <option value="">TBD</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {message ? (
        <p
          className={`text-sm ${isError ? "text-red-400" : "text-emerald-400"}`}
        >
          {message}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isPending}
        className={actionPillButtonClassName({ variant: "create" })}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-1 h-3.5 w-3.5" />
            Save teams
          </>
        )}
      </Button>
    </form>
  );
}
