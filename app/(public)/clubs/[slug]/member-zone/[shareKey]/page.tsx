import { notFound } from "next/navigation";

import { ClubProfileShell } from "@/components/clubs/club-profile-shell";
import { PageContainer } from "@/components/layout/page-container";
import { prisma } from "@/lib/db/prisma";
import {
  mapClubProfileMember,
  mapClubProfileSession,
} from "@/lib/clubs/club-profile-mappers";

type MemberZonePageProps = {
  params: Promise<{
    slug: string;
    shareKey: string;
  }>;
};

const sessionSelect = {
  id: true,
  title: true,
  startAt: true,
  endAt: true,
  courtNumbers: true,
  privateNotes: true,
  attendance: {
    where: {
      status: "GOING" as const,
    },
    orderBy: {
      member: {
        name: "asc" as const,
      },
    },
    select: {
      member: {
        select: {
          id: true,
          name: true,
          nickname: true,
        },
      },
    },
  },
};

export default async function ClubMemberZonePage({
  params,
}: MemberZonePageProps) {
  const { slug, shareKey } = await params;
  const now = new Date();

  const club = await prisma.club.findFirst({
    where: {
      slug,
      memberShareKey: shareKey,
      memberAccessEnabled: true,
      isManagedClub: true,
      isPublic: true,
    },
    select: {
      id: true,
      name: true,
      shortName: true,
      description: true,
      homeVenue: true,
      logoUrl: true,
      isManagedClub: true,
      members: {
        where: {
          isPublic: true,
        },
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          nickname: true,
        },
      },
    },
  });

  if (!club) {
    notFound();
  }

  const [upcomingSessions, previousSessions] = await Promise.all([
    prisma.clubSession.findMany({
      where: {
        clubId: club.id,
        endAt: {
          gte: now,
        },
      },
      orderBy: {
        startAt: "asc",
      },
      take: 8,
      select: sessionSelect,
    }),
    prisma.clubSession.findMany({
      where: {
        clubId: club.id,
        endAt: {
          lt: now,
        },
      },
      orderBy: {
        startAt: "desc",
      },
      take: 8,
      select: sessionSelect,
    }),
  ]);

  type MemberRow = (typeof club.members)[number];
  type SessionRow = (typeof upcomingSessions)[number];

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
        members={club.members.map((member: MemberRow) =>
          mapClubProfileMember(member),
        )}
        hasSessionAccess={true}
        upcomingSessions={upcomingSessions.map((session: SessionRow) =>
          mapClubProfileSession(session),
        )}
        previousSessions={previousSessions.map((session: SessionRow) =>
          mapClubProfileSession(session),
        )}
      />
    </PageContainer>
  );
}
