import { ClubMembersPanel } from "@/components/clubs/club-members-panel";
import { ClubOverviewPanel } from "@/components/clubs/club-overview-panel";
import type { ClubProfileMember } from "@/lib/clubs/club-profile-mappers";

type ClubProfileShellData =
  | {
      activeTab: "overview";
      club: {
        description: string | null;
        homeVenue: string | null;
        memberCount: number;
      };
    }
  | {
      activeTab: "members";
      members: ClubProfileMember[];
    };

type ClubProfileShellProps = {
  data: ClubProfileShellData;
};

export function ClubProfileShell({ data }: ClubProfileShellProps) {
  return (
    <div className="space-y-5">
      {data.activeTab === "overview" ? (
        <ClubOverviewPanel
          description={data.club.description}
          homeVenue={data.club.homeVenue}
          memberCount={data.club.memberCount}
        />
      ) : (
        <ClubMembersPanel members={data.members} />
      )}
    </div>
  );
}
