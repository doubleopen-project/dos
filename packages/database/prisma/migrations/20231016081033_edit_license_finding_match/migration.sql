/*
  Warnings:

  - Made the column `licenseExpression` on table `LicenseFindingMatch` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "LicenseFindingMatch" ALTER COLUMN "licenseExpression" SET NOT NULL;
