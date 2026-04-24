"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, Plus } from "lucide-react";

import {
  createGroupMatchAction,
  type CreateGroupMatchActionState,
} from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/fixtures/actions";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TeamOption = {
  id: string;
  label: string;
};

type CreateGroupMatchFormProps = {
  tournamentId: string;
  categoryId: string;
  groupId: string;
  teams: TeamOption[];
};

const initialState: CreateGroupMatchActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function CreateGroupMatchForm({
  tournamentId,
  categoryId,
  groupId,
  teams,
}: CreateGroupMatchFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    createGroupMatchAction,
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
      <input type="hidden" name="groupId" value={groupId} />

      <div className="space-y-2">
        <Label htmlFor={`roundLabel-${groupId}`}>Round label</Label>
        <Input
          id={`roundLabel-${groupId}`}
          name="roundLabel"
          placeholder="Example: Round 4 or Manual Match"
          defaultValue="Manual Match"
        />
        {state.fieldErrors?.roundLabel ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.roundLabel[0]}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`teamAId-${groupId}`}>Team A</Label>
          <select
            id={`teamAId-${groupId}`}
            name="teamAId"
            defaultValue=""
            className="flex h-11 w-full rounded-xl border border-white/10 bg-background/70 px-4 text-sm text-foreground shadow-sm outline-none transition focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/25"
          >
            <option value="" disabled>
              Select team A
            </option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.label}
              </option>
            ))}
          </select>
          {state.fieldErrors?.teamAId ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.teamAId[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`teamBId-${groupId}`}>Team B</Label>
          <select
            id={`teamBId-${groupId}`}
            name="teamBId"
            defaultValue=""
            className="flex h-11 w-full rounded-xl border border-white/10 bg-background/70 px-4 text-sm text-foreground shadow-sm outline-none transition focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/25"
          >
            <option value="" disabled>
              Select team B
            </option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.label}
              </option>
            ))}
          </select>
          {state.fieldErrors?.teamBId ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.teamBId[0]}
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
            Creating...
          </>
        ) : (
          <>
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add match
          </>
        )}
      </Button>
    </form>
  );
}
