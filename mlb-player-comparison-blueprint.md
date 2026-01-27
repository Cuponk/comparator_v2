# MLB Player Comparison Web App — Comprehensive Blueprint

## Overview

A Next.js full-stack web app that allows users to compare any 2 MLB players using both basic and advanced statistics. Users can view career totals, filter by individual seasons, and drill down into individual game logs to visualize performance trends over time.

**Key Capabilities:**
- Search and select any two MLB players (active or historical)
- Compare career stats or individual seasons side-by-side
- View detailed game logs with trend visualizations
- Support for batters, pitchers, and two-way players

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 14+ (App Router) | Full-stack React framework with API routes |
| Language | TypeScript | Type safety throughout |
| Database | PostgreSQL (hosted) | Primary data store for players, stats, game logs |
| ORM | Prisma | Database schema management and queries |
| Styling | Tailwind CSS | Utility-first CSS |
| Charts | Recharts | Line charts for game log trends |
| External API | MLB Stats API | Source of truth for all baseball data |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                       │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────────────┐    │
│  │  Home    │  │   Compare    │  │    Player Detail       │    │
│  │  (Search)│  │   (Side-by-  │  │    (Stats + Game Logs) │    │
│  │          │  │    side)     │  │                        │    │
│  └──────────┘  └──────────────┘  └────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API ROUTES (Next.js)                        │
│  /api/players/search    /api/players/[id]/stats                 │
│  /api/players/[id]      /api/players/[id]/gamelogs              │
│  /api/players/compare   /api/players/[id]/awards                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                │
│  ┌─────────────────────┐      ┌─────────────────────────────┐  │
│  │   PostgreSQL DB     │◄────►│   MLB Stats API (fallback)  │  │
│  │   (primary source)  │      │   (live queries if needed)  │  │
│  └─────────────────────┘      └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    INGESTION SCRIPTS                            │
│  Scheduled jobs to sync players, stats, and game logs           │
│  from MLB Stats API into PostgreSQL                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### players

Primary table storing all MLB player biographical information.

| Column | Type | Notes |
|--------|------|-------|
| `id` | INTEGER, PK | MLB player ID (from API) |
| `full_name` | STRING | |
| `first_name` | STRING | |
| `last_name` | STRING | |
| `position` | STRING | Primary position code (e.g., "SS", "P", "OF") |
| `position_category` | STRING | 'Batter', 'Pitcher', or 'Two-Way' |
| `batting_hand` | STRING | 'R', 'L', 'S' (switch) |
| `throwing_hand` | STRING | 'R', 'L' |
| `height` | STRING | Display format, e.g., "6'2\"" |
| `height_inches` | INTEGER | Height in inches for sorting/filtering |
| `weight` | INTEGER | Weight in pounds |
| `birth_date` | DATE | |
| `birth_city` | STRING | |
| `birth_state` | STRING | |
| `birth_country` | STRING | |
| `debut_date` | DATE | MLB debut |
| `final_game_date` | DATE, nullable | Last game played (null if active) |
| `active` | BOOLEAN | Currently active player |
| `image_url` | STRING, nullable | Headshot URL |
| `created_at` | TIMESTAMP | Record creation |
| `updated_at` | TIMESTAMP | Last update |

**Indexes:** `full_name` (for search), `active`, `position_category`

---

### batting_stats

Season and career batting statistics for each player.

| Column | Type | Notes |
|--------|------|-------|
| `id` | INTEGER, PK | Auto-generated |
| `player_id` | INTEGER, FK | References players.id |
| `season` | INTEGER, nullable | Year (null for career totals) |
| `is_career` | BOOLEAN | True if this row is career totals |
| `team_id` | INTEGER, nullable | Team during this season |
| `team_name` | STRING, nullable | Team name for display |

**Basic Stats:**

