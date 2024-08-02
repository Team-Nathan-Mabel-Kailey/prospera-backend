/*
  Warnings:

  - The primary key for the `Conversation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,conversationId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ChatbotInteraction" DROP CONSTRAINT "ChatbotInteraction_conversationId_fkey";

-- AlterTable
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_pkey",
ALTER COLUMN "conversationId" DROP DEFAULT,
ADD CONSTRAINT "Conversation_pkey" PRIMARY KEY ("userId", "conversationId");
DROP SEQUENCE "Conversation_conversationId_seq";

-- CreateIndex
CREATE INDEX "ChatbotInteraction_userId_conversationId_idx" ON "ChatbotInteraction"("userId", "conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_userId_conversationId_key" ON "Conversation"("userId", "conversationId");

-- AddForeignKey
ALTER TABLE "ChatbotInteraction" ADD CONSTRAINT "ChatbotInteraction_userId_conversationId_fkey" FOREIGN KEY ("userId", "conversationId") REFERENCES "Conversation"("userId", "conversationId") ON DELETE CASCADE ON UPDATE CASCADE;
