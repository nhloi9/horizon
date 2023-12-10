-- CreateTable
CREATE TABLE "story" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "song" JSONB,
    "mutedOriginal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_story" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "react_story" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "reactId" INTEGER NOT NULL,

    CONSTRAINT "react_story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StoryToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_StoryToUser_AB_unique" ON "_StoryToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_StoryToUser_B_index" ON "_StoryToUser"("B");

-- AddForeignKey
ALTER TABLE "_StoryToUser" ADD CONSTRAINT "_StoryToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StoryToUser" ADD CONSTRAINT "_StoryToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
