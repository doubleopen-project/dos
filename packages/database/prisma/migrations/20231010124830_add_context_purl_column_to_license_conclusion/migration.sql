/*
  Warnings:

  - Added the required column `contextPurl` to the `LicenseConclusion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LicenseConclusion" ADD COLUMN     "contextPurl" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "LicenseConclusion_userId_idx" ON "LicenseConclusion"("userId");
