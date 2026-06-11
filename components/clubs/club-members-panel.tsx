import type { ClubProfileMember } from "@/lib/clubs/club-profile-mappers";

type ClubMembersPanelProps = {
  members: ClubProfileMember[];
};

export function ClubMembersPanel({ members }: ClubMembersPanelProps) {
  if (members.length === 0) {
    return (
      <div className="rounded-md border border-white/10 bg-white/4 px-3 py-4 text-sm text-muted-foreground">
        No public members added yet.
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {members.map((member) => (
        <div
          key={member.id}
          className="rounded-md border border-white/10 bg-white/4 px-3 py-2.5"
        >
          <p className="truncate text-sm font-semibold text-foreground">
            {member.displayName}
          </p>

          {member.nickname ? (
            <p className="truncate text-xs text-muted-foreground">
              {member.name}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
