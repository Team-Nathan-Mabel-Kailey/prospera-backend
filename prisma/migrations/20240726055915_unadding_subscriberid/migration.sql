/*
  Warnings:

  - You are about to drop the column `subscriberId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_subscriberId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "subscriberId";
