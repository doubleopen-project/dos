-- CreateEnum
CREATE TYPE "Role" AS ENUM ('WRITER', 'READER');

-- AlterTable
ALTER TABLE "ClearanceGroup_Curator"
ADD COLUMN "role" "Role" NOT NULL DEFAULT 'READER';
