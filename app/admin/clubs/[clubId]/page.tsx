import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  EyeOff,
  PlusSquare,
  Settings2,
  Users,
} from "lucide-react";

import { ClubForm } from "@/components/admin/clubs/club-form";
import { ClubMemberForm } from "@/components/admin/clubs/club-member-form";
import { ClubMembersDirectory } from "@/components/admin/clubs/club-members-directory";
import { CreateSheet } from "@/components/admin/create-sheet";
import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";
import { PageContainer } from "@/components/layout/page-container";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";

type ClubWorkspacePageProps = {
  params: Promise<{
    clubId: string;
  }>;
};

export default async function ClubWorkspacePage({
  params,
}: ClubWorkspacePageProps) {
  const { clubId } = await params;

  const [club, players] = await Promise.all([
    prisma.club.findUnique({
      where: {
        id: clubId,
      },
      include: {
        members: {
          orderBy: [
            {
              role: "asc",
            },
            {
              name: "asc",
            },
          ],
          include: {
            player: {
              select: {
                id: true,
                fullName: true,
                nickname: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            sessions: true,
          },
        },
      },
    }),
    prisma.player.findMany({
      orderBy: {
        fullName: "asc",
      },
      select: {
        id: true,
        fullName: true,
        nickname: true,
      },
    }),
  ]);

  if (!club) {
    notFound();
  }

  const VisibilityIcon = club.isPublic ? Eye : EyeOff;

  return (
    <PageContainer className="space-y-4 sm:space-y-6">
      <AdminShellHeader
        title={club.name}
        description="Manage the club profile, linked players, club-only members, and future session planning from one clean workspace."
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
            Back
          </Link>
        </Button>

        <CompactStatPill label="Members" value={club._count.members} />
        <CompactStatPill label="Sessions" value={club._count.sessions} />

        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
          <VisibilityIcon className="mr-1.5 h-3.5 w-3.5 text-primary/80" />
          {club.isPublic ? "Public" : "Private"}
        </span>

        <CreateSheet
          triggerLabel="Edit profile"
          title="Edit club profile"
          description="Update the public identity and basic details for this club."
          triggerClassName={actionPillButtonClassName({
            variant: "link",
            className:
              "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
          })}
          triggerIcon={<Settings2 className="h-3.5 w-3.5" />}
        >
          <ClubForm mode="edit" club={club} />
        </CreateSheet>

        <CreateSheet
          triggerLabel="Add member"
          title="Add club member"
          description="Link an existing Shuttle Orbit player or add a club-only member for sessions."
          triggerClassName={actionPillButtonClassName({
            variant: "create",
            className:
              "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
          })}
          triggerIcon={<PlusSquare className="h-3.5 w-3.5" />}
        >
          <ClubMemberForm clubId={club.id} players={players} />
        </CreateSheet>
      </section>

      <section className="surface-card p-4 sm:p-5">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                  Club overview
                </h2>

                {club.shortName ? (
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                    {club.shortName}
                  </span>
                ) : null}
              </div>

              <p className="text-xs text-muted-foreground">/{club.slug}</p>

              {club.description ? (
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                  {club.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No club description added yet.
                </p>
              )}
            </div>

            {club.homeVenue ? (
              <div className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
                <CalendarDays className="mr-1.5 h-3.5 w-3.5 text-primary/80" />
                {club.homeVenue}
              </div>
            ) : null}
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                  Members
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Manage linked tournament players and club-only members in the
                  same place.
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5 text-primary/80" />
                {club.members.length} total
              </div>
            </div>

            <ClubMembersDirectory members={club.members} players={players} />
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
