"use server";

import { LeagueFormat, type Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createDoublesEntries,
  createTeamPairMatrixMatches,
} from "@/lib/leagues/team-pair-matrix";
import { prisma } from "@/lib/db/prisma";

export type LeagueActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    title?: string[];
    playedAt?: string[];
    sideAName?: string[];
    sideBName?: string[];
    sideAPlayerIds?: string[];
    sideBPlayerIds?: string[];
  };
};

type PlayerInput = {
  id: string;
  name: string;
};

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getStringArray(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string");
}

function createLeagueSlug(title: string, playedAt: Date) {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const datePart = playedAt.toISOString().slice(0, 10);

  return `${base || "league"}-${datePart}-${Date.now()}`;
}

function getPlayerDisplayName(player: {
  fullName: string;
  nickname: string | null;
}) {
  return player.nickname?.trim() || player.fullName.trim();
}

export async function createTeamPairMatrixLeagueAction(
  _state: LeagueActionState,
  formData: FormData,
): Promise<LeagueActionState> {
  const clubId = getStringValue(formData, "clubId");
  const title = getStringValue(formData, "title");
  const playedAtValue = getStringValue(formData, "playedAt");
  const rulesNote = getStringValue(formData, "rulesNote");
  const sideAName = getStringValue(formData, "sideAName") || "Team A";
  const sideBName = getStringValue(formData, "sideBName") || "Team B";
  const sideAPlayerIds = getStringArray(formData, "sideAPlayerIds");
  const sideBPlayerIds = getStringArray(formData, "sideBPlayerIds");

  const fieldErrors: LeagueActionState["fieldErrors"] = {};

  if (!title) {
    fieldErrors.title = ["League title is required."];
  }

  if (!playedAtValue) {
    fieldErrors.playedAt = ["Played date is required."];
  }

  if (sideAPlayerIds.length < 2) {
    fieldErrors.sideAPlayerIds = ["Select at least 2 players for Side A."];
  }

  if (sideBPlayerIds.length < 2) {
    fieldErrors.sideBPlayerIds = ["Select at least 2 players for Side B."];
  }

  const allPlayerIds = [...sideAPlayerIds, ...sideBPlayerIds];
  const uniquePlayerIds = new Set(allPlayerIds);

  if (uniquePlayerIds.size !== allPlayerIds.length) {
    fieldErrors.sideAPlayerIds = ["A player can only be selected once."];
    fieldErrors.sideBPlayerIds = ["A player can only be selected once."];
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  const playedAt = new Date(`${playedAtValue}T00:00:00`);

  if (Number.isNaN(playedAt.getTime())) {
    return {
      success: false,
      message: "Please enter a valid played date.",
      fieldErrors: {
        playedAt: ["Invalid date."],
      },
    };
  }

  const managedClub = await prisma.club.findFirst({
    where: {
      id: clubId,
      isManagedClub: true,
    },
    select: {
      id: true,
      name: true,
      shortName: true,
      players: {
        where: {
          id: {
            in: allPlayerIds,
          },
          isActive: true,
        },
        select: {
          id: true,
          fullName: true,
          nickname: true,
        },
      },
    },
  });

  if (!managedClub) {
    return {
      success: false,
      message: "Managed club could not be found.",
    };
  }

  if (managedClub.players.length !== allPlayerIds.length) {
    return {
      success: false,
      message: "Only active players from the selected club can be selected.",
    };
  }

  const playerMap = new Map<string, PlayerInput>();

  for (const player of managedClub.players) {
    playerMap.set(player.id, {
      id: player.id,
      name: getPlayerDisplayName(player),
    });
  }

  const sideAPlayers: PlayerInput[] = sideAPlayerIds.map((playerId: string) => {
    const player = playerMap.get(playerId);

    if (!player) {
      throw new Error("A selected Side A player could not be resolved.");
    }

    return player;
  });

  const sideBPlayers: PlayerInput[] = sideBPlayerIds.map((playerId: string) => {
    const player = playerMap.get(playerId);

    if (!player) {
      throw new Error("A selected Side B player could not be resolved.");
    }

    return player;
  });

  const sideAEntries = createDoublesEntries("A", sideAPlayers, 1);
  const sideBEntries = createDoublesEntries(
    "B",
    sideBPlayers,
    sideAEntries.length + 1,
  );

  const generatedMatches = createTeamPairMatrixMatches(
    sideAEntries,
    sideBEntries,
  );

  const league = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const createdLeague = await tx.league.create({
        data: {
          title,
          slug: createLeagueSlug(title, playedAt),
          playedAt,
          location: managedClub.shortName || managedClub.name,
          format: LeagueFormat.TEAM_PAIR_MATRIX,
          rulesNote: rulesNote || null,
          hostClubId: managedClub.id,
        },
      });

      const createdSideAEntries = await Promise.all(
        sideAEntries.map(async (entry) => {
          const team = await tx.leagueTeam.create({
            data: {
              leagueId: createdLeague.id,
              name: entry.displayName,
              shortName: entry.displayName,
              teamOrder: entry.entryOrder,
              originLabel: sideAName,
            },
          });

          await tx.leagueTeamPlayer.createMany({
            data: [
              {
                teamId: team.id,
                playerId: entry.player1Id,
              },
              {
                teamId: team.id,
                playerId: entry.player2Id,
              },
            ],
          });

          return team;
        }),
      );

      const createdSideBEntries = await Promise.all(
        sideBEntries.map(async (entry) => {
          const team = await tx.leagueTeam.create({
            data: {
              leagueId: createdLeague.id,
              name: entry.displayName,
              shortName: entry.displayName,
              teamOrder: entry.entryOrder,
              originLabel: sideBName,
            },
          });

          await tx.leagueTeamPlayer.createMany({
            data: [
              {
                teamId: team.id,
                playerId: entry.player1Id,
              },
              {
                teamId: team.id,
                playerId: entry.player2Id,
              },
            ],
          });

          return team;
        }),
      );

      await Promise.all(
        generatedMatches.map((match) =>
          tx.leagueMatch.create({
            data: {
              leagueId: createdLeague.id,
              teamAId: createdSideAEntries[match.entryAIndex].id,
              teamBId: createdSideBEntries[match.entryBIndex].id,
              matchOrder: match.matchOrder,
              roundLabel: match.roundLabel,
            },
          }),
        ),
      );

      return createdLeague;
    },
  );

  revalidatePath("/admin/leagues");
  redirect(`/admin/leagues/${league.id}`);
}
