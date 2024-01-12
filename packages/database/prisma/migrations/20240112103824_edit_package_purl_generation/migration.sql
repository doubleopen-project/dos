/*
  Warnings:

  - A unique constraint covering the columns `[purl]` on the table `Package` will be added. If there are existing duplicate values, this will fail.

*/

ALTER TABLE "Package"
DROP COLUMN "purl",
ADD COLUMN "purl" TEXT NOT NULL GENERATED ALWAYS AS (
  'pkg:' 
  || "type" 
  || (CASE 
        WHEN "namespace" IS NOT NULL THEN '/' ||
        Replace(
          --Replace(
            Replace(
              Replace(
                Replace(
                  Replace(
                    Replace(
                      Replace(
                        Replace(
                          Replace(
                            Replace(
                              Replace(
                                Replace(
                                  Replace(
                                    Replace(
                                      Replace(
                                        Replace(
                                          Replace(
                                            Replace(
                                              Replace(
                                                Replace(
                                                  --Replace(
                                                    Replace(
                                                      Replace(
                                                        Replace(
                                                          Replace(
                                                            Replace("namespace", '%', '%25')
                                                          , '&', '%26')
                                                        , '$', '%24')
                                                      , '+', '%2B')
                                                    , ',', '%2C')
                                                  --, ':', '%3A')
                                                , ';', '%3B')
                                              , '=', '%3D')
                                            , '?', '%3F')
                                          , '@', '%40')
                                        , '#', '%23')
                                      , '<', '%3C')
                                    , '>', '%3E')
                                  , '[', '%5B')
                                , ']', '%5D')
                              , '{', '%7B')
                            , '}', '%7D')
                          , '|', '%7C')
                        , '^', '%5E')
                      , ' ', '%20')
                    , '~', '%7E')
                  , '`', '%60')
                , '*', '%2A')
              , '(', '%28')
            , ')', '%29')
          --, '/', '%2F')
        , '\', '%5C')
        ELSE ''
      END) 
  || '/' 
  || Replace(
          Replace(
            Replace(
              Replace(
                Replace(
                  Replace(
                    Replace(
                      Replace(
                        Replace(
                          Replace(
                            Replace(
                              Replace(
                                Replace(
                                  Replace(
                                    Replace(
                                      Replace(
                                        Replace(
                                          Replace(
                                            Replace(
                                              Replace(
                                                Replace(
                                                  --Replace(
                                                    Replace(
                                                      Replace(
                                                        Replace(
                                                          Replace(
                                                            Replace("name", '%', '%25')
                                                          , '&', '%26')
                                                        , '$', '%24')
                                                      , '+', '%2B')
                                                    , ',', '%2C')
                                                  --, ':', '%3A')
                                                , ';', '%3B')
                                              , '=', '%3D')
                                            , '?', '%3F')
                                          , '@', '%40')
                                        , '#', '%23')
                                      , '<', '%3C')
                                    , '>', '%3E')
                                  , '[', '%5B')
                                , ']', '%5D')
                              , '{', '%7B')
                            , '}', '%7D')
                          , '|', '%7C')
                        , '^', '%5E')
                      , ' ', '%20')
                    , '~', '%7E')
                  , '`', '%60')
                , '*', '%2A')
              , '(', '%28')
            , ')', '%29')
          , '/', '%2F')
        , '\', '%5C') 
  || (CASE 
        WHEN "version" IS NOT NULL THEN '@' ||
        Replace(
          Replace(
            Replace(
              Replace(
                Replace(
                  Replace(
                    Replace(
                      Replace(
                        Replace(
                          Replace(
                            Replace(
                              Replace(
                                Replace(
                                  Replace(
                                    Replace(
                                      Replace(
                                        Replace(
                                          Replace(
                                            Replace(
                                              Replace(
                                                Replace(
                                                  --Replace(
                                                    Replace(
                                                      Replace(
                                                        Replace(
                                                          Replace(
                                                            Replace("version", '%', '%25')
                                                          , '&', '%26')
                                                        , '$', '%24')
                                                      , '+', '%2B')
                                                    , ',', '%2C')
                                                  --, ':', '%3A')
                                                , ';', '%3B')
                                              , '=', '%3D')
                                            , '?', '%3F')
                                          , '@', '%40')
                                        , '#', '%23')
                                      , '<', '%3C')
                                    , '>', '%3E')
                                  , '[', '%5B')
                                , ']', '%5D')
                              , '{', '%7B')
                            , '}', '%7D')
                          , '|', '%7C')
                        , '^', '%5E')
                      , ' ', '%20')
                    , '~', '%7E')
                  , '`', '%60')
                , '*', '%2A')
              , '(', '%28')
            , ')', '%29')
          , '/', '%2F')
        , '\', '%5C')
        ELSE '' 
      END) 
  || (CASE 
        WHEN "qualifiers" IS NOT NULL THEN '?' ||
            "qualifiers"
        ELSE '' 
      END) 
  || (CASE 
        WHEN "subpath" IS NOT NULL THEN '#' || 
        Replace(
          --Replace(
            Replace(
              Replace(
                Replace(
                  Replace(
                    Replace(
                      Replace(
                        Replace(
                          Replace(
                            Replace(
                              Replace(
                                Replace(
                                  Replace(
                                    Replace(
                                      Replace(
                                        Replace(
                                          Replace(
                                            Replace(
                                              Replace(
                                                Replace(
                                                  --Replace(
                                                    Replace(
                                                      Replace(
                                                        Replace(
                                                          Replace(
                                                            Replace("subpath", '%', '%25')
                                                          , '&', '%26')
                                                        , '$', '%24')
                                                      , '+', '%2B')
                                                    , ',', '%2C')
                                                  --, ':', '%3A')
                                                , ';', '%3B')
                                              , '=', '%3D')
                                            , '?', '%3F')
                                          , '@', '%40')
                                        , '#', '%23')
                                      , '<', '%3C')
                                    , '>', '%3E')
                                  , '[', '%5B')
                                , ']', '%5D')
                              , '{', '%7B')
                            , '}', '%7D')
                          , '|', '%7C')
                        , '^', '%5E')
                      , ' ', '%20')
                    , '~', '%7E')
                  , '`', '%60')
                , '*', '%2A')
              , '(', '%28')
            , ')', '%29')
          --, '/', '%2F')
        , '\', '%5C') 
        ELSE '' 
      END)
) STORED;

-- CreateIndex
CREATE UNIQUE INDEX "Package_purl_key" ON "Package"("purl");

