/*
  Warnings:

  - You are about to drop the column `status` on the `ClubMember` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ClubMember_clubId_status_idx";

-- AlterTable
ALTER TABLE "ClubMember" DROP COLUMN "status";

-- DropEnum
DROP TYPE "ClubMemberStatus";

-- CreateIndex
CREATE INDEX "ClubMember_clubId_idx" ON "ClubMember"("clubId");
