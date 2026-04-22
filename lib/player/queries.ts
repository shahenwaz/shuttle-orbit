import { prisma } from "@/lib/db/prisma";

function getCategoryCodeRank(code: string) {
  const normalized = code.trim().toUpperCase();

  switch (normalized) {
    case "A":
      return 300;
    case "B":
      return 200;
    case "C":
      return 100;
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
