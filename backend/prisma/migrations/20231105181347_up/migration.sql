/*
  Warnings:

  - You are about to drop the column `recipientId` on the `friend_requests` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[senderId,receiverId]` on the table `friend_requests` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[receiverId,senderId]` on the table `friend_requests` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receiverId` to the `friend_requests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "friend_requests" DROP CONSTRAINT "friend_requests_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "friend_requests" DROP CONSTRAINT "friend_requests_senderId_fkey";

-- AlterTable
ALTER TABLE "friend_requests" DROP COLUMN "recipientId",
ADD COLUMN     "receiverId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "friend_requests_senderId_receiverId_key" ON "friend_requests"("senderId", "receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "friend_requests_receiverId_senderId_key" ON "friend_requests"("receiverId", "senderId");

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
