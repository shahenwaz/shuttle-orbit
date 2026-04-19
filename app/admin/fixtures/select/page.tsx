import { PageContainer } from "@/components/layout/page-container";
import { FixtureTemplateSelector } from "@/components/admin/fixtures/fixture-template-selector";
import { CATEGORY_C_13_TEAMS_PRESET } from "@/lib/fixtures/presets";
import { FIXTURE_TEMPLATES } from "@/lib/fixtures/templates";

export default function AdminFixtureTemplateSelectPage() {
  const templates = [
    CATEGORY_C_13_TEAMS_PRESET,
    ...FIXTURE_TEMPLATES.filter(
      (template) => template.key !== CATEGORY_C_13_TEAMS_PRESET.key,
    ),
  ];

  return (
    <PageContainer className="space-y-6 sm:space-y-8">
      <section className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.22em] text-primary sm:text-xs">
          Admin fixtures
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Select fixture template
        </h1>
        <p className="max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
          Start by choosing the most suitable fixture structure for the
          category.
        </p>
      </section>

      <FixtureTemplateSelector
        templates={templates}
        initialTemplateKey={CATEGORY_C_13_TEAMS_PRESET.key}
      />
    </PageContainer>
  );
}
