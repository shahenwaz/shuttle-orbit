import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, PlusSquare, Settings2 } from "lucide-react";

import { ClubForm } from "@/components/admin/clubs/club-form";
import { ClubMemberForm } from "@/components/admin/clubs/club-member-form";
import { ClubMembersDirectory } from "@/components/admin/clubs/club-members-directory";
import { ClubSessionForm } from "@/components/admin/clubs/club-session-form";
import { ClubSessionsDirectory } from "@/components/admin/clubs/club-sessions-directory";
import { CreateSheet } from "@/components/admin/create-sheet";
import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";
import { PageContainer } from "@/components/layout/page-container";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { SectionTabs } from "@/components/shared/section-tabs";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";

type ClubWorkspaceTab = "overview" | "members" | "sessions";

type ClubWorkspacePageProps = {
  params: Promise<{
    clubId: string;
  }>;
  searchParams?: Promise<{
    tab?: string;
  }>;
};

function getActiveTab(tab: string | undefined, isManagedClub: boolean) {
  if (tab === "members") return "members";
  if (tab === "sessions" && isManagedClub) return "sessions";

  return "overview";
}

export default async function ClubWorkspacePage({
  params,
  searchParams,
}: ClubWorkspacePageProps) {
  const { clubId } = await params;
  const resolvedSearchParams = await searchParams;

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
        sessions: {
          orderBy: {
            startAt: "desc",
          },
          select: {
            id: true,
            clubId: true,
            title: true,
            startAt: true,
            endAt: true,
            venue: true,
            courtNumbers: true,
            privateNotes: true,
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

  const activeTab = getActiveTab(
    resolvedSearchParams?.tab,
    club.isManagedClub,
  ) as ClubWorkspaceTab;

  const VisibilityIcon = club.isPublic ? Eye : EyeOff;

  const tabs = [
    {
      key: "overview",
      label: "Overview",
      href: `/admin/clubs/${club.id}`,
    },
    {
      key: "members",
      label: "Members",
      href: `/admin/clubs/${club.id}?tab=members`,
    },
    ...(club.isManagedClub
      ? [
          {
            key: "sessions",
            label: "Sessions",
            href: `/admin/clubs/${club.id}?tab=sessions`,
          },
        ]
      : []),
  ];

  return (
    <PageContainer className="space-y-4 sm:space-y-5">
      <AdminShellHeader
        title={club.name}
        description="Manage club profile, members, and internal tools in one compact workspace."
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

        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
          {club.isManagedClub ? "Managed" : "Showcase"}
        </span>
      </section>

      <SectionTabs activeKey={activeTab} items={tabs} />

      {activeTab === "overview" ? (
        <section className="space-y-4 pt-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                  Club profile
                </h2>

                {club.shortName ? (
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                    {club.shortName}
                  </span>
                ) : null}
              </div>

              <p className="text-xs text-sky-500">clubs/{club.slug}</p>

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

            <CreateSheet
              triggerLabel="Edit profile"
              title="Edit club profile"
              description="Update the public identity and basic details for this club."
              triggerClassName={actionPillButtonClassName({
                variant: "create",
                className:
                  "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
              })}
              triggerIcon={<Settings2 className="h-3.5 w-3.5" />}
            >
              <ClubForm mode="edit" club={club} />
            </CreateSheet>
          </div>

          <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-md border border-white/10 bg-white/4 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Home venue
              </p>
              <p className="mt-1 text-foreground">
                {club.homeVenue ?? "Not set"}
              </p>
            </div>

            <div className="rounded-md border border-white/10 bg-white/4 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Profile type
              </p>
              <p className="mt-1 text-foreground">
                {club.isManagedClub ? "Managed club" : "Showcase club"}
              </p>
            </div>

            <div className="rounded-md border border-white/10 bg-white/4 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Visibility
              </p>
              <p className="mt-1 text-foreground">
                {club.isPublic ? "Public profile" : "Private profile"}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "members" ? (
        <section className="space-y-4 pt-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Members
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Linked players and club-only members.
              </p>
            </div>

            <CreateSheet
              triggerLabel="Add member"
              title="Add club member"
              description="Link an existing Shuttle Orbit player or add a club-only member."
              triggerClassName={actionPillButtonClassName({
                variant: "create",
                className:
                  "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
              })}
              triggerIcon={<PlusSquare className="h-3.5 w-3.5" />}
            >
              <ClubMemberForm clubId={club.id} players={players} />
            </CreateSheet>
          </div>

          <ClubMembersDirectory members={club.members} players={players} />
        </section>
      ) : null}

      {activeTab === "sessions" && club.isManagedClub ? (
        <section className="space-y-4 pt-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Sessions
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Court times, court numbers, and session details.
              </p>
            </div>

            <CreateSheet
              triggerLabel="Add session"
              title="Add club session"
              description="Add the next club night with time, venue, and court details."
              triggerClassName={actionPillButtonClassName({
                variant: "create",
                className:
                  "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
              })}
              triggerIcon={<PlusSquare className="h-3.5 w-3.5" />}
            >
              <ClubSessionForm
                mode="create"
                clubId={club.id}
                defaultVenue={club.homeVenue}
              />
            </CreateSheet>
          </div>

          <ClubSessionsDirectory
            sessions={club.sessions}
            defaultVenue={club.homeVenue}
          />
        </section>
      ) : null}
    </PageContainer>
  );
}
