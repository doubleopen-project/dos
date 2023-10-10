/*
  Warnings:

  - You are about to drop the column `endLine` on the `LicenseConclusion` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `LicenseConclusion` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `LicenseConclusion` table. All the data in the column will be lost.
  - You are about to drop the column `startLine` on the `LicenseConclusion` table. All the data in the column will be lost.
  - Made the column `userId` on table `LicenseConclusion` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "LicenseConclusion" DROP COLUMN "endLine",
DROP COLUMN "reason",
DROP COLUMN "score",
DROP COLUMN "startLine",
ALTER COLUMN "userId" SET NOT NULL;
