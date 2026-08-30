import { MapPin } from "lucide-react";

import { ConnectedTabs } from "@/components/shared/connected-tabs";
import { HeaderSurface } from "@/components/shared/header-surface";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";

export type ClubWorkspaceTab = "overview" | "members";

type ClubWorkspaceHeaderProps = {
  clubId: string;
  clubName: string;
  homeVenue: string | null;
  memberCount: number;
  activeTab: ClubWorkspaceTab;
};

export function ClubWorkspaceHeader({
  clubId,
  clubName,
  homeVenue,
  memberCount,
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
      summary={<CompactStatPill label="Members" value={memberCount} />}
    >
      <ConnectedTabs activeValue={activeTab} items={tabs} />
    </HeaderSurface>
  );
}
