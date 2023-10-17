/*
  Warnings:

  - A unique constraint covering the columns `[purl]` on the table `Package` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Package" 
DROP COLUMN     "purl",
ADD COLUMN     "namespace" TEXT,
ADD COLUMN     "qualifiers" TEXT,
ADD COLUMN     "subpath" TEXT,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN  "purl" TEXT NOT NULL
GENERATED ALWAYS AS (
  'pkg:' 
  || "type" 
  || (CASE 
        WHEN "namespace" IS NOT NULL THEN '/' || Replace("namespace", '@', '%40')
        ELSE ''
      END) 
  || '/' 
  || "name" 
  || '@' 
  || "version"
  || (CASE 
        WHEN "qualifiers" IS NOT NULL THEN '?' || "qualifiers" 
        ELSE '' 
      END) 
  || (CASE 
        WHEN "subpath" IS NOT NULL THEN '#' || "subpath" 
        ELSE '' 
      END)
) STORED;

-- CreateIndex
CREATE UNIQUE INDEX "Package_purl_key" ON "Package"("purl");
