export type ClubAttendanceStatus = "GOING" | "NOT_GOING";

export type ClubSessionMember = {
  id: string;
  clubId: string;
  name: string;
  nickname: string | null;
  role: string;
  playerId: string | null;
  attendanceStatus?: ClubAttendanceStatus | null;
};

export type ClubSessionRow = {
  id: string;
  clubId: string;
  title: string;
  startAt: Date;
  endAt: Date;
  courtNumbers: string | null;
  privateNotes: string | null;
  attendance: {
    id: string;
    memberId: string;
    status: ClubAttendanceStatus;
  }[];
};

export type ClubSessionVariant = "upcoming" | "previous";
