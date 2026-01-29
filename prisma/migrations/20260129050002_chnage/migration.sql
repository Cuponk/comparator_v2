-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "full_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "position_category" TEXT NOT NULL,
    "batting_hand" TEXT NOT NULL,
    "throwing_hand" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "birth_date" TEXT NOT NULL,
    "birth_city" TEXT NOT NULL,
    "birth_state" TEXT DEFAULT '',
    "birth_country" TEXT NOT NULL,
    "debut_date" TEXT NOT NULL,
    "final_game_date" TEXT,
    "active" BOOLEAN NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_player" ("active", "batting_hand", "birth_city", "birth_country", "birth_date", "birth_state", "created_at", "debut_date", "final_game_date", "first_name", "full_name", "height", "id", "last_name", "number", "position", "position_category", "throwing_hand", "updated_at", "weight") SELECT "active", "batting_hand", "birth_city", "birth_country", "birth_date", "birth_state", "created_at", "debut_date", "final_game_date", "first_name", "full_name", "height", "id", "last_name", "number", "position", "position_category", "throwing_hand", "updated_at", "weight" FROM "player";
DROP TABLE "player";
ALTER TABLE "new_player" RENAME TO "player";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
