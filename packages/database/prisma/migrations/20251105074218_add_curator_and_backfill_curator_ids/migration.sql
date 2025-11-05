-- Ensure pgcrypto extension is enabled for gen_random_uuid function
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE "BulkConclusion"
ADD COLUMN "curatorId" UUID;

ALTER TABLE "LicenseConclusion"
ADD COLUMN "curatorId" UUID;

ALTER TABLE "PathExclusion"
ADD COLUMN "curatorId" UUID;

CREATE TABLE
    "Curator" (
        "id" UUID NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "username" TEXT NOT NULL,
        "remoteId" UUID NOT NULL,
        CONSTRAINT "Curator_pkey" PRIMARY KEY ("id")
    );

CREATE UNIQUE INDEX "Curator_remoteId_key" ON "Curator" ("remoteId");

CREATE INDEX "BulkConclusion_curatorId_idx" ON "BulkConclusion" ("curatorId");

CREATE INDEX "LicenseConclusion_curatorId_idx" ON "LicenseConclusion" ("curatorId");

CREATE INDEX "PathExclusion_curatorId_idx" ON "PathExclusion" ("curatorId");

/*
 * Create Curator rows for existing curators based on unique userIds in LicenseConclusion, 
 * BulkConclusion, and PathExclusion tables.
 */
INSERT INTO
    "Curator" ("id", "updatedAt", "username", "remoteId")
SELECT
    gen_random_uuid () AS "id",
    CURRENT_TIMESTAMP AS "updatedAt",
    'unknown' AS "username",
    u."userId" AS "remoteId"
FROM
    (
        SELECT DISTINCT
            "userId"
        FROM
            "LicenseConclusion"
        UNION
        SELECT DISTINCT
            "userId"
        FROM
            "BulkConclusion"
        UNION
        SELECT DISTINCT
            "userId"
        FROM
            "PathExclusion"
    ) u ON CONFLICT ("remoteId") DO NOTHING;

-- Backfill curatorId in LicenseConclusion, BulkConclusion, and PathExclusion tables
UPDATE "LicenseConclusion" lc
SET
    "curatorId" = c."id"
FROM
    "Curator" c
WHERE
    lc."userId" = c."remoteId";

UPDATE "BulkConclusion" bc
SET
    "curatorId" = c."id"
FROM
    "Curator" c
WHERE
    bc."userId" = c."remoteId";

UPDATE "PathExclusion" pe
SET
    "curatorId" = c."id"
FROM
    "Curator" c
WHERE
    pe."userId" = c."remoteId";
