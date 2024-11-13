-- AlterTable
ALTER TABLE "ScanIssue" ADD COLUMN     "timeout" INTEGER,
ADD COLUMN     "timeoutIssue" BOOLEAN NOT NULL DEFAULT false;

-- Update existing rows
WITH "matches" AS (
  SELECT
    "id",
    true AS "timeoutIssue",
    CAST((REGEXP_MATCHES("message", 'ERROR: Processing interrupted: timeout after (\d+) seconds\.'))[1] AS INTEGER) AS "timeout"
  FROM
    "ScanIssue"
  WHERE
    "message" ~ 'ERROR: Processing interrupted: timeout after \d+ seconds\.'
)
UPDATE "ScanIssue"
SET
  "timeoutIssue" = "matches"."timeoutIssue",
  "timeout" = "matches"."timeout"
FROM
  "matches"
WHERE
  "ScanIssue"."id" = "matches"."id";