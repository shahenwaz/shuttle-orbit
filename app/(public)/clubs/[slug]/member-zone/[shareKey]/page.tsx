import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";

import { MemberZoneSessions } from "@/components/clubs/member-zone-sessions";
import { PageContainer } from "@/components/layout/page-container";
import { prisma } from "@/lib/db/prisma";

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
    },
    select: {
      id: true,
      name: true,
      homeVenue: true,
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

  type SessionRow = (typeof upcomingSessions)[number];
  type AttendanceRow = SessionRow["attendance"][number];

  function mapSession(session: SessionRow) {
    return {
      id: session.id,
      title: session.title,
      startAt: session.startAt.toISOString(),
      endAt: session.endAt.toISOString(),
      courtNumbers: session.courtNumbers,
      privateNotes: session.privateNotes,
      attendance: session.attendance.map((attendance: AttendanceRow) => ({
        member: {
          id: attendance.member.id,
          name: attendance.member.name,
          nickname: attendance.member.nickname,
        },
      })),
    };
  }

  return (
    <PageContainer className="space-y-5 py-7 sm:space-y-6 sm:py-10">
      <section className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/80">
          Private member view
        </p>

        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {club.name}
          </h1>

          {club.homeVenue ? (
            <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary/80" />
              {club.homeVenue}
            </p>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Our Train & Play sessions
        </h2>

        <MemberZoneSessions
          upcomingSessions={upcomingSessions.map((session: SessionRow) =>
            mapSession(session),
          )}
          previousSessions={previousSessions.map((session: SessionRow) =>
            mapSession(session),
          )}
        />
      </section>
    </PageContainer>
  );
}
