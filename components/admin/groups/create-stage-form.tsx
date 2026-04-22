"use client";

import { useActionState } from "react";
import { Loader2, PlusSquare } from "lucide-react";

import {
  createCategoryGroupStageAction,
  type CreateCategoryGroupStageActionState,
} from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/groups/actions";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateStageFormProps = {
  tournamentId: string;
  categoryId: string;
};

const initialState: CreateCategoryGroupStageActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function CreateStageForm({
  tournamentId,
  categoryId,
}: CreateStageFormProps) {
  const [state, formAction, isPending] = useActionState(
    createCategoryGroupStageAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <input type="hidden" name="categoryId" value={categoryId} />

      <div className="space-y-2">
        <Label htmlFor="stageName">Stage name</Label>
        <Input
          id="stageName"
          name="stageName"
          placeholder="Example: Quarter Final Groups"
        />
        {state.fieldErrors?.stageName?.length ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.stageName[0]}
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
            Create stage
          </>
        )}
      </Button>
    </form>
  );
}
