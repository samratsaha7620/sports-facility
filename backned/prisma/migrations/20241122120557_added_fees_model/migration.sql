-- CreateEnum
CREATE TYPE "FeesType" AS ENUM ('MONTHLY', 'ANUALLY', 'FINE', 'OTHER');

-- CreateEnum
CREATE TYPE "FeesStatus" AS ENUM ('PAID', 'PENDING', 'OVERDUE');

-- CreateTable
CREATE TABLE "Fee" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "type" "FeesType" NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "FeesStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Fee" ADD CONSTRAINT "Fee_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "ClubMembership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
