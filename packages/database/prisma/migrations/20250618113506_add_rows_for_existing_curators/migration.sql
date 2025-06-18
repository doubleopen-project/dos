-- This is an empty migration.
INSERT INTO
    "Curator" ("remoteId")
SELECT DISTINCT
    "userId"
FROM
    (
        SELECT
            "userId"
        FROM
            "LicenseConclusion"
        UNION
        SELECT
            "userId"
        FROM
            "BulkConclusion"
        UNION
        SELECT
            "userId"
        FROM
            "PathExclusion"
    ) AS "all_user_ids" ON CONFLICT ("remoteId") DO NOTHING;