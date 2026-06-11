"use client";

import { useState } from "react";

import { ClubMembersPanel } from "@/components/clubs/club-members-panel";
import { ClubOverviewPanel } from "@/components/clubs/club-overview-panel";
import { ClubProfileHero } from "@/components/clubs/club-profile-hero";
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
  };
  members: ClubProfileMember[];
  hasSessionAccess: boolean;
  upcomingSessions?: ClubProfileSession[];
  previousSessions?: ClubProfileSession[];
};

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
      <ClubProfileHero
        club={{
          name: club.name,
          shortName: club.shortName,
          logoUrl: club.logoUrl,
        }}
      />

      <SectionTabs
        activeKey={activeTab}
        items={tabs}
        onChange={(key) => setActiveTab(key as ClubProfileTab)}
      />

      {activeTab === "overview" ? (
        <ClubOverviewPanel
          description={club.description}
          homeVenue={club.homeVenue}
        />
      ) : null}

      {activeTab === "members" ? <ClubMembersPanel members={members} /> : null}

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
