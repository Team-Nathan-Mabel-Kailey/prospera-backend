/*
  Warnings:

  - The primary key for the `Article` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `datePublished` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `resourceId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ChatbotInteraction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ChatbotInteraction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatbotInteraction" DROP CONSTRAINT "ChatbotInteraction_userId_fkey";

-- AlterTable
ALTER TABLE "Article" DROP CONSTRAINT "Article_pkey",
DROP COLUMN "datePublished",
DROP COLUMN "language",
DROP COLUMN "resourceId",
DROP COLUMN "tags",
DROP COLUMN "updatedAt",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ADD CONSTRAINT "Article_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ChatbotInteraction" DROP COLUMN "updatedAt",
DROP COLUMN "userId";
