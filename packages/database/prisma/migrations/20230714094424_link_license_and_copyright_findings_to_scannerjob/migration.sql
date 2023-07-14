/*
  Warnings:

  - You are about to drop the column `scannerName` on the `CopyrightFinding` table. All the data in the column will be lost.
  - You are about to drop the column `scannerVersion` on the `CopyrightFinding` table. All the data in the column will be lost.
  - You are about to drop the column `scannerName` on the `LicenseFinding` table. All the data in the column will be lost.
  - You are about to drop the column `scannerVersion` on the `LicenseFinding` table. All the data in the column will be lost.
  - Added the required column `scannerJobId` to the `CopyrightFinding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scannerJobId` to the `LicenseFinding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CopyrightFinding" DROP COLUMN "scannerName",
DROP COLUMN "scannerVersion",
ADD COLUMN     "scannerJobId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LicenseFinding" DROP COLUMN "scannerName",
DROP COLUMN "scannerVersion",
ADD COLUMN     "scannerJobId" TEXT NOT NULL;
