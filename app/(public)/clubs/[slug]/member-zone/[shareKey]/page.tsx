import { notFound } from "next/navigation";

import {
  PublicClubProfileHeader,
  type PublicClubProfileTab,
} from "@/components/clubs/public-club-profile-header";
import { ClubProfileShell } from "@/components/clubs/club-profile-shell";
import { PageContainer } from "@/components/layout/page-container";
import {
  mapClubProfileMember,
  mapClubProfileSession,
} from "@/lib/clubs/club-profile-mappers";
import { prisma } from "@/lib/db/prisma";

type MemberZonePageProps = {
  params: Promise<{
    slug: string;
    shareKey: string;
  }>;
  searchParams?: Promise<{
    tab?: string;
  }>;
};

const sessionSelect = {
  id: true,
  title: true,
  startAt: true,
  endAt: true,
  courtNumbers: true,
  attendance: {
    where: {
      status: "GOING" as const,
    },
    orderBy: {
      player: {
        fullName: "asc" as const,
      },
    },
    select: {
      player: {
        select: {
          id: true,
          fullName: true,
          nickname: true,
          clubId: true,
        },
      },
    },
  },
};

function getActiveTab(tab: string | undefined): PublicClubProfileTab {
  if (tab === "members") return "members";
  if (tab === "sessions") return "sessions";

  return "overview";
}

export default async function ClubMemberZonePage({
  params,
  searchParams,
}: MemberZonePageProps) {
  const { slug, shareKey } = await params;
  const resolvedSearchParams = await searchParams;
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

  if (!club) {
    notFound();
  }

  const [upcomingSessionRows, previousSessionRows] = await Promise.all([
    prisma.clubSession.findMany({
      where: {
        clubId: club.id,
        visibility: {
          in: ["PUBLIC", "MEMBER_ONLY"],
        },
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
        visibility: {
          in: ["PUBLIC", "MEMBER_ONLY"],
        },
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

  type PlayerRow = (typeof club.players)[number];
  type UpcomingSessionRow = (typeof upcomingSessionRows)[number];
  type PreviousSessionRow = (typeof previousSessionRows)[number];

  const members = club.players.map((player: PlayerRow) =>
    mapClubProfileMember(player),
  );

  const upcomingSessions = upcomingSessionRows.map(
    (session: UpcomingSessionRow) => mapClubProfileSession(session),
  );

  const previousSessions = previousSessionRows.map(
    (session: PreviousSessionRow) => mapClubProfileSession(session),
  );

  const activeTab = getActiveTab(resolvedSearchParams?.tab);
  const baseHref = `/clubs/${slug}/member-zone/${shareKey}`;

  return (
    <>
      <PublicClubProfileHeader
        club={{
          name: club.name,
          shortName: club.shortName,
          homeVenue: club.homeVenue,
          logoUrl: club.logoUrl,
        }}
        activeTab={activeTab}
        baseHref={baseHref}
        hasSessionAccess={true}
      />

      <PageContainer className="py-5 sm:py-7">
        <ClubProfileShell
          club={{
            description: club.description,
            homeVenue: club.homeVenue,
          }}
          members={members}
          activeTab={activeTab}
          hasSessionAccess={true}
          upcomingSessions={upcomingSessions}
          previousSessions={previousSessions}
        />
      </PageContainer>
    </>
  );
}
