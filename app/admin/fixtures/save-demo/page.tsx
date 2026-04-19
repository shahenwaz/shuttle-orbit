import { PageContainer } from "@/components/layout/page-container";

export default function AdminFixtureSaveDemoPage() {
  return (
    <PageContainer className="space-y-4 sm:space-y-5">
      <section className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.22em] text-primary sm:text-xs">
          Admin fixtures
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Fixture config persistence
        </h1>
        <p className="max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
          Next step is wiring the selected template to a real tournament
          category save flow.
        </p>
      </section>
    </PageContainer>
  );
}
