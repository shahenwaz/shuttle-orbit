/*
  Warnings:

  - You are about to drop the column `memberId` on the `ClubSessionAttendance` table. All the data in the column will be lost.
  - You are about to drop the `ClubLeague` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClubLeagueEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClubLeagueMatch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClubLeagueSet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClubLeagueSide` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClubMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClubPlayerLeagueStat` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sessionId,playerId]` on the table `ClubSessionAttendance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `playerId` to the `ClubSessionAttendance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LeagueFormat" AS ENUM ('ROUND_ROBIN', 'TEAM_PAIR_MATRIX', 'FIXED_DOUBLES', 'MANUAL');

-- DropForeignKey
ALTER TABLE "ClubLeague" DROP CONSTRAINT "ClubLeague_clubId_fkey";

-- DropForeignKey
ALTER TABLE "ClubLeagueEntry" DROP CONSTRAINT "ClubLeagueEntry_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "ClubLeagueEntry" DROP CONSTRAINT "ClubLeagueEntry_player1Id_fkey";

-- DropForeignKey
ALTER TABLE "ClubLeagueEntry" DROP CONSTRAINT "ClubLeagueEntry_player2Id_fkey";

-- DropForeignKey
ALTER TABLE "ClubLeagueEntry" DROP CONSTRAINT "ClubLeagueEntry_sideId_fkey";

-- DropForeignKey
ALTER TABLE "ClubLeagueMatch" DROP CONSTRAINT "ClubLeagueMatch_entryAId_fkey";

-- DropForeignKey
ALTER TABLE "ClubLeagueMatch" DROP CONSTRAINT "ClubLeagueMatch_entryBId_fkey";

-- DropForeignKey
ALTER TABLE "ClubLeagueMatch" DROP CONSTRAINT "ClubLeagueMatch_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "ClubLeagueMatch" DROP CONSTRAINT "ClubLeagueMatch_winnerEntryId_fkey";

-- DropForeignKey
ALTER TABLE "ClubLeagueSet" DROP CONSTRAINT "ClubLeagueSet_matchId_fkey";

-- DropForeignKey
ALTER TABLE "ClubLeagueSide" DROP CONSTRAINT "ClubLeagueSide_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "ClubMember" DROP CONSTRAINT "ClubMember_clubId_fkey";

-- DropForeignKey
ALTER TABLE "ClubMember" DROP CONSTRAINT "ClubMember_playerId_fkey";

-- DropForeignKey
ALTER TABLE "ClubPlayerLeagueStat" DROP CONSTRAINT "ClubPlayerLeagueStat_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "ClubPlayerLeagueStat" DROP CONSTRAINT "ClubPlayerLeagueStat_playerId_fkey";

-- DropForeignKey
ALTER TABLE "ClubSessionAttendance" DROP CONSTRAINT "ClubSessionAttendance_memberId_fkey";

-- DropIndex
DROP INDEX "ClubSessionAttendance_memberId_status_idx";

-- DropIndex
DROP INDEX "ClubSessionAttendance_sessionId_memberId_key";

-- AlterTable
ALTER TABLE "ClubSessionAttendance" DROP COLUMN "memberId",
ADD COLUMN     "playerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "clubId" TEXT,
ADD COLUMN     "clubJoinedAt" TIMESTAMP(3),
ADD COLUMN     "clubNotes" TEXT,
ADD COLUMN     "clubProfilePublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "clubRole" "ClubMemberRole" NOT NULL DEFAULT 'MEMBER';

-- DropTable
DROP TABLE "ClubLeague";

-- DropTable
DROP TABLE "ClubLeagueEntry";

-- DropTable
DROP TABLE "ClubLeagueMatch";

-- DropTable
DROP TABLE "ClubLeagueSet";

-- DropTable
DROP TABLE "ClubLeagueSide";

-- DropTable
DROP TABLE "ClubMember";

-- DropTable
DROP TABLE "ClubPlayerLeagueStat";

-- DropEnum
DROP TYPE "ClubLeagueFormat";

-- CreateTable
CREATE TABLE "League" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "playedAt" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "format" "LeagueFormat" NOT NULL,
    "rulesNote" TEXT,
    "hostClubId" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeagueTeam" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "teamOrder" INTEGER NOT NULL,
    "originLabel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeagueTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeagueTeamPlayer" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "role" TEXT,

    CONSTRAINT "LeagueTeamPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeagueMatch" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "teamAId" TEXT,
    "teamBId" TEXT,
    "winnerTeamId" TEXT,
    "matchOrder" INTEGER NOT NULL,
    "roundLabel" TEXT,
    "scoreSummary" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeagueMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeagueSet" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "teamAScore" INTEGER NOT NULL,
    "teamBScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeagueSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerLeagueStat" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "teamId" TEXT,
    "matchesPlayed" INTEGER NOT NULL DEFAULT 0,
    "matchesWon" INTEGER NOT NULL DEFAULT 0,
    "matchesLost" INTEGER NOT NULL DEFAULT 0,
    "pointsFor" INTEGER NOT NULL DEFAULT 0,
    "pointsAgainst" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerLeagueStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "League_slug_key" ON "League"("slug");

-- CreateIndex
CREATE INDEX "League_playedAt_idx" ON "League"("playedAt");

-- CreateIndex
CREATE INDEX "League_hostClubId_idx" ON "League"("hostClubId");

-- CreateIndex
CREATE INDEX "LeagueTeam_leagueId_idx" ON "LeagueTeam"("leagueId");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueTeam_leagueId_teamOrder_key" ON "LeagueTeam"("leagueId", "teamOrder");

-- CreateIndex
CREATE INDEX "LeagueTeamPlayer_playerId_idx" ON "LeagueTeamPlayer"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueTeamPlayer_teamId_playerId_key" ON "LeagueTeamPlayer"("teamId", "playerId");

-- CreateIndex
CREATE INDEX "LeagueMatch_leagueId_idx" ON "LeagueMatch"("leagueId");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueMatch_leagueId_matchOrder_key" ON "LeagueMatch"("leagueId", "matchOrder");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueSet_matchId_setNumber_key" ON "LeagueSet"("matchId", "setNumber");

-- CreateIndex
CREATE INDEX "PlayerLeagueStat_leagueId_idx" ON "PlayerLeagueStat"("leagueId");

-- CreateIndex
CREATE INDEX "PlayerLeagueStat_teamId_idx" ON "PlayerLeagueStat"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerLeagueStat_playerId_leagueId_key" ON "PlayerLeagueStat"("playerId", "leagueId");

-- CreateIndex
CREATE INDEX "ClubSessionAttendance_playerId_status_idx" ON "ClubSessionAttendance"("playerId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ClubSessionAttendance_sessionId_playerId_key" ON "ClubSessionAttendance"("sessionId", "playerId");

-- CreateIndex
CREATE INDEX "Player_clubId_idx" ON "Player"("clubId");

-- CreateIndex
CREATE INDEX "Player_clubId_isActive_idx" ON "Player"("clubId", "isActive");

-- CreateIndex
CREATE INDEX "Player_clubId_clubRole_idx" ON "Player"("clubId", "clubRole");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubSessionAttendance" ADD CONSTRAINT "ClubSessionAttendance_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "League" ADD CONSTRAINT "League_hostClubId_fkey" FOREIGN KEY ("hostClubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueTeam" ADD CONSTRAINT "LeagueTeam_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueTeamPlayer" ADD CONSTRAINT "LeagueTeamPlayer_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "LeagueTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueTeamPlayer" ADD CONSTRAINT "LeagueTeamPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueMatch" ADD CONSTRAINT "LeagueMatch_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueMatch" ADD CONSTRAINT "LeagueMatch_teamAId_fkey" FOREIGN KEY ("teamAId") REFERENCES "LeagueTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueMatch" ADD CONSTRAINT "LeagueMatch_teamBId_fkey" FOREIGN KEY ("teamBId") REFERENCES "LeagueTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueMatch" ADD CONSTRAINT "LeagueMatch_winnerTeamId_fkey" FOREIGN KEY ("winnerTeamId") REFERENCES "LeagueTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueSet" ADD CONSTRAINT "LeagueSet_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "LeagueMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerLeagueStat" ADD CONSTRAINT "PlayerLeagueStat_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerLeagueStat" ADD CONSTRAINT "PlayerLeagueStat_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerLeagueStat" ADD CONSTRAINT "PlayerLeagueStat_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "LeagueTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
