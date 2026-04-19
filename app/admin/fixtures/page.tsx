import { FixtureTemplatePreviewCard } from "@/components/admin/fixtures/fixture-template-preview-card";
import { PageContainer } from "@/components/layout/page-container";
import { CATEGORY_C_13_TEAMS_PRESET } from "@/lib/fixtures/presets";
import { FIXTURE_TEMPLATES } from "@/lib/fixtures/templates";
import { toFixtureTemplatePreview } from "@/lib/fixtures/presentation";

export default function AdminFixturesPage() {
  const previews = FIXTURE_TEMPLATES.map(toFixtureTemplatePreview);
  const categoryCPreview = toFixtureTemplatePreview(CATEGORY_C_13_TEAMS_PRESET);

  return (
    <PageContainer className="space-y-6 sm:space-y-8">
      <section className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.22em] text-primary sm:text-xs">
          Admin fixtures
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Fixture templates
        </h1>
        <p className="max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
          Preview tournament structures before building generation logic.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
          Real tournament preset
        </h2>

        <FixtureTemplatePreviewCard
          title={categoryCPreview.title}
          description={categoryCPreview.description}
          groups={categoryCPreview.groups}
          knockoutMatches={categoryCPreview.knockoutMatches}
          isSelected
        />
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
          Available templates
        </h2>

        <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
          {previews.map((preview) => (
            <FixtureTemplatePreviewCard
              key={preview.title}
              title={preview.title}
              description={preview.description}
              groups={preview.groups}
              knockoutMatches={preview.knockoutMatches}
            />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
