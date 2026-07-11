-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Service" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "features" TEXT,
    "price" INTEGER NOT NULL,
    "duration" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '🚿',
    "color" TEXT NOT NULL DEFAULT 'from-blue-400 to-blue-600',
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Service" ("createdAt", "description", "duration", "icon", "id", "isActive", "name", "price") SELECT "createdAt", "description", "duration", "icon", "id", "isActive", "name", "price" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
