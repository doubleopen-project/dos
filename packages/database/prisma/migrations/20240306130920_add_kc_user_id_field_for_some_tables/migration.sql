-- AlterTable
ALTER TABLE "BulkConclusion" ADD COLUMN     "kcUserId" UUID;

-- AlterTable
ALTER TABLE "LicenseConclusion" ADD COLUMN     "kcUserId" UUID;

-- AlterTable
ALTER TABLE "PathExclusion" ADD COLUMN     "kcUserId" UUID;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "kcUserId" UUID;

-- CreateIndex
CREATE INDEX "BulkConclusion_kcUserId_idx" ON "BulkConclusion"("kcUserId");

-- CreateIndex
CREATE INDEX "LicenseConclusion_kcUserId_idx" ON "LicenseConclusion"("kcUserId");

-- CreateIndex
CREATE INDEX "PathExclusion_kcUserId_idx" ON "PathExclusion"("kcUserId");

-- CreateIndex
CREATE INDEX "User_kcUserId_idx" ON "User"("kcUserId");
