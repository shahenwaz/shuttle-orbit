import { prisma } from "@/lib/db/prisma";

type LeaderboardScope = "UNIVERSAL" | "CATEGORY";

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

function getStrongestCategoryPlayed(codes: string[]) {
  return (
    [...new Set(codes)].sort((a, b) => {
      const rankDiff = getCategoryCodeRank(b) - getCategoryCodeRank(a);

      if (rankDiff !== 0) {
        return rankDiff;
      }

      return a.localeCompare(b);
    })[0] ?? null
  );
}

export async function getLeaderboard({
  scope = "UNIVERSAL",
  categoryCode,
}: {
  scope?: LeaderboardScope;
  categoryCode?: string;
}) {
  const normalizedCategoryCode = categoryCode?.trim().toUpperCase();

  const rows = await prisma.rankingLedger.groupBy({
    by: ["playerId"],
    where: {
      scope,
      ...(scope === "CATEGORY" && normalizedCategoryCode
        ? { categoryCode: normalizedCategoryCode }
        : {}),
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

  const playerIds = rows.map((row) => row.playerId);

  const players = await prisma.player.findMany({
    where: {
      id: {
        in: playerIds,
      },
    },
    select: {
      id: true,
      fullName: true,
      tournamentStats: {
        select: {
          tournamentId: true,
          category: {
            select: {
              code: true,
            },
          },
        },
      },
    },
  });

  const playerMap = new Map(players.map((player) => [player.id, player]));

  return rows.map((row, index) => {
    const player = playerMap.get(row.playerId);
    const totalPoints = row._sum.totalPointsAwarded ?? 0;

    const tournamentIds = new Set(
      player?.tournamentStats.map((stat) => stat.tournamentId) ?? [],
    );

    const categoryCodes =
      player?.tournamentStats.map((stat) => stat.category.code) ?? [];

    return {
      rank: index + 1,
      playerId: row.playerId,
      fullName: player?.fullName ?? "Unknown Player",
      totalPoints,
      tournamentsCount: tournamentIds.size,
      bestCategory: getStrongestCategoryPlayed(categoryCodes),
    };
  });
}

export async function getAvailableLeaderboardCategories() {
  const rows = await prisma.rankingLedger.findMany({
    where: {
      scope: "CATEGORY",
    },
    select: {
      categoryCode: true,
    },
    distinct: ["categoryCode"],
    orderBy: {
      categoryCode: "asc",
    },
  });

  return rows.map((row) => row.categoryCode);
}
