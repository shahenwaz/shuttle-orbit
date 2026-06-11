"use client";

import { useState } from "react";
import { MapPin, ShieldCheck, Users } from "lucide-react";

import { ClubMembersPanel } from "@/components/clubs/club-members-panel";
import { ClubSessionsPanel } from "@/components/clubs/club-sessions-panel";
import { SectionTabs } from "@/components/shared/section-tabs";
import type {
  ClubProfileMember,
  ClubProfileSession,
} from "@/lib/clubs/club-profile-mappers";

type ClubProfileTab = "overview" | "members" | "sessions";

type ClubProfileShellProps = {
  club: {
    name: string;
    shortName: string | null;
    description: string | null;
    homeVenue: string | null;
    logoUrl: string | null;
    isManagedClub: boolean;
  };
  members: ClubProfileMember[];
  hasSessionAccess: boolean;
  upcomingSessions?: ClubProfileSession[];
  previousSessions?: ClubProfileSession[];
};

function getClubInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ClubProfileShell({
  club,
  members,
  hasSessionAccess,
  upcomingSessions = [],
  previousSessions = [],
}: ClubProfileShellProps) {
  const [activeTab, setActiveTab] = useState<ClubProfileTab>("overview");

  const tabs: { key: ClubProfileTab; label: string }[] = [
    {
      key: "overview",
      label: "Overview",
    },
    {
      key: "members",
      label: "Members",
    },
  ];

  if (hasSessionAccess) {
    tabs.push({
      key: "sessions",
      label: "Sessions",
    });
  }

  return (
    <div className="space-y-5">
      <section className="rounded-md border border-white/10 bg-white/4 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-white/10 bg-background/60 bg-cover bg-center text-sm font-bold text-primary"
            style={
              club.logoUrl
                ? {
                    backgroundImage: `url(${club.logoUrl})`,
                  }
                : undefined
            }
          >
            {club.logoUrl ? null : getClubInitials(club.shortName ?? club.name)}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/80">
                Club profile
              </p>

              <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {club.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {club.homeVenue ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary/80" />
                  {club.homeVenue}
                </span>
              ) : null}

              {club.isManagedClub ? (
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary/80" />
                  Managed club
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <SectionTabs
        activeKey={activeTab}
        items={tabs}
        onChange={(key) => setActiveTab(key as ClubProfileTab)}
      />

      {activeTab === "overview" ? (
        <section className="space-y-3">
          {club.description ? (
            <p className="rounded-md border border-white/10 bg-white/4 px-3 py-3 text-sm leading-6 text-muted-foreground">
              {club.description}
            </p>
          ) : (
            <p className="rounded-md border border-white/10 bg-white/4 px-3 py-3 text-sm leading-6 text-muted-foreground">
              Club details will be updated soon.
            </p>
          )}

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-md border border-white/10 bg-white/4 px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Members
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {members.length}
              </p>
            </div>

            <div className="rounded-md border border-white/10 bg-white/4 px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Access
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {hasSessionAccess ? "Private member link" : "Public profile"}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "members" ? (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary/80" />
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Members
            </h2>
          </div>

          <ClubMembersPanel members={members} />
        </section>
      ) : null}

      {activeTab === "sessions" && hasSessionAccess ? (
        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Our Train & Play Sessions
          </h2>

          <ClubSessionsPanel
            upcomingSessions={upcomingSessions}
            previousSessions={previousSessions}
          />
        </section>
      ) : null}
    </div>
  );
}
