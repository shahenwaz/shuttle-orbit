"use client";

import { useActionState, useEffect, useRef } from "react";
import { CalendarPlus, Loader2 } from "lucide-react";

import {
  createTournamentAction,
  type CreateTournamentActionState,
} from "@/app/admin/tournaments/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { tournamentStatusValues } from "@/lib/validations/tournament";

const initialState: CreateTournamentActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function CreateTournamentForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    createTournamentAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Tournament name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Dublin Community Badminton Cup"
          />
          {state.fieldErrors?.name ? (
            <p className="text-sm text-red-400">{state.fieldErrors.name[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" placeholder="Optional" />
          {state.fieldErrors?.location ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.location[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue="draft"
            className="flex h-11 w-full rounded-xl border border-white/10 bg-background/70 px-4 text-sm text-foreground outline-none focus-visible:border-primary/50"
          >
            {tournamentStatusValues.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          {state.fieldErrors?.status ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.status[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Start date</Label>
          <Input id="startDate" name="startDate" type="date" />
          {state.fieldErrors?.startDate ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.startDate[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End date</Label>
          <Input id="endDate" name="endDate" type="date" />
          {state.fieldErrors?.endDate ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.endDate[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Optional short summary for the tournament"
            className="flex w-full rounded-xl border border-white/10 bg-background/70 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/75 focus-visible:border-primary/50"
          />
          {state.fieldErrors?.description ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.description[0]}
            </p>
          ) : null}
        </div>
      </div>

      {state.message ? (
        <p
          className={`text-sm ${
            state.success ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Add tournament
          </>
        )}
      </Button>
    </form>
  );
}
