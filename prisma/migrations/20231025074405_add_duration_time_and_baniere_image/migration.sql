-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "baniereImageCloudinaryPublicId" TEXT,
ADD COLUMN     "baniereImageUrl" TEXT,
ADD COLUMN     "durationTime" INTEGER NOT NULL DEFAULT 120;
