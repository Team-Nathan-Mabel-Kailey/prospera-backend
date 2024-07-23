/*
  Warnings:

  - Added the required column `h` to the `Widget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `i` to the `Widget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `w` to the `Widget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `x` to the `Widget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `Widget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Widget" ADD COLUMN     "h" INTEGER NOT NULL,
ADD COLUMN     "i" TEXT NOT NULL,
ADD COLUMN     "w" INTEGER NOT NULL,
ADD COLUMN     "x" INTEGER NOT NULL,
ADD COLUMN     "y" INTEGER NOT NULL;
