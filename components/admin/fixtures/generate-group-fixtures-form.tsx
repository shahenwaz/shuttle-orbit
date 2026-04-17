"use client";

import { useActionState } from "react";
import { CalendarRange, Loader2 } from "lucide-react";

import {
  generateGroupFixturesAction,
  type GenerateGroupFixturesActionState,
} from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/fixtures/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type GroupOption = {
  id: string;
  name: string;
  teamCount: number;
  matchCount: number;
};

type GenerateGroupFixturesFormProps = {
  tournamentId: string;
  categoryId: string;
  groups: GroupOption[];
};

const initialState: GenerateGroupFixturesActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function GenerateGroupFixturesForm({
  tournamentId,
  categoryId,
  groups,
}: GenerateGroupFixturesFormProps) {
  const [state, formAction, isPending] = useActionState(
    generateGroupFixturesAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <input type="hidden" name="categoryId" value={categoryId} />

      <div className="space-y-2">
        <Label htmlFor="groupId">Group</Label>
        <select
          id="groupId"
          name="groupId"
          defaultValue=""
          className="flex h-11 w-full rounded-xl border border-white/10 bg-background/70 px-4 text-sm text-foreground shadow-sm outline-none transition focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/25"
        >
          <option value="" disabled>
            Select a group
          </option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name} · {group.teamCount} teams · {group.matchCount}{" "}
              matches
            </option>
          ))}
        </select>
        {state.fieldErrors?.groupId ? (
          <p className="text-sm text-red-400">{state.fieldErrors.groupId[0]}</p>
        ) : null}
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

      <Button type="submit" disabled={isPending} className="min-w-44">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <CalendarRange className="mr-2 h-4 w-4" />
            Generate fixtures
          </>
        )}
      </Button>
    </form>
  );
}
