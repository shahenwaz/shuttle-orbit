"use client";

import { useState, useTransition } from "react";
import { GitBranch, Loader2, Sparkles } from "lucide-react";

import { saveKnockoutStageSelection } from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/knockout-actions";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { KnockoutStageType } from "@/lib/knockout/types";

type KnockoutStageSelectorProps = {
  tournamentId: string;
  categoryId: string;
  currentStartStageType: KnockoutStageType | null;
};

const stageOptions: Array<{
  value: KnockoutStageType;
  label: string;
  summary: string;
  meta: string;
}> = [
  {
    value: "quarter_final",
    label: "Quarter final",
    summary: "Start with 8 teams",
    meta: "Creates quarter finals, semi finals, and final.",
  },
  {
    value: "semi_final",
    label: "Semi final",
    summary: "Start with 4 teams",
    meta: "Creates semi finals and final.",
  },
  {
    value: "final",
    label: "Final",
    summary: "Start with 2 teams",
    meta: "Creates a direct final match only.",
  },
];

export function KnockoutStageSelector({
  tournamentId,
  categoryId,
  currentStartStageType,
}: KnockoutStageSelectorProps) {
  const [selectedStage, setSelectedStage] = useState<KnockoutStageType>(
    currentStartStageType ?? "semi_final",
  );
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isPending, startTransition] = useTransition();

  const selectedOption =
    stageOptions.find((option) => option.value === selectedStage) ??
    stageOptions[1];

  return (
    <section className="surface-card overflow-hidden">
      <div className="border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
            <GitBranch className="h-4 w-4 text-primary" />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
              Knockout setup
            </h2>
            <p className="text-sm text-muted-foreground">
              Configure the starting round for this category bracket.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="knockoutStartStage">Knockout start stage</Label>

            <select
              id="knockoutStartStage"
              value={selectedStage}
              onChange={(event) => {
                setSelectedStage(event.target.value as KnockoutStageType);
                setMessage("");
                setIsError(false);
              }}
              className="flex h-11 w-full rounded-2xl border border-white/10 bg-background/70 px-4 text-sm text-foreground shadow-sm outline-none transition focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/25"
            >
              {stageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} — {option.summary}
                </option>
              ))}
            </select>
          </div>

          {message ? (
            <div
              className={`rounded-2xl border px-3 py-2.5 text-sm ${
                isError
                  ? "border-red-500/20 bg-red-500/10 text-red-300"
                  : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              }`}
            >
              {message}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              disabled={isPending}
              className={actionPillButtonClassName({ variant: "create" })}
              onClick={() => {
                setMessage("");
                setIsError(false);

                startTransition(async () => {
                  try {
                    await saveKnockoutStageSelection({
                      tournamentId,
                      categoryId,
                      startStageType: selectedStage,
                    });

                    setIsError(false);
                    setMessage("Knockout setup saved.");
                  } catch (error) {
                    setIsError(true);
                    setMessage(
                      error instanceof Error
                        ? error.message
                        : "Failed to save knockout stage configuration.",
                    );
                  }
                });
              }}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <GitBranch className="mr-1 h-3.5 w-3.5" />
                  Save knockout setup
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Selected format
            </h3>
          </div>

          <div className="space-y-2">
            <p className="text-base font-semibold text-foreground">
              {selectedOption.label}
            </p>
            <p className="text-sm text-muted-foreground">
              {selectedOption.summary}
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              {selectedOption.meta}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
