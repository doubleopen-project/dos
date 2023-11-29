-- AlterTable
ALTER TABLE "ScannerJob" ADD COLUMN     "parentId" TEXT;

-- CreateIndex
CREATE INDEX "ScannerJob_parentId_idx" ON "ScannerJob"("parentId");
