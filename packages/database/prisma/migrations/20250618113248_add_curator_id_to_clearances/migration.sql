-- AlterTable
ALTER TABLE "BulkConclusion" ADD COLUMN     "curatorId" UUID;

-- AlterTable
ALTER TABLE "LicenseConclusion" ADD COLUMN     "curatorId" UUID;

-- AlterTable
ALTER TABLE "PathExclusion" ADD COLUMN     "curatorId" UUID;

-- CreateIndex
CREATE INDEX "BulkConclusion_curatorId_idx" ON "BulkConclusion"("curatorId");

-- CreateIndex
CREATE INDEX "LicenseConclusion_curatorId_idx" ON "LicenseConclusion"("curatorId");

-- CreateIndex
CREATE INDEX "PathExclusion_curatorId_idx" ON "PathExclusion"("curatorId");
