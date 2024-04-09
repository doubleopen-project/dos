-- AlterTable
ALTER TABLE "BulkConclusion" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "LicenseConclusion" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PathExclusion" ALTER COLUMN "userId" DROP NOT NULL;
