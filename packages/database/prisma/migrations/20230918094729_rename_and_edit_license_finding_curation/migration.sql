/*
  Warnings:

  - You are about to drop the `LicenseFindingCuration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "LicenseFindingCuration";

-- CreateTable
CREATE TABLE "LicenseConclusion" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "licenseExpressionSPDX" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "startLine" INTEGER NOT NULL,
    "endLine" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "fileSha256" TEXT NOT NULL,

    CONSTRAINT "LicenseConclusion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LicenseConclusion_fileSha256_idx" ON "LicenseConclusion"("fileSha256");
