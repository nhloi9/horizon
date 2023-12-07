-- CreateEnum
CREATE TYPE "accessGroup" AS ENUM ('private', 'public');

-- CreateEnum
CREATE TYPE "groupRequestType" AS ENUM ('invite', 'join');

-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "negative" BOOLEAN;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "approved" BOOLEAN,
ADD COLUMN     "negative" BOOLEAN,
ALTER COLUMN "access" DROP NOT NULL,
ALTER COLUMN "access" DROP DEFAULT;

-- CreateTable
CREATE TABLE "groups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "access" "accessGroup" NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMember" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupReqest" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER,
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "isAcceptedByAdmin" BOOLEAN NOT NULL,
    "isAcceptedByUser" BOOLEAN NOT NULL,
    "type" "groupRequestType" NOT NULL,

    CONSTRAINT "GroupReqest_pkey" PRIMARY KEY ("id")
);
