import { notFound } from "next/navigation";

import { AddClubMemberSheet } from "@/components/admin/clubs/add-club-member-sheet";
import { ClubMembersDirectory } from "@/components/admin/clubs/club-members-directory";
import { ClubOverviewPanel } from "@/components/admin/clubs/club-overview-panel";
import {
  ClubWorkspaceHeader,
  type ClubWorkspaceTab,
} from "@/components/admin/clubs/club-workspace-header";
import { PageContainer } from "@/components/layout/page-container";
import { prisma } from "@/lib/db/prisma";

type ClubWorkspacePageProps = {
  params: Promise<{ clubId: string }>;
  searchParams?: Promise<{ tab?: string }>;
};

function getActiveTab(tab: string | undefined): ClubWorkspaceTab {
  return tab === "members" ? "members" : "overview";
}

export default async function ClubWorkspacePage({
  params,
  searchParams,
}: ClubWorkspacePageProps) {
  const { clubId } = await params;
  const resolvedSearchParams = await searchParams;
  const activeTab = getActiveTab(resolvedSearchParams?.tab);

  if (activeTab === "overview") {
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: {
        id: true,
        name: true,
        slug: true,
        shortName: true,
        description: true,
        homeVenue: true,
        logoUrl: true,
        bannerUrl: true,
        isPublic: true,
        _count: { select: { players: true } },
      },
    });

    if (!club) notFound();

    return (
      <>
        <ClubWorkspaceHeader
          clubId={club.id}
          clubName={club.name}
          homeVenue={club.homeVenue}
          memberCount={club._count.players}
          activeTab={activeTab}
        />

        <PageContainer className="space-y-4 pt-4 pb-4 sm:space-y-5 sm:pt-5 sm:pb-5">
          <ClubOverviewPanel club={club} />
        </PageContainer>
      </>
    );
  }

  const [club, availablePlayers] = await Promise.all([
    prisma.club.findUnique({
      where: { id: clubId },
      select: {
        id: true,
        name: true,
        homeVenue: true,
        players: {
          orderBy: [{ clubRole: "asc" }, { fullName: "asc" }],
          select: {
            id: true,
            fullName: true,
            nickname: true,
            clubRole: true,
            clubProfilePublic: true,
          },
        },
        _count: { select: { players: true } },
      },
    }),
    prisma.player.findMany({
      where: { OR: [{ clubId: null }, { clubId }] },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true, nickname: true },
    }),
  ]);

  if (!club) notFound();

  type ClubPlayerRow = (typeof club.players)[number];

  const members = club.players.map((player: ClubPlayerRow) => ({
    id: player.id,
    clubId: club.id,
    name: player.fullName,
    nickname: player.nickname,
    role: player.clubRole,
    isPublic: player.clubProfilePublic,
  }));

  return (
    <>
      <ClubWorkspaceHeader
        clubId={club.id}
        clubName={club.name}
        homeVenue={club.homeVenue}
        memberCount={club._count.players}
        activeTab={activeTab}
      />

      <PageContainer className="space-y-4 pt-4 pb-4 sm:space-y-5 sm:pt-5 sm:pb-5">
        <section className="space-y-4 pt-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-base font-semibold tracking-tight text-purple-400">
                Club Members
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Members assigned to this club from the global player database.
              </p>
            </div>

            <AddClubMemberSheet clubId={club.id} players={availablePlayers} />
          </div>

          <ClubMembersDirectory members={members} />
        </section>
      </PageContainer>
    </>
  );
}
