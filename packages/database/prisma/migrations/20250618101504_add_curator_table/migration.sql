-- CreateTable
CREATE TABLE
    "Curator" (
        "id" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "displayName" TEXT NOT NULL,
        "enabled" BOOLEAN NOT NULL DEFAULT true,
        "remoteId" TEXT,
        CONSTRAINT "Curator_pkey" PRIMARY KEY ("id")
    );

-- CreateIndex
CREATE UNIQUE INDEX "Curator_remoteId_key" ON "Curator" ("remoteId");