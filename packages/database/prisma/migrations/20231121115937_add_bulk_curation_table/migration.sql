-- AlterTable
ALTER TABLE "LicenseConclusion" ADD COLUMN     "bulkCurationId" INTEGER;

-- CreateTable
CREATE TABLE "BulkCuration" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pattern" TEXT,
    "concludedLicenseExpressionSPDX" TEXT NOT NULL,
    "detectedLicenseExpressionSPDX" TEXT,
    "comment" TEXT,
    "packageId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "BulkCuration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BulkCuration_packageId_idx" ON "BulkCuration"("packageId");

-- CreateIndex
CREATE INDEX "BulkCuration_userId_idx" ON "BulkCuration"("userId");

-- CreateIndex
CREATE INDEX "LicenseConclusion_bulkCurationId_idx" ON "LicenseConclusion"("bulkCurationId");
