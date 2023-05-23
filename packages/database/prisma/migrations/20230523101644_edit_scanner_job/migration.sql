/*
  Warnings:

  - You are about to drop the column `status` on the `ScannerJob` table. All the data in the column will be lost.
  - You are about to drop the `ScannerJobPackage` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sourceHash]` on the table `Package` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sourceHash` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceUrl` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageName` to the `ScannerJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageRegistry` to the `ScannerJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageVersion` to the `ScannerJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scanJobId` to the `ScannerJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `ScannerJob` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "sourceHash" TEXT NOT NULL,
ADD COLUMN     "sourceUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ScannerJob" DROP COLUMN "status",
ADD COLUMN     "ortVersion" TEXT,
ADD COLUMN     "packageName" TEXT NOT NULL,
ADD COLUMN     "packageRegistry" TEXT NOT NULL,
ADD COLUMN     "packageVersion" TEXT NOT NULL,
ADD COLUMN     "scanJobId" TEXT NOT NULL,
ADD COLUMN     "scancodeVersion" TEXT,
ADD COLUMN     "state" TEXT NOT NULL;

-- DropTable
DROP TABLE "ScannerJobPackage";

-- CreateIndex
CREATE UNIQUE INDEX "Package_sourceHash_key" ON "Package"("sourceHash");
