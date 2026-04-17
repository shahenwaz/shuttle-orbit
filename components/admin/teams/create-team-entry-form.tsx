"use client";

import { useActionState, useEffect, useMemo, useRef } from "react";
import { Loader2, Users2 } from "lucide-react";

import {
  createTeamEntryAction,
  type CreateTeamEntryActionState,
} from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/teams/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PlayerOption = {
  id: string;
  fullName: string;
  nickname: string;
};

type CreateTeamEntryFormProps = {
  tournamentId: string;
  categoryId: string;
  players: PlayerOption[];
};

const initialState: CreateTeamEntryActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function CreateTeamEntryForm({
  tournamentId,
  categoryId,
  players,
}: CreateTeamEntryFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    createTeamEntryAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  const sortedPlayers = useMemo(
    () =>
      [...players].sort((a, b) =>
        a.fullName.localeCompare(b.fullName, "en", { sensitivity: "base" }),
      ),
    [players],
  );

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <input type="hidden" name="categoryId" value={categoryId} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="player1Id">Player 1</Label>
          <select
            id="player1Id"
            name="player1Id"
            defaultValue=""
            className="flex h-11 w-full rounded-xl border border-white/10 bg-background/70 px-4 text-sm text-foreground outline-none focus-visible:border-primary/50"
          >
            <option value="" disabled>
              Select first player
            </option>
            {sortedPlayers.map((player) => (
              <option key={player.id} value={player.id}>
                {player.fullName} @{player.nickname}
              </option>
            ))}
          </select>
          {state.fieldErrors?.player1Id ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.player1Id[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="player2Id">Player 2</Label>
          <select
            id="player2Id"
            name="player2Id"
            defaultValue=""
            className="flex h-11 w-full rounded-xl border border-white/10 bg-background/70 px-4 text-sm text-foreground outline-none focus-visible:border-primary/50"
          >
            <option value="" disabled>
              Select second player
            </option>
            {sortedPlayers.map((player) => (
              <option key={player.id} value={player.id}>
                {player.fullName} @{player.nickname}
              </option>
            ))}
          </select>
          {state.fieldErrors?.player2Id ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.player2Id[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="teamName">Team name</Label>
          <Input
            id="teamName"
            name="teamName"
            placeholder="Optional. Leave empty to use player names."
          />
          {state.fieldErrors?.teamName ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.teamName[0]}
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

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Users2 className="mr-2 h-4 w-4" />
            Add team
          </>
        )}
      </Button>
    </form>
  );
}
