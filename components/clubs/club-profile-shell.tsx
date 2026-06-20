import { ClubMembersPanel } from "@/components/clubs/club-members-panel";
import { ClubOverviewPanel } from "@/components/clubs/club-overview-panel";
import { ClubSessionsPanel } from "@/components/clubs/club-sessions-panel";
import type { PublicClubProfileTab } from "@/components/clubs/public-club-profile-header";
import type {
  ClubProfileMember,
  ClubProfileSession,
} from "@/lib/clubs/club-profile-mappers";

type ClubProfileShellProps = {
  club: {
    description: string | null;
    homeVenue: string | null;
  };
  members: ClubProfileMember[];
  activeTab: PublicClubProfileTab;
  hasSessionAccess: boolean;
  upcomingSessions?: ClubProfileSession[];
  previousSessions?: ClubProfileSession[];
};

export function ClubProfileShell({
  club,
  members,
  activeTab,
  hasSessionAccess,
  upcomingSessions = [],
  previousSessions = [],
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
