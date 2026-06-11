"use client";

import { useState } from "react";
import { CalendarDays, Clock, Grid3X3, StickyNote, Users } from "lucide-react";

import type { ClubProfileSession } from "@/lib/clubs/club-profile-mappers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ClubSessionsPanelProps = {
  upcomingSessions: ClubProfileSession[];
  previousSessions: ClubProfileSession[];
};

type SelectedSessionState = {
  session: ClubProfileSession;
  variant: "upcoming" | "previous";
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

function SessionCard({
  session,
  label,
  onOpen,
}: {
  session: ClubProfileSession;
  label: "Going" | "Attended";
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group rounded-md border border-white/10 bg-white/4 p-3 text-left transition hover:border-primary/25 hover:bg-white/6"
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
            {session.title}
          </h3>

          <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
            View
          </span>
        </div>

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
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {session.courtNumbers ? (
            <span className="inline-flex items-center gap-1">
              <Grid3X3 className="h-3 w-3 text-primary/80" />
              Courts: {session.courtNumbers}
            </span>
          ) : null}

          <span className="inline-flex items-center gap-1">
            <Users className="h-3 w-3 text-primary/80" />
            {label} - {session.attendance.length}
          </span>
        </div>
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
  variant: "upcoming" | "previous";
  onOpen: (state: SelectedSessionState) => void;
}) {
  const label = variant === "previous" ? "Attended" : "Going";

  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold tracking-tight text-foreground">
        {title}
      </h3>

      {sessions.length === 0 ? (
        <div className="rounded-md border border-white/10 bg-white/4 px-3 py-4 text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid gap-2">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              label={label}
              onOpen={() => onOpen({ session, variant })}
            />
          ))}
        </div>
      )}
    </section>
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
              <DialogHeader className="space-y-2">
                <DialogTitle className="font-heading text-lg font-semibold tracking-tight text-foreground">
                  {selectedSession.title}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Session details for club members.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/4 px-3 py-2 text-muted-foreground">
                  <CalendarDays className="h-4 w-4 text-primary/80" />
                  <span>
                    {formatSessionDate(selectedSession.startAt, "long")}
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/4 px-3 py-2 text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary/80" />
                  <span>
                    {formatSessionTime(selectedSession.startAt)} -{" "}
                    {formatSessionTime(selectedSession.endAt)}
                  </span>
                </div>

                {selectedSession.courtNumbers ? (
                  <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/4 px-3 py-2 text-muted-foreground">
                    <Grid3X3 className="h-4 w-4 text-primary/80" />
                    <span>Courts: {selectedSession.courtNumbers}</span>
                  </div>
                ) : null}
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
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

                  <p className="rounded-md border border-white/10 bg-white/4 px-3 py-2 text-sm leading-6 text-muted-foreground">
                    {selectedSession.privateNotes}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
