/*
Warnings:

- You are about to drop the column `userId` on the `BulkConclusion` table. All the data in the column will be lost.
- You are about to drop the column `userId` on the `LicenseConclusion` table. All the data in the column will be lost.
- You are about to drop the column `userId` on the `PathExclusion` table. All the data in the column will be lost.

 */
-- Set userId to NULL for all rows on BulkConclusion, LicenseConclusion and PathExclusion tables
UPDATE "BulkConclusion"
SET
  "userId" = NULL
WHERE
  "userId" IS NOT NULL;

UPDATE "LicenseConclusion"
SET
  "userId" = NULL
WHERE
  "userId" IS NOT NULL;

UPDATE "PathExclusion"
SET
  "userId" = NULL
WHERE
  "userId" IS NOT NULL;

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