/*
  Warnings:

  - You are about to drop the column `bulkCurationId` on the `LicenseConclusion` table. All the data in the column will be lost.
  - You are about to drop the `BulkCuration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "LicenseConclusion_bulkCurationId_idx";

-- AlterTable
ALTER TABLE "LicenseConclusion" DROP COLUMN "bulkCurationId",
ADD COLUMN     "bulkConclusionId" INTEGER;

-- DropTable
DROP TABLE "BulkCuration";

-- CreateTable
CREATE TABLE "BulkConclusion" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pattern" TEXT,
    "concludedLicenseExpressionSPDX" TEXT NOT NULL,
    "detectedLicenseExpressionSPDX" TEXT,
    "comment" TEXT,
    "local" BOOLEAN NOT NULL DEFAULT false,
    "packageId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "BulkConclusion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BulkConclusion_packageId_idx" ON "BulkConclusion"("packageId");

-- CreateIndex
CREATE INDEX "BulkConclusion_userId_idx" ON "BulkConclusion"("userId");

-- CreateIndex
CREATE INDEX "LicenseConclusion_bulkConclusionId_idx" ON "LicenseConclusion"("bulkConclusionId");