| Column | Type | Description |
|--------|------|-------------|
| `games` | INTEGER | Games played (G) |
| `plate_appearances` | INTEGER | Plate appearances (PA) |
| `at_bats` | INTEGER | At bats (AB) |
| `runs` | INTEGER | Runs scored (R) |
| `hits` | INTEGER | Hits (H) |
| `doubles` | INTEGER | Doubles (2B) |
| `triples` | INTEGER | Triples (3B) |
| `home_runs` | INTEGER | Home runs (HR) |
| `rbi` | INTEGER | Runs batted in (RBI) |
| `stolen_bases` | INTEGER | Stolen bases (SB) |
| `caught_stealing` | INTEGER | Caught stealing (CS) |
| `walks` | INTEGER | Walks (BB) |
| `strikeouts` | INTEGER | Strikeouts (SO) |
| `hit_by_pitch` | INTEGER | Hit by pitch (HBP) |
| `sacrifice_flies` | INTEGER | Sacrifice flies (SF) |
| `sacrifice_bunts` | INTEGER | Sacrifice bunts (SAC) |
| `ground_into_dp` | INTEGER | Grounded into double play (GIDP) |
| `batting_average` | DECIMAL(4,3) | Batting average (AVG) |
| `on_base_percentage` | DECIMAL(4,3) | On-base percentage (OBP) |
| `slugging_percentage` | DECIMAL(4,3) | Slugging percentage (SLG) |
| `ops` | DECIMAL(4,3) | On-base plus slugging (OPS) |

**Advanced Stats:**

| Column | Type | Description |
|--------|------|-------------|
| `war` | DECIMAL(3,1) | Wins Above Replacement |
| `wpa` | DECIMAL(4,2) | Win Probability Added |
| `woba` | DECIMAL(4,3) | Weighted On-Base Average |
| `wrc_plus` | INTEGER | Weighted Runs Created Plus (100 = league avg) |
| `iso` | DECIMAL(4,3) | Isolated Power (SLG - AVG) |
| `babip` | DECIMAL(4,3) | Batting Avg on Balls In Play |
| `exit_velocity` | DECIMAL(4,1) | Average exit velocity (mph) |
| `launch_angle` | DECIMAL(4,1) | Average launch angle (degrees) |
| `barrel_percentage` | DECIMAL(4,1) | Barrel rate (%) |
| `hard_hit_percentage` | DECIMAL(4,1) | Hard hit rate (%) |

**Unique constraint:** `(player_id, season, team_id)` — one row per player per team per season

---

### pitching_stats

Season and career pitching statistics for each player.

| Column | Type | Notes |
|--------|------|-------|
| `id` | INTEGER, PK | Auto-generated |
| `player_id` | INTEGER, FK | References players.id |
| `season` | INTEGER, nullable | Year (null for career totals) |
| `is_career` | BOOLEAN | True if this row is career totals |
| `team_id` | INTEGER, nullable | Team during this season |
| `team_name` | STRING, nullable | Team name for display |

**Basic Stats:**

| Column | Type | Description |
|--------|------|-------------|
| `wins` | INTEGER | Wins (W) |
| `losses` | INTEGER | Losses (L) |
| `era` | DECIMAL(4,2) | Earned Run Average |
| `games` | INTEGER | Games pitched (G) |
| `games_started` | INTEGER | Games started (GS) |
| `games_finished` | INTEGER | Games finished (GF) |
| `complete_games` | INTEGER | Complete games (CG) |
| `shutouts` | INTEGER | Shutouts (SHO) |
| `saves` | INTEGER | Saves (SV) |
| `save_opportunities` | INTEGER | Save opportunities (SVO) |
| `holds` | INTEGER | Holds (HLD) |
| `innings_pitched` | DECIMAL(5,1) | Innings pitched (IP) |
| `hits` | INTEGER | Hits allowed (H) |
| `runs` | INTEGER | Runs allowed (R) |
| `earned_runs` | INTEGER | Earned runs (ER) |
| `home_runs` | INTEGER | Home runs allowed (HR) |
| `walks` | INTEGER | Walks (BB) |
| `intentional_walks` | INTEGER | Intentional walks (IBB) |
| `strikeouts` | INTEGER | Strikeouts (K) |
| `hit_batters` | INTEGER | Hit batters (HB) |
| `wild_pitches` | INTEGER | Wild pitches (WP) |
| `balks` | INTEGER | Balks (BK) |
| `whip` | DECIMAL(4,2) | Walks + Hits per IP |
| `batting_avg_against` | DECIMAL(4,3) | Opponent batting average |

**Advanced Stats:**

