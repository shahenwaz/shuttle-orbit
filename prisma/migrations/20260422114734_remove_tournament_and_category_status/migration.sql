/*
  Warnings:

  - You are about to drop the column `status` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `TournamentCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "TournamentCategory" DROP COLUMN "status";
