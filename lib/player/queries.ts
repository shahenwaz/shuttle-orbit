import { prisma } from "@/lib/db/prisma";

export async function getPlayersDirectory() {
  return prisma.player.findMany({
    orderBy: {
      fullName: "asc",
    },
    select: {
      id: true,
      fullName: true,
      nickname: true,
    },
  });
}

export async function getPlayerProfile(playerId: string) {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: {
      id: true,
      fullName: true,
      nickname: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!player) {
    return null;
  }

  const teamEntries = await prisma.teamEntry.findMany({
    where: {
      OR: [{ player1Id: playerId }, { player2Id: playerId }],
    },
    include: {
      category: {
        select: {
          id: true,
          code: true,
          name: true,
          tournament: {
            select: {
              id: true,
              slug: true,
              name: true,
              eventDate: true,
            },
          },
        },
      },
      player1: {
        select: {
          id: true,
          fullName: true,
          nickname: true,
        },
      },
      player2: {
        select: {
          id: true,
          fullName: true,
          nickname: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const appearances = [...teamEntries].sort(
    (a, b) =>
      b.category.tournament.eventDate.getTime() -
      a.category.tournament.eventDate.getTime(),
  );

  return {
    player,
    appearances,
  };
}
