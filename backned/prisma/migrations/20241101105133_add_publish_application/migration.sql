-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "isApplicationPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publishEndDate" TIMESTAMP(3),
ADD COLUMN     "publishStartDate" TIMESTAMP(3);
