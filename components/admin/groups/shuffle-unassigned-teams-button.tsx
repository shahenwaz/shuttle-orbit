"use client";

import { useState, useTransition } from "react";
import { Shuffle } from "lucide-react";

import { shuffleFirstGroupStageTeamsAction } from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/groups/actions";
import { CreateDialog } from "@/components/admin/create-dialog";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { Button } from "@/components/ui/button";

type ShuffleUnassignedTeamsButtonProps = {
  tournamentId: string;
  categoryId: string;
  disabled: boolean;
  unassignedCount: number;
};

export function ShuffleUnassignedTeamsButton({
  tournamentId,
  categoryId,
  disabled,
  unassignedCount,
}: ShuffleUnassignedTeamsButtonProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isPending, startTransition] = useTransition();

  const triggerLabel = disabled
    ? "All teams assigned"
    : "Shuffle unassigned teams";

  return (
    <CreateDialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (nextOpen) {
          setMessage("");
          setHasError(false);
        }
      }}
      triggerLabel={triggerLabel}
      triggerIcon={<Shuffle className="h-3.5 w-3.5" />}
      triggerDisabled={disabled}
      title="Shuffle unassigned teams"
      description="Randomly assign only unassigned teams into the first group stage. Existing assignments will not be changed."
      triggerClassName={actionPillButtonClassName({
        variant: disabled ? "neutral" : "create",
        className: "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
      })}
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();

          const formData = new FormData(event.currentTarget);

          setMessage("");
          setHasError(false);

          startTransition(async () => {
            const result = await shuffleFirstGroupStageTeamsAction(formData);

            setMessage(result.message);
            setHasError(!result.success);

            if (result.success) {
              setOpen(false);
            }
          });
        }}
      >
        <input type="hidden" name="tournamentId" value={tournamentId} />
        <input type="hidden" name="categoryId" value={categoryId} />

        <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-muted-foreground">
          <p>
            This will shuffle{" "}
            <span className="font-semibold text-primary">
              {unassignedCount}
            </span>{" "}
            unassigned team{unassignedCount === 1 ? "" : "s"} into the first
            group stage groups.
          </p>

          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Teams already assigned manually will stay in their current groups.
          </p>
        </div>

        {message ? (
          <div
            className={`rounded-xl border px-3 py-2 text-sm ${
              hasError
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
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isPending || disabled}>
            {isPending ? "Shuffling..." : "Shuffle teams"}
          </Button>
        </div>
      </form>
    </CreateDialog>
  );
}
