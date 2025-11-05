-- Make curatorId NOT NULL in BulkConclusion, LicenseConclusion, and PathExclusion tables
ALTER TABLE "BulkConclusion"
ALTER COLUMN "curatorId"
SET
  NOT NULL;

ALTER TABLE "LicenseConclusion"
ALTER COLUMN "curatorId"
SET
  NOT NULL;

ALTER TABLE "PathExclusion"
ALTER COLUMN "curatorId"
SET
  NOT NULL;
