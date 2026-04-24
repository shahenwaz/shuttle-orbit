/*
  Warnings:

  - You are about to drop the column `pointsAwarded` on the `RankingLedger` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `RankingLedger` table. All the data in the column will be lost.
  - You are about to drop the column `seasonLabel` on the `RankingLedger` table. All the data in the column will be lost.
  - Added the required column `placementTier` to the `PlayerTournamentStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `basePoints` to the `RankingLedger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `RankingLedger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `multiplierApplied` to the `RankingLedger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `placementTier` to the `RankingLedger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scope` to the `RankingLedger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPointsAwarded` to the `RankingLedger` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RankingScope" AS ENUM ('UNIVERSAL', 'CATEGORY');

-- CreateEnum
CREATE TYPE "PlacementTier" AS ENUM ('CHAMPION', 'RUNNER_UP', 'THIRD_PLACE', 'FOURTH_PLACE', 'ADVANCED_STAGE', 'GROUP_STAGE', 'PARTICIPATION');

-- AlterTable
ALTER TABLE "PlayerTournamentStat" ADD COLUMN     "placementTier" "PlacementTier" NOT NULL,
ADD COLUMN     "pointsAgainst" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pointsFor" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "setsLost" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "setsWon" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "teamEntryId" TEXT;

-- AlterTable
ALTER TABLE "RankingLedger" DROP COLUMN "pointsAwarded",
DROP COLUMN "reason",
DROP COLUMN "seasonLabel",
ADD COLUMN     "basePoints" INTEGER NOT NULL,
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "multiplierApplied" DECIMAL(5,2) NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "placementTier" "PlacementTier" NOT NULL,
ADD COLUMN     "scope" "RankingScope" NOT NULL,
ADD COLUMN     "totalPointsAwarded" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "PlayerTournamentStat_categoryId_placementTier_idx" ON "PlayerTournamentStat"("categoryId", "placementTier");

-- CreateIndex
CREATE INDEX "PlayerTournamentStat_tournamentId_idx" ON "PlayerTournamentStat"("tournamentId");

-- CreateIndex
CREATE INDEX "RankingLedger_playerId_scope_idx" ON "RankingLedger"("playerId", "scope");

-- CreateIndex
CREATE INDEX "RankingLedger_categoryId_scope_idx" ON "RankingLedger"("categoryId", "scope");

-- CreateIndex
CREATE INDEX "RankingLedger_tournamentId_idx" ON "RankingLedger"("tournamentId");

-- AddForeignKey
ALTER TABLE "RankingLedger" ADD CONSTRAINT "RankingLedger_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TournamentCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
