/*
  Warnings:

  - You are about to drop the column `scannerJobId` on the `CopyrightFinding` table. All the data in the column will be lost.
  - You are about to drop the column `endLine` on the `LicenseFinding` table. All the data in the column will be lost.
  - You are about to drop the column `licenseExpression` on the `LicenseFinding` table. All the data in the column will be lost.
  - You are about to drop the column `scannerJobId` on the `LicenseFinding` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `LicenseFinding` table. All the data in the column will be lost.
  - You are about to drop the column `startLine` on the `LicenseFinding` table. All the data in the column will be lost.
  - Added the required column `scanner` to the `CopyrightFinding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scannerConfig` to the `CopyrightFinding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `licenseExpressionSPDX` to the `LicenseFinding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scannerConfig` to the `LicenseFinding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CopyrightFinding" DROP COLUMN "scannerJobId",
ADD COLUMN     "scanner" TEXT NOT NULL,
ADD COLUMN     "scannerConfig" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LicenseFinding" DROP COLUMN "endLine",
DROP COLUMN "licenseExpression",
DROP COLUMN "scannerJobId",
DROP COLUMN "score",
DROP COLUMN "startLine",
ADD COLUMN     "licenseExpressionSPDX" TEXT NOT NULL,
ADD COLUMN     "scannerConfig" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "LicenseFindingMatch" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startLine" INTEGER NOT NULL,
    "endLine" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "licenseFindingId" INTEGER NOT NULL,

    CONSTRAINT "LicenseFindingMatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LicenseFindingMatch_licenseFindingId_idx" ON "LicenseFindingMatch"("licenseFindingId");
