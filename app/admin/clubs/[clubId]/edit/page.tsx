import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Eye, EyeOff, Users } from "lucide-react";

import { ClubForm } from "@/components/admin/clubs/club-form";
import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";
import { PageContainer } from "@/components/layout/page-container";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";

type EditClubPageProps = {
  params: Promise<{
    clubId: string;
  }>;
};

export default async function EditClubPage({ params }: EditClubPageProps) {
  const { clubId } = await params;

  const club = await prisma.club.findUnique({
    where: {
      id: clubId,
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

  if (!club) {
    notFound();
  }

  const VisibilityIcon = club.isPublic ? Eye : EyeOff;

  return (
    <PageContainer className="space-y-4 sm:space-y-6">
      <AdminShellHeader
        title={club.name}
        description="Update this club profile and prepare its member, session, and private matchday workspace."
      />

      <section className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          className={actionPillButtonClassName({
            variant: "link",
            className:
              "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
          })}
        >
          <Link href="/admin/clubs">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            Back to clubs
          </Link>
        </Button>

        <CompactStatPill label="Members" value={club._count.members} />
        <CompactStatPill label="Sessions" value={club._count.sessions} />

        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
          <VisibilityIcon className="mr-1.5 h-3.5 w-3.5 text-primary/80" />
          {club.isPublic ? "Public profile" : "Private profile"}
        </span>

        {club.homeVenue ? (
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
            <CalendarDays className="mr-1.5 h-3.5 w-3.5 text-primary/80" />
            {club.homeVenue}
          </span>
        ) : null}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="surface-card p-4 sm:p-5">
          <ClubForm mode="edit" club={club} />
        </div>

        <aside className="surface-card h-fit p-4 sm:p-5">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/4">
              <Users className="h-4.5 w-4.5 text-primary" />
            </div>

            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-foreground">
                Club workspace
              </h2>
              <p className="text-xs leading-5 text-muted-foreground">
                Next, this profile will connect to members, club sessions,
                attendance, court details, and a private member-only share view.
              </p>
            </div>

            <div className="rounded-md border border-white/10 bg-background/40 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary/80">
                Public slug
              </p>
              <p className="mt-1 break-all text-sm font-medium text-foreground">
                /clubs/{club.slug}
              </p>
            </div>
          </div>
        </aside>
      </section>
    </PageContainer>
  );
}
