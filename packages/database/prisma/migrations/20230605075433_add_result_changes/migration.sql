/*
  Warnings:

  - You are about to drop the column `packageName` on the `ScannerJob` table. All the data in the column will be lost.
  - You are about to drop the column `packageRegistry` on the `ScannerJob` table. All the data in the column will be lost.
  - You are about to drop the column `packageVersion` on the `ScannerJob` table. All the data in the column will be lost.
  - You are about to drop the column `scancodeVersion` on the `ScannerJob` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "scanned" BOOLEAN,
ADD COLUMN     "scannerJobId" TEXT;

-- AlterTable
ALTER TABLE "ScannerJob" DROP COLUMN "packageName",
DROP COLUMN "packageRegistry",
DROP COLUMN "packageVersion",
DROP COLUMN "scancodeVersion",
ADD COLUMN     "duration" DOUBLE PRECISION,
ADD COLUMN     "scanEndTS" TIMESTAMP(3),
ADD COLUMN     "scanStartTS" TIMESTAMP(3),
ADD COLUMN     "scannerName" TEXT,
ADD COLUMN     "scannerVersion" TEXT,
ADD COLUMN     "spdxLicenseListVersion" TEXT;

-- CreateIndex
CREATE INDEX "File_scannerJobId_idx" ON "File"("scannerJobId");
