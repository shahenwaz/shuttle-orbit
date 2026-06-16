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
  existingSets?: {
    setNumber: number;
    entryAScore: number;
    entryBScore: number;
  }[];
};

const initialState: ClubLeagueResultActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

function getExistingSet(
  existingSets: ClubLeagueResultFormProps["existingSets"],
  setNumber: number,
) {
  return existingSets?.find((set) => set.setNumber === setNumber) ?? null;
}

export function ClubLeagueResultForm({
  leagueId,
  matchId,
  entryALabel,
  entryBLabel,
  existingSets = [],
}: ClubLeagueResultFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    recordClubLeagueResultAction,
    initialState,
  );

  const formattedEntryALabel = formatClubLeagueDisplayName(entryALabel);
  const formattedEntryBLabel = formatClubLeagueDisplayName(entryBLabel);
  const hasExistingResult = existingSets.length > 0;

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="leagueId" value={leagueId} />
      <input type="hidden" name="matchId" value={matchId} />

      {hasExistingResult ? (
        <p className="rounded-md border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-primary">
          Existing result loaded. Update the scores and save again if needed.
        </p>
      ) : null}

      {[1, 2, 3].map((setNumber) => {
        const existingSet = getExistingSet(existingSets, setNumber);
        const isRequired = setNumber === 1;
        const entryAKey = `set${setNumber}EntryAScore` as keyof NonNullable<
          ClubLeagueResultActionState["fieldErrors"]
        >;
        const entryBKey = `set${setNumber}EntryBScore` as keyof NonNullable<
          ClubLeagueResultActionState["fieldErrors"]
        >;

        return (
          <div
            key={setNumber}
            className="rounded-md border border-white/10 bg-background/50 p-3"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Set {setNumber}
              </p>
              <span className="text-[11px] text-muted-foreground">
                {isRequired ? "Required" : "Optional"}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${matchId}-set-${setNumber}-entry-a`}>
                  {formattedEntryALabel}
                </Label>
                <Input
                  id={`${matchId}-set-${setNumber}-entry-a`}
                  name={`set${setNumber}EntryAScore`}
                  type="number"
                  min={0}
                  defaultValue={existingSet?.entryAScore ?? ""}
                  placeholder={isRequired ? "21" : ""}
                />
                {state.fieldErrors?.[entryAKey] ? (
                  <p className="text-xs text-red-300">
                    {state.fieldErrors[entryAKey]?.[0]}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${matchId}-set-${setNumber}-entry-b`}>
                  {formattedEntryBLabel}
                </Label>
                <Input
                  id={`${matchId}-set-${setNumber}-entry-b`}
                  name={`set${setNumber}EntryBScore`}
                  type="number"
                  min={0}
                  defaultValue={existingSet?.entryBScore ?? ""}
                  placeholder={isRequired ? "17" : ""}
                />
                {state.fieldErrors?.[entryBKey] ? (
                  <p className="text-xs text-red-300">
                    {state.fieldErrors[entryBKey]?.[0]}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}

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
