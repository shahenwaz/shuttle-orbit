import { PlusSquare } from "lucide-react";
import { notFound } from "next/navigation";

import { ClubMemberForm } from "@/components/admin/clubs/club-member-form";
import { ClubMembersDirectory } from "@/components/admin/clubs/club-members-directory";
import { ClubOverviewPanel } from "@/components/admin/clubs/club-overview-panel";
import {
  ClubWorkspaceHeader,
  type ClubWorkspaceTab,
} from "@/components/admin/clubs/club-workspace-header";
import { CreateSheet } from "@/components/admin/create-sheet";
import { PageContainer } from "@/components/layout/page-container";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
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

  const [club, availablePlayers] = await Promise.all([
    prisma.club.findUnique({
      where: { id: clubId },
      include: {
        players: {
          orderBy: [{ clubRole: "asc" }, { fullName: "asc" }],
          select: {
            id: true,
            fullName: true,
            nickname: true,
            clubRole: true,
            clubProfilePublic: true,
            clubJoinedAt: true,
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
    playerId: player.id,
    name: player.fullName,
    nickname: player.nickname,
    role: player.clubRole,
    isPublic: player.clubProfilePublic,
    joinedAt: player.clubJoinedAt,
    player: {
      id: player.id,
      fullName: player.fullName,
      nickname: player.nickname,
    },
  }));

  const activeTab = getActiveTab(resolvedSearchParams?.tab);

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
        {activeTab === "overview" ? <ClubOverviewPanel club={club} /> : null}

        {activeTab === "members" ? (
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

              <CreateSheet
                triggerLabel="Add player"
                title="Add player to club"
                description="Assign an existing Shuttle Orbit player to this club."
                triggerClassName={actionPillButtonClassName({
                  variant: "create",
                  className:
                    "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
                })}
                triggerIcon={<PlusSquare className="h-3.5 w-3.5" />}
              >
                <ClubMemberForm clubId={club.id} players={availablePlayers} />
              </CreateSheet>
            </div>

            <ClubMembersDirectory
              members={members}
              players={availablePlayers}
            />
          </section>
        ) : null}
      </PageContainer>
    </>
  );
}
