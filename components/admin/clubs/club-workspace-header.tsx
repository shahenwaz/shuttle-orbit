import { MapPin } from "lucide-react";

import { ConnectedTabs } from "@/components/shared/connected-tabs";
import { HeaderSurface } from "@/components/shared/header-surface";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";

export type ClubWorkspaceTab = "overview" | "members" | "sessions";

type ClubWorkspaceHeaderProps = {
  clubId: string;
  clubName: string;
  homeVenue: string | null;
  isManagedClub: boolean;
  memberCount: number;
  sessionCount: number;
  activeTab: ClubWorkspaceTab;
};

export function ClubWorkspaceHeader({
  clubId,
  clubName,
  homeVenue,
  isManagedClub,
  memberCount,
  sessionCount,
  activeTab,
}: ClubWorkspaceHeaderProps) {
  const tabs = [
    {
      value: "overview",
      label: "Overview",
      href: `/admin/clubs/${clubId}`,
    },
    {
      value: "members",
      label: "Members",
      href: `/admin/clubs/${clubId}?tab=members`,
    },
    ...(isManagedClub
      ? [
          {
            value: "sessions",
            label: "Sessions",
            href: `/admin/clubs/${clubId}?tab=sessions`,
          },
        ]
      : []),
  ];

  return (
    <HeaderSurface
      title={clubName}
      variant="club"
      meta={
        <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-sky-100/85" />
          <span className="min-w-0 truncate">
            {homeVenue ?? "Venue not set"}
          </span>
        </span>
      }
      summary={
        <>
          <CompactStatPill label="Members" value={memberCount} />
          <CompactStatPill label="Sessions" value={sessionCount} />
        </>
      }
    >
      <ConnectedTabs activeValue={activeTab} items={tabs} />
    </HeaderSurface>
  );
}
