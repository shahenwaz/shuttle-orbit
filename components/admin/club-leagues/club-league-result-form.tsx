"use client";

import { useActionState, useRef } from "react";
import { Loader2, Save } from "lucide-react";

import {
  recordClubLeagueResultAction,
  type ClubLeagueResultActionState,
} from "@/app/admin/club-leagues/[leagueId]/actions";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatClubLeagueDisplayName } from "@/lib/club-league/display";

type ClubLeagueResultFormProps = {
  leagueId: string;
  matchId: string;
  entryALabel: string;
  entryBLabel: string;
  existingSet?: {
    entryAScore: number;
    entryBScore: number;
  } | null;
};

const initialState: ClubLeagueResultActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function ClubLeagueResultForm({
  leagueId,
  matchId,
  entryALabel,
  entryBLabel,
  existingSet,
}: ClubLeagueResultFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    recordClubLeagueResultAction,
    initialState,
  );

  const hasExistingResult = Boolean(existingSet);
  const formattedEntryALabel = formatClubLeagueDisplayName(entryALabel);
  const formattedEntryBLabel = formatClubLeagueDisplayName(entryBLabel);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="leagueId" value={leagueId} />
      <input type="hidden" name="matchId" value={matchId} />

      <div className="rounded-md border border-white/10 bg-white/4 p-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Entry A
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {formattedEntryALabel}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Entry B
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {formattedEntryBLabel}
            </p>
          </div>
        </div>
      </div>

      {hasExistingResult ? (
        <p className="rounded-md border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-primary">
          Existing result loaded. Update the score and save again if needed.
        </p>
      ) : null}

      <div className="rounded-md border border-white/10 bg-white/4 p-3">
        <p className="text-sm font-medium text-foreground">Score</p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${matchId}-entry-a-score`}>
              {formattedEntryALabel}
            </Label>
            <Input
              id={`${matchId}-entry-a-score`}
              name="entryAScore"
              type="number"
              min={0}
              defaultValue={existingSet?.entryAScore ?? ""}
              placeholder="21"
            />
            {state.fieldErrors?.entryAScore ? (
              <p className="text-xs text-red-300">
                {state.fieldErrors.entryAScore[0]}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${matchId}-entry-b-score`}>
              {formattedEntryBLabel}
            </Label>
            <Input
              id={`${matchId}-entry-b-score`}
              name="entryBScore"
              type="number"
              min={0}
              defaultValue={existingSet?.entryBScore ?? ""}
              placeholder="17"
            />
            {state.fieldErrors?.entryBScore ? (
              <p className="text-xs text-red-300">
                {state.fieldErrors.entryBScore[0]}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {state.message ? (
        <p
          className={
            state.success ? "text-sm text-primary" : "text-sm text-red-300"
          }
        >
          {state.message}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isPending}
        className={actionPillButtonClassName({ variant: "create" })}
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="size-4" />
            Save result
          </>
        )}
      </Button>
    </form>
  );
}
