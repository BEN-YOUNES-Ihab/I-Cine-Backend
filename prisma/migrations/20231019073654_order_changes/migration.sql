/*
  Warnings:

  - Made the column `onDisplay` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `movieId` on table `Session` required. This step will fail if there are existing NULL values in that column.
  - Made the column `firstName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_movieId_fkey";

-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "onDisplay" SET NOT NULL;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "movieId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
