import { ClubSessionCard } from "@/components/admin/clubs/sessions/club-session-card";
import type {
  ClubSessionMember,
  ClubSessionRow,
  ClubSessionVariant,
} from "@/components/admin/clubs/sessions/club-session-types";

type ClubSessionSectionProps = {
  title: string;
  emptyMessage: string;
  sessions: ClubSessionRow[];
  members: ClubSessionMember[];
  variant: ClubSessionVariant;
};

export function ClubSessionSection({
  title,
  emptyMessage,
  sessions,
  members,
  variant,
}: ClubSessionSectionProps) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-tight text-primary/80">
          {title}
        </h3>

        {sessions.length > 0 ? (
          <span className="text-xs font-medium text-muted-foreground">
            {sessions.length}
          </span>
        ) : null}
      </div>

      {sessions.length === 0 ? (
        <p className="rounded-md border border-white/10 bg-white/4 px-3 py-3 text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <div className="grid gap-1.5 sm:gap-2 md:grid-cols-2">
          {sessions.map((session) => (
            <ClubSessionCard
              key={session.id}
              session={session}
              members={members}
              variant={variant}
            />
          ))}
        </div>
      )}
    </section>
  );
}
