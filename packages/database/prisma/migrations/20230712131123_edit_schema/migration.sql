/*
  Warnings:

  - You are about to drop the column `scanned` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `scannerJobId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `sourceHash` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `sourceUrl` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `ortVersion` on the `ScannerJob` table. All the data in the column will be lost.
  - Added the required column `scannerName` to the `CopyrightFinding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scannerVersion` to the `CopyrightFinding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scanStatus` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scannerName` to the `LicenseFinding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scannerVersion` to the `LicenseFinding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purl` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scanStatus` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageId` to the `ScannerJob` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "File_scannerJobId_idx";

-- DropIndex
DROP INDEX "Package_sourceHash_key";

-- AlterTable
ALTER TABLE "CopyrightFinding" ADD COLUMN     "scannerName" TEXT NOT NULL,
ADD COLUMN     "scannerVersion" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "File" DROP COLUMN "scanned",
DROP COLUMN "scannerJobId",
ADD COLUMN     "scanStatus" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LicenseFinding" ADD COLUMN     "scannerName" TEXT NOT NULL,
ADD COLUMN     "scannerVersion" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Package" DROP COLUMN "sourceHash",
DROP COLUMN "sourceUrl",
ADD COLUMN     "purl" TEXT NOT NULL,
ADD COLUMN     "scanStatus" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ScannerJob" DROP COLUMN "ortVersion",
ADD COLUMN     "packageId" INTEGER NOT NULL,
ADD COLUMN     "scannerConfig" TEXT;
