/*
  Warnings:

  - You are about to drop the column `hash` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- DropIndex
DROP INDEX "users_hash_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "hash";
