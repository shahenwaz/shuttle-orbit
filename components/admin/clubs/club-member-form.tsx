"use client";

import { useActionState } from "react";

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

export function ClubMemberForm({
  clubId,
  players,
  onSuccess,
}: ClubMemberFormProps) {
  const [state, formAction, pending] = useActionState(
    async (previousState: ClubMemberActionState, formData: FormData) => {
      const result = await createClubMemberAction(previousState, formData);

      if (result.success) {
        onSuccess?.();
      }

      return result;
    },
    initialState,
  );

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
          defaultValue=""
          className={inputClassName}
        >
          <option value="">Select player</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.fullName}
              {player.nickname ? ` (@${player.nickname})` : ""}
            </option>
          ))}
        </select>

        <p className="text-xs leading-5 text-muted-foreground">
          Select an existing Shuttle Orbit player. Club membership is now
          handled directly from the global player profile.
        </p>

        <FieldError errors={state.fieldErrors?.playerId} />
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
