"use client";

import { useState } from "react";

import { ClubSessionSection } from "@/components/admin/clubs/sessions/club-session-section";
import type {
  ClubSessionMember,
  ClubSessionRow,
} from "@/components/admin/clubs/sessions/club-session-types";
import { splitClubSessionsByTime } from "@/components/admin/clubs/sessions/club-session-utils";
import { EmptyState } from "@/components/shared/empty-state";

type ClubSessionsDirectoryProps = {
  sessions: ClubSessionRow[];
  members: ClubSessionMember[];
};

export function ClubSessionsDirectory({
  sessions,
  members,
}: ClubSessionsDirectoryProps) {
  const [referenceTime] = useState(() => Date.now());

  if (sessions.length === 0) {
    return (
      <EmptyState message="No sessions added yet. Add the next club night with court time and court numbers." />
    );
  }

  const { upcomingSessions, previousSessions } = splitClubSessionsByTime({
    sessions,
    referenceTime,
  });

  return (
    <div className="space-y-5">
      <ClubSessionSection
        title="Upcoming sessions"
        emptyMessage="No upcoming sessions scheduled."
        sessions={upcomingSessions}
        members={members}
        variant="upcoming"
      />

      {previousSessions.length > 0 ? (
        <ClubSessionSection
          title="Previous sessions"
          emptyMessage="No previous sessions found."
          sessions={previousSessions}
          members={members}
          variant="previous"
        />
      ) : null}
    </div>
  );
}
