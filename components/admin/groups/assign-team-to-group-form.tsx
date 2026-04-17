"use client";

import { useActionState } from "react";
import { Loader2, MoveRight } from "lucide-react";

import {
  assignTeamToGroupAction,
  type AssignTeamToGroupActionState,
} from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/groups/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type TeamOption = {
  id: string;
  label: string;
};

type GroupOption = {
  id: string;
  name: string;
};

type AssignTeamToGroupFormProps = {
  tournamentId: string;
  categoryId: string;
  teams: TeamOption[];
  groups: GroupOption[];
};

const initialState: AssignTeamToGroupActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function AssignTeamToGroupForm({
  tournamentId,
  categoryId,
  teams,
  groups,
}: AssignTeamToGroupFormProps) {
  const [state, formAction, isPending] = useActionState(
    assignTeamToGroupAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <input type="hidden" name="categoryId" value={categoryId} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="teamEntryId">Team</Label>
          <select
            id="teamEntryId"
            name="teamEntryId"
            defaultValue=""
            className="flex h-11 w-full rounded-xl border border-white/10 bg-background/70 px-4 text-sm text-foreground shadow-sm outline-none transition focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/25"
          >
            <option value="" disabled>
              Select a team
            </option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.label}
              </option>
            ))}
          </select>
          {state.fieldErrors?.teamEntryId ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.teamEntryId[0]}
            </p>
          ) : null}
        </div>

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
                {group.name}
              </option>
            ))}
          </select>
          {state.fieldErrors?.groupId ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.groupId[0]}
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
            Assigning...
          </>
        ) : (
          <>
            <MoveRight className="mr-2 h-4 w-4" />
            Assign team
          </>
        )}
      </Button>
    </form>
  );
}