| Column | Type | Description |
|--------|------|-------------|
| `war` | DECIMAL(3,1) | Wins Above Replacement |
| `fip` | DECIMAL(4,2) | Fielding Independent Pitching |
| `xfip` | DECIMAL(4,2) | Expected FIP |
| `era_plus` | INTEGER | ERA+ (100 = league average) |
| `siera` | DECIMAL(4,2) | Skill-Interactive ERA |
| `k_percentage` | DECIMAL(4,1) | Strikeout rate (K%) |
| `bb_percentage` | DECIMAL(4,1) | Walk rate (BB%) |
| `k_bb_ratio` | DECIMAL(4,2) | K/BB ratio |
| `hr_per_9` | DECIMAL(4,2) | Home runs per 9 innings |
| `k_per_9` | DECIMAL(4,2) | Strikeouts per 9 innings |
| `bb_per_9` | DECIMAL(4,2) | Walks per 9 innings |
| `gb_percentage` | DECIMAL(4,1) | Ground ball rate (GB%) |
| `fb_percentage` | DECIMAL(4,1) | Fly ball rate (FB%) |

**Unique constraint:** `(player_id, season, team_id)`

---

### batting_game_logs

Individual game batting performance for trend analysis.

| Column | Type | Notes |
|--------|------|-------|
| `id` | INTEGER, PK | Auto-generated |
| `player_id` | INTEGER, FK | References players.id |
| `season` | INTEGER | Year |
| `game_id` | STRING | MLB Game ID (gamePk) |
| `game_date` | DATE | Date of the game |
| `opponent_team_id` | INTEGER | Opponent team ID |
| `opponent_team_name` | STRING | Opponent team name |
| `is_home` | BOOLEAN | Home or away game |
| `game_result` | STRING | e.g., "W 5-3", "L 2-4" |
| `batting_order` | INTEGER | Position in lineup (1-9) |
| `position_played` | STRING | Position(s) played this game |
| `at_bats` | INTEGER | AB |
| `runs` | INTEGER | R |
| `hits` | INTEGER | H |
| `doubles` | INTEGER | 2B |
| `triples` | INTEGER | 3B |
| `home_runs` | INTEGER | HR |
| `rbi` | INTEGER | RBI |
| `walks` | INTEGER | BB |
| `strikeouts` | INTEGER | SO |
| `stolen_bases` | INTEGER | SB |
| `caught_stealing` | INTEGER | CS |
| `hit_by_pitch` | INTEGER | HBP |
| `sacrifice_flies` | INTEGER | SF |
| `avg_season_to_date` | DECIMAL(4,3) | Running season AVG |
| `ops_season_to_date` | DECIMAL(4,3) | Running season OPS |

**Unique constraint:** `(player_id, game_id)`
**Index:** `(player_id, season, game_date)` for chronological queries

---

### pitching_game_logs

Individual game pitching performance for trend analysis.

| Column | Type | Notes |
|--------|------|-------|
| `id` | INTEGER, PK | Auto-generated |
| `player_id` | INTEGER, FK | References players.id |
| `season` | INTEGER | Year |
| `game_id` | STRING | MLB Game ID (gamePk) |
| `game_date` | DATE | Date of the game |
| `opponent_team_id` | INTEGER | Opponent team ID |
| `opponent_team_name` | STRING | Opponent team name |
| `is_home` | BOOLEAN | Home or away game |
| `game_result` | STRING | e.g., "W 5-3" |
| `decision` | STRING, nullable | W, L, S (save), H (hold), BS (blown save), or null |
| `is_start` | BOOLEAN | Started the game |
| `innings_pitched` | DECIMAL(4,1) | IP (e.g., 6.2 = 6 2/3 innings) |
| `hits` | INTEGER | H |
| `runs` | INTEGER | R |
| `earned_runs` | INTEGER | ER |
| `walks` | INTEGER | BB |
| `strikeouts` | INTEGER | K |
| `home_runs` | INTEGER | HR |
| `pitches_thrown` | INTEGER | Total pitches |
| `strikes` | INTEGER | Total strikes |
| `balls` | INTEGER | Total balls |
| `era_season_to_date` | DECIMAL(4,2) | Running season ERA |

**Unique constraint:** `(player_id, game_id)`
**Index:** `(player_id, season, game_date)`

---

### player_awards

Awards and accolades for each player.

| Column | Type | Notes |
|--------|------|-------|
| `id` | INTEGER, PK | Auto-generated |
| `player_id` | INTEGER, FK | References players.id |
| `award_type` | STRING | See award types below |
| `season` | INTEGER | Year awarded |
| `league` | STRING, nullable | 'AL', 'NL', or null |
| `team_id` | INTEGER, nullable | Team at time of award |
| `team_name` | STRING, nullable | Team name |
| `notes` | STRING, nullable | Additional context |

