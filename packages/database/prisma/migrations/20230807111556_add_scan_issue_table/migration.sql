-- DropIndex
DROP INDEX "CopyrightFinding_sha256_idx";

-- DropIndex
DROP INDEX "FileTree_sha256_idx";

-- DropIndex
DROP INDEX "LicenseFinding_sha256_idx";

-- AlterTable
ALTER TABLE "CopyrightFinding" 
RENAME COLUMN "sha256" TO "fileSha256";

-- AlterTable
ALTER TABLE "FileTree"
RENAME COLUMN "sha256" TO "fileSha256";

-- AlterTable
ALTER TABLE "LicenseFinding" 
RENAME COLUMN "sha256" TO "fileSha256";

-- CreateTable
CREATE TABLE "ScanIssue" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "severity" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "scanner" TEXT NOT NULL,
    "scannerConfig" TEXT NOT NULL,
    "fileSha256" TEXT NOT NULL,

    CONSTRAINT "ScanIssue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScanIssue_fileSha256_idx" ON "ScanIssue"("fileSha256");

-- CreateIndex
CREATE INDEX "CopyrightFinding_fileSha256_idx" ON "CopyrightFinding"("fileSha256");

-- CreateIndex
CREATE INDEX "FileTree_fileSha256_idx" ON "FileTree"("fileSha256");

-- CreateIndex
CREATE INDEX "LicenseFinding_fileSha256_idx" ON "LicenseFinding"("fileSha256");
