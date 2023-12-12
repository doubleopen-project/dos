-- AlterTable
ALTER TABLE "BulkCuration" ADD COLUMN     "local" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "LicenseConclusion" ADD COLUMN     "local" BOOLEAN NOT NULL DEFAULT false;
