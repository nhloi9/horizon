/*
  Warnings:

  - You are about to drop the column `userId` on the `comments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_avatarOfUserId_fkey";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_avatarOfUserId_fkey" FOREIGN KEY ("avatarOfUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
