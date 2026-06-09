import { notFound } from "next/navigation";
import { CalendarDays, Clock, Grid3X3, MapPin } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { prisma } from "@/lib/db/prisma";

type MemberZonePageProps = {
  params: Promise<{
    slug: string;
    shareKey: string;
  }>;
};

function formatSessionDate(date: Date) {
  return new Intl.DateTimeFormat("en-IE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    timeZone: "UTC",
  }).format(date);
}

function formatSessionTime(date: Date) {
  return new Intl.DateTimeFormat("en-IE", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "UTC",
  }).format(date);
}

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
      shortName: true,
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
                  playerId: true,
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

  type MemberSession = (typeof club.sessions)[number];
  type GoingAttendance = MemberSession["attendance"][number];

  return (
    <PageContainer className="space-y-6 py-8 sm:py-10">
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
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Upcoming sessions
            </h2>
            <p className="text-sm text-muted-foreground">
              Date, time, courts, and confirmed players.
            </p>
          </div>
        </div>

        {club.sessions.length === 0 ? (
          <div className="rounded-md border border-white/10 bg-white/4 px-4 py-5 text-sm text-muted-foreground">
            No upcoming sessions shared yet.
          </div>
        ) : (
          <div className="grid gap-2">
            {club.sessions.map((session: MemberSession) => (
              <article
                key={session.id}
                className="rounded-md border border-white/10 bg-white/4 p-4"
              >
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground sm:text-base">
                      {session.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3 w-3 text-primary/80" />
                        {formatSessionDate(session.startAt)}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3 text-primary/80" />
                        {formatSessionTime(session.startAt)} -{" "}
                        {formatSessionTime(session.endAt)}
                      </span>

                      {session.courtNumbers ? (
                        <span className="inline-flex items-center gap-1">
                          <Grid3X3 className="h-3 w-3 text-primary/80" />
                          Courts: {session.courtNumbers}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-white/10 pt-3">
                    {session.attendance.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No one marked going yet.
                      </p>
                    ) : (
                      <p className="text-sm leading-6 text-foreground">
                        {session.attendance
                          .map(
                            (attendance: GoingAttendance) =>
                              attendance.member.name,
                          )
                          .join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}
