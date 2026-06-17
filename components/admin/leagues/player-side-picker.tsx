"use client";

import { useMemo } from "react";

import { FieldError } from "@/components/admin/leagues/league-form-fields";
import type { PlayerOption } from "@/components/admin/leagues/league-form-types";
import { PlayerPickButton } from "@/components/admin/leagues/player-pick-button";

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

export function PlayerSidePicker({
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

      <FieldError errors={error} />
    </div>
  );
}
