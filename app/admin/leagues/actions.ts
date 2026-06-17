"use server";

import { LeagueFormat, type Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createDoublesEntries,
  createTeamPairMatrixMatches,
} from "@/lib/leagues/team-pair-matrix";
import { prisma } from "@/lib/db/prisma";
import { createFixedDoublesMatches } from "@/lib/leagues/fixed-doubles";

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

export type FixedDoublesLeagueActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    title?: string[];
    playedAt?: string[];
    teams?: string[];
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

function getIndexedStringValue(formData: FormData, key: string, index: number) {
  return getStringValue(formData, `${key}-${index}`);
}

function getIndexedStringArray(formData: FormData, key: string, index: number) {
  return getStringArray(formData, `${key}-${index}`);
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

  const [managedClub, selectedPlayers] = await Promise.all([
    prisma.club.findFirst({
      where: {
        id: clubId,
        isManagedClub: true,
      },
      select: {
        id: true,
        name: true,
        shortName: true,
      },
    }),
    prisma.player.findMany({
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
    }),
  ]);

  if (!managedClub) {
    return {
      success: false,
      message: "Managed club could not be found.",
    };
  }

  if (selectedPlayers.length !== uniquePlayerIds.size) {
    return {
      success: false,
      message:
        "Only active players from the community player database can be selected.",
    };
  }

  const playerMap = new Map<string, PlayerInput>();

  for (const player of selectedPlayers) {
    playerMap.set(player.id, {
      id: player.id,
      name: getPlayerDisplayName(player),
    });
  }

  const sideAPlayers: PlayerInput[] = sideAPlayerIds.map((playerId: string) => {
    const player = playerMap.get(playerId);

    if (!player) {
      throw new Error("A selected Side A player could not be found.");
    }

    return player;
  });

  const sideBPlayers: PlayerInput[] = sideBPlayerIds.map((playerId: string) => {
    const player = playerMap.get(playerId);

    if (!player) {
      throw new Error("A selected Side B player could not be found.");
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

export async function createFixedDoublesLeagueAction(
  _state: FixedDoublesLeagueActionState,
  formData: FormData,
): Promise<FixedDoublesLeagueActionState> {
  const clubId = getStringValue(formData, "clubId");
  const title = getStringValue(formData, "title");
  const playedAtValue = getStringValue(formData, "playedAt");
  const rulesNote = getStringValue(formData, "rulesNote");
  const teamCountValue = getStringValue(formData, "teamCount");
  const teamCount = Number(teamCountValue);

  const fieldErrors: FixedDoublesLeagueActionState["fieldErrors"] = {};

  if (!title) {
    fieldErrors.title = ["League title is required."];
  }

  if (!playedAtValue) {
    fieldErrors.playedAt = ["Played date is required."];
  }

  if (!Number.isInteger(teamCount) || teamCount < 2) {
    fieldErrors.teams = ["Add at least 2 fixed doubles teams."];
  }

  const teamInputs =
    Number.isInteger(teamCount) && teamCount > 0
      ? Array.from({ length: teamCount }, (_, index) => {
          const name = getIndexedStringValue(formData, "teamName", index);
          const playerIds = getIndexedStringArray(
            formData,
            "teamPlayerIds",
            index,
          );

          return {
            name,
            playerIds,
          };
        })
      : [];

  for (const [index, team] of teamInputs.entries()) {
    if (!team.name) {
      fieldErrors.teams = [
        `Team ${index + 1} needs a name. Example: BDBC 1 or Mubin 2.`,
      ];
      break;
    }

    if (team.playerIds.length !== 2) {
      fieldErrors.teams = [`Team ${index + 1} must have exactly 2 players.`];
      break;
    }
  }

  const allPlayerIds = teamInputs.flatMap((team) => team.playerIds);
  const uniquePlayerIds = new Set(allPlayerIds);

  if (uniquePlayerIds.size !== allPlayerIds.length) {
    fieldErrors.teams = [
      "A player can only be selected once across all teams.",
    ];
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

  const [managedClub, selectedPlayers] = await Promise.all([
    prisma.club.findFirst({
      where: {
        id: clubId,
        isManagedClub: true,
      },
      select: {
        id: true,
        name: true,
        shortName: true,
      },
    }),
    prisma.player.findMany({
      where: {
        id: {
          in: Array.from(uniquePlayerIds),
        },
        isActive: true,
      },
      select: {
        id: true,
        fullName: true,
        nickname: true,
      },
    }),
  ]);

  if (!managedClub) {
    return {
      success: false,
      message: "Managed club could not be found.",
    };
  }

  if (selectedPlayers.length !== uniquePlayerIds.size) {
    return {
      success: false,
      message:
        "Only active players from the community player database can be selected.",
    };
  }

  const playerMap = new Map<string, PlayerInput>();

  for (const player of selectedPlayers) {
    playerMap.set(player.id, {
      id: player.id,
      name: getPlayerDisplayName(player),
    });
  }

  const generatedMatches = createFixedDoublesMatches(teamInputs.length);

  const league = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const createdLeague = await tx.league.create({
        data: {
          title,
          slug: createLeagueSlug(title, playedAt),
          playedAt,
          location: managedClub.shortName || managedClub.name,
          format: LeagueFormat.FIXED_DOUBLES,
          rulesNote: rulesNote || null,
          hostClubId: managedClub.id,
        },
      });

      const createdTeams = await Promise.all(
        teamInputs.map(async (teamInput, index) => {
          const team = await tx.leagueTeam.create({
            data: {
              leagueId: createdLeague.id,
              name: teamInput.name,
              shortName: teamInput.name,
              teamOrder: index + 1,
              originLabel: "Fixed doubles",
            },
          });

          await tx.leagueTeamPlayer.createMany({
            data: teamInput.playerIds.map((playerId) => {
              const player = playerMap.get(playerId);

              if (!player) {
                throw new Error("A selected player could not be found.");
              }

              return {
                teamId: team.id,
                playerId: player.id,
              };
            }),
          });

          return team;
        }),
      );

      await Promise.all(
        generatedMatches.map((match) =>
          tx.leagueMatch.create({
            data: {
              leagueId: createdLeague.id,
              teamAId: createdTeams[match.teamAIndex].id,
              teamBId: createdTeams[match.teamBIndex].id,
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
