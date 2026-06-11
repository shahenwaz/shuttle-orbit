import { Users } from "lucide-react";

import { ClubMemberCard } from "@/components/clubs/club-member-card";
import type { ClubProfileMember } from "@/lib/clubs/club-profile-mappers";

type ClubMembersPanelProps = {
  members: ClubProfileMember[];
};

export function ClubMembersPanel({ members }: ClubMembersPanelProps) {
  if (members.length === 0) {
    return (
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-purple-400" />
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Club Members
          </h2>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          Members will be added soon.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-purple-400" />
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Club Members
          </h2>
        </div>

        <p className="text-xs font-medium text-muted-foreground">
          {members.length} {members.length === 1 ? "member" : "members"}
        </p>
      </div>

      <div className="grid gap-1.5 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <ClubMemberCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
}
