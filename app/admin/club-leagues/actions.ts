"use server";

import { ClubLeagueFormat, type Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import {
  createDoublesEntries,
  createTeamPairMatrixMatches,
} from "@/lib/club-league/team-pair-matrix";

type PlayerInput = {
  id: string;
  name: string;
};

type CreateTeamPairMatrixLeagueInput = {
  clubId: string;
  title: string;
  playedAt: Date;
  rulesNote?: string;
  sideAName: string;
  sideBName: string;
  sideAPlayerIds: string[];
  sideBPlayerIds: string[];
};

export async function createTeamPairMatrixLeague(
  input: CreateTeamPairMatrixLeagueInput,
) {
  if (input.sideAPlayerIds.length < 2 || input.sideBPlayerIds.length < 2) {
    throw new Error("Each side needs at least 2 players.");
  }

  const allPlayerIds = [...input.sideAPlayerIds, ...input.sideBPlayerIds];
  const uniquePlayerIds = new Set(allPlayerIds);

  if (uniquePlayerIds.size !== allPlayerIds.length) {
    throw new Error("A player cannot be selected more than once.");
  }

  const players = await prisma.player.findMany({
    where: { id: { in: allPlayerIds } },
    select: {
      id: true,
      fullName: true,
      nickname: true,
    },
  });

  if (players.length !== allPlayerIds.length) {
    throw new Error("One or more selected players could not be found.");
  }

  type PlayerRow = (typeof players)[number];

  const playerMap = new Map<string, PlayerInput>(
    players.map((player: PlayerRow) => [
      player.id,
      {
        id: player.id,
        name: player.nickname || player.fullName,
      },
    ]),
  );

  const sideAPlayers: PlayerInput[] = input.sideAPlayerIds.map((playerId) => {
    const player = playerMap.get(playerId);

    if (!player) {
      throw new Error("A selected side A player could not be found.");
    }

    return player;
  });

  const sideBPlayers: PlayerInput[] = input.sideBPlayerIds.map((playerId) => {
    const player = playerMap.get(playerId);

    if (!player) {
      throw new Error("A selected side B player could not be found.");
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
    sideAEntries.length,
    sideBEntries.length,
  );

  const league = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const createdLeague = await tx.clubLeague.create({
        data: {
          clubId: input.clubId,
          title: input.title,
          playedAt: input.playedAt,
          format: ClubLeagueFormat.TEAM_PAIR_MATRIX,
          rulesNote: input.rulesNote || null,
        },
      });

      const sideA = await tx.clubLeagueSide.create({
        data: {
          leagueId: createdLeague.id,
          name: input.sideAName,
          sideOrder: 1,
        },
      });

      const sideB = await tx.clubLeagueSide.create({
        data: {
          leagueId: createdLeague.id,
          name: input.sideBName,
          sideOrder: 2,
        },
      });

      const createdSideAEntries = await Promise.all(
        sideAEntries.map((entry) =>
          tx.clubLeagueEntry.create({
            data: {
              leagueId: createdLeague.id,
              sideId: sideA.id,
              player1Id: entry.player1Id,
              player2Id: entry.player2Id,
              displayName: entry.displayName,
              entryOrder: entry.entryOrder,
            },
          }),
        ),
      );

      const createdSideBEntries = await Promise.all(
        sideBEntries.map((entry) =>
          tx.clubLeagueEntry.create({
            data: {
              leagueId: createdLeague.id,
              sideId: sideB.id,
              player1Id: entry.player1Id,
              player2Id: entry.player2Id,
              displayName: entry.displayName,
              entryOrder: entry.entryOrder,
            },
          }),
        ),
      );

      await Promise.all(
        generatedMatches.map((match) =>
          tx.clubLeagueMatch.create({
            data: {
              leagueId: createdLeague.id,
              entryAId: createdSideAEntries[match.entryAIndex].id,
              entryBId: createdSideBEntries[match.entryBIndex].id,
              matchOrder: match.matchOrder,
              roundLabel: match.roundLabel,
            },
          }),
        ),
      );

      return createdLeague;
    },
  );

  revalidatePath("/admin/club-leagues");
  revalidatePath(`/admin/club-leagues/${league.id}`);

  redirect(`/admin/club-leagues/${league.id}`);
}
