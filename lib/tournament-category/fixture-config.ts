import { prisma } from "@/lib/db/prisma";
import { toStoredFixtureConfig } from "@/lib/fixtures/config";
import type { FixtureTemplateConfig } from "@/lib/fixtures/types";

export async function saveCategoryFixtureTemplate(args: {
  categoryId: string;
  template: FixtureTemplateConfig;
}) {
  const storedConfig = toStoredFixtureConfig(args.template);

  return prisma.tournamentCategory.update({
    where: { id: args.categoryId },
    data: {
      fixtureTemplateKey: args.template.key,
      fixtureConfig: storedConfig,
    },
    select: {
      id: true,
      code: true,
      name: true,
      fixtureTemplateKey: true,
      fixtureConfig: true,
    },
  });
}

export async function getCategoryFixtureTemplate(categoryId: string) {
  return prisma.tournamentCategory.findUnique({
    where: { id: categoryId },
    select: {
      id: true,
      code: true,
      name: true,
      fixtureTemplateKey: true,
      fixtureConfig: true,
    },
  });
}