**Award Types:**
- `MVP` — Most Valuable Player
- `CY_YOUNG` — Cy Young Award
- `ROOKIE_OF_YEAR` — Rookie of the Year
- `ALL_STAR` — All-Star selection
- `GOLD_GLOVE` — Gold Glove Award
- `SILVER_SLUGGER` — Silver Slugger Award
- `BATTING_TITLE` — League batting champion
- `HOME_RUN_TITLE` — League home run leader
- `TRIPLE_CROWN` — Led league in AVG, HR, RBI
- `WORLD_SERIES_MVP` — World Series MVP
- `WORLD_SERIES_CHAMP` — World Series champion
- `HALL_OF_FAME` — Hall of Fame inductee

**Unique constraint:** `(player_id, award_type, season)`

---

### player_teams

Historical record of which teams a player played for.

| Column | Type | Notes |
|--------|------|-------|
| `id` | INTEGER, PK | Auto-generated |
| `player_id` | INTEGER, FK | References players.id |
| `team_id` | INTEGER | MLB team ID |
| `team_name` | STRING | Team name at the time |
| `team_abbreviation` | STRING | e.g., "NYY", "LAD" |
| `season_start` | INTEGER | First season with team |
| `season_end` | INTEGER, nullable | Last season (null if current) |

**Unique constraint:** `(player_id, team_id, season_start)`

---

### teams (reference table)

Static reference table for MLB teams.

| Column | Type | Notes |
|--------|------|-------|
| `id` | INTEGER, PK | MLB team ID |
| `name` | STRING | Full team name |
| `abbreviation` | STRING | e.g., "NYY" |
| `league` | STRING | 'AL' or 'NL' |
| `division` | STRING | 'East', 'Central', 'West' |
| `logo_url` | STRING, nullable | Team logo URL |

---

## API Routes

### Player Search

```
GET /api/players/search?q={query}&limit={limit}
```

**Purpose:** Autocomplete search for player selection

**Query Parameters:**
- `q` (required): Search string (minimum 2 characters)
- `limit` (optional): Max results to return (default: 10)

**Response:**
```json
{
  "players": [
    {
      "id": 545361,
      "full_name": "Mike Trout",
      "position": "CF",
      "position_category": "Batter",
      "active": true,
      "image_url": "https://...",
      "current_team": "Los Angeles Angels"
    }
  ]
}
```

**Logic:**
1. Query local database first (fast, indexed search on `full_name`)
2. If fewer than `limit` results, optionally query MLB API for additional matches
3. Deduplicate and merge results

---

### Player Info

```
GET /api/players/[id]
```

**Purpose:** Get full biographical info for a single player

**Response:**
```json
{
  "id": 545361,
  "full_name": "Mike Trout",
  "first_name": "Mike",
  "last_name": "Trout",
  "position": "CF",
  "position_category": "Batter",
  "batting_hand": "R",
  "throwing_hand": "R",
  "height": "6'2\"",
  "weight": 235,
  "birth_date": "1991-08-07",
  "birth_city": "Vineland",
  "birth_state": "NJ",
  "birth_country": "USA",
  "debut_date": "2011-07-08",
  "active": true,
  "image_url": "https://...",
  "teams": [
    { "team_name": "Los Angeles Angels", "season_start": 2011, "season_end": null }
  ],
  "awards_summary": {
    "mvp": 3,
    "all_star": 11,
    "silver_slugger": 9
  }
}
```

**Logic:**
1. Check database for player
2. If not found or stale, fetch from MLB API and upsert
3. Return combined data

---

### Player Stats

```
GET /api/players/[id]/stats?type={career|season}&season={year}
```

**Purpose:** Get batting and/or pitching stats for a player

**Query Parameters:**
- `type` (optional): `career` or `season` (default: `career`)
- `season` (optional): Year for season stats (required if type=season)

**Response:**
```json
{
  "player_id": 545361,
  "type": "career",
  "batting": {
    "games": 1524,
    "at_bats": 5423,
    "hits": 1624,
    "home_runs": 378,
    "batting_average": 0.299,
    "ops": 0.999,
    "war": 85.2,
    "wrc_plus": 176
    // ... all batting stats
  },
  "pitching": null  // null for non-pitchers
}
```

