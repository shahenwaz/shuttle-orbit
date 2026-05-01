"use client";

import { useActionState, useRef } from "react";
import { Loader2, Save } from "lucide-react";

import {
  recordMatchResultAction,
  type RecordMatchResultActionState,
} from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/results/actions";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RecordMatchResultFormProps = {
  tournamentId: string;
  categoryId: string;
  matchId: string;
  teamALabel: string;
  teamBLabel: string;
  existingSets?: Array<{
    setNumber: number;
    teamAScore: number;
    teamBScore: number;
  }>;
};

const initialState: RecordMatchResultActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function RecordMatchResultForm({
  tournamentId,
  categoryId,
  matchId,
  teamALabel,
  teamBLabel,
  existingSets = [],
}: RecordMatchResultFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    recordMatchResultAction,
    initialState,
  );

  const set1 = existingSets.find((set) => set.setNumber === 1);
  const set2 = existingSets.find((set) => set.setNumber === 2);
  const set3 = existingSets.find((set) => set.setNumber === 3);
  const hasExistingResult = existingSets.length > 0;

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <input type="hidden" name="categoryId" value={categoryId} />
      <input type="hidden" name="matchId" value={matchId} />

      <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-muted-foreground">
        <div className="space-y-1">
          <p className="font-medium text-foreground">{teamALabel}</p>
          <p className="font-medium text-foreground">{teamBLabel}</p>

          {hasExistingResult ? (
            <p className="pt-1 text-xs text-primary">
              Existing result loaded. Update any set or add the next set.
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
          <p className="mb-3 text-sm font-medium text-foreground">Set 1</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`set1TeamAScore-${matchId}`}>{teamALabel}</Label>
              <Input
                id={`set1TeamAScore-${matchId}`}
                name="set1TeamAScore"
                type="number"
                min={0}
                placeholder="Enter score"
                defaultValue={set1?.teamAScore ?? ""}
              />
              {state.fieldErrors?.set1TeamAScore ? (
                <p className="text-sm text-red-400">
                  {state.fieldErrors.set1TeamAScore[0]}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`set1TeamBScore-${matchId}`}>{teamBLabel}</Label>
              <Input
                id={`set1TeamBScore-${matchId}`}
                name="set1TeamBScore"
                type="number"
                min={0}
                placeholder="Enter score"
                defaultValue={set1?.teamBScore ?? ""}
              />
              {state.fieldErrors?.set1TeamBScore ? (
                <p className="text-sm text-red-400">
                  {state.fieldErrors.set1TeamBScore[0]}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
          <p className="mb-3 text-sm font-medium text-foreground">
            Set 2 <span className="text-muted-foreground">(optional)</span>
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`set2TeamAScore-${matchId}`}>{teamALabel}</Label>
              <Input
                id={`set2TeamAScore-${matchId}`}
                name="set2TeamAScore"
                type="number"
                min={0}
                placeholder="Leave empty if not needed"
                defaultValue={set2?.teamAScore ?? ""}
              />
              {state.fieldErrors?.set2TeamAScore ? (
                <p className="text-sm text-red-400">
                  {state.fieldErrors.set2TeamAScore[0]}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`set2TeamBScore-${matchId}`}>{teamBLabel}</Label>
              <Input
                id={`set2TeamBScore-${matchId}`}
                name="set2TeamBScore"
                type="number"
                min={0}
                placeholder="Leave empty if not needed"
                defaultValue={set2?.teamBScore ?? ""}
              />
              {state.fieldErrors?.set2TeamBScore ? (
                <p className="text-sm text-red-400">
                  {state.fieldErrors.set2TeamBScore[0]}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
          <p className="mb-3 text-sm font-medium text-foreground">
            Set 3 <span className="text-muted-foreground">(optional)</span>
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`set3TeamAScore-${matchId}`}>{teamALabel}</Label>
              <Input
                id={`set3TeamAScore-${matchId}`}
                name="set3TeamAScore"
                type="number"
                min={0}
                placeholder="Leave empty if not needed"
                defaultValue={set3?.teamAScore ?? ""}
              />
              {state.fieldErrors?.set3TeamAScore ? (
                <p className="text-sm text-red-400">
                  {state.fieldErrors.set3TeamAScore[0]}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`set3TeamBScore-${matchId}`}>{teamBLabel}</Label>
              <Input
                id={`set3TeamBScore-${matchId}`}
                name="set3TeamBScore"
                type="number"
                min={0}
                placeholder="Leave empty if not needed"
                defaultValue={set3?.teamBScore ?? ""}
              />
              {state.fieldErrors?.set3TeamBScore ? (
                <p className="text-sm text-red-400">
                  {state.fieldErrors.set3TeamBScore[0]}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {state.message ? (
        <p
          className={`text-sm ${
            state.success ? "text-emerald-400" : "text-red-400"
          }`}
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
            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-1 h-3.5 w-3.5" />
            Save result
          </>
        )}
      </Button>
    </form>
  );
}
