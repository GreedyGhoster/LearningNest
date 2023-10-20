/*
  Warnings:

  - You are about to drop the column `bookmark` on the `Bookmark` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bookmark" DROP COLUMN "bookmark",
ADD COLUMN     "description" TEXT;
