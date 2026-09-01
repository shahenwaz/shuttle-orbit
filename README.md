# Shuttle Orbit

Shuttle Orbit is a modern badminton community platform for tournaments, player rankings, public club profiles, Player-based club membership, and community leagues.

## Current features

### Public site

- Tournament listings, tournament summaries, and category pages
- Category Info, Teams, Players, Matches, and Standings views
- Group-stage and knockout fixtures, including TBD participants and multi-set results
- Universal and category-based leaderboards
- Player directory and public player profiles with tournament history
- Public club directory and club profiles
- Active club members shown according to each member's public-visibility setting
- Route metadata, sitemap coverage, and public loading/error states

### Administration

- Authenticated admin routes and server-protected mutations
- Tournament and category creation, editing, and guarded deletion
- Team-entry and player management
- Group assignment, fixture generation, manual fixtures, and result management
- Knockout configuration, bracket generation, propagation, and third-place support
- Ranking recalculation and administration
- Club profiles and Player-based membership with roles and public visibility
- Community league creation, fixtures, results, and derived player statistics
- League host selection from existing clubs through `League.hostClubId`

## Tournament formats

Tournament categories support flexible, data-driven structures, including:

- One or more round-robin group stages
- Manual or generated group fixtures
- Configurable knockout start stages
- Semi-finals, finals, and optional third-place matches
- One-set group matches and optional multi-set knockout matches
- Manual corrections with safeguards around completed downstream results

Tournament rankings remain separate from tournament operation logic so results can be audited and recalculated.

## Clubs and community leagues

Clubs are persistent public community entities. Membership is attached to the global `Player` record and includes a `ClubMemberRole`, public-profile visibility, a club join date, and optional admin notes. There is no separate club-only member identity.

Public club profiles show active members only when their club profile is public. Club administration manages membership, roles, and visibility without changing the player's global identity.

Community leagues are separate from tournament categories and rankings. Current league formats include round robin, team-pair matrix, fixed doubles, and manual flows. A league may reference an existing host club through nullable `League.hostClubId`.

## Tech stack

| Area                 | Technology                               |
| -------------------- | ---------------------------------------- |
| Framework            | Next.js 16 App Router and React 19       |
| Language             | TypeScript                               |
| Styling              | Tailwind CSS 4                           |
| UI                   | shadcn/ui and Radix UI                   |
| Database             | PostgreSQL                               |
| ORM                  | Prisma 7                                 |
| Authentication       | Auth.js / NextAuth with JWT sessions     |
| Validation and forms | Zod, React Hook Form, and Server Actions |
| Icons                | Lucide React                             |
| Deployment           | Vercel with Vercel Analytics             |

## Project structure

```txt
app/
  (public)/
    clubs/
    leaderboard/
    login/
    players/
    tournaments/
  admin/
    clubs/
    leagues/
    players/
    rankings/
    tournaments/
  api/auth/
  layout.tsx
  sitemap.ts

components/
  admin/
  clubs/
  layout/
  players/
  tournaments/
  ui/

lib/
  clubs/
  leagues/
  rankings/
  tournament/
  validations/
  auth.ts
  prisma.ts

prisma/
  migrations/
  schema.prisma
  seed.ts
```

The `(public)` route group supplies the public site shell but does not change public URLs.

## Main routes

### Public

```txt
/
/login
/tournaments
/tournaments/[slug]
/tournaments/[slug]/categories/[categoryCode]
/leaderboard
/players
/players/[playerId]
/clubs
/clubs/[slug]
```

### Admin

```txt
/admin
/admin/tournaments
/admin/tournaments/[tournamentId]
/admin/tournaments/[tournamentId]/categories/[categoryId]
/admin/players
/admin/clubs
/admin/clubs/[clubId]
/admin/leagues
/admin/leagues/[leagueId]
/admin/rankings
```

Category workspaces provide dedicated Teams, Groups, Fixtures, Results, and Knockout Setup routes.

## Core data model

- `Player`: persistent identity shared by tournaments, clubs, rankings, and leagues
- `Tournament` and `TournamentCategory`: events and their divisions
- `TeamEntry`: category-specific doubles pairing
- `Stage`, `Group`, and `GroupMembership`: tournament structure and group assignments
- `Match` and `MatchSet`: tournament fixtures and scores
- `PlayerTournamentStat` and `RankingLedger`: derived tournament statistics and auditable ranking points
- `Club`: public club profile and host relation for leagues
- `League`, `LeagueTeam`, `LeagueTeamPlayer`, `LeagueMatch`, and `LeagueSet`: community league operation
- `PlayerLeagueStat`: derived league player statistics
- `AdminUser`: authenticated administrator identity

## Local development

### Requirements

- A Node.js version compatible with Next.js 16
- PostgreSQL
- npm

### Setup

```bash
git clone <repository-url>
cd shuttle-orbit
npm install
```

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="replace-with-a-secure-password"
ADMIN_NAME="Shuttle Orbit Admin"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Do not commit real credentials or connection strings.

Prepare the database and start development:

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

The local site is available at `http://localhost:3000` by default.

## Useful commands

```bash
npm run dev
npm run lint
npm run build
npm run start
npx prisma format
npx prisma validate
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npx prisma studio
```

`npm run build` generates the Prisma client before running the production Next.js build. The Prisma client is also generated after dependency installation.

## Development principles

- Prefer Server Components and narrow Prisma selects for public pages.
- Keep client-side islands focused on genuine interaction.
- Preserve the compact, mobile-first dark interface and Shuttle Orbit branding.
- Keep tournament, ranking, club, and league business rules distinct.
- Protect admin mutations on the server and use transactions for related writes that must succeed together.
- Do not reset or destructively migrate a real database without explicit review.

## Deployment

The project is designed for Vercel with a hosted PostgreSQL database. Configure production environment variables, apply reviewed Prisma migrations through the deployment workflow, and verify lint and build checks before release.

## Author

Built by [Shahenwaz Muzahid](https://github.com/shahenwaz) for flexible community badminton competitions.
