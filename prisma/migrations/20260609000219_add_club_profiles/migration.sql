-- CreateEnum
CREATE TYPE "ClubMemberRole" AS ENUM ('OWNER', 'ORGANIZER', 'MEMBER');

-- CreateEnum
CREATE TYPE "ClubMemberStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ClubSessionStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ClubSessionVisibility" AS ENUM ('PUBLIC', 'MEMBER_ONLY', 'ADMIN_ONLY');

-- CreateEnum
CREATE TYPE "ClubAttendanceStatus" AS ENUM ('GOING', 'MAYBE', 'NOT_GOING', 'NOT_RESPONDED');

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortName" TEXT,
    "description" TEXT,
    "location" TEXT,
    "homeVenue" TEXT,
    "logoUrl" TEXT,
    "bannerUrl" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "memberAccessEnabled" BOOLEAN NOT NULL DEFAULT false,
    "memberShareKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubMember" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "playerId" TEXT,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "role" "ClubMemberRole" NOT NULL DEFAULT 'MEMBER',
    "status" "ClubMemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubSession" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "venue" TEXT,
    "courtNumbers" TEXT,
    "bookingRef" TEXT,
    "status" "ClubSessionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "visibility" "ClubSessionVisibility" NOT NULL DEFAULT 'MEMBER_ONLY',
    "publicNotes" TEXT,
    "privateNotes" TEXT,
    "costPerPlayer" DECIMAL(8,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubSessionAttendance" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "status" "ClubAttendanceStatus" NOT NULL DEFAULT 'NOT_RESPONDED',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubSessionAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Club_slug_key" ON "Club"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Club_memberShareKey_key" ON "Club"("memberShareKey");

-- CreateIndex
CREATE INDEX "Club_slug_idx" ON "Club"("slug");

-- CreateIndex
CREATE INDEX "Club_isPublic_idx" ON "Club"("isPublic");

-- CreateIndex
CREATE INDEX "ClubMember_clubId_status_idx" ON "ClubMember"("clubId", "status");

-- CreateIndex
CREATE INDEX "ClubMember_playerId_idx" ON "ClubMember"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "ClubMember_clubId_playerId_key" ON "ClubMember"("clubId", "playerId");

-- CreateIndex
CREATE INDEX "ClubSession_clubId_startAt_idx" ON "ClubSession"("clubId", "startAt");

-- CreateIndex
CREATE INDEX "ClubSession_status_idx" ON "ClubSession"("status");

-- CreateIndex
CREATE INDEX "ClubSessionAttendance_memberId_status_idx" ON "ClubSessionAttendance"("memberId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ClubSessionAttendance_sessionId_memberId_key" ON "ClubSessionAttendance"("sessionId", "memberId");

-- AddForeignKey
ALTER TABLE "ClubMember" ADD CONSTRAINT "ClubMember_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubMember" ADD CONSTRAINT "ClubMember_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubSession" ADD CONSTRAINT "ClubSession_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubSessionAttendance" ADD CONSTRAINT "ClubSessionAttendance_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ClubSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubSessionAttendance" ADD CONSTRAINT "ClubSessionAttendance_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "ClubMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
