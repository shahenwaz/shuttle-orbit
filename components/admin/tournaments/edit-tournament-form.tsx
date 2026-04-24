"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";

import {
  updateTournamentAction,
  type UpdateTournamentActionState,
} from "@/app/admin/tournaments/[tournamentId]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EditTournamentFormProps = {
  tournament: {
    id: string;
    name: string;
    location: string | null;
    eventDate: Date;
    description: string | null;
  };
};

const initialState: UpdateTournamentActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

function toDateInputValue(date: Date) {
  return new Date(date).toISOString().slice(0, 10);
}

export function EditTournamentForm({ tournament }: EditTournamentFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateTournamentAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="tournamentId" value={tournament.id} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Tournament name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={tournament.name}
            placeholder="Tournament name"
          />
          {state.fieldErrors?.name ? (
            <p className="text-sm text-red-400">{state.fieldErrors.name[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            defaultValue={tournament.location ?? ""}
            placeholder="Optional"
          />
          {state.fieldErrors?.location ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.location[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="eventDate">Tournament date</Label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            defaultValue={toDateInputValue(tournament.eventDate)}
            className="flex h-11 w-full rounded-xl border border-white/10 bg-background/70 px-4 text-sm text-foreground outline-none focus-visible:border-primary/50 dark-date"
            style={{ colorScheme: "dark" }}
          />
          {state.fieldErrors?.eventDate ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.eventDate[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={tournament.description ?? ""}
            placeholder="Optional short summary"
            className="flex min-h-32 w-full rounded-xl border border-white/10 bg-background/70 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/75 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/25"
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

      <Button type="submit" disabled={isPending} className="min-w-40">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save changes
          </>
        )}
      </Button>
    </form>
  );
}
