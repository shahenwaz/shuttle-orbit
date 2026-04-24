import { PageContainer } from "@/components/layout/page-container";
import { KnockoutStageSelector } from "@/components/admin/knockout/knockout-stage-selector";

export default function AdminKnockoutSetupPage() {
  return (
    <PageContainer className="space-y-6 sm:space-y-8">
      <section className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.22em] text-primary sm:text-xs">
          Admin knockout
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Knockout stage setup
        </h1>
        <p className="max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
          Choose the starting knockout stage for a category and preview the
          bracket structure before saving it.
        </p>
      </section>

      <KnockoutStageSelector initialStageType="semi_final" />
    </PageContainer>
  );
}
