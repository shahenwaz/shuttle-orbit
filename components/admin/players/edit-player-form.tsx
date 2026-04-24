"use client";

import { useActionState, useEffect } from "react";

import {
  updatePlayerAction,
  type UpdatePlayerActionState,
} from "@/app/admin/players/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type EditPlayerFormProps = {
  player: {
    id: string;
    fullName: string;
    nickname: string;
  };
  onSuccess?: () => void;
};

const initialState: UpdatePlayerActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function EditPlayerForm({ player, onSuccess }: EditPlayerFormProps) {
  const [state, formAction, isPending] = useActionState(
    updatePlayerAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      onSuccess?.();
    }
  }, [onSuccess, state.success]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="playerId" value={player.id} />

      <div className="space-y-2">
        <label
          htmlFor={`fullName-${player.id}`}
          className="text-sm font-medium text-foreground"
        >
          Full name
        </label>
        <Input
          id={`fullName-${player.id}`}
          name="fullName"
          defaultValue={player.fullName}
          placeholder="Enter full name"
        />
        {state.fieldErrors?.fullName?.length ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.fullName[0]}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor={`nickname-${player.id}`}
          className="text-sm font-medium text-foreground"
        >
          Username
        </label>
        <Input
          id={`nickname-${player.id}`}
          name="nickname"
          defaultValue={player.nickname}
          placeholder="Enter username"
        />
        {state.fieldErrors?.nickname?.length ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.nickname[0]}
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
