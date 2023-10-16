/*
  Warnings:

  - You are about to drop the column `duration` on the `ScannerJob` table. All the data in the column will be lost.
  - You are about to drop the column `scanEndTS` on the `ScannerJob` table. All the data in the column will be lost.
  - You are about to drop the column `scanStartTS` on the `ScannerJob` table. All the data in the column will be lost.
  - You are about to drop the column `scannerConfig` on the `ScannerJob` table. All the data in the column will be lost.
  - You are about to drop the column `scannerName` on the `ScannerJob` table. All the data in the column will be lost.
  - You are about to drop the column `scannerVersion` on the `ScannerJob` table. All the data in the column will be lost.
  - You are about to drop the column `spdxLicenseListVersion` on the `ScannerJob` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ScannerJob" DROP COLUMN "duration",
DROP COLUMN "scanEndTS",
DROP COLUMN "scanStartTS",
DROP COLUMN "scannerConfig",
DROP COLUMN "scannerName",
DROP COLUMN "scannerVersion",
DROP COLUMN "spdxLicenseListVersion",
ADD COLUMN     "fileCount" INTEGER,
ADD COLUMN     "scanDuration" DOUBLE PRECISION,
ALTER COLUMN "timeout" DROP NOT NULL,
ALTER COLUMN "timeout" DROP DEFAULT;
