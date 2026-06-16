import { notFound } from "next/navigation";

import { ClubProfileShell } from "@/components/clubs/club-profile-shell";
import { PageContainer } from "@/components/layout/page-container";
import { prisma } from "@/lib/db/prisma";
import { mapClubProfileMember } from "@/lib/clubs/club-profile-mappers";

type PublicClubPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublicClubPage({ params }: PublicClubPageProps) {
  const { slug } = await params;

  const club = await prisma.club.findUnique({
    where: {
      slug,
    },
    select: {
      name: true,
      shortName: true,
      description: true,
      homeVenue: true,
      logoUrl: true,
      isPublic: true,
      players: {
        where: {
          isActive: true,
          clubProfilePublic: true,
        },
        orderBy: {
          fullName: "asc",
        },
        select: {
          id: true,
          fullName: true,
          nickname: true,
          clubId: true,
        },
      },
    },
  });

  if (!club || !club.isPublic) {
    notFound();
  }

  type PlayerRow = (typeof club.players)[number];

  return (
    <PageContainer className="py-7 sm:py-10">
      <ClubProfileShell
        club={{
          name: club.name,
          shortName: club.shortName,
          description: club.description,
          homeVenue: club.homeVenue,
          logoUrl: club.logoUrl,
        }}
        members={club.players.map((player: PlayerRow) =>
          mapClubProfileMember(player),
        )}
        hasSessionAccess={false}
      />
    </PageContainer>
  );
}
