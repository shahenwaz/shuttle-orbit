export type ClubProfileMemberInput = {
  id: string;
  name: string;
  nickname: string | null;
  playerId?: string | null;
};

export type ClubProfileMember = ClubProfileMemberInput & {
  displayName: string;
  playerType: "tour-player" | "club-only";
};

export type ClubProfileSessionInput = {
  id: string;
  title: string;
  startAt: Date;
  endAt: Date;
  courtNumbers: string | null;
  privateNotes: string | null;
  attendance: {
    member: ClubProfileMemberInput;
  }[];
};

export type ClubProfileSession = {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  courtNumbers: string | null;
  privateNotes: string | null;
  attendance: {
    member: ClubProfileMember;
  }[];
};

export function getClubMemberDisplayName(member: {
  name: string;
  nickname: string | null;
}) {
  return (member.nickname?.trim() || member.name).toUpperCase();
}

export function mapClubProfileMember(
  member: ClubProfileMemberInput,
): ClubProfileMember {
  return {
    ...member,
    playerId: member.playerId ?? null,
    displayName: getClubMemberDisplayName(member),
    playerType: member.playerId ? "tour-player" : "club-only",
  };
}

export function mapClubProfileSession(
  session: ClubProfileSessionInput,
): ClubProfileSession {
  return {
    id: session.id,
    title: session.title,
    startAt: session.startAt.toISOString(),
    endAt: session.endAt.toISOString(),
    courtNumbers: session.courtNumbers,
    privateNotes: session.privateNotes,
    attendance: session.attendance.map((attendance) => ({
      member: mapClubProfileMember(attendance.member),
    })),
  };
}
