"use client";

import { useActionState, useEffect, useRef } from "react";
import { FolderPlus, Loader2 } from "lucide-react";

import {
  createTournamentCategoryAction,
  type CreateTournamentCategoryActionState,
} from "@/app/admin/tournaments/[tournamentId]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: CreateTournamentCategoryActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

type CreateCategoryFormProps = {
  tournamentId: string;
};

export function CreateCategoryForm({ tournamentId }: CreateCategoryFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    createTournamentCategoryAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <input type="hidden" name="tournamentId" value={tournamentId} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Category name</Label>
          <Input id="name" name="name" placeholder="e.g. Group B" />
          {state.fieldErrors?.name ? (
            <p className="text-sm text-red-400">{state.fieldErrors.name[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Category code</Label>
          <Input id="code" name="code" placeholder="e.g. B" />
          <p className="text-xs text-muted-foreground">
            Short code like B, C, MIXED, A1.
          </p>
          {state.fieldErrors?.code ? (
            <p className="text-sm text-red-400">{state.fieldErrors.code[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="rulesSummary">Rules summary</Label>
          <textarea
            id="rulesSummary"
            name="rulesSummary"
            rows={4}
            placeholder="Optional short summary of how this category will be managed"
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
            Creating...
          </>
        ) : (
          <>
            <FolderPlus className="mr-2 h-4 w-4" />
            Add category
          </>
        )}
      </Button>
    </form>
  );
}
