-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GeneralKnowledgeQuestion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionTitle" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_GeneralKnowledgeQuestion" ("content", "id", "questionTitle", "type") SELECT "content", "id", "questionTitle", "type" FROM "GeneralKnowledgeQuestion";
DROP TABLE "GeneralKnowledgeQuestion";
ALTER TABLE "new_GeneralKnowledgeQuestion" RENAME TO "GeneralKnowledgeQuestion";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
