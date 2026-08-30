import type { Metadata } from "next";

import {
  PublicClubCard,
  type PublicClubCardData,
} from "@/components/clubs/public-club-card";
import { PageContainer } from "@/components/layout/page-container";
import { PublicPageHeader } from "@/components/public/public-page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { prisma } from "@/lib/db/prisma";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Clubs",
  description:
    "Explore community badminton clubs connected with Shuttle Orbit.",
});

export default async function PublicClubsPage() {
  const clubs = await prisma.club.findMany({
    where: {
      isPublic: true,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      shortName: true,
      homeVenue: true,
      logoUrl: true,
      _count: {
        select: {
          players: true,
        },
      },
    },
  });

  type ClubRow = (typeof clubs)[number];

  return (
    <PageContainer className="space-y-6 sm:space-y-8">
      <PublicPageHeader
        eyebrow="Clubs"
        title="BD Community badminton clubs"
        description="Explore BD community badminton clubs."
      />

      {clubs.length === 0 ? (
        <EmptyState message="No public clubs are available right now." />
      ) : (
        <div className="grid gap-2 sm:gap-2.5 sm:grid-cols-2">
          {clubs.map((club: ClubRow) => (
            <PublicClubCard key={club.id} club={club as PublicClubCardData} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
