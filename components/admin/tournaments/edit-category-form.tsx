"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";

import {
  updateTournamentCategoryAction,
  type UpdateTournamentCategoryActionState,
} from "@/app/admin/tournaments/[tournamentId]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EditCategoryFormProps = {
  tournamentId: string;
  category: {
    id: string;
    name: string;
    code: string;
    rulesSummary: string | null;
  };
};

const initialState: UpdateTournamentCategoryActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function EditCategoryForm({
  tournamentId,
  category,
}: EditCategoryFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateTournamentCategoryAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <input type="hidden" name="categoryId" value={category.id} />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Category name</Label>
          <Input id="name" name="name" defaultValue={category.name} />
          {state.fieldErrors?.name ? (
            <p className="text-sm text-red-400">{state.fieldErrors.name[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Category code</Label>
          <Input id="code" name="code" defaultValue={category.code} />
          {state.fieldErrors?.code ? (
            <p className="text-sm text-red-400">{state.fieldErrors.code[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="rulesSummary">Rules summary</Label>
          <textarea
            id="rulesSummary"
            name="rulesSummary"
            rows={4}
            defaultValue={category.rulesSummary ?? ""}
            className="flex min-h-32 w-full rounded-xl border border-white/10 bg-background/70 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/75 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/25"
          />
          {state.fieldErrors?.rulesSummary ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.rulesSummary[0]}
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

      <Button type="submit" disabled={isPending} className="min-w-36">
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
