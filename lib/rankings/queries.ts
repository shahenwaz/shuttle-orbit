import { prisma } from "@/lib/db/prisma";

type LeaderboardScope = "UNIVERSAL" | "CATEGORY";

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

  const players = await prisma.player.findMany({
    where: {
      id: {
        in: rows.map((row) => row.playerId),
      },
    },
    select: {
      id: true,
      fullName: true,
      nickname: true,
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

    const tournamentIds = new Set(
      player?.tournamentStats.map((stat) => stat.tournamentId) ?? [],
    );

    const categoryCounts = new Map<string, number>();

    for (const stat of player?.tournamentStats ?? []) {
      const code = stat.category.code;
      categoryCounts.set(code, (categoryCounts.get(code) ?? 0) + 1);
    }

    const bestCategory =
      [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    return {
      rank: index + 1,
      playerId: row.playerId,
      fullName: player?.fullName ?? "Unknown Player",
      nickname: player?.nickname ?? "unknown",
      totalPoints: row._sum.totalPointsAwarded ?? 0,
      tournamentsCount: tournamentIds.size,
      bestCategory,
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
