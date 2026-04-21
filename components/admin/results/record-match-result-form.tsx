"use client";

import { useActionState, useEffect, useRef } from "react";
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
}: RecordMatchResultFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    recordMatchResultAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <input type="hidden" name="categoryId" value={categoryId} />
      <input type="hidden" name="matchId" value={matchId} />

      <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-muted-foreground">
        <div className="space-y-1">
          <p className="font-medium text-foreground">{teamALabel}</p>
          <p className="font-medium text-foreground">{teamBLabel}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`teamAScore-${matchId}`}>{teamALabel}</Label>
          <Input
            id={`teamAScore-${matchId}`}
            name="teamAScore"
            type="number"
            min={0}
            placeholder="Enter score"
          />
          {state.fieldErrors?.teamAScore ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.teamAScore[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`teamBScore-${matchId}`}>{teamBLabel}</Label>
          <Input
            id={`teamBScore-${matchId}`}
            name="teamBScore"
            type="number"
            min={0}
            placeholder="Enter score"
          />
          {state.fieldErrors?.teamBScore ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.teamBScore[0]}
            </p>
          ) : null}
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
