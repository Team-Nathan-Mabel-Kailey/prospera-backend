-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hasCompletedTopics" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "topics" TEXT[] DEFAULT ARRAY[]::TEXT[];
