"use client";

import { useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  Clock,
  Grid3X3,
  StickyNote,
  Users,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ClubProfileSession } from "@/lib/clubs/club-profile-mappers";
import { cn } from "@/lib/utils";

type ClubSessionsPanelProps = {
  upcomingSessions: ClubProfileSession[];
  previousSessions: ClubProfileSession[];
};

type SessionVariant = "upcoming" | "previous";

type SelectedSessionState = {
  session: ClubProfileSession;
  variant: SessionVariant;
};

function formatSessionDate(value: string, style: "short" | "long" = "short") {
  return new Intl.DateTimeFormat("en-IE", {
    weekday: style === "long" ? "long" : "short",
    day: "2-digit",
    month: style === "long" ? "long" : "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatSessionTime(value: string) {
  return new Intl.DateTimeFormat("en-IE", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "UTC",
  }).format(new Date(value));
}

function SessionMetaItem({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5">
      <span className="shrink-0 text-purple-400">{icon}</span>
      <span className="truncate">{children}</span>
    </span>
  );
}

function SessionCard({
  session,
  variant,
  onOpen,
}: {
  session: ClubProfileSession;
  variant: SessionVariant;
  onOpen: () => void;
}) {
  const label = variant === "previous" ? "Attended" : "Going";

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group block rounded-md border border-white/10 bg-white/4 px-3 py-2.5 text-left transition",
        "hover:border-purple-400/25 hover:bg-white/6",
      )}
    >
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="truncate text-sm font-semibold leading-5 text-foreground">
            {session.title}
          </h3>

          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <SessionMetaItem icon={<CalendarDays className="h-3 w-3" />}>
              {formatSessionDate(session.startAt)}
            </SessionMetaItem>

            <SessionMetaItem icon={<Clock className="h-3 w-3" />}>
              {formatSessionTime(session.startAt)} -{" "}
              {formatSessionTime(session.endAt)}
            </SessionMetaItem>
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {session.courtNumbers ? (
              <SessionMetaItem icon={<Grid3X3 className="h-3 w-3" />}>
                Courts: {session.courtNumbers}
              </SessionMetaItem>
            ) : null}

            <SessionMetaItem icon={<Users className="h-3 w-3" />}>
              {label} - {session.attendance.length}
            </SessionMetaItem>
          </div>
        </div>

        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-purple-300" />
      </div>
    </button>
  );
}

function SessionSection({
  title,
  emptyMessage,
  sessions,
  variant,
  onOpen,
}: {
  title: string;
  emptyMessage: string;
  sessions: ClubProfileSession[];
  variant: SessionVariant;
  onOpen: (state: SelectedSessionState) => void;
}) {
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
        <div className="grid gap-1.5 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              variant={variant}
              onOpen={() => onOpen({ session, variant })}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function DialogDetailRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="shrink-0 text-purple-400">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

export function ClubSessionsPanel({
  upcomingSessions,
  previousSessions,
}: ClubSessionsPanelProps) {
  const [selectedSessionState, setSelectedSessionState] =
    useState<SelectedSessionState | null>(null);

  const selectedSession = selectedSessionState?.session ?? null;
  const selectedSessionIsPrevious =
    selectedSessionState?.variant === "previous";

  return (
    <>
      <div className="space-y-5">
        <SessionSection
          title="Upcoming sessions"
          emptyMessage="No upcoming sessions shared yet."
          sessions={upcomingSessions}
          variant="upcoming"
          onOpen={setSelectedSessionState}
        />

        <SessionSection
          title="Previous sessions"
          emptyMessage="No previous sessions found yet."
          sessions={previousSessions}
          variant="previous"
          onOpen={setSelectedSessionState}
        />
      </div>

      <Dialog
        open={Boolean(selectedSessionState)}
        onOpenChange={(open) => {
          if (!open) setSelectedSessionState(null);
        }}
      >
        <DialogContent className="max-h-[86vh] overflow-y-auto rounded-md border-white/10 bg-background/95 p-4 shadow-2xl sm:max-w-lg sm:p-5">
          {selectedSession ? (
            <div className="space-y-5">
              <DialogHeader className="space-y-1.5">
                <DialogTitle className="font-heading text-lg font-semibold tracking-tight text-foreground">
                  {selectedSession.title}
                </DialogTitle>

                <DialogDescription className="text-sm text-muted-foreground">
                  Session details for club members.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2">
                <DialogDetailRow icon={<CalendarDays className="h-4 w-4" />}>
                  {formatSessionDate(selectedSession.startAt, "long")}
                </DialogDetailRow>

                <DialogDetailRow icon={<Clock className="h-4 w-4" />}>
                  {formatSessionTime(selectedSession.startAt)} -{" "}
                  {formatSessionTime(selectedSession.endAt)}
                </DialogDetailRow>

                {selectedSession.courtNumbers ? (
                  <DialogDetailRow icon={<Grid3X3 className="h-4 w-4" />}>
                    Courts: {selectedSession.courtNumbers}
                  </DialogDetailRow>
                ) : null}
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-purple-400">
                  <Users className="h-3.5 w-3.5" />
                  {selectedSessionIsPrevious
                    ? "Joined this session"
                    : "Joining this session"}
                  : {selectedSession.attendance.length}
                </div>

                {selectedSession.attendance.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {selectedSessionIsPrevious
                      ? "No attendance recorded."
                      : "No players marked going yet."}
                  </p>
                ) : (
                  <p className="text-sm leading-6 text-foreground">
                    {selectedSession.attendance
                      .map((attendance) => attendance.member.displayName)
                      .join(", ")}
                  </p>
                )}
              </div>

              {selectedSession.privateNotes ? (
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
                    <StickyNote className="h-3.5 w-3.5" />
                    Session note
                  </div>

                  <div className="rounded-md bg-white/4 px-3 py-3 text-sm leading-7 text-muted-foreground whitespace-pre-wrap wrap-break-word">
                    {selectedSession.privateNotes.trim()}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
