-- CreateTable
CREATE TABLE "PathExclusion" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pattern" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "comment" TEXT,
    "packageId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PathExclusion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PathExclusion_packageId_idx" ON "PathExclusion"("packageId");

-- CreateIndex
CREATE INDEX "PathExclusion_userId_idx" ON "PathExclusion"("userId");
