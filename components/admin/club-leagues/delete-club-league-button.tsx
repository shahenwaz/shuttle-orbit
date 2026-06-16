"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

import { deleteClubLeagueAction } from "@/app/admin/club-leagues/[leagueId]/actions";
import { CreateDialog } from "@/components/admin/create-dialog";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { Button } from "@/components/ui/button";

type DeleteClubLeagueButtonProps = {
  leagueId: string;
};

export function DeleteClubLeagueButton({
  leagueId,
}: DeleteClubLeagueButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <CreateDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      triggerLabel="Delete"
      title="Delete club league"
      description="This will permanently delete this test league and its generated fixtures."
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
            const result = await deleteClubLeagueAction(formData);

            if (result) {
              setIsError(!result.success);
              setMessage(result.message);
            }
          });
        }}
      >
        <p className="text-sm leading-6 text-muted-foreground">
          Are you sure you want to delete this club league? This is mainly for
          removing test leagues before real results are recorded.
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
