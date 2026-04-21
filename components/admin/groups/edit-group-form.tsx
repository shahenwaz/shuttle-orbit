"use client";

import { useActionState } from "react";

import {
  updateGroupAction,
  type UpdateGroupActionState,
} from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/groups/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EditGroupFormProps = {
  tournamentId: string;
  categoryId: string;
  group: {
    id: string;
    name: string;
    groupOrder: number;
  };
};

const initialState: UpdateGroupActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function EditGroupForm({
  tournamentId,
  categoryId,
  group,
}: EditGroupFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateGroupAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <input type="hidden" name="categoryId" value={categoryId} />
      <input type="hidden" name="groupId" value={group.id} />

      <div className="space-y-2">
        <Label htmlFor={`name-${group.id}`}>Group name</Label>
        <Input
          id={`name-${group.id}`}
          name="name"
          defaultValue={group.name}
          placeholder="Enter group name"
        />
        {state.fieldErrors?.name?.length ? (
          <p className="text-sm text-red-400">{state.fieldErrors.name[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`groupOrder-${group.id}`}>Group order</Label>
        <Input
          id={`groupOrder-${group.id}`}
          name="groupOrder"
          type="number"
          min={1}
          defaultValue={group.groupOrder}
          placeholder="Enter display order"
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

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
