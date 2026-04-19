"use client";

import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { buildKnockoutStageSeeds } from "@/lib/knockout/helpers";
import type { KnockoutStageType } from "@/lib/knockout/types";

type KnockoutStageSelectorProps = {
  initialStageType?: KnockoutStageType;
  onStageChange?: (stageType: KnockoutStageType) => void;
};

const stageOptions: Array<{
  value: KnockoutStageType;
  label: string;
  description: string;
}> = [
  {
    value: "quarter_final",
    label: "Quarter Final",
    description: "Creates Quarter Final, Semi Final, and Final.",
  },
  {
    value: "semi_final",
    label: "Semi Final",
    description: "Creates Semi Final and Final.",
  },
  {
    value: "final",
    label: "Final",
    description: "Creates Final only.",
  },
];

export function KnockoutStageSelector({
  initialStageType = "semi_final",
  onStageChange,
}: KnockoutStageSelectorProps) {
  const [selectedStageType, setSelectedStageType] =
    useState<KnockoutStageType>(initialStageType);

  const stageSeeds = useMemo(
    () => buildKnockoutStageSeeds(selectedStageType),
    [selectedStageType],
  );

  return (
    <section className="space-y-4 sm:space-y-5">
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
          Knockout stage setup
        </h2>
        <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
          Choose where the knockout phase starts. Teams will still be assigned
          manually by admin later.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
        {stageOptions.map((option) => {
          const isSelected = option.value === selectedStageType;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setSelectedStageType(option.value);
                onStageChange?.(option.value);
              }}
              className={[
                "rounded-2xl border p-4 text-left transition sm:p-5",
                isSelected
                  ? "border-primary/30 bg-primary/8"
                  : "border-white/10 bg-white/4 hover:border-primary/20 hover:bg-white/5",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <p className="text-base font-semibold text-foreground">
                    {option.label}
                  </p>
                  <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
                    {option.description}
                  </p>
                </div>

                {isSelected ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/4 p-4 sm:p-5">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
          Preview
        </p>

        <div className="mt-3 space-y-3">
          {stageSeeds.map((stage) => (
            <div
              key={stage.stageType}
              className="rounded-xl border border-white/10 bg-background/40 p-3"
            >
              <p className="text-sm font-semibold text-foreground sm:text-base">
                {stage.stageName}
              </p>

              <div className="mt-2 space-y-1.5">
                {stage.matches.map((match) => (
                  <p
                    key={`${stage.stageType}-${match.matchNumber}`}
                    className="text-xs text-muted-foreground sm:text-sm"
                  >
                    Match {match.matchNumber}: {match.slotA} vs {match.slotB}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
