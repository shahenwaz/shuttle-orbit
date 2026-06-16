export type ClubProfileMemberInput = {
  id: string;
  fullName: string;
  nickname: string | null;
  clubId?: string | null;
};

export type ClubProfileMember = {
  id: string;
  name: string;
  nickname: string | null;
  playerId: string;
  displayName: string;
  playerType: "tour-player";
};

export type ClubProfileSessionInput = {
  id: string;
  title: string;
  startAt: Date;
  endAt: Date;
  courtNumbers: string | null;
  privateNotes: string | null;
  attendance: {
    player: ClubProfileMemberInput;
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
  fullName: string;
  nickname: string | null;
}) {
  return (member.nickname?.trim() || member.fullName).toUpperCase();
}

export function mapClubProfileMember(
  member: ClubProfileMemberInput,
): ClubProfileMember {
  return {
    id: member.id,
    name: member.fullName,
    nickname: member.nickname,
    playerId: member.id,
    displayName: getClubMemberDisplayName(member),
    playerType: "tour-player",
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
      member: mapClubProfileMember(attendance.player),
    })),
  };
}
