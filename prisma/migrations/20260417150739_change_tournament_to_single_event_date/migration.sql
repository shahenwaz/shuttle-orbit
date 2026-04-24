/*
  Warnings:

  - You are about to drop the column `endDate` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Tournament` table. All the data in the column will be lost.
  - Added the required column `eventDate` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "eventDate" TIMESTAMP(3) NOT NULL;
