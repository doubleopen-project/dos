-- CreateTable
CREATE TABLE
    "ClearanceGroup" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "name" TEXT NOT NULL,
        CONSTRAINT "ClearanceGroup_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "ClearanceGroup_LicenseConclusion" (
        "clearanceGroupId" INTEGER NOT NULL,
        "licenseConclusionId" INTEGER NOT NULL,
        CONSTRAINT "ClearanceGroup_LicenseConclusion_pkey" PRIMARY KEY ("clearanceGroupId", "licenseConclusionId")
    );

-- CreateTable
CREATE TABLE
    "ClearanceGroup_BulkConclusion" (
        "clearanceGroupId" INTEGER NOT NULL,
        "bulkConclusionId" INTEGER NOT NULL,
        CONSTRAINT "ClearanceGroup_BulkConclusion_pkey" PRIMARY KEY ("clearanceGroupId", "bulkConclusionId")
    );

-- CreateTable
CREATE TABLE
    "ClearanceGroup_PathExclusion" (
        "clearanceGroupId" INTEGER NOT NULL,
        "pathExclusionId" INTEGER NOT NULL,
        CONSTRAINT "ClearanceGroup_PathExclusion_pkey" PRIMARY KEY ("clearanceGroupId", "pathExclusionId")
    );

-- CreateTable
CREATE TABLE
    "ClearanceGroup_Curator" (
        "clearanceGroupId" INTEGER NOT NULL,
        "curatorId" UUID NOT NULL,
        CONSTRAINT "ClearanceGroup_Curator_pkey" PRIMARY KEY ("clearanceGroupId", "curatorId")
    );

-- CreateIndex
CREATE UNIQUE INDEX "ClearanceGroup_name_key" ON "ClearanceGroup" ("name");

-- CreateIndex
CREATE INDEX "ClearanceGroup_LicenseConclusion_clearanceGroupId_idx" ON "ClearanceGroup_LicenseConclusion" ("clearanceGroupId");

-- CreateIndex
CREATE INDEX "ClearanceGroup_LicenseConclusion_licenseConclusionId_idx" ON "ClearanceGroup_LicenseConclusion" ("licenseConclusionId");

-- CreateIndex
CREATE INDEX "ClearanceGroup_BulkConclusion_clearanceGroupId_idx" ON "ClearanceGroup_BulkConclusion" ("clearanceGroupId");

-- CreateIndex
CREATE INDEX "ClearanceGroup_BulkConclusion_bulkConclusionId_idx" ON "ClearanceGroup_BulkConclusion" ("bulkConclusionId");

-- CreateIndex
CREATE INDEX "ClearanceGroup_PathExclusion_clearanceGroupId_idx" ON "ClearanceGroup_PathExclusion" ("clearanceGroupId");

-- CreateIndex
CREATE INDEX "ClearanceGroup_PathExclusion_pathExclusionId_idx" ON "ClearanceGroup_PathExclusion" ("pathExclusionId");

-- CreateIndex
CREATE INDEX "ClearanceGroup_Curator_clearanceGroupId_idx" ON "ClearanceGroup_Curator" ("clearanceGroupId");

-- CreateIndex
CREATE INDEX "ClearanceGroup_Curator_curatorId_idx" ON "ClearanceGroup_Curator" ("curatorId");
