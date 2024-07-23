/*
  Warnings:

  - Added the required column `publishedAt` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `securityAnswer` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "publishedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "source" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "securityAnswer" TEXT NOT NULL;
