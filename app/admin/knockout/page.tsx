import { PageContainer } from "@/components/layout/page-container";
import { buildKnockoutStageSeeds } from "@/lib/knockout/helpers";

export default function AdminKnockoutPage() {
  const quarterFinalChain = buildKnockoutStageSeeds("quarter_final");
  const semiFinalChain = buildKnockoutStageSeeds("semi_final");
  const finalChain = buildKnockoutStageSeeds("final");

  const examples = [
    { title: "Quarter Final start", stages: quarterFinalChain },
    { title: "Semi Final start", stages: semiFinalChain },
    { title: "Final only", stages: finalChain },
  ];

  return (
    <PageContainer className="space-y-6 sm:space-y-8">
      <section className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.22em] text-primary sm:text-xs">
          Admin knockout
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Knockout stage helper preview
        </h1>
        <p className="max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
          Preview the stage chain and slot layout before wiring admin setup.
        </p>
      </section>

      <div className="space-y-4 sm:space-y-5">
        {examples.map((example) => (
          <div
            key={example.title}
            className="rounded-2xl border border-white/10 bg-white/4 p-4 sm:p-5"
          >
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              {example.title}
            </h2>

            <div className="mt-4 space-y-3">
              {example.stages.map((stage) => (
                <div
                  key={stage.stageType}
                  className="rounded-xl border border-white/10 bg-background/40 p-3"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {stage.stageName}
                  </p>

                  <div className="mt-2 space-y-1.5">
                    {stage.matches.map((match) => (
                      <p
                        key={`${stage.stageType}-${match.matchNumber}`}
                        className="text-xs text-muted-foreground sm:text-sm"
                      >
                        Match {match.matchNumber}: {match.slotA} vs{" "}
                        {match.slotB}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
