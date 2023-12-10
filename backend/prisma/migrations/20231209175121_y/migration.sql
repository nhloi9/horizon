/*
  Warnings:

  - You are about to drop the column `access` on the `groups` table. All the data in the column will be lost.
  - You are about to drop the column `access` on the `posts` table. All the data in the column will be lost.
  - Added the required column `privacy` to the `groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "groups" DROP COLUMN "access",
ADD COLUMN     "privacy" "accessGroup" NOT NULL;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "access",
ADD COLUMN     "privacy" "access";
