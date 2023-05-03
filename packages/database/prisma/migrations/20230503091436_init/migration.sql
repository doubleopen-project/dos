-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "sha256" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileTree" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "path" TEXT NOT NULL,
    "packageId" INTEGER NOT NULL,
    "sha256" TEXT NOT NULL,

    CONSTRAINT "FileTree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LicenseFinding" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "scanner" TEXT NOT NULL,
    "licenseExpression" TEXT NOT NULL,
    "startLine" INTEGER NOT NULL,
    "endLine" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "sha256" TEXT NOT NULL,

    CONSTRAINT "LicenseFinding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LicenseFindingCuration" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "licenseExpression" TEXT NOT NULL,
    "licenseFindingId" INTEGER NOT NULL,

    CONSTRAINT "LicenseFindingCuration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CopyrightFinding" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startLine" INTEGER NOT NULL,
    "endLine" INTEGER NOT NULL,
    "copyright" TEXT NOT NULL,
    "sha256" TEXT NOT NULL,

    CONSTRAINT "CopyrightFinding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CopyrightFindingCuration" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "copyright" TEXT NOT NULL,
    "copyrightFindingId" INTEGER NOT NULL,

    CONSTRAINT "CopyrightFindingCuration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScannerJob" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "ScannerJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScannerJobPackage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "packageId" INTEGER NOT NULL,
    "scannerJobId" TEXT NOT NULL,

    CONSTRAINT "ScannerJobPackage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_sha256_key" ON "File"("sha256");

-- CreateIndex
CREATE INDEX "FileTree_packageId_idx" ON "FileTree"("packageId");

-- CreateIndex
CREATE INDEX "FileTree_sha256_idx" ON "FileTree"("sha256");

-- CreateIndex
CREATE INDEX "LicenseFinding_sha256_idx" ON "LicenseFinding"("sha256");

-- CreateIndex
CREATE INDEX "LicenseFindingCuration_licenseFindingId_idx" ON "LicenseFindingCuration"("licenseFindingId");

-- CreateIndex
CREATE INDEX "CopyrightFinding_sha256_idx" ON "CopyrightFinding"("sha256");

-- CreateIndex
CREATE INDEX "CopyrightFindingCuration_copyrightFindingId_idx" ON "CopyrightFindingCuration"("copyrightFindingId");

-- CreateIndex
CREATE INDEX "ScannerJobPackage_packageId_idx" ON "ScannerJobPackage"("packageId");

-- CreateIndex
CREATE INDEX "ScannerJobPackage_scannerJobId_idx" ON "ScannerJobPackage"("scannerJobId");
