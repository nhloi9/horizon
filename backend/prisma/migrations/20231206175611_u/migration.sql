-- CreateEnum
CREATE TYPE "access" AS ENUM ('private', 'public', 'friend');

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "access" "access" NOT NULL DEFAULT 'public';
