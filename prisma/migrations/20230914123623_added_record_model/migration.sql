-- CreateTable
CREATE TABLE "Record" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "amount" BIGINT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,
    "label" TEXT
);
