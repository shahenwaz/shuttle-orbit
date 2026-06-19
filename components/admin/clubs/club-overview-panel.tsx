import { Settings2 } from "lucide-react";

import { ClubForm } from "@/components/admin/clubs/club-form";
import { ClubMemberAccessPanel } from "@/components/admin/clubs/club-member-access-panel";
import { CreateSheet } from "@/components/admin/create-sheet";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";

type ClubOverviewPanelProps = {
  club: {
    id: string;
    name: string;
    slug: string;
    shortName: string | null;
    description: string | null;
    homeVenue: string | null;
    logoUrl: string | null;
    bannerUrl: string | null;
    isManagedClub: boolean;
    isPublic: boolean;
    memberAccessEnabled: boolean;
    memberShareKey: string | null;
  };
};

export function ClubOverviewPanel({ club }: ClubOverviewPanelProps) {
  return (
    <section className="space-y-4 pt-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-base font-semibold tracking-tight text-purple-400">
            Club Admin Overview
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Manage the club setup, visibility and profile.
          </p>
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

      {club.isManagedClub ? (
        <ClubMemberAccessPanel
          clubId={club.id}
          slug={club.slug}
          memberAccessEnabled={club.memberAccessEnabled}
          memberShareKey={club.memberShareKey}
        />
      ) : null}
    </section>
  );
}
