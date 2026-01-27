-- CreateTable
CREATE TABLE "player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "full_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "position_category" TEXT NOT NULL,
    "batting_hand" TEXT NOT NULL,
    "throwing_hand" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "height_inches" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "birth_date" DATETIME NOT NULL,
    "birth_city" TEXT NOT NULL,
    "birth_state" TEXT NOT NULL,
    "birth_country" TEXT NOT NULL,
    "debut_date" DATETIME NOT NULL,
    "final_game_date" DATETIME,
    "active" BOOLEAN NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "league" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "awards" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player_id" INTEGER NOT NULL,
    "award_type" TEXT NOT NULL,
    "season" INTEGER NOT NULL,
    "league" TEXT,
    "team_id" INTEGER,
    "team_name" TEXT,
    CONSTRAINT "awards_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "batting_stats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player_id" INTEGER NOT NULL,
    "stat_type" TEXT DEFAULT 'CAREER',
    "season" INTEGER,
    "team_id" INTEGER,
    "team_name" TEXT,
    "games" INTEGER NOT NULL,
    "plate_appearances" INTEGER NOT NULL,
    "at_bats" INTEGER NOT NULL,
    "runs" INTEGER NOT NULL,
    "hits" INTEGER NOT NULL,
    "doubles" INTEGER NOT NULL,
    "triples" INTEGER NOT NULL,
    "home_runs" INTEGER NOT NULL,
    "rbi" INTEGER NOT NULL,
    "stolen_bases" INTEGER NOT NULL,
    "caught_stealing" INTEGER NOT NULL,
    "walks" INTEGER NOT NULL,
    "strikeouts" INTEGER NOT NULL,
    "hit_by_pitch" INTEGER NOT NULL,
    "sacrifice_flies" INTEGER NOT NULL,
    "sacrifice_bunts" INTEGER NOT NULL,
    "ground_into_dp" INTEGER NOT NULL,
    "batting_average" REAL NOT NULL,
    "on_base_percentage" REAL NOT NULL,
    "slugging_percentage" REAL NOT NULL,
    "ops" REAL NOT NULL,
    "war" REAL NOT NULL,
    "wpa" REAL NOT NULL,
    "woba" REAL NOT NULL,
    "wrc_plus" INTEGER NOT NULL,
    "iso" REAL NOT NULL,
    "babip" REAL NOT NULL,
    CONSTRAINT "batting_stats_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pitching_stats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player_id" INTEGER NOT NULL,
    "stat_type" TEXT DEFAULT 'CAREER',
    "season" INTEGER,
    "team_id" INTEGER,
    "team_name" TEXT,
    "wins" INTEGER NOT NULL,
    "losses" INTEGER NOT NULL,
    "era" REAL NOT NULL,
    "games" INTEGER NOT NULL,
    "games_started" INTEGER NOT NULL,
    "games_finished" INTEGER NOT NULL,
    "complete_games" INTEGER NOT NULL,
    "shutouts" INTEGER NOT NULL,
    "saves" INTEGER NOT NULL,
    "save_opportunities" INTEGER NOT NULL,
    "holds" INTEGER NOT NULL,
    "innings_pitched" REAL NOT NULL,
    "hits" INTEGER NOT NULL,
    "runs" INTEGER NOT NULL,
    "earned_runs" INTEGER NOT NULL,
    "home_runs" INTEGER NOT NULL,
    "walks" INTEGER NOT NULL,
    "intentional_walks" INTEGER NOT NULL,
    "strikeouts" INTEGER NOT NULL,
    "hit_batters" INTEGER NOT NULL,
    "wild_pitches" INTEGER NOT NULL,
    "balks" INTEGER NOT NULL,
    "whip" REAL NOT NULL,
    "batting_avg_against" REAL NOT NULL,
    "war" REAL NOT NULL,
    "fip" REAL NOT NULL,
    "xfip" REAL NOT NULL,
    "era_plus" INTEGER NOT NULL,
    "siera" REAL NOT NULL,
    "k_percentage" REAL NOT NULL,
    "bb_percentage" REAL NOT NULL,
    "k_bb_ratio" REAL NOT NULL,
    "hr_per_9" REAL NOT NULL,
    "k_per_9" REAL NOT NULL,
    "bb_per_9" REAL NOT NULL,
    "gb_percentage" REAL NOT NULL,
    "fb_percentage" REAL NOT NULL,
    CONSTRAINT "pitching_stats_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "batting_game_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player_id" INTEGER NOT NULL,
    "season" INTEGER NOT NULL,
    "game_id" TEXT NOT NULL,
    "game_date" DATETIME NOT NULL,
    "opponent_team_id" INTEGER NOT NULL,
    "opponent_team_name" TEXT NOT NULL,
    "is_home" BOOLEAN NOT NULL,
    "game_result" TEXT NOT NULL,
    "batting_order" INTEGER NOT NULL,
    "position_played" TEXT NOT NULL,
    "at_bats" INTEGER NOT NULL,
    "runs" INTEGER NOT NULL,
    "hits" INTEGER NOT NULL,
    "doubles" INTEGER NOT NULL,
    "triples" INTEGER NOT NULL,
    "home_runs" INTEGER NOT NULL,
    "rbi" INTEGER NOT NULL,
    "walks" INTEGER NOT NULL,
    "strikeouts" INTEGER NOT NULL,
    "stolen_bases" INTEGER NOT NULL,
    "caught_stealing" INTEGER NOT NULL,
    "hit_by_pitch" INTEGER NOT NULL,
    "sacrifice_flies" INTEGER NOT NULL,
    "avg_season_to_date" REAL NOT NULL,
    "ops_season_to_date" REAL NOT NULL,
    CONSTRAINT "batting_game_logs_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pitching_game_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player_id" INTEGER NOT NULL,
    "season" INTEGER NOT NULL,
    "game_id" TEXT NOT NULL,
    "game_date" DATETIME NOT NULL,
    "opponent_team_id" INTEGER NOT NULL,
    "opponent_team_name" TEXT NOT NULL,
    "is_home" BOOLEAN NOT NULL,
    "game_result" TEXT NOT NULL,
    "decision" TEXT,
    "is_start" BOOLEAN NOT NULL,
    "innings_pitched" REAL NOT NULL,
    "hits" INTEGER NOT NULL,
    "runs" INTEGER NOT NULL,
    "earned_runs" INTEGER NOT NULL,
    "walks" INTEGER NOT NULL,
    "strikeouts" INTEGER NOT NULL,
    "home_runs" INTEGER NOT NULL,
    "pitches_thrown" INTEGER NOT NULL,
    "strikes" INTEGER NOT NULL,
    "balls" INTEGER NOT NULL,
    "era_season_to_date" REAL NOT NULL,
    CONSTRAINT "pitching_game_logs_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "awards_player_id_idx" ON "awards"("player_id");

-- CreateIndex
CREATE INDEX "batting_stats_player_id_season_team_id_idx" ON "batting_stats"("player_id", "season", "team_id");

-- CreateIndex
CREATE INDEX "pitching_stats_player_id_season_team_id_idx" ON "pitching_stats"("player_id", "season", "team_id");

-- CreateIndex
CREATE INDEX "batting_game_logs_player_id_season_game_date_idx" ON "batting_game_logs"("player_id", "season", "game_date");

-- CreateIndex
CREATE INDEX "pitching_game_logs_player_id_season_game_date_idx" ON "pitching_game_logs"("player_id", "season", "game_date");
