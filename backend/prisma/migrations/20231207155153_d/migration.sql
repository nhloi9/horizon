/*
  Warnings:

  - You are about to drop the column `birthday` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "shareId" INTEGER;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "birthday";

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
