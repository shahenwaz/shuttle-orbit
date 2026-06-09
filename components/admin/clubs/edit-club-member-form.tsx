"use client";

import { useActionState, useMemo, useState } from "react";

import {
  updateClubMemberAction,
  type ClubMemberActionState,
} from "@/app/admin/clubs/[clubId]/members/actions";
import { Button } from "@/components/ui/button";

type EditClubMemberFormPlayer = {
  id: string;
  fullName: string;
  nickname: string;
};

type EditClubMemberFormMember = {
  id: string;
  clubId: string;
  playerId?: string | null;
  name: string;
  nickname: string | null;
  role: string;
  isPublic: boolean;
};

type EditClubMemberFormProps = {
  member: EditClubMemberFormMember;
  players: EditClubMemberFormPlayer[];
  onSuccess?: () => void;
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

export function EditClubMemberForm({
  member,
  players,
  onSuccess,
}: EditClubMemberFormProps) {
  const [state, formAction, pending] = useActionState(
    async (prevState: ClubMemberActionState, formData: FormData) => {
      const result = await updateClubMemberAction(prevState, formData);

      if (result.success) {
        onSuccess?.();
      }

      return result;
    },
    initialState,
  );

  const [selectedPlayerId, setSelectedPlayerId] = useState(
    member.playerId ?? "",
  );
  const [name, setName] = useState(member.name);
  const [nickname, setNickname] = useState(member.nickname ?? "");

  const selectedPlayer = useMemo(
    () => players.find((player) => player.id === selectedPlayerId),
    [players, selectedPlayerId],
  );

  function handlePlayerChange(playerId: string) {
    setSelectedPlayerId(playerId);

    const player = players.find((item) => item.id === playerId);

    if (player) {
      setName(player.fullName);
      setNickname(player.nickname);
      return;
    }

    setName(member.name);
    setNickname(member.nickname ?? "");
  }

  const isLinkedPlayer = Boolean(selectedPlayer);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="clubId" value={member.clubId} />
      <input type="hidden" name="memberId" value={member.id} />

      <div className="space-y-2">
        <label
          htmlFor={`playerId-${member.id}`}
          className="text-sm font-medium text-foreground"
        >
          Link Shuttle Orbit player
        </label>

        <select
          id={`playerId-${member.id}`}
          name="playerId"
          value={selectedPlayerId}
          onChange={(event) => handlePlayerChange(event.target.value)}
          className={inputClassName}
        >
          <option value="">Club-only member</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.fullName} (@{player.nickname})
            </option>
          ))}
        </select>

        <FieldError errors={state.fieldErrors?.playerId} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor={`name-${member.id}`}
            className="text-sm font-medium text-foreground"
          >
            Member name
          </label>
          <input
            id={`name-${member.id}`}
            name="name"
            value={name}
            readOnly={isLinkedPlayer}
            onChange={(event) => setName(event.target.value)}
            className={`${inputClassName} ${
              isLinkedPlayer ? "cursor-not-allowed text-muted-foreground" : ""
            }`}
          />
          <FieldError errors={state.fieldErrors?.name} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`nickname-${member.id}`}
            className="text-sm font-medium text-foreground"
          >
            Nickname
          </label>
          <input
            id={`nickname-${member.id}`}
            name="nickname"
            value={nickname}
            readOnly={isLinkedPlayer}
            onChange={(event) => setNickname(event.target.value)}
            className={`${inputClassName} ${
              isLinkedPlayer ? "cursor-not-allowed text-muted-foreground" : ""
            }`}
          />
          <FieldError errors={state.fieldErrors?.nickname} />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor={`role-${member.id}`}
          className="text-sm font-medium text-foreground"
        >
          Club role
        </label>
        <select
          id={`role-${member.id}`}
          name="role"
          defaultValue={member.role}
          className={inputClassName}
        >
          <option value="OWNER">Owner</option>
          <option value="ORGANIZER">Organizer</option>
          <option value="MEMBER">Member</option>
        </select>
      </div>

      <label className="flex items-start gap-3 rounded-md border border-white/10 bg-white/4 p-3">
        <input
          type="checkbox"
          name="isPublic"
          defaultChecked={member.isPublic}
          className="mt-1 h-4 w-4 rounded border-white/20 bg-background"
        />
        <span className="block text-sm font-medium text-foreground">
          Show on public club profile
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
        {pending ? "Saving..." : "Save member"}
      </Button>
    </form>
  );
}
