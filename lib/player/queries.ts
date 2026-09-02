import { prisma } from "@/lib/db/prisma";

function getCategoryCodeRank(code: string) {
  const normalized = code.trim().toUpperCase();

  switch (normalized) {
    case "A":
      return 500;
    case "B":
      return 400;
    case "MIXED":
      return 300;
    case "C":
      return 200;
    default:
      return 0;
  }
}

function sortCategoryCodes(codes: string[]) {
  return [...codes].sort((a, b) => {
    const rankDiff = getCategoryCodeRank(b) - getCategoryCodeRank(a);

    if (rankDiff !== 0) {
      return rankDiff;
    }

    return a.localeCompare(b);
  });
}

export async function getPlayersDirectory() {
  const players = await prisma.player.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      fullName: true,
      nickname: true,
      createdAt: true,
      teamEntriesAsPlayer1: {
        select: {
          category: {
            select: {
              code: true,
            },
          },
        },
      },
      teamEntriesAsPlayer2: {
        select: {
          category: {
            select: {
              code: true,
            },
          },
        },
      },
    },
  });

  return players.map((player) => {
    const categoryCodes = Array.from(
      new Set([
        ...player.teamEntriesAsPlayer1.map((entry) => entry.category.code),
        ...player.teamEntriesAsPlayer2.map((entry) => entry.category.code),
      ]),
    );

    return {
      id: player.id,
      fullName: player.fullName,
      nickname: player.nickname,
      createdAt: player.createdAt,
      categoryCodes: sortCategoryCodes(categoryCodes),
    };
  });
}

export async function getPlayerSitemapEntries() {
  return prisma.player.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  });
}

export async function getPlayerProfileMetadata(playerId: string) {
  return prisma.player.findUnique({
    where: {
      id: playerId,
    },
    select: {
      fullName: true,
    },
  });
}

export async function getPlayerProfile(playerId: string) {
  const player = await prisma.player.findUnique({
    where: {
      id: playerId,
    },
    select: {
      fullName: true,
      nickname: true,
      clubProfilePublic: true,
      club: {
        select: {
          name: true,
          shortName: true,
          slug: true,
          isPublic: true,
        },
      },
    },
  });

  if (!player) {
    return null;
  }

  const appearances = await prisma.teamEntry.findMany({
    where: {
      OR: [{ player1Id: playerId }, { player2Id: playerId }],
    },
    orderBy: [
      {
        tournament: {
          eventDate: "desc",
        },
      },
      {
        createdAt: "desc",
      },
    ],
    select: {
      id: true,
      teamName: true,
      player1Id: true,
      player2Id: true,
      player1: {
        select: {
          id: true,
          fullName: true,
        },
      },
      player2: {
        select: {
          id: true,
          fullName: true,
        },
      },
      category: {
        select: {
          id: true,
          code: true,
          tournament: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  const appearanceKeys = appearances.map((entry) => ({
    tournamentId: entry.category.tournament.id,
    categoryId: entry.category.id,
  }));

  const stats =
    appearanceKeys.length > 0
      ? await prisma.playerTournamentStat.findMany({
          where: {
            playerId,
            OR: appearanceKeys.map((entry) => ({
              tournamentId: entry.tournamentId,
              categoryId: entry.categoryId,
            })),
          },
          select: {
            tournamentId: true,
            categoryId: true,
            finishLabel: true,
            rankingPoints: true,
            matchesPlayed: true,
            matchesWon: true,
          },
        })
      : [];

  const statMap = new Map(
    stats.map((stat) => [`${stat.tournamentId}:${stat.categoryId}`, stat]),
  );

  return {
    player: {
      fullName: player.fullName,
      nickname: player.nickname,
      publicClub:
        player.clubProfilePublic && player.club?.isPublic
          ? {
              name: player.club.name,
              shortName: player.club.shortName,
              slug: player.club.slug,
            }
          : null,
    },
    appearances: appearances.map((entry) => {
      const key = `${entry.category.tournament.id}:${entry.category.id}`;
      const stat = statMap.get(key);
      const partner =
        entry.player1Id === playerId ? entry.player2 : entry.player1;

      return {
        id: entry.id,
        teamName: entry.teamName,
        partner,
        categoryCode: entry.category.code,
        tournament: entry.category.tournament,
        result: stat
          ? {
              finishLabel: stat.finishLabel,
              rankingPoints: stat.rankingPoints,
              matchesPlayed: stat.matchesPlayed,
              matchesWon: stat.matchesWon,
            }
          : null,
      };
    }),
  };
}
