/*
  Warnings:

  - This removes the private club member-zone, session, and attendance subsystem.
  - Existing session, attendance, share-key, and managed-club data will be lost.
*/
-- DropForeignKey
ALTER TABLE "ClubSession" DROP CONSTRAINT "ClubSession_clubId_fkey";

-- DropForeignKey
ALTER TABLE "ClubSessionAttendance" DROP CONSTRAINT "ClubSessionAttendance_playerId_fkey";

-- DropForeignKey
ALTER TABLE "ClubSessionAttendance" DROP CONSTRAINT "ClubSessionAttendance_sessionId_fkey";

-- DropIndex
DROP INDEX "Club_isManagedClub_idx";

-- DropIndex
DROP INDEX "Club_memberShareKey_key";

-- AlterTable
ALTER TABLE "Club" DROP COLUMN "isManagedClub",
DROP COLUMN "memberAccessEnabled",
DROP COLUMN "memberShareKey";

-- DropTable
DROP TABLE "ClubSession";

-- DropTable
DROP TABLE "ClubSessionAttendance";

-- DropEnum
DROP TYPE "ClubAttendanceStatus";

-- DropEnum
DROP TYPE "ClubSessionStatus";

-- DropEnum
DROP TYPE "ClubSessionVisibility";
