import { ClubMembersPanel } from "@/components/clubs/club-members-panel";
import { ClubOverviewPanel } from "@/components/clubs/club-overview-panel";
import type { PublicClubProfileTab } from "@/components/clubs/public-club-profile-header";
import type { ClubProfileMember } from "@/lib/clubs/club-profile-mappers";

type ClubProfileShellProps = {
  club: {
    description: string | null;
    homeVenue: string | null;
  };
  members: ClubProfileMember[];
  activeTab: PublicClubProfileTab;
};

export function ClubProfileShell({
  club,
  members,
  activeTab,
}: ClubProfileShellProps) {
  return (
    <div className="space-y-5">
      {activeTab === "overview" ? (
        <ClubOverviewPanel
          description={club.description}
          homeVenue={club.homeVenue}
          memberCount={members.length}
        />
      ) : null}

      {activeTab === "members" ? <ClubMembersPanel members={members} /> : null}
    </div>
  );
}
