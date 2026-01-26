-- CreateEnum
CREATE TYPE "ApiScope" AS ENUM ('SCAN_DATA', 'CLEARANCE_DATA');

-- CreateTable
CREATE TABLE
    "ApiClient" (
        "id" UUID NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        CONSTRAINT "ApiClient_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "ApiToken" (
        "id" UUID NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "tokenHash" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "apiClientId" UUID NOT NULL,
        CONSTRAINT "ApiToken_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "ApiTokenScope" (
        "apiTokenId" UUID NOT NULL,
        "scope" "ApiScope" NOT NULL,
        CONSTRAINT "ApiTokenScope_pkey" PRIMARY KEY ("apiTokenId", "scope")
    );

-- CreateTable
CREATE TABLE
    "ApiToken_ClearanceGroup" (
        "apiTokenId" UUID NOT NULL,
        "clearanceGroupId" INTEGER NOT NULL,
        "rank" INTEGER NOT NULL,
        CONSTRAINT "ApiToken_ClearanceGroup_pkey" PRIMARY KEY ("apiTokenId", "clearanceGroupId")
    );

-- CreateIndex
CREATE UNIQUE INDEX "ApiClient_name_key" ON "ApiClient" ("name");

-- CreateIndex
CREATE UNIQUE INDEX "ApiToken_tokenHash_key" ON "ApiToken" ("tokenHash");

-- CreateIndex
CREATE INDEX "ApiTokenScope_apiTokenId_idx" ON "ApiTokenScope" ("apiTokenId");

-- CreateIndex
CREATE INDEX "ApiToken_ClearanceGroup_apiTokenId_idx" ON "ApiToken_ClearanceGroup" ("apiTokenId");

-- CreateIndex
CREATE INDEX "ApiToken_ClearanceGroup_clearanceGroupId_idx" ON "ApiToken_ClearanceGroup" ("clearanceGroupId");
