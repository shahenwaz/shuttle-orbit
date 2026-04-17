"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, Plus } from "lucide-react";

import {
  createPlayerAction,
  type CreatePlayerActionState,
} from "@/app/admin/players/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: CreatePlayerActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function CreatePlayerForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    createPlayerAction,
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
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="e.g. Shahenwaz Muzahid"
            className="h-11 rounded-2xl border-white/10 bg-background/50"
          />
          {state.fieldErrors?.fullName ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.fullName[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nickname">Username</Label>
          <Input
            id="nickname"
            name="nickname"
            placeholder="e.g. shahenwaz"
            className="h-11 rounded-2xl border-white/10 bg-background/50"
          />
          <p className="text-xs text-muted-foreground">
            Use a unique handle. Lowercase letters, numbers, dot, underscore,
            and hyphen only.
          </p>
          {state.fieldErrors?.nickname ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.nickname[0]}
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

      <Button
        type="submit"
        disabled={isPending}
        className="h-11 rounded-full px-5"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Add player
          </>
        )}
      </Button>
    </form>
  );
}
