"use client";

import { useState } from "react";

import { FixedDoublesForm } from "@/components/admin/leagues/fixed-doubles-form";
import type { PlayerOption } from "@/components/admin/leagues/league-form-types";
import { TeamPairMatrixForm } from "@/components/admin/leagues/team-pair-matrix-form";

type CreateLeagueFormProps = {
  clubs: Array<{
    id: string;
    name: string;
    shortName: string | null;
  }>;
  players: PlayerOption[];
};

type LeagueCreateFormat = "TEAM_PAIR_MATRIX" | "FIXED_DOUBLES";

export function CreateLeagueForm({ clubs, players }: CreateLeagueFormProps) {
  const [format, setFormat] = useState<LeagueCreateFormat>("TEAM_PAIR_MATRIX");
  const [clubId, setClubId] = useState(clubs[0]?.id ?? "");

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="league-host-club"
          className="text-sm font-medium text-foreground"
        >
          Host club
        </label>
        <select
          id="league-host-club"
          value={clubId}
          onChange={(event) => setClubId(event.target.value)}
          className="h-11 w-full rounded-md border border-white/10 bg-background/60 px-3 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
        >
          {clubs.map((club) => (
            <option key={club.id} value={club.id}>
              {club.shortName ? `${club.name} (${club.shortName})` : club.name}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-md border border-white/10 bg-white/4 p-2">
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setFormat("TEAM_PAIR_MATRIX")}
            className={[
              "rounded-md border px-3 py-2 text-left transition",
              format === "TEAM_PAIR_MATRIX"
                ? "border-primary/30 bg-primary/10 text-foreground"
                : "border-white/10 bg-background/60 text-muted-foreground hover:bg-white/6 hover:text-foreground",
            ].join(" ")}
          >
            <span className="block text-sm font-semibold">
              Team Pair Matrix
            </span>
            <span className="mt-1 block text-xs leading-5">
              Two sides generate all doubles pairs.
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFormat("FIXED_DOUBLES")}
            className={[
              "rounded-md border px-3 py-2 text-left transition",
              format === "FIXED_DOUBLES"
                ? "border-primary/30 bg-primary/10 text-foreground"
                : "border-white/10 bg-background/60 text-muted-foreground hover:bg-white/6 hover:text-foreground",
            ].join(" ")}
          >
            <span className="block text-sm font-semibold">Fixed Doubles</span>
            <span className="mt-1 block text-xs leading-5">
              Fixed pairs play every other pair.
            </span>
          </button>
        </div>
      </div>

      {format === "TEAM_PAIR_MATRIX" ? (
        <TeamPairMatrixForm clubId={clubId} players={players} />
      ) : (
        <FixedDoublesForm clubId={clubId} players={players} />
      )}
    </div>
  );
}
