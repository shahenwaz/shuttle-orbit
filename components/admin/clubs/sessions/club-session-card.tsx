"use client";

import { useState, useTransition } from "react";
import {
  CalendarDays,
  Clock,
  Grid3X3,
  MoreVertical,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";

import {
  deleteClubSessionAction,
  type DeleteClubSessionActionState,
} from "@/app/admin/clubs/[clubId]/sessions/actions";
import { ClubSessionAttendanceManager } from "@/components/admin/clubs/sessions/club-session-attendance-manager";
import { ClubSessionForm } from "@/components/admin/clubs/sessions/club-session-form";
import type {
  ClubSessionMember,
  ClubSessionRow,
  ClubSessionVariant,
} from "@/components/admin/clubs/sessions/club-session-types";
import {
  formatSessionDate,
  formatSessionTime,
  getGoingCount,
  getMembersWithAttendance,
} from "@/components/admin/clubs/sessions/club-session-utils";
import { CreateDialog } from "@/components/admin/create-dialog";
import { surfaceCardClassName } from "@/components/shared/surface-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ClubSessionCardProps = {
  session: ClubSessionRow;
  members: ClubSessionMember[];
  variant: ClubSessionVariant;
};

const initialDeleteState: DeleteClubSessionActionState = {
  success: false,
  message: "",
};

export function ClubSessionCard({
  session,
  members,
  variant,
}: ClubSessionCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [deleteState, setDeleteState] =
    useState<DeleteClubSessionActionState>(initialDeleteState);
  const [isDeleting, startDeleteTransition] = useTransition();

  const attendanceLabel = variant === "previous" ? "Attended" : "Going";
  const goingCount = getGoingCount(session);
  const membersWithAttendance = getMembersWithAttendance({ session, members });

  return (
    <div
      className={surfaceCardClassName({
        variant: "elevated",
        interactive: true,
        className: "px-3 py-2.5 sm:px-3.5",
      })}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 space-y-1.5">
          <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
            {session.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3 w-3 text-primary/80" />
              {formatSessionDate(session.startAt)}
            </span>

            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 text-primary/80" />
              {formatSessionTime(session.startAt)} -{" "}
              {formatSessionTime(session.endAt)}
            </span>

            {session.courtNumbers ? (
              <span className="inline-flex items-center gap-1">
                <Grid3X3 className="h-3 w-3 text-primary/80" />
                Courts: {session.courtNumbers}
              </span>
            ) : null}

            <span className="inline-flex items-center gap-1">
              <Users className="h-3 w-3 text-primary/80" />
              {attendanceLabel}: {goingCount}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 cursor-pointer rounded-full text-muted-foreground hover:bg-white/6 hover:text-foreground focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 ring-offset-0 focus:ring-offset-0 focus-visible:ring-offset-0"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open session actions</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-48 rounded-2xl border border-white/10 bg-[#0b1018]/95 p-1.5 text-foreground shadow-2xl backdrop-blur-xl"
          >
            <DropdownMenuItem
              onSelect={() => setIsAttendanceOpen(true)}
              className="cursor-pointer rounded-xl text-sm text-foreground focus:bg-white/8"
            >
              <Users className="mr-2 h-4 w-4" />
              Manage attendance
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() => setIsEditOpen(true)}
              className="cursor-pointer rounded-xl text-sm text-foreground focus:bg-white/8"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit session
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() => {
                setDeleteState(initialDeleteState);
                setIsDeleteOpen(true);
              }}
              className="cursor-pointer rounded-xl text-sm text-red-200 focus:bg-red-500/10 focus:text-red-100"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CreateDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        triggerLabel=""
        hideTrigger
        title="Edit session"
        description="Update date, time, and court details."
      >
        <ClubSessionForm
          mode="edit"
          clubId={session.clubId}
          session={session}
          onSuccess={() => setIsEditOpen(false)}
        />
      </CreateDialog>

      <CreateDialog
        open={isAttendanceOpen}
        onOpenChange={setIsAttendanceOpen}
        triggerLabel=""
        hideTrigger
        title="Manage attendance"
        description="Quickly mark who is coming."
      >
        <ClubSessionAttendanceManager
          clubId={session.clubId}
          sessionId={session.id}
          members={membersWithAttendance}
        />
      </CreateDialog>

      <CreateDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        triggerLabel=""
        hideTrigger
        title="Remove session"
        description="This will only work if no attendance has been recorded for this session."
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);

            startDeleteTransition(async () => {
              const result = await deleteClubSessionAction(formData);
              setDeleteState(result);

              if (result.success) {
                setIsDeleteOpen(false);
              }
            });
          }}
        >
          <input type="hidden" name="clubId" value={session.clubId} />
          <input type="hidden" name="sessionId" value={session.id} />

          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove{" "}
            <span className="font-medium text-foreground">{session.title}</span>
            ?
          </p>

          {deleteState.message ? (
            <div
              className={`rounded-xl border px-3 py-2 text-sm ${
                deleteState.success
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/20 bg-red-500/10 text-red-300"
              }`}
            >
              {deleteState.message}
            </div>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="destructive"
              disabled={isDeleting}
              className="cursor-pointer"
            >
              {isDeleting ? "Removing..." : "Remove session"}
            </Button>
          </div>
        </form>
      </CreateDialog>
    </div>
  );
}