**Logic:**
1. Query database for stats
2. If not found, fetch from MLB API, store, and return
3. For two-way players, return both batting and pitching objects

---

### Player Seasons

```
GET /api/players/[id]/seasons
```

**Purpose:** Get list of seasons a player has stats for (for dropdown selectors)

**Response:**
```json
{
  "player_id": 545361,
  "seasons": [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011],
  "debut_season": 2011,
  "most_recent_season": 2024
}
```

---

### Player Awards

```
GET /api/players/[id]/awards
```

**Purpose:** Get full award history for a player

**Response:**
```json
{
  "player_id": 545361,
  "awards": [
    { "award_type": "MVP", "season": 2014, "league": "AL" },
    { "award_type": "MVP", "season": 2016, "league": "AL" },
    { "award_type": "MVP", "season": 2019, "league": "AL" },
    { "award_type": "ALL_STAR", "season": 2012, "league": "AL" },
    // ...
  ]
}
```

---

### Player Game Logs

```
GET /api/players/[id]/gamelogs?season={year}&type={batting|pitching}
```

**Purpose:** Get game-by-game data for charts and detailed analysis

**Query Parameters:**
- `season` (required): Year
- `type` (required): `batting` or `pitching`

**Response (batting example):**
```json
{
  "player_id": 545361,
  "season": 2024,
  "type": "batting",
  "games": [
    {
      "game_id": "717465",
      "game_date": "2024-03-28",
      "opponent": "Baltimore Orioles",
      "is_home": false,
      "result": "L 2-5",
      "at_bats": 4,
      "hits": 1,
      "home_runs": 0,
      "rbi": 0,
      "walks": 0,
      "strikeouts": 2,
      "avg_season_to_date": 0.250,
      "ops_season_to_date": 0.500
    }
    // ... one object per game
  ]
}
```

**Logic:**
1. Query database for game logs
2. If not found or incomplete, fetch from MLB API and store
3. Return sorted by date (ascending)

---

### Compare Players

```
GET /api/players/compare?player1={id}&player2={id}&type={career|season}&season={year}
```

**Purpose:** Get side-by-side comparison data for two players

**Query Parameters:**
- `player1` (required): First player ID
- `player2` (required): Second player ID
- `type` (optional): `career` or `season` (default: `career`)
- `season` (optional): Year for season comparison

**Response:**
```json
{
  "comparison_type": "career",
  "players": [
    {
      "id": 545361,
      "full_name": "Mike Trout",
      "image_url": "https://...",
      "position_category": "Batter",
      "batting": { /* all stats */ },
      "pitching": null
    },
    {
      "id": 660271,
      "full_name": "Shohei Ohtani",
      "image_url": "https://...",
      "position_category": "Two-Way",
      "batting": { /* all stats */ },
      "pitching": { /* all stats */ }
    }
  ],
  "stat_leaders": {
    "batting": {
      "home_runs": "player1",
      "batting_average": "player2",
      "war": "player1"
      // ... for each comparable stat
    },
    "pitching": {
      "era": "player2",
      "strikeouts": "player2"
      // ...
    }
  }
}
```

---

## UI Pages & Components

### Page Structure

```
/                           → Home (search + select two players)
/compare                    → Comparison view (requires player1 & player2 query params)
/player/[id]                → Single player detail view
```

### Home Page (`/`)

**Purpose:** Entry point for selecting two players to compare

**Components:**
- Two autocomplete search inputs (Player 1, Player 2)
- Search results dropdown with player photo, name, position, team
- "Compare" button (enabled when both players selected)
- Recent comparisons (stored in localStorage)
- Popular comparisons (hardcoded or from analytics)

**User Flow:**
1. User types in Player 1 search box
2. Autocomplete shows matching players
3. User selects player (shows confirmation card)
4. Repeat for Player 2
5. Click "Compare" → navigates to `/compare?player1=X&player2=Y`

---

### Compare Page (`/compare`)

**Purpose:** Side-by-side statistical comparison

**Query Params:**
- `player1` (required): Player 1 ID
- `player2` (required): Player 2 ID
- `type` (optional): `career` or `season`
- `season` (optional): Year if type=season

**Components:**
- Player header cards (photo, name, position, team)
- Toggle: Career / Season (with season dropdown)
- Batting stats comparison table
- Pitching stats comparison table (if applicable)
- Awards comparison section
- Game log chart (if season selected)

