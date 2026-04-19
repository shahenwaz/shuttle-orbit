/*
  Warnings:

  - You are about to drop the column `fixtureConfig` on the `TournamentCategory` table. All the data in the column will be lost.
  - You are about to drop the column `fixtureTemplateKey` on the `TournamentCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TournamentCategory" DROP COLUMN "fixtureConfig",
DROP COLUMN "fixtureTemplateKey";
