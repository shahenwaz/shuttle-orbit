# ShuttleRank

A modern badminton tournament and ranking platform for community competitions.

ShuttleRank helps communities run flexible badminton tournaments with admin-controlled setup, public tournament pages, fixtures, standings, results, player records, and ranking support.

![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38BDF8?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Components-111827)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)

## Current status

The core tournament management foundation is in place, along with ranking, leaderboard, and player profile support.

ShuttleRank currently includes:

- Public tournament, category, player, and leaderboard pages
- Admin tournament, player, team, group, fixture, result, and ranking workflows
- Flexible category structures with group stages, multiple stages, knockouts, finals, and third-place matches
- Fixture generation, manual fixture creation, score recording, result reset, and standings calculation
- Player records, tournament history, ranking data, and leaderboard support
- Public match cards with multi-set score details
- Modern dark UI with mobile-first responsive polish
- Branded ShuttleRank identity, favicon, app icon, and web app manifest setup

## Tech stack

| Area               | Stack                                            |
| ------------------ | ------------------------------------------------ |
| Framework          | Next.js App Router                               |
| Language           | TypeScript                                       |
| Styling            | Tailwind CSS                                     |
| UI                 | shadcn/ui                                        |
| Database ORM       | Prisma                                           |
| Database           | PostgreSQL                                       |
| Icons              | Lucide React                                     |
| Validation / Forms | Server actions with validation-focused workflows |

## Project goal

ShuttleRank is built as a long-term badminton tournament platform, not a one-off event page.

The app is designed around these principles:

- Players are persistent across tournaments.
- Doubles teams are tournament-specific.
- Tournament formats should stay flexible.
- Admins should be able to manage real-life changes manually.
- Public pages should be clean, mobile-friendly, and easy to follow.
- Ranking and player history should be built safely on top of completed results.

## Main features

### Public experience

- Homepage with tournament highlights
- Tournament listing and detail pages
- Category pages with players, teams, matches, and standings
- Multi-stage tournament display support
- Latest fixture and result presentation
- Searchable players directory
- Player profile pages with tournament history and ranking context
- Public leaderboard with universal and category-based ranking views
- Public match cards with clear set-by-set score details for multi-set knockout matches
- Mobile-first public UI

### Admin experience

- Admin dashboard layout
- Tournament creation and editing
- Tournament category management
- Player creation, editing, and deletion
- Team entry and team name management
- Group creation, editing, deletion, and team assignment
- Group-stage fixture generation
- Manual fixture creation
- Match result recording and reset flow
- Safe individual match removal
- Group cleanup and fixture reset controls
- Knockout stage setup and result handling
- Optional multi-set scoring for knockout matches
- Third-place match flow
- Stage rename support
- Multiple group stages before knockout
- Ranking data, leaderboard management, and admin ranking tools
- Existing score preload when editing match results
- Ranking recalculation for completed tournaments

## Tournament format support

ShuttleRank supports flexible badminton formats instead of forcing one fixed structure.

Currently supported flows include:

- Round-robin groups
- Multiple groups inside one category
- Advanced round-robin stages before knockouts
- Semi-final and final stages
- Third-place matches
- Manually managed fixtures and results
- One-set group matches
- Optional multi-set knockout matches
- Ranking support for later group stages treated as advanced stages

Example supported structure:

```txt
Category C
├── First Group Stage
│   ├── Group C1
│   ├── Group C2
│   └── Group C3
├── Second Group Stage
│   ├── Group C Second Round 1
│   └── Group C Second Round 2
└── Knockout Stage
    ├── Semi-finals
    ├── Third-place match
    └── Final
```

## Project structure

```txt
app/
├── admin/
├── players/
├── tournaments/
└── leaderboard/

components/
├── admin/
├── layout/
├── players/
├── public/
├── shared/
├── tournaments/
└── ui/

lib/
├── db/
├── tournament/
├── utils/
└── validations/

prisma/
├── schema.prisma
└── seed.ts
```

## Routes

### Public routes

```txt
/
/tournaments
/tournaments/[slug]
/tournaments/[slug]/categories/[categoryCode]
/players
/players/[playerId]
/leaderboard
```

### Admin routes

```txt
/admin
/admin/players
/admin/tournaments
/admin/tournaments/[id]
/admin/tournaments/[id]/categories/[categoryId]
/admin/rankings
```

Admin category pages include workflows for teams, groups, fixtures, results, stages, and knockout management.

## Database concepts

Core models include:

- **Player** — persistent community player record
- **Tournament** — event container
- **TournamentCategory** — category or division inside a tournament
- **TeamEntry** — tournament-specific doubles pairing
- **Stage** — group stage, second stage, knockout, or custom stage
- **Group** — group inside a stage
- **GroupMembership** — team assignment to a group
- **Match** — fixture between two teams
- **MatchSet** — per-set score data
- **PlayerTournamentStat** — player summary for a tournament category
- **RankingLedger** — auditable ranking points generated from tournament results

## Local development

### 1. Clone the repository

```bash
git clone <repository-url>
cd shuttlerank
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env` file in the project root.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=verify-full"
```

Do not commit the real `.env` file. Use `.env.example` for safe shared examples.

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Run database migration

```bash
npx prisma migrate dev
```

### 6. Seed the database

```bash
npx prisma db seed
```

### 7. Start the development server

```bash
npm run dev
```

Open the app at:

```txt
http://localhost:3000
```

## Useful commands

```bash
npm run dev
npm run build
npm run lint
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npx prisma studio
```

## Design direction

- Dark theme
- Modern and polished
- Mobile-first
- Compact tournament information
- Clean cards, tabs, and public pages
- Reusable admin and public components
- No unnecessary clutter

Most public users are expected to view tournament pages on phones, so mobile responsiveness is a major design priority.

## Ranking direction

Ranking logic stays separate from tournament operation logic.

Current ranking direction:

1. Store completed tournament results.
2. Generate player tournament statistics from completed events.
3. Generate ranking ledger records from those statistics.
4. Build public leaderboard views from ranking ledger totals.
5. Support category-specific rankings.
6. Support universal ranking from category results.

This keeps rankings auditable, flexible, and easier to recalculate when tournament results are corrected.

## Roadmap

### Completed foundation work

- Project setup and UI foundation
- Prisma and PostgreSQL setup
- Seed data
- Public tournament pages
- Admin tournament setup
- Player and team management
- Group management
- Fixture generation
- Result recording
- Standings display
- Knockout and third-place flow foundation
- Public player directory and profile foundation
- Player profile enrichment
- Ranking data, leaderboard views, and admin ranking tools
- Public leaderboard filters and summaries
- Admin route authentication
- ShuttleRank branding, logo, favicon, and app icon setup

### Next major areas

- More robust tournament format presets

## Deployment notes

The app is intended to be deployed on Vercel with a hosted PostgreSQL database such as Neon or Supabase.

Before production deployment:

- Configure production environment variables
- Confirm Prisma migration workflow
- Ensure build and lint checks pass

## Author

Built by [**Shahenwaz Muzahid**](https://github.com/shahenwaz) as a long-term badminton tournament platform for flexible community competitions.
