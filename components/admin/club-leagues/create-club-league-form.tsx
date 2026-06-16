"use client";

import { useActionState, useState } from "react";

import {
  createTeamPairMatrixLeagueAction,
  type ClubLeagueActionState,
} from "@/app/admin/club-leagues/actions";
import { Button } from "@/components/ui/button";
import { formatClubLeagueDisplayName } from "@/lib/club-league/display";

type PlayerOption = {
  id: string;
  fullName: string;
  nickname: string | null;
};

type CreateClubLeagueFormProps = {
  clubId: string;
  players: PlayerOption[];
};

const initialState: ClubLeagueActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

const inputClassName =
  "h-11 w-full rounded-md border border-white/10 bg-background/60 px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

const textareaClassName =
  "min-h-24 w-full rounded-md border border-white/10 bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;

  return <p className="text-xs text-red-300">{errors[0]}</p>;
}

export function CreateClubLeagueForm({
  clubId,
  players,
}: CreateClubLeagueFormProps) {
  const [state, formAction, pending] = useActionState(
    createTeamPairMatrixLeagueAction,
    initialState,
  );

  const [sideAPlayerIds, setSideAPlayerIds] = useState<string[]>([]);
  const [sideBPlayerIds, setSideBPlayerIds] = useState<string[]>([]);

  function togglePlayer(side: "A" | "B", playerId: string) {
    const otherSideIds = side === "A" ? sideBPlayerIds : sideAPlayerIds;

    if (otherSideIds.includes(playerId)) return;

    if (side === "A") {
      setSideAPlayerIds((current) =>
        current.includes(playerId)
          ? current.filter((id) => id !== playerId)
          : [...current, playerId],
      );
      return;
    }

    setSideBPlayerIds((current) =>
      current.includes(playerId)
        ? current.filter((id) => id !== playerId)
        : [...current, playerId],
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="clubId" value={clubId} />

      {sideAPlayerIds.map((playerId) => (
        <input
          key={`side-a-${playerId}`}
          type="hidden"
          name="sideAMemberIds"
          value={playerId}
        />
      ))}

      {sideBPlayerIds.map((playerId) => (
        <input
          key={`side-b-${playerId}`}
          type="hidden"
          name="sideBMemberIds"
          value={playerId}
        />
      ))}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label
            htmlFor="title"
            className="text-sm font-medium text-foreground"
          >
            League title
          </label>
          <input
            id="title"
            name="title"
            defaultValue={formatClubLeagueDisplayName(
              "Friday Team Doubles League",
            )}
            placeholder={formatClubLeagueDisplayName(
              "Friday Team Doubles League",
            )}
            className={inputClassName}
          />
          <FieldError errors={state.fieldErrors?.title} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="playedAt"
            className="text-sm font-medium text-foreground"
          >
            Played at
          </label>
          <input
            id="playedAt"
            name="playedAt"
            type="date"
            className={inputClassName}
          />
          <FieldError errors={state.fieldErrors?.playedAt} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="rulesNote"
            className="text-sm font-medium text-foreground"
          >
            Format
          </label>
          <input
            id="rulesNote"
            name="rulesNote"
            defaultValue={formatClubLeagueDisplayName("Team Pair Matrix")}
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="sideAName"
            className="text-sm font-medium text-foreground"
          >
            Side A name
          </label>
          <input
            id="sideAName"
            name="sideAName"
            defaultValue={formatClubLeagueDisplayName("Team A")}
            className={inputClassName}
          />
          <FieldError errors={state.fieldErrors?.sideAName} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="sideBName"
            className="text-sm font-medium text-foreground"
          >
            Side B name
          </label>
          <input
            id="sideBName"
            name="sideBName"
            defaultValue={formatClubLeagueDisplayName("Team B")}
            className={inputClassName}
          />
          <FieldError errors={state.fieldErrors?.sideBName} />
        </div>

        <PlayerSidePicker
          title="Side A players"
          players={players}
          selectedIds={sideAPlayerIds}
          blockedIds={sideBPlayerIds}
          onToggle={(playerId) => togglePlayer("A", playerId)}
          error={state.fieldErrors?.sideAMemberIds}
        />

        <PlayerSidePicker
          title="Side B players"
          players={players}
          selectedIds={sideBPlayerIds}
          blockedIds={sideAPlayerIds}
          onToggle={(playerId) => togglePlayer("B", playerId)}
          error={state.fieldErrors?.sideBMemberIds}
        />

        <div className="space-y-2 sm:col-span-2">
          <label
            htmlFor="rulesDescription"
            className="text-sm font-medium text-foreground"
          >
            Rules note
          </label>
          <textarea
            id="rulesDescription"
            name="rulesNote"
            defaultValue={formatClubLeagueDisplayName(
              "Each side creates all doubles pairs and every pair plays every pair from the other side.",
            )}
            className={textareaClassName}
          />
        </div>
      </div>

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
        {pending ? "Creating..." : "Create league"}
      </Button>
    </form>
  );
}

type PlayerSidePickerProps = {
  title: string;
  players: PlayerOption[];
  selectedIds: string[];
  blockedIds: string[];
  onToggle: (playerId: string) => void;
  error?: string[];
};

function PlayerSidePicker({
  title,
  players,
  selectedIds,
  blockedIds,
  onToggle,
  error,
}: PlayerSidePickerProps) {
  return (
    <div className="space-y-3 rounded-md border border-white/10 bg-white/4 p-3 sm:col-span-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">
          Selected: {selectedIds.length}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {players.map((player) => {
          const isSelected = selectedIds.includes(player.id);
          const isBlocked = blockedIds.includes(player.id);

          return (
            <button
              key={player.id}
              type="button"
              disabled={isBlocked}
              onClick={() => onToggle(player.id)}
              className={[
                "rounded-full border px-3 py-1.5 text-xs transition",
                isSelected
                  ? "border-primary/40 bg-primary/15 text-primary"
                  : "border-white/10 bg-background/60 text-muted-foreground hover:bg-white/8 hover:text-foreground",
                isBlocked ? "cursor-not-allowed opacity-40" : "",
              ].join(" ")}
            >
              {player.nickname || player.fullName}
            </button>
          );
        })}
      </div>

      <FieldError errors={error} />
    </div>
  );
}
