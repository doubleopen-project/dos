-- CreateTable
CREATE TABLE "Session" (
    "sid" TEXT NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,
    "sess" JSONB NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sid")
);
