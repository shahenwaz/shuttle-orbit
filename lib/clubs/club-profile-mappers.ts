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
