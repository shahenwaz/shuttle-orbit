-- CreateEnum
CREATE TYPE "ClubLeagueFormat" AS ENUM ('TEAM_PAIR_MATRIX', 'FIXED_DOUBLES', 'MANUAL');

-- CreateTable
CREATE TABLE "ClubLeague" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "playedAt" TIMESTAMP(3) NOT NULL,
    "format" "ClubLeagueFormat" NOT NULL,
    "rulesNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubLeague_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubLeagueSide" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sideOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubLeagueSide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubLeagueEntry" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "sideId" TEXT,
    "player1Id" TEXT NOT NULL,
    "player2Id" TEXT,
    "displayName" TEXT,
    "entryOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubLeagueEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubLeagueMatch" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "entryAId" TEXT,
    "entryBId" TEXT,
    "winnerEntryId" TEXT,
    "matchOrder" INTEGER NOT NULL,
    "roundLabel" TEXT,
    "scoreSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubLeagueMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubLeagueSet" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "entryAScore" INTEGER NOT NULL,
    "entryBScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClubLeagueSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubPlayerLeagueStat" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "matchesPlayed" INTEGER NOT NULL DEFAULT 0,
    "matchesWon" INTEGER NOT NULL DEFAULT 0,
    "matchesLost" INTEGER NOT NULL DEFAULT 0,
    "pointsFor" INTEGER NOT NULL DEFAULT 0,
    "pointsAgainst" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubPlayerLeagueStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClubLeague_clubId_playedAt_idx" ON "ClubLeague"("clubId", "playedAt");

-- CreateIndex
CREATE INDEX "ClubLeague_format_idx" ON "ClubLeague"("format");

-- CreateIndex
CREATE UNIQUE INDEX "ClubLeagueSide_leagueId_sideOrder_key" ON "ClubLeagueSide"("leagueId", "sideOrder");

-- CreateIndex
CREATE INDEX "ClubLeagueEntry_leagueId_idx" ON "ClubLeagueEntry"("leagueId");

-- CreateIndex
CREATE INDEX "ClubLeagueEntry_sideId_idx" ON "ClubLeagueEntry"("sideId");

-- CreateIndex
CREATE UNIQUE INDEX "ClubLeagueMatch_leagueId_matchOrder_key" ON "ClubLeagueMatch"("leagueId", "matchOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ClubLeagueSet_matchId_setNumber_key" ON "ClubLeagueSet"("matchId", "setNumber");

-- CreateIndex
CREATE INDEX "ClubPlayerLeagueStat_leagueId_idx" ON "ClubPlayerLeagueStat"("leagueId");

-- CreateIndex
CREATE UNIQUE INDEX "ClubPlayerLeagueStat_playerId_leagueId_key" ON "ClubPlayerLeagueStat"("playerId", "leagueId");

-- AddForeignKey
ALTER TABLE "ClubLeague" ADD CONSTRAINT "ClubLeague_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubLeagueSide" ADD CONSTRAINT "ClubLeagueSide_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "ClubLeague"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubLeagueEntry" ADD CONSTRAINT "ClubLeagueEntry_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "ClubLeague"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubLeagueEntry" ADD CONSTRAINT "ClubLeagueEntry_sideId_fkey" FOREIGN KEY ("sideId") REFERENCES "ClubLeagueSide"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubLeagueEntry" ADD CONSTRAINT "ClubLeagueEntry_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubLeagueEntry" ADD CONSTRAINT "ClubLeagueEntry_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubLeagueMatch" ADD CONSTRAINT "ClubLeagueMatch_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "ClubLeague"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubLeagueMatch" ADD CONSTRAINT "ClubLeagueMatch_entryAId_fkey" FOREIGN KEY ("entryAId") REFERENCES "ClubLeagueEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubLeagueMatch" ADD CONSTRAINT "ClubLeagueMatch_entryBId_fkey" FOREIGN KEY ("entryBId") REFERENCES "ClubLeagueEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubLeagueMatch" ADD CONSTRAINT "ClubLeagueMatch_winnerEntryId_fkey" FOREIGN KEY ("winnerEntryId") REFERENCES "ClubLeagueEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubLeagueSet" ADD CONSTRAINT "ClubLeagueSet_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "ClubLeagueMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubPlayerLeagueStat" ADD CONSTRAINT "ClubPlayerLeagueStat_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubPlayerLeagueStat" ADD CONSTRAINT "ClubPlayerLeagueStat_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "ClubLeague"("id") ON DELETE CASCADE ON UPDATE CASCADE;
