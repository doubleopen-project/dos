-- DropIndex
DROP INDEX "BulkConclusion_userId_idx";

-- DropIndex
DROP INDEX "LicenseConclusion_userId_idx";

-- DropIndex
DROP INDEX "PathExclusion_userId_idx";

-- AlterTable
ALTER TABLE "BulkConclusion"
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "LicenseConclusion"
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "PathExclusion"
DROP COLUMN "userId";
