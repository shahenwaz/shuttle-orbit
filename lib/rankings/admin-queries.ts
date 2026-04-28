import { prisma } from "@/lib/db/prisma";

export async function getAdminRankingTournaments() {
  const tournaments = await prisma.tournament.findMany({
    orderBy: {
      eventDate: "desc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      eventDate: true,
      _count: {
        select: {
          categories: true,
          rankingLedger: true,
          playerStats: true,
        },
      },
    },
  });

  return tournaments;
}
