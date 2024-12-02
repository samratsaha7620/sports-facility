/*
  Warnings:

  - Added the required column `membershipValidDate` to the `ClubMembership` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClubMembership" ADD COLUMN     "membershipValidDate" TIMESTAMP(3) NOT NULL;
