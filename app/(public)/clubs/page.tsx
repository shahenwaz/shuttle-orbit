import Link from "next/link";
import { MapPin } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { prisma } from "@/lib/db/prisma";

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
      description: true,
      homeVenue: true,
      isManagedClub: true,
      _count: {
        select: {
          players: true,
        },
      },
    },
  });

  type ClubRow = (typeof clubs)[number];

  return (
    <PageContainer className="space-y-6 py-8 sm:py-10">
      <section className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/80">
          Clubs
        </p>

        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Badminton clubs
        </h1>

        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Explore community badminton clubs connected with Shuttle Orbit.
        </p>
      </section>

      {clubs.length === 0 ? (
        <div className="rounded-md border border-white/10 bg-white/4 px-4 py-5 text-sm text-muted-foreground">
          No public clubs added yet.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {clubs.map((club: ClubRow) => (
            <Link
              key={club.id}
              href={`/clubs/${club.slug}`}
              className="group rounded-md border border-white/10 bg-white/4 p-4 transition hover:border-primary/25 hover:bg-white/6"
            >
              <div className="space-y-3">
                <div className="space-y-1">
                  <h2 className="text-base font-semibold tracking-tight text-foreground">
                    {club.name}
                  </h2>

                  {club.homeVenue ? (
                    <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 text-primary/80" />
                      {club.homeVenue}
                    </p>
                  ) : null}
                </div>

                {club.description ? (
                  <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {club.description}
                  </p>
                ) : null}

                <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  <span>{club._count.players} players</span>
                  {club.isManagedClub ? <span>Managed</span> : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
