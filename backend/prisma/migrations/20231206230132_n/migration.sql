/*
  Warnings:

  - A unique constraint covering the columns `[userId,commentId]` on the table `comment_reacts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,groupId]` on the table `group_requests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "comment_reacts_userId_commentId_key" ON "comment_reacts"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "group_requests_userId_groupId_key" ON "group_requests"("userId", "groupId");
