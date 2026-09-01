"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

import { deleteLeagueAction } from "@/app/admin/leagues/[leagueId]/actions";
import { CreateDialog } from "@/components/admin/create-dialog";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { Button } from "@/components/ui/button";

type DeleteLeagueButtonProps = {
  leagueId: string;
};

export function DeleteLeagueButton({ leagueId }: DeleteLeagueButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <CreateDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      triggerLabel="Delete"
      title="Delete community league"
      description="This will permanently delete the league, its fixtures, and its statistics."
      triggerClassName={actionPillButtonClassName({
        variant: "danger",
      })}
      triggerIcon={<Trash2 className="size-4" />}
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();

          const formData = new FormData();
          formData.set("leagueId", leagueId);

          setMessage("");
          setIsError(false);

          startTransition(async () => {
            const result = await deleteLeagueAction(formData);

            if (result) {
              setIsError(!result.success);
              setMessage(result.message);
            }
          });
        }}
      >
        <p className="text-sm leading-6 text-muted-foreground">
          Are you sure you want to delete this community league? Recorded
          results must be reset before the league can be deleted.
        </p>

        {message ? (
          <div
            className={`rounded-md border px-3 py-2 text-sm ${
              isError
                ? "border-red-500/20 bg-red-500/10 text-red-300"
                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
            }`}
          >
            {message}
          </div>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>

          <Button type="submit" variant="destructive" disabled={isPending}>
            {isPending ? "Deleting..." : "Delete league"}
          </Button>
        </div>
      </form>
    </CreateDialog>
  );
}
