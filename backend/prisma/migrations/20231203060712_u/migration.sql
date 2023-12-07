-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_avatarOfUserId_fkey";

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_avatarOfUserId_fkey" FOREIGN KEY ("avatarOfUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
