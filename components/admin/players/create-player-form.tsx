"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, Plus } from "lucide-react";

import {
  createPlayerAction,
  type CreatePlayerActionState,
} from "@/app/admin/players/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ClubOption = {
  id: string;
  name: string;
  shortName: string | null;
};

type CreatePlayerFormProps = {
  clubs: ClubOption[];
};

const initialState: CreatePlayerActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function CreatePlayerForm({ clubs }: CreatePlayerFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    createPlayerAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="e.g. SHAHENWAZ MUZAHID"
            className="h-11 rounded-2xl border-white/10 bg-background/50"
          />
          {state.fieldErrors?.fullName ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.fullName[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nickname">Username</Label>
          <Input
            id="nickname"
            name="nickname"
            placeholder="e.g. shahenwaz"
            className="h-11 rounded-2xl border-white/10 bg-background/50"
          />
          <p className="text-xs text-muted-foreground">
            Use a unique handle. Lowercase letters, numbers, dot, underscore,
            and hyphen only.
          </p>
          {state.fieldErrors?.nickname ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.nickname[0]}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="clubId">Club</Label>
        <select
          id="clubId"
          name="clubId"
          defaultValue=""
          className="h-11 w-full rounded-2xl border border-white/10 bg-background/50 px-3 text-sm text-foreground outline-none transition focus:border-primary/40"
        >
          <option value="">No club</option>
          {clubs.map((club) => (
            <option key={club.id} value={club.id}>
              {club.shortName ? `${club.name} (${club.shortName})` : club.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          Optional. If selected, this player will appear under that club.
        </p>
        {state.fieldErrors?.clubId ? (
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

      <Button type="submit" disabled={isPending} className="min-w-32">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Add player
          </>
        )}
      </Button>
    </form>
  );
}
