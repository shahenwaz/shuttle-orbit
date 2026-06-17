"use client";

import type { PlayerOption } from "@/components/admin/leagues/league-form-types";
import { TeamPairMatrixForm } from "@/components/admin/leagues/team-pair-matrix-form";

type CreateLeagueFormProps = {
  clubId: string;
  players: PlayerOption[];
};

export function CreateLeagueForm({ clubId, players }: CreateLeagueFormProps) {
  return <TeamPairMatrixForm clubId={clubId} players={players} />;
}
