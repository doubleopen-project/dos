-- DropIndex
DROP INDEX "BulkConclusion_kcUserId_idx";

-- DropIndex
DROP INDEX "LicenseConclusion_kcUserId_idx";

-- DropIndex
DROP INDEX "PathExclusion_kcUserId_idx";

-- AlterTable
ALTER TABLE "BulkConclusion"
RENAME COLUMN "kcUserId" TO "userId";

-- AlterTable
ALTER TABLE "LicenseConclusion"
RENAME COLUMN "kcUserId" TO "userId";

-- AlterTable
ALTER TABLE "PathExclusion"
RENAME COLUMN "kcUserId" TO "userId";

-- CreateIndex
CREATE INDEX "BulkConclusion_userId_idx" ON "BulkConclusion" ("userId");

-- CreateIndex
CREATE INDEX "LicenseConclusion_userId_idx" ON "LicenseConclusion" ("userId");

-- CreateIndex
CREATE INDEX "PathExclusion_userId_idx" ON "PathExclusion" ("userId");