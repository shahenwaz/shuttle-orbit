"use client";

import { useTransition } from "react";
import { Check, X } from "lucide-react";

import { setClubSessionAttendanceAction } from "@/app/admin/clubs/[clubId]/sessions/attendance-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ClubAttendanceStatus = "GOING" | "NOT_GOING";

type ClubSessionAttendanceMember = {
  id: string;
  clubId: string;
  name: string;
  nickname: string | null;
  role: string;
  playerId: string | null;
  attendanceStatus?: ClubAttendanceStatus | null;
};

type ClubSessionAttendanceManagerProps = {
  clubId: string;
  sessionId: string;
  members: ClubSessionAttendanceMember[];
};

export function ClubSessionAttendanceManager({
  clubId,
  sessionId,
  members,
}: ClubSessionAttendanceManagerProps) {
  const [isPending, startTransition] = useTransition();

  function updateAttendance(memberId: string, status: ClubAttendanceStatus) {
    const formData = new FormData();

    formData.set("clubId", clubId);
    formData.set("sessionId", sessionId);
    formData.set("memberId", memberId);
    formData.set("status", status);

    startTransition(async () => {
      await setClubSessionAttendanceAction(formData);
    });
  }

  if (members.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Add club players first before managing attendance.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-white/10 bg-white/4">
      {members.map((member, index) => {
        const isGoing = member.attendanceStatus === "GOING";
        const isNotGoing = member.attendanceStatus === "NOT_GOING";

        return (
          <div
            key={member.id}
            className={cn(
              "flex items-center justify-between gap-3 px-3 py-2.5",
              index !== members.length - 1 ? "border-b border-white/8" : "",
            )}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-5 text-foreground">
                {member.name}
              </p>
              <p className="truncate text-xs leading-4 text-muted-foreground">
                {member.nickname ? `@${member.nickname}` : "Club member"}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                size="sm"
                disabled={isPending}
                onClick={() => updateAttendance(member.id, "GOING")}
                className={cn(
                  "h-7 rounded-md px-2 text-[11px] font-medium",
                  isGoing
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-white/10 bg-background/50 text-muted-foreground hover:bg-white/6 hover:text-foreground",
                )}
              >
                <Check className="mr-1 h-3 w-3" />
                Going
              </Button>

              <Button
                type="button"
                size="sm"
                disabled={isPending}
                onClick={() => updateAttendance(member.id, "NOT_GOING")}
                className={cn(
                  "h-7 rounded-md px-2 text-[11px] font-medium",
                  isNotGoing
                    ? "bg-red-500/15 text-red-100 hover:bg-red-500/20"
                    : "border border-white/10 bg-background/50 text-muted-foreground hover:bg-white/6 hover:text-foreground",
                )}
              >
                <X className="mr-1 h-3 w-3" />
                No
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
