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

function getPlacementPriority(placementTier: string | null) {
  switch (placementTier) {
    case "CHAMPION":
      return 700;
    case "RUNNER_UP":
      return 600;
    case "THIRD_PLACE":
      return 500;
    case "SEMI_FINALIST":
      return 450;
    case "FOURTH_PLACE":
      return 400;
    case "ADVANCED_STAGE":
      return 300;
    case "GROUP_STAGE":
      return 100;
    default:
      return 0;
  }
}

function getBestResultValue({
  categoryCode,
  placementTier,
}: {
  categoryCode: string;
  placementTier: string | null;
}) {
  switch (placementTier) {
    case "CHAMPION":
      return `${categoryCode} · #1`;
    case "RUNNER_UP":
      return `${categoryCode} · #2`;
    case "THIRD_PLACE":
      return `${categoryCode} · #3`;
    case "FOURTH_PLACE":
      return `${categoryCode} · #4`;
    case "SEMI_FINALIST":
      return `${categoryCode} · Semi Finalist`;
    case "ADVANCED_STAGE":
      return `${categoryCode} · Advanced`;
    case "GROUP_STAGE":
      return `${categoryCode} · Group`;
    default:
      return categoryCode;
  }
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

export async function getLeaderboardPositionForPlayer(playerId: string) {
  const grouped = await prisma.rankingLedger.groupBy({
    by: ["playerId"],
    where: {
      scope: "UNIVERSAL",
    },
    _sum: {
      totalPointsAwarded: true,
    },
    orderBy: [
      {
        _sum: {
          totalPointsAwarded: "desc",
        },
      },
      {
        playerId: "asc",
      },
    ],
  });

  const index = grouped.findIndex((row) => row.playerId === playerId);

  if (index === -1) {
    return {
      rank: null,
      totalPoints: 0,
    };
  }

  return {
    rank: index + 1,
    totalPoints: grouped[index]?._sum.totalPointsAwarded ?? 0,
  };
}

export async function getCategoryLeaderboardPositionsForPlayer(
  playerId: string,
) {
  const categoryRows = await prisma.rankingLedger.findMany({
    where: {
      playerId,
      scope: "CATEGORY",
    },
    select: {
      categoryCode: true,
    },
    distinct: ["categoryCode"],
  });

  const categoryCodes = sortCategoryCodes(
    categoryRows.map((row) => row.categoryCode),
  );

  const rankings = await Promise.all(
    categoryCodes.map(async (categoryCode) => {
      const grouped = await prisma.rankingLedger.groupBy({
        by: ["playerId"],
        where: {
          scope: "CATEGORY",
          categoryCode,
        },
        _sum: {
          totalPointsAwarded: true,
        },
        orderBy: [
          {
            _sum: {
              totalPointsAwarded: "desc",
            },
          },
          {
            playerId: "asc",
          },
        ],
      });

      const index = grouped.findIndex((row) => row.playerId === playerId);

      return {
        categoryCode,
        rank: index === -1 ? null : index + 1,
        totalPoints:
          index === -1 ? 0 : (grouped[index]?._sum.totalPointsAwarded ?? 0),
      };
    }),
  );

  return rankings;
}

export async function getPlayerProfile(playerId: string) {
  const player = await prisma.player.findUnique({
    where: {
      id: playerId,
    },
    select: {
      id: true,
      fullName: true,
      nickname: true,
      createdAt: true,
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
          fullName: true,
          nickname: true,
        },
      },
      player2: {
        select: {
          fullName: true,
          nickname: true,
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
              eventDate: true,
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
            placementTier: true,
            matchesPlayed: true,
            matchesWon: true,
            category: {
              select: {
                code: true,
              },
            },
          },
        })
      : [];

  const statMap = new Map(
    stats.map((stat) => [`${stat.tournamentId}:${stat.categoryId}`, stat]),
  );

  const universalRanking = await getLeaderboardPositionForPlayer(playerId);
  const categoryRankings =
    await getCategoryLeaderboardPositionsForPlayer(playerId);

  const bestStat =
    [...stats].sort((a, b) => {
      const placementDiff =
        getPlacementPriority(b.placementTier) -
        getPlacementPriority(a.placementTier);

      if (placementDiff !== 0) {
        return placementDiff;
      }

      const pointsDiff = b.rankingPoints - a.rankingPoints;

      if (pointsDiff !== 0) {
        return pointsDiff;
      }

      const categoryRankDiff =
        getCategoryCodeRank(b.category.code) -
        getCategoryCodeRank(a.category.code);

      if (categoryRankDiff !== 0) {
        return categoryRankDiff;
      }

      return a.category.code.localeCompare(b.category.code);
    })[0] ?? null;

  const bestCategory = bestStat?.category.code ?? null;
  const bestResultLabel = bestStat
    ? getBestResultValue({
        categoryCode: bestStat.category.code,
        placementTier: bestStat.placementTier,
      })
    : null;

  return {
    player,
    appearances: appearances.map((entry) => {
      const key = `${entry.category.tournament.id}:${entry.category.id}`;
      const stat = statMap.get(key);

      return {
        ...entry,
        ranking: stat
          ? {
              finishLabel: stat.finishLabel,
              rankingPoints: stat.rankingPoints,
              placementTier: stat.placementTier,
              matchesPlayed: stat.matchesPlayed,
              matchesWon: stat.matchesWon,
            }
          : null,
      };
    }),
    rankingSummary: {
      universalRank: universalRanking.rank,
      universalPoints: universalRanking.totalPoints,
      bestCategory,
      bestResultLabel,
      categoryRankings,
    },
  };
}
