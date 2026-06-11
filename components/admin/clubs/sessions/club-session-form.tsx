"use client";

import { useActionState } from "react";

import {
  createClubSessionAction,
  updateClubSessionAction,
  type ClubSessionActionState,
} from "@/app/admin/clubs/[clubId]/sessions/actions";
import { Button } from "@/components/ui/button";

type ClubSessionFormSession = {
  id: string;
  clubId: string;
  title: string;
  startAt: Date;
  endAt: Date;
  courtNumbers: string | null;
  privateNotes: string | null;
};

type ClubSessionFormProps = {
  mode: "create" | "edit";
  clubId: string;
  session?: ClubSessionFormSession;
  onSuccess?: () => void;
};

const initialState: ClubSessionActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

const inputClassName =
  "h-10 w-full rounded-md border border-white/10 bg-background/60 px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

const textareaClassName =
  "min-h-20 w-full rounded-md border border-white/10 bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;

  return <p className="text-xs text-red-300">{errors[0]}</p>;
}

function getInputDate(date?: Date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

function getInputTime(date?: Date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "UTC",
  }).format(date);
}

export function ClubSessionForm({
  mode,
  clubId,
  session,
  onSuccess,
}: ClubSessionFormProps) {
  const action =
    mode === "edit" ? updateClubSessionAction : createClubSessionAction;

  const [state, formAction, pending] = useActionState(
    async (prevState: ClubSessionActionState, formData: FormData) => {
      const result = await action(prevState, formData);

      if (result.success) {
        onSuccess?.();
      }

      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="clubId" value={clubId} />

      {session ? (
        <input type="hidden" name="sessionId" value={session.id} />
      ) : null}

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-foreground">
          Session title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={session?.title ?? "Club night"}
          className={inputClassName}
        />
        <FieldError errors={state.fieldErrors?.title} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-2">
          <label
            htmlFor="sessionDate"
            className="text-sm font-medium text-foreground"
          >
            Date
          </label>
          <input
            id="sessionDate"
            name="sessionDate"
            type="date"
            defaultValue={getInputDate(session?.startAt)}
            className={inputClassName}
          />
          <FieldError errors={state.fieldErrors?.sessionDate} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="startTime"
            className="text-sm font-medium text-foreground"
          >
            Start
          </label>
          <input
            id="startTime"
            name="startTime"
            type="time"
            defaultValue={getInputTime(session?.startAt)}
            className={inputClassName}
          />
          <FieldError errors={state.fieldErrors?.startTime} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="endTime"
            className="text-sm font-medium text-foreground"
          >
            End
          </label>
          <input
            id="endTime"
            name="endTime"
            type="time"
            defaultValue={getInputTime(session?.endAt)}
            className={inputClassName}
          />
          <FieldError errors={state.fieldErrors?.endTime} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="courtNumbers"
            className="text-sm font-medium text-foreground"
          >
            Courts
          </label>
          <input
            id="courtNumbers"
            name="courtNumbers"
            defaultValue={session?.courtNumbers ?? ""}
            placeholder="Court 4, 5"
            className={inputClassName}
          />
          <FieldError errors={state.fieldErrors?.courtNumbers} />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="privateNotes"
          className="text-sm font-medium text-foreground"
        >
          Internal note
        </label>
        <textarea
          id="privateNotes"
          name="privateNotes"
          defaultValue={session?.privateNotes ?? ""}
          placeholder="Optional note for court/payment/session details"
          className={textareaClassName}
        />
        <FieldError errors={state.fieldErrors?.privateNotes} />
      </div>

      {state.message ? (
        <p
          className={
            state.success ? "text-sm text-primary" : "text-sm text-red-300"
          }
        >
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="rounded-md">
        {pending
          ? mode === "edit"
            ? "Saving..."
            : "Adding..."
          : mode === "edit"
            ? "Save session"
            : "Add session"}
      </Button>
    </form>
  );
}
