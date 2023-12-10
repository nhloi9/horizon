-- DropForeignKey
ALTER TABLE "reset_password_codes" DROP CONSTRAINT "reset_password_codes_userId_fkey";

-- AlterTable
ALTER TABLE "reset_password_codes" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "reset_password_codes" ADD CONSTRAINT "reset_password_codes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
