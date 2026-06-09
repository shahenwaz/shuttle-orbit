/*
  Warnings:

  - The values [MAYBE,NOT_RESPONDED] on the enum `ClubAttendanceStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ClubAttendanceStatus_new" AS ENUM ('GOING', 'NOT_GOING');
ALTER TABLE "public"."ClubSessionAttendance" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ClubSessionAttendance" ALTER COLUMN "status" TYPE "ClubAttendanceStatus_new" USING ("status"::text::"ClubAttendanceStatus_new");
ALTER TYPE "ClubAttendanceStatus" RENAME TO "ClubAttendanceStatus_old";
ALTER TYPE "ClubAttendanceStatus_new" RENAME TO "ClubAttendanceStatus";
DROP TYPE "public"."ClubAttendanceStatus_old";
ALTER TABLE "ClubSessionAttendance" ALTER COLUMN "status" SET DEFAULT 'NOT_GOING';
COMMIT;

-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "isManagedClub" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ClubSessionAttendance" ALTER COLUMN "status" SET DEFAULT 'NOT_GOING';

-- CreateIndex
CREATE INDEX "Club_isManagedClub_idx" ON "Club"("isManagedClub");
