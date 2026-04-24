import { prisma } from "@/lib/db/prisma";

type RankingScope = "UNIVERSAL" | "CATEGORY";

export async function getLeaderboard({
  scope = "UNIVERSAL",
  categoryCode,
}: {
  scope?: RankingScope;
  categoryCode?: string;
}) {
  const rows = await prisma.rankingLedger.groupBy({
    by: ["playerId"],
    where: {
      scope,
      ...(scope === "CATEGORY" && categoryCode
        ? { categoryCode: categoryCode.toUpperCase() }
        : {}),
    },
    _sum: {
      totalPointsAwarded: true,
    },
    orderBy: {
      _sum: {
        totalPointsAwarded: "desc",
      },
    },
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
        },
      },
    },
  });

  const playerMap = new Map(players.map((player) => [player.id, player]));

  return rows.map((row, index) => {
    const player = playerMap.get(row.playerId);

    return {
      rank: index + 1,
      playerId: row.playerId,
      fullName: player?.fullName ?? "Unknown Player",
      nickname: player?.nickname ?? "unknown",
      totalPoints: row._sum.totalPointsAwarded ?? 0,
      tournamentsCount: new Set(
        player?.tournamentStats.map((stat) => stat.tournamentId) ?? [],
      ).size,
    };
  });
}
