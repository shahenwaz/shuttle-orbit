"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";

import {
  recordMatchResultAction,
  type RecordMatchResultActionState,
} from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/results/actions";
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
  const [state, formAction, isPending] = useActionState(
    recordMatchResultAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <input type="hidden" name="categoryId" value={categoryId} />
      <input type="hidden" name="matchId" value={matchId} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="teamAScore">{teamALabel}</Label>
          <Input
            id="teamAScore"
            name="teamAScore"
            type="number"
            min={0}
            max={99}
            placeholder="Enter Score"
          />
          {state.fieldErrors?.teamAScore ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.teamAScore[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="teamBScore">{teamBLabel}</Label>
          <Input
            id="teamBScore"
            name="teamBScore"
            type="number"
            min={0}
            max={99}
            placeholder="Enter Score"
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

      <Button type="submit" disabled={isPending} className="min-w-36">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save result
          </>
        )}
      </Button>
    </form>
  );
}
