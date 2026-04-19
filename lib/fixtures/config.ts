import type { FixtureTemplateConfig } from "@/lib/fixtures/types";

export type StoredFixtureConfig = {
  key: string;
  label: string;
  description: string;
  stages: FixtureTemplateConfig["stages"];
};

export function toStoredFixtureConfig(
  template: FixtureTemplateConfig,
): StoredFixtureConfig {
  return {
    key: template.key,
    label: template.label,
    description: template.description,
    stages: template.stages,
  };
}

export function isStoredFixtureConfig(
  value: unknown,
): value is StoredFixtureConfig {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.key === "string" &&
    typeof candidate.label === "string" &&
    typeof candidate.description === "string" &&
    Array.isArray(candidate.stages)
  );
}
