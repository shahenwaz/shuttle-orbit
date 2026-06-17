"use client";

import { useActionState, useMemo, useState } from "react";

import {
  createTeamPairMatrixLeagueAction,
  type LeagueActionState,
} from "@/app/admin/leagues/actions";
import { Button } from "@/components/ui/button";
import { formatLeagueDisplayName } from "@/lib/leagues/display";

type PlayerOption = {
  id: string;
  fullName: string;
  nickname: string | null;
};

type CreateLeagueFormProps = {
  clubId: string;
  players: PlayerOption[];
};

const initialState: LeagueActionState = {
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

export function CreateLeagueForm({ clubId, players }: CreateLeagueFormProps) {
  const [state, formAction, pending] = useActionState(
    createTeamPairMatrixLeagueAction,
    initialState,
  );

  const [sideAPlayerIds, setSideAPlayerIds] = useState<string[]>([]);
  const [sideBPlayerIds, setSideBPlayerIds] = useState<string[]>([]);

  const [sideAQuery, setSideAQuery] = useState("");
  const [sideBQuery, setSideBQuery] = useState("");

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
          name="sideAPlayerIds"
          value={playerId}
        />
      ))}

      {sideBPlayerIds.map((playerId) => (
        <input
          key={`side-b-${playerId}`}
          type="hidden"
          name="sideBPlayerIds"
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
            defaultValue={formatLeagueDisplayName("Friday Team Doubles League")}
            placeholder={formatLeagueDisplayName("Friday Team Doubles League")}
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
            defaultValue={formatLeagueDisplayName("Team Pair Matrix")}
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
            defaultValue={formatLeagueDisplayName("Team A")}
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
            defaultValue={formatLeagueDisplayName("Team B")}
            className={inputClassName}
          />
          <FieldError errors={state.fieldErrors?.sideBName} />
        </div>

        <PlayerSidePicker
          title="Side A players"
          players={players}
          selectedIds={sideAPlayerIds}
          blockedIds={sideBPlayerIds}
          query={sideAQuery}
          onQueryChange={setSideAQuery}
          onToggle={(playerId) => togglePlayer("A", playerId)}
          error={state.fieldErrors?.sideAPlayerIds}
        />

        <PlayerSidePicker
          title="Side B players"
          players={players}
          selectedIds={sideBPlayerIds}
          blockedIds={sideAPlayerIds}
          query={sideBQuery}
          onQueryChange={setSideBQuery}
          onToggle={(playerId) => togglePlayer("B", playerId)}
          error={state.fieldErrors?.sideBPlayerIds}
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
            defaultValue={formatLeagueDisplayName(
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
  query: string;
  onQueryChange: (query: string) => void;
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
  query,
  onQueryChange,
}: PlayerSidePickerProps) {
  const normalizedQuery = query.trim().toLowerCase();

  const selectedPlayers = useMemo(() => {
    return players.filter((player) => selectedIds.includes(player.id));
  }, [players, selectedIds]);

  const availablePlayers = useMemo(() => {
    const unselectedPlayers = players.filter(
      (player) => !selectedIds.includes(player.id),
    );

    if (!normalizedQuery) {
      return unselectedPlayers.slice(0, 12);
    }

    return unselectedPlayers.filter((player) => {
      const fullName = player.fullName.toLowerCase();
      const nickname = player.nickname?.toLowerCase() ?? "";

      return (
        fullName.includes(normalizedQuery) || nickname.includes(normalizedQuery)
      );
    });
  }, [normalizedQuery, players, selectedIds]);

  const hiddenPlayerCount = Math.max(
    players.length - selectedPlayers.length - availablePlayers.length,
    0,
  );

  return (
    <div className="space-y-3 rounded-md border border-white/10 bg-white/4 p-3 sm:col-span-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">
          Selected: {selectedIds.length}
        </p>
      </div>

      <input
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search players..."
        className="h-9 w-full rounded-md border border-white/10 bg-background/60 px-3 text-xs text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
      />

      <div className="space-y-3">
        {selectedPlayers.length > 0 ? (
          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary/80">
              Selected
            </p>

            <div className="flex flex-wrap gap-2">
              {selectedPlayers.map((player) => (
                <PlayerPickButton
                  key={player.id}
                  player={player}
                  isSelected
                  isBlocked={false}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {normalizedQuery ? "Search results" : "Available players"}
          </p>

          <div className="flex flex-wrap gap-2">
            {availablePlayers.map((player) => {
              const isBlocked = blockedIds.includes(player.id);

              return (
                <PlayerPickButton
                  key={player.id}
                  player={player}
                  isSelected={false}
                  isBlocked={isBlocked}
                  onToggle={onToggle}
                />
              );
            })}

            {availablePlayers.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No players found for this search.
              </p>
            ) : null}
          </div>

          {!normalizedQuery && hiddenPlayerCount > 0 ? (
            <p className="text-xs text-muted-foreground">
              Showing 12 players. Search to find more.
            </p>
          ) : null}
        </div>
      </div>

      {availablePlayers.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No players found for this search.
        </p>
      ) : null}

      <FieldError errors={error} />
    </div>
  );
}

function PlayerPickButton({
  player,
  isSelected,
  isBlocked,
  onToggle,
}: {
  player: PlayerOption;
  isSelected: boolean;
  isBlocked: boolean;
  onToggle: (playerId: string) => void;
}) {
  return (
    <button
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
}
