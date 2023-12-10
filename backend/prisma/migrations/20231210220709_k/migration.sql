/*
  Warnings:

  - A unique constraint covering the columns `[storyId]` on the table `files` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "files" ADD COLUMN     "storyId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "files_storyId_key" ON "files"("storyId");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "story"("id") ON DELETE SET NULL ON UPDATE CASCADE;
