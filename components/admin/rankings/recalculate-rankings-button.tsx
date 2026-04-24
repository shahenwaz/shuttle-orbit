"use client";

import { useState, useTransition } from "react";
import { RefreshCcw } from "lucide-react";

import {
  recalculateTournamentRankingsAction,
  type RecalculateTournamentRankingsActionState,
} from "@/app/admin/tournaments/[tournamentId]/actions";
import { CreateDialog } from "@/components/admin/create-dialog";
import { Button } from "@/components/ui/button";

type RecalculateRankingsButtonProps = {
  tournamentId: string;
};

const initialState: RecalculateTournamentRankingsActionState = {
  success: false,
  message: "",
};

export function RecalculateRankingsButton({
  tournamentId,
}: RecalculateRankingsButtonProps) {
  const [open, setOpen] = useState(false);
  const [state, setState] =
    useState<RecalculateTournamentRankingsActionState>(initialState);
  const [isPending, startTransition] = useTransition();

  return (
    <CreateDialog
      open={open}
      onOpenChange={setOpen}
      title="Recalculate rankings"
      description="This will rebuild player tournament stats and ranking ledger rows for this tournament."
      triggerLabel="Recalculate rankings"
      triggerIcon={<RefreshCcw className="h-4 w-4" />}
      triggerClassName="border-white/10 bg-white/4 text-foreground hover:bg-white/8"
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();

          const formData = new FormData(event.currentTarget);

          startTransition(async () => {
            const result = await recalculateTournamentRankingsAction(formData);
            setState(result);

            if (result.success) {
              setOpen(false);
            }
          });
        }}
      >
        <input type="hidden" name="tournamentId" value={tournamentId} />

        <p className="text-sm text-muted-foreground">
          Rebuild rankings for all completed categories in this tournament?
        </p>

        {state.message ? (
          <div
            className={`rounded-xl border px-3 py-2 text-sm ${
              state.success
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/20 bg-red-500/10 text-red-300"
            }`}
          >
            {state.message}
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

          <Button type="submit" disabled={isPending}>
            {isPending ? "Recalculating..." : "Run recalculation"}
          </Button>
        </div>
      </form>
    </CreateDialog>
  );
}
