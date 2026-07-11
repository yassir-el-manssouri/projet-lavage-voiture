-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" INTEGER NOT NULL,
    "agentId" INTEGER,
    "vehicle" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "price" INTEGER NOT NULL,
    "rating" INTEGER,
    "comment" TEXT,
    "photoBefore" TEXT,
    "photoAfter" TEXT,
    "paymentMethod" TEXT,
    "step" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Reservation" ("agentId", "clientId", "comment", "createdAt", "date", "id", "paymentMethod", "photoAfter", "photoBefore", "price", "rating", "service", "status", "time", "vehicle") SELECT "agentId", "clientId", "comment", "createdAt", "date", "id", "paymentMethod", "photoAfter", "photoBefore", "price", "rating", "service", "status", "time", "vehicle" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
