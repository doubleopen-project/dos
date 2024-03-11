/*
  Warnings:

  - Made the column `kcUserId` on table `BulkConclusion` required. This step will fail if there are existing NULL values in that column.
  - Made the column `kcUserId` on table `LicenseConclusion` required. This step will fail if there are existing NULL values in that column.
  - Made the column `kcUserId` on table `PathExclusion` required. This step will fail if there are existing NULL values in that column.
  - Made the column `kcUserId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BulkConclusion" ALTER COLUMN "kcUserId" SET NOT NULL;

-- AlterTable
ALTER TABLE "LicenseConclusion" ALTER COLUMN "kcUserId" SET NOT NULL;

-- AlterTable
ALTER TABLE "PathExclusion" ALTER COLUMN "kcUserId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "kcUserId" SET NOT NULL;
