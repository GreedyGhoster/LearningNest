/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_title_key" ON "Bookmark"("title");
