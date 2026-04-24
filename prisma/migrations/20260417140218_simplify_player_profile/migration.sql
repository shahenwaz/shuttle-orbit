/*
  Warnings:

  - You are about to drop the column `communityTag` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Player` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nickname]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Made the column `nickname` on table `Player` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "communityTag",
DROP COLUMN "gender",
ALTER COLUMN "nickname" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Player_nickname_key" ON "Player"("nickname");
