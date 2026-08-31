import { PlusSquare } from "lucide-react";

import { CreateSheet } from "@/components/admin/create-sheet";
import { AdminClubsDirectory } from "@/components/admin/clubs/admin-clubs-directory";
import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";
import { ClubForm } from "@/components/admin/clubs/club-form";
import { PageContainer } from "@/components/layout/page-container";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { prisma } from "@/lib/db/prisma";

export default async function AdminClubsPage() {
  const clubs = await prisma.club.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      shortName: true,
      homeVenue: true,
      _count: {
        select: {
          players: true,
        },
      },
    },
  });

  return (
    <PageContainer className="space-y-4 sm:space-y-6">
      <AdminShellHeader title="Club management" />

      <section className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <CompactStatPill label="Clubs" value={clubs.length} />

        <CreateSheet
          triggerLabel="Add club"
          title="Create club"
          description="Add a club profile and connect players from the community database."
          triggerClassName={actionPillButtonClassName({
            variant: "create",
            className:
              "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
          })}
          triggerIcon={<PlusSquare className="h-3.5 w-3.5" />}
        >
          <ClubForm mode="create" />
        </CreateSheet>
      </section>

      <AdminClubsDirectory clubs={clubs} />
    </PageContainer>
  );
}
