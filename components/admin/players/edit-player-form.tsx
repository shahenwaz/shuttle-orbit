"use client";

import { useActionState, useEffect } from "react";

import {
  updatePlayerAction,
  type UpdatePlayerActionState,
} from "@/app/admin/players/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ClubOption = {
  id: string;
  name: string;
  shortName: string | null;
};

type EditPlayerFormProps = {
  clubs: ClubOption[];
  player: {
    id: string;
    fullName: string;
    nickname: string | null;
    clubId: string | null;
  };
  onSuccess?: () => void;
};

const initialState: UpdatePlayerActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function EditPlayerForm({
  player,
  clubs,
  onSuccess,
}: EditPlayerFormProps) {
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

      <div className="space-y-2">
        <label
          htmlFor={`clubId-${player.id}`}
          className="text-sm font-medium text-foreground"
        >
          Club
        </label>
        <select
          id={`clubId-${player.id}`}
          name="clubId"
          defaultValue={player.clubId ?? ""}
          className="h-10 w-full rounded-xl border border-white/10 bg-background/50 px-3 text-sm text-foreground outline-none transition focus:border-primary/40"
        >
          <option value="">No club</option>
          {clubs.map((club) => (
            <option key={club.id} value={club.id}>
              {club.shortName ? `${club.name} (${club.shortName})` : club.name}
            </option>
          ))}
        </select>
        {state.fieldErrors?.clubId?.length ? (
          <p className="text-sm text-red-400">{state.fieldErrors.clubId[0]}</p>
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