**Stat Table Features:**
- Side-by-side columns
- Leader highlighting (green for better stat)
- Tooltips explaining each stat
- Toggle between basic and advanced stats

---

### Player Detail Page (`/player/[id]`)

**Purpose:** Deep dive into a single player

**Components:**
- Player bio header (photo, name, position, physical stats, debut)
- Career stats summary
- Season-by-season stats table (sortable)
- Awards timeline
- Game log chart for selected season
- Team history

---

### Shared Components

| Component | Description |
|-----------|-------------|
| `PlayerSearchInput` | Autocomplete search with debouncing |
| `PlayerCard` | Compact player display (photo, name, position) |
| `StatsTable` | Configurable stats display with leader highlighting |
| `StatComparison` | Single stat row with visual indicator of leader |
| `GameLogChart` | Recharts line chart for trends over time |
| `SeasonSelector` | Dropdown for picking a season |
| `LoadingSpinner` | Loading state indicator |
| `ErrorBoundary` | Error handling wrapper |

---

## Data Ingestion System

### Overview

The ingestion system syncs data from the MLB Stats API into the PostgreSQL database. It runs as a set of scripts that can be executed manually or scheduled (via cron, GitHub Actions, or a job scheduler).

### MLB Stats API Endpoints

Base URL: `https://statsapi.mlb.com/api/v1`

| Endpoint | Purpose |
|----------|---------|
| `/sports/1/players` | List all players (with filters) |
| `/people/{id}` | Single player bio |
| `/people/{id}/stats?stats=career&group=hitting` | Career batting stats |
| `/people/{id}/stats?stats=career&group=pitching` | Career pitching stats |
| `/people/{id}/stats?stats=yearByYear&group=hitting` | Season-by-season batting |
| `/people/{id}/stats?stats=yearByYear&group=pitching` | Season-by-season pitching |
| `/people/{id}/stats?stats=gameLog&group=hitting&season={year}` | Batting game logs |
| `/people/{id}/stats?stats=gameLog&group=pitching&season={year}` | Pitching game logs |
| `/awards` | List all award types |
| `/people/{id}/awards` | Player awards |
| `/teams` | List all teams |

### Ingestion Strategy

**Phase 1: Initial Data Load (one-time)**
1. Fetch all teams → populate `teams` table
2. Fetch all players (active + historical) → populate `players` table
3. For each player:
   - Fetch career stats → populate `batting_stats` / `pitching_stats` (is_career=true)
   - Fetch year-by-year stats → populate season rows
   - Fetch awards → populate `player_awards`

**Phase 2: Incremental Updates (scheduled)**
1. Daily: Update active player stats during season
2. Daily: Fetch yesterday's game logs for active players
3. Weekly: Refresh career totals for active players
4. Annually: Add new players, update retired status

**Phase 3: On-Demand Fetching (runtime fallback)**
1. If player not in DB → fetch from API, store, return
2. If stats missing → fetch from API, store, return
3. Cache API responses to avoid rate limits

### Project Structure

```
/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Migration history
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── compare/
│   │   │   └── page.tsx       # Comparison page
│   │   ├── player/
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Player detail page
│   │   └── api/               # API routes
│   │       └── players/
│   │           ├── search/
│   │           │   └── route.ts
│   │           ├── compare/
│   │           │   └── route.ts
│   │           └── [id]/
│   │               ├── route.ts
│   │               ├── stats/
│   │               │   └── route.ts
│   │               ├── seasons/
│   │               │   └── route.ts
│   │               ├── awards/
│   │               │   └── route.ts
│   │               └── gamelogs/
│   │                   └── route.ts
│   ├── components/            # React components
│   │   ├── ui/                # Base UI components
│   │   ├── player/            # Player-specific components
│   │   └── charts/            # Chart components
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── mlb-api.ts         # MLB Stats API client
│   │   └── utils.ts           # Shared utilities
│   └── types/
│       └── index.ts           # TypeScript interfaces
├── scripts/
│   ├── ingest-teams.ts        # Populate teams table
│   ├── ingest-players.ts      # Populate players table
│   ├── ingest-stats.ts        # Populate stats tables
│   ├── ingest-gamelogs.ts     # Populate game log tables
│   ├── ingest-awards.ts       # Populate awards table
│   └── ingest-all.ts          # Run full ingestion
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── .env                       # Environment variables
```

