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

export default async function ClubMemberZonePage({
  params,
}: MemberZonePageProps) {
  const { slug, shareKey } = await params;

  const club = await prisma.club.findFirst({
    where: {
      slug,
      memberShareKey: shareKey,
      memberAccessEnabled: true,
      isManagedClub: true,
    },
    select: {
      name: true,
      homeVenue: true,
      sessions: {
        where: {
          startAt: {
            gte: new Date(),
          },
        },
        orderBy: {
          startAt: "asc",
        },
        take: 8,
        select: {
          id: true,
          title: true,
          startAt: true,
          endAt: true,
          courtNumbers: true,
          privateNotes: true,
          attendance: {
            where: {
              status: "GOING",
            },
            orderBy: {
              member: {
                name: "asc",
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
        },
      },
    },
  });

  if (!club) {
    notFound();
  }

  type SessionRow = (typeof club.sessions)[number];
  type AttendanceRow = SessionRow["attendance"][number];

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
        <div className="space-y-1">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Upcoming sessions
          </h2>
          <p className="text-sm text-muted-foreground">
            Date, time, courts, and confirmed players.
          </p>
        </div>

        <MemberZoneSessions
          sessions={club.sessions.map((session: SessionRow) => ({
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
          }))}
        />
      </section>
    </PageContainer>
  );
}
