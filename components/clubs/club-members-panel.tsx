import type { ClubProfileMember } from "@/lib/clubs/club-profile-mappers";

type ClubMembersPanelProps = {
  members: ClubProfileMember[];
};

export function ClubMembersPanel({ members }: ClubMembersPanelProps) {
  if (members.length === 0) {
    return (
      <section className="space-y-2">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Members
        </h2>

        <p className="text-sm leading-6 text-muted-foreground">
          No public members added yet.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Members
        </h2>

        <p className="text-sm text-muted-foreground">
          Public members shared by the club.
        </p>
      </div>

      <p className="max-w-3xl text-sm font-medium leading-7 text-foreground">
        {members.map((member) => member.displayName).join(", ")}
      </p>
    </section>
  );
}