### Ingestion Scripts Detail

#### `scripts/ingest-teams.ts`

```typescript
// Pseudocode
async function ingestTeams() {
  const teams = await mlbApi.getTeams();
  for (const team of teams) {
    await prisma.team.upsert({
      where: { id: team.id },
      create: mapTeam(team),
      update: mapTeam(team),
    });
  }
}
```

#### `scripts/ingest-players.ts`

```typescript
// Pseudocode
async function ingestPlayers(options: { activeOnly?: boolean }) {
  const players = await mlbApi.getPlayers({ 
    season: currentYear,
    activeStatus: options.activeOnly ? 'active' : 'all'
  });
  
  for (const player of players) {
    const fullPlayer = await mlbApi.getPlayer(player.id);
    await prisma.player.upsert({
      where: { id: player.id },
      create: mapPlayer(fullPlayer),
      update: mapPlayer(fullPlayer),
    });
    
    // Also update player_teams
    await updatePlayerTeams(player.id, fullPlayer.teams);
  }
}
```

#### `scripts/ingest-stats.ts`

```typescript
// Pseudocode
async function ingestStats(playerId: number) {
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  
  if (player.positionCategory === 'Batter' || player.positionCategory === 'Two-Way') {
    const careerBatting = await mlbApi.getCareerBattingStats(playerId);
    await upsertBattingStats(playerId, careerBatting, { isCareer: true });
    
    const seasonBatting = await mlbApi.getSeasonBattingStats(playerId);
    for (const season of seasonBatting) {
      await upsertBattingStats(playerId, season, { isCareer: false });
    }
  }
  
  if (player.positionCategory === 'Pitcher' || player.positionCategory === 'Two-Way') {
    // Same pattern for pitching stats
  }
}
```

#### `scripts/ingest-gamelogs.ts`

```typescript
// Pseudocode
async function ingestGameLogs(playerId: number, season: number, type: 'batting' | 'pitching') {
  const logs = await mlbApi.getGameLogs(playerId, season, type);
  
  for (const log of logs) {
    if (type === 'batting') {
      await prisma.battingGameLog.upsert({
        where: { playerId_gameId: { playerId, gameId: log.gameId } },
        create: mapBattingGameLog(playerId, log),
        update: mapBattingGameLog(playerId, log),
      });
    } else {
      await prisma.pitchingGameLog.upsert({
        where: { playerId_gameId: { playerId, gameId: log.gameId } },
        create: mapPitchingGameLog(playerId, log),
        update: mapPitchingGameLog(playerId, log),
      });
    }
  }
}
```

### MLB API Client (`lib/mlb-api.ts`)

```typescript
// Key functions to implement
export const mlbApi = {
  // Teams
  getTeams(): Promise<Team[]>,
  
  // Players
  getPlayers(options: { season?: number, activeStatus?: string }): Promise<PlayerSummary[]>,
  getPlayer(id: number): Promise<PlayerDetail>,
  searchPlayers(query: string): Promise<PlayerSummary[]>,
  
  // Stats
  getCareerBattingStats(playerId: number): Promise<BattingStats>,
  getCareerPitchingStats(playerId: number): Promise<PitchingStats>,
  getSeasonBattingStats(playerId: number): Promise<BattingStats[]>,
  getSeasonPitchingStats(playerId: number): Promise<PitchingStats[]>,
  
  // Game Logs
  getBattingGameLogs(playerId: number, season: number): Promise<BattingGameLog[]>,
  getPitchingGameLogs(playerId: number, season: number): Promise<PitchingGameLog[]>,
  
  // Awards
  getPlayerAwards(playerId: number): Promise<Award[]>,
};
```

### Data Mapping Layer (`lib/mappers.ts`)

Transforms MLB API responses to Prisma model shapes:

