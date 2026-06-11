import type {
  ClubSessionMember,
  ClubSessionRow,
} from "@/components/admin/clubs/sessions/club-session-types";

function getTimestamp(value: Date | string) {
  return new Date(value).getTime();
}

export function formatSessionDate(date: Date) {
  return new Intl.DateTimeFormat("en-IE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

export function formatSessionTime(date: Date) {
  return new Intl.DateTimeFormat("en-IE", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "UTC",
  }).format(date);
}

export function getGoingCount(session: ClubSessionRow) {
  return session.attendance.filter((item) => item.status === "GOING").length;
}

export function getMembersWithAttendance({
  session,
  members,
}: {
  session: ClubSessionRow;
  members: ClubSessionMember[];
}) {
  return members.map((member) => {
    const attendance = session.attendance.find(
      (item) => item.memberId === member.id,
    );

    return {
      ...member,
      attendanceStatus: attendance?.status ?? null,
    };
  });
}

export function splitClubSessionsByTime({
  sessions,
  referenceTime,
}: {
  sessions: ClubSessionRow[];
  referenceTime: number;
}) {
  const upcomingSessions = sessions
    .filter((session) => getTimestamp(session.endAt) >= referenceTime)
    .sort((a, b) => getTimestamp(a.startAt) - getTimestamp(b.startAt));

  const previousSessions = sessions
    .filter((session) => getTimestamp(session.endAt) < referenceTime)
    .sort((a, b) => getTimestamp(b.startAt) - getTimestamp(a.startAt));

  return {
    upcomingSessions,
    previousSessions,
  };
}
