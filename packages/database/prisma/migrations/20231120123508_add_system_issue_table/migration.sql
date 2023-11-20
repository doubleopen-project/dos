-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('CRITICAL', 'MODERATE', 'LOW', 'UNKNOWN');

-- CreateTable
CREATE TABLE "SystemIssue" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "severity" "Severity" NOT NULL DEFAULT 'UNKNOWN',
    "message" TEXT NOT NULL,
    "details" TEXT,
    "errorCode" TEXT,
    "info" JSONB,
    "errorType" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SystemIssue_pkey" PRIMARY KEY ("id")
);