```typescript
export function mapPlayer(apiPlayer: ApiPlayer): Prisma.PlayerCreateInput {
  return {
    id: apiPlayer.id,
    fullName: apiPlayer.fullName,
    firstName: apiPlayer.firstName,
    lastName: apiPlayer.lastName,
    position: apiPlayer.primaryPosition?.abbreviation,
    positionCategory: determinePositionCategory(apiPlayer.primaryPosition),
    battingHand: apiPlayer.batSide?.code,
    throwingHand: apiPlayer.pitchHand?.code,
    height: apiPlayer.height,
    heightInches: parseHeightToInches(apiPlayer.height),
    weight: apiPlayer.weight,
    birthDate: new Date(apiPlayer.birthDate),
    // ... etc
  };
}

export function mapBattingStats(apiStats: ApiStats): Prisma.BattingStatsCreateInput {
  // Transform API stat names to DB column names
  // Handle nulls and missing values
  // Calculate derived stats if not provided
}
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)

**Goals:** Project setup, database, basic API

**Tasks:**
1. Initialize Next.js project with TypeScript
2. Set up Tailwind CSS
3. Configure Prisma with PostgreSQL
4. Create database schema (all tables)
5. Run migrations
6. Create MLB API client (`lib/mlb-api.ts`)
7. Implement data mappers
8. Build ingestion scripts for teams and players
9. Run initial player ingestion (active players only)

**Deliverables:**
- Working database with players table populated
- MLB API client with basic methods
- Ingestion scripts that can be run manually

### Phase 2: Core API Routes (Week 2)

**Goals:** All backend endpoints working

**Tasks:**
1. Implement `/api/players/search`
2. Implement `/api/players/[id]`
3. Implement `/api/players/[id]/stats`
4. Implement `/api/players/[id]/seasons`
5. Implement `/api/players/compare`
6. Add stats ingestion for searched players
7. Add caching layer (in-memory or Redis)

**Deliverables:**
- All API routes returning correct data
- On-demand stats fetching working
- API tests passing

### Phase 3: UI - Search & Compare (Week 3)

**Goals:** Main user flow complete

**Tasks:**
1. Build `PlayerSearchInput` component
2. Build Home page with dual search
3. Build `PlayerCard` component
4. Build `StatsTable` component
5. Build Compare page layout
6. Implement career comparison view
7. Implement season comparison view
8. Add leader highlighting

**Deliverables:**
- Users can search and select two players
- Users can view side-by-side comparison
- Toggle between career and season stats

### Phase 4: Game Logs & Charts (Week 4)

**Goals:** Detailed analysis features

**Tasks:**
1. Implement `/api/players/[id]/gamelogs`
2. Build game logs ingestion
3. Build `GameLogChart` component with Recharts
4. Add game log section to Compare page
5. Build Player Detail page
6. Add awards display

**Deliverables:**
- Game log charts showing trends
- Player detail page complete
- Full feature set working

### Phase 5: Polish & Deploy (Week 5)

**Goals:** Production ready

**Tasks:**
1. Add loading states and error handling
2. Implement responsive design
3. Add SEO metadata
4. Set up scheduled ingestion (GitHub Actions or cron)
5. Performance optimization
6. Deploy to Vercel
7. Set up production database (Supabase, Neon, or Railway)

**Deliverables:**
- Production deployment
- Automated data refresh
- Documentation

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/mlb_compare?schema=public"

# MLB API (no auth required, but good to have base URL configurable)
MLB_API_BASE_URL="https://statsapi.mlb.com/api/v1"

# Optional: Caching
REDIS_URL="redis://localhost:6379"

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID="..."
```

---

## Error Handling Strategy

### API Routes

```typescript
// Consistent error response format
interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// Example usage
if (!player) {
  return NextResponse.json(
    { error: 'NOT_FOUND', message: 'Player not found', statusCode: 404 },
    { status: 404 }
  );
}
```

### MLB API Failures

1. Retry with exponential backoff (3 attempts)
2. Return cached/stale data if available
3. Return partial data with warning
4. Log failures for monitoring

### Database Failures

1. Return cached data if available
2. Return user-friendly error message
3. Alert monitoring system

---

## Testing Strategy

| Layer | Tool | Coverage |
|-------|------|----------|
| Unit | Jest | Mappers, utilities, calculations |
| API | Jest + Supertest | All API routes |
| Components | React Testing Library | Interactive components |
| E2E | Playwright | Critical user flows |

**Critical Test Cases:**
- Search returns correct players
- Stats comparison shows correct leader
- Two-way players show both batting and pitching
- Game logs display in correct order
- Error states render correctly

---

## Future Enhancements (Not in MVP)

- User accounts and saved comparisons
- Head-to-head matchup history
- Team comparisons
- Advanced filtering (by date range, vs. team, home/away)
- Export comparison as image/PDF
- API rate limiting for public access
- Historical Hall of Fame voting data
- Salary data integration
- Minor league stats
