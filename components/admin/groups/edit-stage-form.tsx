"use client";

import { useActionState, useEffect } from "react";
import { Loader2, Pencil } from "lucide-react";

import {
  updateCategoryStageAction,
  type UpdateCategoryStageActionState,
} from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/groups/actions";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EditStageFormProps = {
  tournamentId: string;
  categoryId: string;
  stage: {
    id: string;
    name: string;
  };
  onSuccess?: () => void;
};

const initialState: UpdateCategoryStageActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function EditStageForm({
  tournamentId,
  categoryId,
  stage,
  onSuccess,
}: EditStageFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateCategoryStageAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      onSuccess?.();
    }
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <input type="hidden" name="categoryId" value={categoryId} />
      <input type="hidden" name="stageId" value={stage.id} />

      <div className="space-y-2">
        <Label htmlFor={`stageName-${stage.id}`}>Stage name</Label>
        <Input
          id={`stageName-${stage.id}`}
          name="stageName"
          defaultValue={stage.name}
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
        className={actionPillButtonClassName({ variant: "edit" })}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Pencil className="mr-1 h-3.5 w-3.5" />
            Save stage
          </>
        )}
      </Button>
    </form>
  );
}
