import { prisma } from "@/lib/db/prisma";

export async function getPlayersDirectory() {
  return prisma.player.findMany({
    orderBy: { fullName: "asc" },
    select: {
      id: true,
      fullName: true,
      nickname: true,
    },
  });
}
