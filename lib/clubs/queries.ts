import { prisma } from "@/lib/db/prisma";

export async function getPublicClubSitemapEntries() {
  return prisma.club.findMany({
    where: {
      isPublic: true,
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });
}
