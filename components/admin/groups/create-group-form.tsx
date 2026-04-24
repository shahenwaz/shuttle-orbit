"use client";

import { useActionState } from "react";
import { Loader2, PlusSquare } from "lucide-react";

import {
  createGroupAction,
  type CreateGroupActionState,
} from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/groups/actions";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateGroupFormProps = {
  tournamentId: string;
  categoryId: string;
  stages: Array<{
    id: string;
    name: string;
  }>;
};

const initialState: CreateGroupActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function CreateGroupForm({
  tournamentId,
  categoryId,
  stages,
}: CreateGroupFormProps) {
  const [state, formAction, isPending] = useActionState(
    createGroupAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <input type="hidden" name="categoryId" value={categoryId} />

      <div className="space-y-2">
        <Label htmlFor="stageId">Stage</Label>
        <select
          id="stageId"
          name="stageId"
          defaultValue={stages[0]?.id ?? ""}
          className="flex h-11 w-full rounded-xl border border-white/10 bg-background/70 px-4 text-sm text-foreground shadow-sm outline-none transition focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/25"
        >
          {stages.map((stage) => (
            <option key={stage.id} value={stage.id}>
              {stage.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Group name</Label>
        <Input id="name" name="name" placeholder="Example: Group Q1" />
        {state.fieldErrors?.name?.length ? (
          <p className="text-sm text-red-400">{state.fieldErrors.name[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="groupOrder">Group order</Label>
        <Input
          id="groupOrder"
          name="groupOrder"
          type="number"
          min={1}
          placeholder="1"
        />
        {state.fieldErrors?.groupOrder?.length ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.groupOrder[0]}
          </p>
        ) : null}
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
            <PlusSquare className="mr-1 h-3.5 w-3.5" />
            Add group
          </>
        )}
      </Button>
    </form>
  );
}
