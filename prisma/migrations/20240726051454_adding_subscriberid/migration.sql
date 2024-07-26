/*
  Warnings:

  - A unique constraint covering the columns `[subscriberId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "subscriberId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_subscriberId_key" ON "User"("subscriberId");
