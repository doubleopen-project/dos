/*
  Warnings:

  - You are about to drop the column `licenseExpressionSPDX` on the `LicenseConclusion` table. All the data in the column will be lost.
  - Added the required column `concludedLicenseExpressionSPDX` to the `LicenseConclusion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detectedLicenseExpressionSPDX` to the `LicenseConclusion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reason` to the `LicenseConclusion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LicenseConclusion" DROP COLUMN "licenseExpressionSPDX",
ADD COLUMN     "concludedLicenseExpressionSPDX" TEXT NOT NULL,
ADD COLUMN     "detectedLicenseExpressionSPDX" TEXT NOT NULL,
ADD COLUMN     "reason" TEXT NOT NULL;
