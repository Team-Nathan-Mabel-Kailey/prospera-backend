/*
  Warnings:

  - You are about to drop the `Article` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FinancialAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FinancialGoal` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WidgetType" AS ENUM ('STOCK', 'FINANCIAL_GOALS', 'HIGHLIGHTED_SAVINGS', 'NEWS', 'SAVINGS_ACCOUNT', 'CHECKINGS_ACCOUNT');

-- DropForeignKey
ALTER TABLE "FinancialAccount" DROP CONSTRAINT "FinancialAccount_userId_fkey";

-- DropForeignKey
ALTER TABLE "FinancialGoal" DROP CONSTRAINT "FinancialGoal_userId_fkey";

-- DropTable
DROP TABLE "Article";

-- DropTable
DROP TABLE "FinancialAccount";

-- DropTable
DROP TABLE "FinancialGoal";

-- CreateTable
CREATE TABLE "Widget" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "WidgetType" NOT NULL,
    "configuration" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;
