"use client";

import { useActionState, useMemo, useState } from "react";

import {
  createClubMemberAction,
  type ClubMemberActionState,
} from "@/app/admin/clubs/[clubId]/members/actions";
import { Button } from "@/components/ui/button";

type ClubMemberFormPlayer = {
  id: string;
  fullName: string;
  nickname: string | null;
};

type ClubMemberFormProps = {
  clubId: string;
  players: ClubMemberFormPlayer[];
};

const initialState: ClubMemberActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

const inputClassName =
  "h-10 w-full rounded-md border border-white/10 bg-background/60 px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;

  return <p className="text-xs text-red-300">{errors[0]}</p>;
}

export function ClubMemberForm({ clubId, players }: ClubMemberFormProps) {
  const [state, formAction, pending] = useActionState(
    createClubMemberAction,
    initialState,
  );

  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");

  const selectedPlayer = useMemo(
    () => players.find((player) => player.id === selectedPlayerId),
    [players, selectedPlayerId],
  );

  function handlePlayerChange(playerId: string) {
    setSelectedPlayerId(playerId);

    const player = players.find((item) => item.id === playerId);

    if (player) {
      setName(player.fullName);
      setNickname(player.nickname ?? "");
      return;
    }

    setName("");
    setNickname("");
  }

  const isLinkedPlayer = Boolean(selectedPlayer);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="clubId" value={clubId} />

      <div className="space-y-2">
        <label
          htmlFor="playerId"
          className="text-sm font-medium text-foreground"
        >
          Link Shuttle Orbit player
        </label>

        <select
          id="playerId"
          name="playerId"
          value={selectedPlayerId}
          onChange={(event) => handlePlayerChange(event.target.value)}
          className={inputClassName}
        >
          <option value="">Club-only member</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.fullName}
              {player.nickname ? ` (@${player.nickname})` : ""}
            </option>
          ))}
        </select>

        <p className="text-xs leading-5 text-muted-foreground">
          Select an existing Shuttle Orbit player to auto-fill their name and
          nickname. Leave this as club-only for casual members or kids.
        </p>

        <FieldError errors={state.fieldErrors?.playerId} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Member name
          </label>
          <input
            id="name"
            name="name"
            value={name}
            readOnly={isLinkedPlayer}
            onChange={(event) => setName(event.target.value)}
            placeholder="Member name"
            className={`${inputClassName} ${
              isLinkedPlayer ? "cursor-not-allowed text-muted-foreground" : ""
            }`}
          />
          <FieldError errors={state.fieldErrors?.name} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="nickname"
            className="text-sm font-medium text-foreground"
          >
            Nickname
          </label>
          <input
            id="nickname"
            name="nickname"
            value={nickname}
            readOnly={isLinkedPlayer}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="Optional"
            className={`${inputClassName} ${
              isLinkedPlayer ? "cursor-not-allowed text-muted-foreground" : ""
            }`}
          />
          <FieldError errors={state.fieldErrors?.nickname} />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="role" className="text-sm font-medium text-foreground">
          Club role
        </label>
        <select
          id="role"
          name="role"
          defaultValue="MEMBER"
          className={inputClassName}
        >
          <option value="OWNER">Owner</option>
          <option value="ORGANIZER">Organizer</option>
          <option value="MEMBER">Member</option>
        </select>
        <FieldError errors={state.fieldErrors?.role} />
      </div>

      <label className="flex items-start gap-3 rounded-md border border-white/10 bg-white/4 p-3">
        <input
          type="checkbox"
          name="isPublic"
          className="mt-1 h-4 w-4 rounded border-white/20 bg-background"
        />
        <span className="space-y-1">
          <span className="block text-sm font-medium text-foreground">
            Show on public club profile
          </span>
          <span className="block text-xs leading-5 text-muted-foreground">
            Keep this off for kids or private members.
          </span>
        </span>
      </label>

      {state.message ? (
        <p
          className={
            state.success ? "text-sm text-primary" : "text-sm text-red-300"
          }
        >
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="rounded-md">
        {pending ? "Adding..." : "Add member"}
      </Button>
    </form>
  );
}
