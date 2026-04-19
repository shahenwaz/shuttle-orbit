"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";

import { FixtureTemplatePreviewCard } from "@/components/admin/fixtures/fixture-template-preview-card";
import type { FixtureTemplateConfig } from "@/lib/fixtures/types";
import { toFixtureTemplatePreview } from "@/lib/fixtures/presentation";

type FixtureTemplateSelectorProps = {
  templates: FixtureTemplateConfig[];
  initialTemplateKey?: string;
  onTemplateChange?: (templateKey: string) => void;
};

export function FixtureTemplateSelector({
  templates,
  initialTemplateKey,
  onTemplateChange,
}: FixtureTemplateSelectorProps) {
  const defaultTemplateKey =
    initialTemplateKey ?? templates[0]?.key ?? "manual_custom";

  const [selectedTemplateKey, setSelectedTemplateKey] =
    useState(defaultTemplateKey);

  const selectedTemplate = useMemo(
    () =>
      templates.find((template) => template.key === selectedTemplateKey) ??
      templates[0],
    [selectedTemplateKey, templates],
  );

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
          Fixture template
        </h2>
        <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
          Choose a structure first. Generation rules can be wired after the
          setup flow is finalized.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        {templates.map((template) => {
          const preview = toFixtureTemplatePreview(template);
          const isSelected = template.key === selectedTemplateKey;

          return (
            <button
              key={template.key}
              type="button"
              onClick={() => {
                setSelectedTemplateKey(template.key);
                onTemplateChange?.(template.key);
              }}
              className="text-left"
            >
              <div className="relative">
                <FixtureTemplatePreviewCard
                  title={preview.title}
                  description={preview.description}
                  groups={preview.groups}
                  knockoutMatches={preview.knockoutMatches}
                  isSelected={isSelected}
                />

                {isSelected ? (
                  <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary sm:text-[11px]">
                    <Check className="h-3.5 w-3.5" />
                    Selected
                  </div>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      {selectedTemplate ? (
        <div className="rounded-2xl border border-white/10 bg-white/4 p-4 sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
            Selected template
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground sm:text-base">
            {selectedTemplate.label}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
            {selectedTemplate.description}
          </p>
        </div>
      ) : null}
    </div>
  );
}
