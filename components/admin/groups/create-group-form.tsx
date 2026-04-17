"use client";

import { useActionState, useEffect, useRef } from "react";
import { FolderPlus, Loader2 } from "lucide-react";

import {
  createGroupAction,
  type CreateGroupActionState,
} from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/groups/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateGroupFormProps = {
  tournamentId: string;
  categoryId: string;
};

const initialState: CreateGroupActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function CreateGroupForm({
  tournamentId,
  categoryId,
}: CreateGroupFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    createGroupAction,
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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Group name</Label>
          <Input id="name" name="name" placeholder="e.g. B1" />
          {state.fieldErrors?.name ? (
            <p className="text-sm text-red-400">{state.fieldErrors.name[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="groupOrder">Group order</Label>
          <Input id="groupOrder" name="groupOrder" type="number" min={1} />
          {state.fieldErrors?.groupOrder ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.groupOrder[0]}
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
            Creating...
          </>
        ) : (
          <>
            <FolderPlus className="mr-2 h-4 w-4" />
            Add group
          </>
        )}
      </Button>
    </form>
  );
}
