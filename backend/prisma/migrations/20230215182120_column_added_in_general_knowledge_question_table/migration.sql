/*
  Warnings:

  - Added the required column `acceptableAnswers` to the `GeneralKnowledgeQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GeneralKnowledgeQuestion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionTitle" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "acceptableAnswers" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_GeneralKnowledgeQuestion" ("approved", "content", "id", "questionTitle", "type") SELECT "approved", "content", "id", "questionTitle", "type" FROM "GeneralKnowledgeQuestion";
DROP TABLE "GeneralKnowledgeQuestion";
ALTER TABLE "new_GeneralKnowledgeQuestion" RENAME TO "GeneralKnowledgeQuestion";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
