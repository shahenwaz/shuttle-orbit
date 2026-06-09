import Link from "next/link";
import { CalendarDays, Plus, Shield, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";

export default async function AdminClubsPage() {
  const clubs = await prisma.club.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          members: true,
          sessions: true,
        },
      },
    },
  });

  type ClubRow = (typeof clubs)[number];

  return (
    <div className="space-y-5 pb-8">
      <section className="overflow-hidden rounded-md border border-white/10 bg-white/4 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <div className="border-b border-white/10 bg-background/40 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/80">
                Club management
              </p>

              <div className="space-y-1">
                <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Clubs
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                  Manage public club profiles, member groups, and private
                  session planning from one Shuttle Orbit workspace.
                </p>
              </div>
            </div>

            <Button
              asChild
              className="h-10 w-full rounded-md font-semibold sm:w-auto"
            >
              <Link href="/admin/clubs/new">
                <Plus className="mr-2 h-4 w-4" />
                Add club
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-3 p-3 sm:p-4">
          {clubs.length === 0 ? (
            <Card className="rounded-md border-white/10 bg-background/40">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No clubs created yet. Add your first club profile to start
                managing members and sessions.
              </CardContent>
            </Card>
          ) : (
            clubs.map((club: ClubRow) => (
              <Card
                key={club.id}
                className="group rounded-md border-white/10 bg-background/45 transition hover:border-primary/25 hover:bg-white/5"
              >
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/4">
                          <Shield className="h-4.5 w-4.5 text-primary" />
                        </div>

                        <div className="min-w-0">
                          <h2 className="truncate font-heading text-base font-semibold text-foreground sm:text-lg">
                            {club.name}
                          </h2>
                          <p className="text-xs text-muted-foreground">
                            /{club.slug}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">
                        {club.shortName ? (
                          <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 font-medium text-primary">
                            {club.shortName}
                          </span>
                        ) : null}

                        <span className="rounded-full border border-white/10 bg-white/4 px-2.5 py-1 text-muted-foreground">
                          {club.isPublic ? "Public profile" : "Private profile"}
                        </span>

                        {club.homeVenue ? (
                          <span className="rounded-full border border-white/10 bg-white/4 px-2.5 py-1 text-muted-foreground">
                            {club.homeVenue}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                      <div className="rounded-md border border-white/10 bg-white/4 px-3 py-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5 text-primary" />
                          Members
                        </div>
                        <p className="mt-1 text-lg font-semibold text-foreground">
                          {club._count.members}
                        </p>
                      </div>

                      <div className="rounded-md border border-white/10 bg-white/4 px-3 py-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5 text-primary" />
                          Sessions
                        </div>
                        <p className="mt-1 text-lg font-semibold text-foreground">
                          {club._count.sessions}
                        </p>
                      </div>

                      <Button
                        asChild
                        variant="secondary"
                        className="col-span-2 h-10 rounded-md sm:col-span-1"
                      >
                        <Link href={`/admin/clubs/${club.id}/edit`}>
                          Manage
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
