-- AddForeignKey
ALTER TABLE "story" ADD CONSTRAINT "story_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
