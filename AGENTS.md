# Shuttle Orbit — Codex Working Instructions

## Project purpose

Shuttle Orbit is a modern badminton community platform built around tournaments, player rankings, club profiles, club sessions/attendance, and community league management.

The application should remain:

- fast and lightweight for public browsing
- mobile-first and responsive
- rich in useful features without unnecessary client-side or dependency weight
- maintainable, readable, and safe to evolve
- visually consistent with the current production UI

## Source of truth

When working in this repository, use this priority order:

1. The current local working tree in VS Code.
2. The user's latest explicit instruction in the active Codex conversation.
3. This `AGENTS.md`.
4. Existing implementation patterns in directly related current files.
5. Current database schema and migrations.
6. Current branch documentation such as `README.md`.
7. Older planning documents and historical notes.

Important:

- The production line of development has historically lived on `feat/club-profiles`, which is significantly ahead of `main`.
- Do not assume `main` represents the current product.
- GitHub may still lag behind the user's local working tree.
- Never overwrite newer local work because a remote branch differs.
- Before substantial work, inspect `git status`, the current branch, and the relevant local files.

## Product domains

Shuttle Orbit currently contains several related but distinct domains.

### Tournament system

- Players are persistent identities across tournaments.
- Tournament doubles pairings are event-specific.
- Tournament formats must remain flexible and data-driven.
- Groups, stages, fixtures, results, knockout progression, rankings, and player tournament history must remain separable.
- Ranking logic must remain auditable and recalculable rather than being buried in UI code.
- Admins require safe manual control for real-world corrections.

### Clubs

- Clubs are persistent community entities.
- A player may belong to a club and has club-specific metadata.
- Club public profiles, managed-club administration, member access, sessions, attendance, and visibility rules are existing concepts.
- Preserve public/member/admin visibility boundaries.
- Club membership features must not accidentally change global player identity semantics.

### Community leagues

- Leagues are separate from tournament categories and tournament rankings.
- Existing league formats include round robin, team-pair matrix, fixed doubles, and manual flows.
- League teams, league matches, league sets, and player league statistics are their own domain.
- Do not force league behavior into tournament models just to reuse code.
- Reuse shared presentation/helpers where appropriate without merging distinct business rules.

## Current stack

Use the existing stack unless the user explicitly approves a change:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4
- shadcn/ui / Radix-based components
- Prisma
- PostgreSQL
- Zod
- React Hook Form
- Auth.js / NextAuth
- Lucide React
- Vercel deployment and analytics
- react-markdown and remark-gfm where already used for formatted content

Do not introduce a new framework, state library, UI library, ORM, validation library, table library, styling system, or utility package when the existing stack can solve the task cleanly.

## Dependency policy

Dependencies are intentionally kept lean.

Before adding any package:

1. Check whether the task can be solved with the platform, Next.js, React, Tailwind, shadcn/ui, Prisma, or an existing dependency.
2. Explain why the package is necessary.
3. Ask the user before installing it.

Do not add packages for minor convenience.

Development-only tooling such as Prettier is acceptable when explicitly approved and must not be confused with runtime dependency weight.

## UI and visual preservation

The current Shuttle Orbit production UI is intentional.

Preserve:

- the current dark theme
- the existing green primary/accent direction
- current OKLCH design tokens
- Inter for body text
- Space Grotesk for headings
- the current compact card/panel language
- current borders, radii, shadows, spacing, and hierarchy
- existing responsive behavior
- current public/admin visual identity

Do not redesign, recolor, re-theme, replace fonts, or change global spacing/radius conventions unless the user explicitly approves it.

The current production styling includes brighter dark cards/panels and relatively compact rounded surfaces. Read `app/globals.css` before any global visual change.

When adding UI:

- reuse existing shared components and local patterns first
- keep pages compact, polished, and easy to scan
- keep mobile usage as a first-class requirement
- avoid decorative clutter and unnecessary animation
- prefer simple server-rendered UI where interaction is not required

Brand tone: modern, sporty, clear, community-friendly, and not overly corporate.

## Performance rules

Public browsing performance is a first-class project priority.

Prefer:

- Server Components by default
- Client Components only when browser state, effects, or interaction requires them
- server-side data fetching close to the route
- narrow Prisma `select` queries instead of broad `include` when practical
- minimal data sent to Client Components
- native Next.js features before third-party client libraries
- static or cached rendering where data freshness semantics allow it
- lightweight images and optimized assets
- reusable server-side helpers for repeated business logic
- small focused client islands rather than converting whole pages to client components

Avoid:

- unnecessary `"use client"`
- large client-side state trees
- browser fetching when the server can provide the data
- duplicate database queries in the same request path
- shipping admin-only code to public pages
- large dependencies for small UI features
- premature abstraction that increases indirection without measurable benefit

Do not make caching or rendering-mode changes blindly.
Tournament results, attendance state, member access, and other changing data may require fresh reads. If a performance change could make user-visible data stale, explain the trade-off and ask before changing caching behavior.

## Code quality and readability

Code must remain easy for a human to read and edit.

- Never minify or compress source files.
- Do not leave JSX, TypeScript, CSS, Prisma schema, JSON, Markdown, or config files as dense one-line code.
- Preserve sensible line breaks and indentation.
- Prefer straightforward control flow over clever one-liners.
- Use descriptive names.
- Keep functions focused.
- Extract helpers when they meaningfully reduce duplication or isolate business logic.
- Do not split simple code across many tiny files without a clear benefit.
- Keep business logic out of presentation components when practical.
- Follow existing aliases such as `@/`.
- Read neighboring files before introducing a new code pattern.

When touching an existing file, avoid unrelated rewrites.

## Formatting

Prettier is the project formatter.

- Use the repository's Prettier configuration.
- Format files changed by the current task.
- Prefer formatting only touched files during normal feature work.
- Do not run a repository-wide formatting rewrite unless the user explicitly asks for a formatting cleanup.
- Do not reformat migration history.
- Keep generated files and lockfiles out of cosmetic formatting changes.

If a file was previously poorly formatted, it is fine to format that file when it is part of the current task, provided the functional diff remains reviewable.

## TypeScript and validation

- Keep TypeScript strict and avoid `any` unless there is a specific justified reason.
- Prefer inferred Prisma/Zod types where they remain readable.
- Validate user-controlled mutation input.
- Keep validation rules close to the relevant domain.
- Do not weaken types just to make a build pass.
- Reuse existing validation modules before creating parallel validation logic.

## Prisma and database safety

Database changes require extra care.

Before changing `prisma/schema.prisma`:

1. Read the current schema and relevant recent migrations.
2. Explain the model/data impact.
3. Avoid destructive changes unless specifically approved.
4. Ask before any migration that drops, renames, or materially transforms existing production data.

Never:

- reset the database without explicit permission
- delete real data to make development easier
- run destructive migration commands casually
- change relationship semantics without considering existing tournament, club, league, attendance, ranking, and player history

Prefer transactions for multi-step mutations that must succeed or fail together.

Be especially careful with:

- Player relations shared across tournaments, clubs, sessions, and leagues
- Club deletion/member reassignment semantics
- public/member/admin visibility
- historical ranking/stat records
- league team/player relations

## Authentication, member access, and security

- Treat admin routes and mutations as privileged.
- Preserve existing authentication checks when refactoring.
- Preserve club member-access boundaries and share-key semantics.
- Never expose credentials or secrets.
- Never commit `.env` values.
- Do not log passwords, hashes, tokens, connection strings, share keys, or private session data.
- Do not weaken authorization for convenience.

## Public data and SEO

Public pages should remain fast, accessible, and indexable where appropriate.

Preserve existing:

- metadata patterns
- sitemap/robots behavior
- semantic headings
- accessible links and buttons
- mobile-first presentation

Do not add heavy client-side rendering to public pages without a clear need.

Private/member-only surfaces must not accidentally become indexable or publicly discoverable through convenience refactors.

## Working with existing features

Before modifying a feature:

1. Read the route/page.
2. Read directly related component(s).
3. Read the relevant action/query/helper.
4. Check the Prisma models involved.
5. Check nearby implementation patterns.
6. Check current `git diff` so ongoing local work is not overwritten.

For tournament logic, inspect fixture/group/result/knockout/ranking code before introducing new behavior.

For club work, inspect club profile mappers, validation, member/session actions, public profile components, and member-zone access flow.

For league work, inspect the existing league format helpers and the specific format implementation before generalizing behavior.

## Change safety

For normal low-risk implementation work, make the smallest clean change that satisfies the request.

Before changing any of the following, explain it and ask for approval:

- global theme or design tokens
- fonts
- broad UI/UX redesign
- database schema semantics or destructive migrations
- authentication or member-access strategy
- caching strategy that can change data freshness
- routing structure
- major architecture
- package additions/removals
- production build/deployment configuration

## Git workflow

The user manages Git manually.

- Do not commit.
- Do not push.
- Do not create or switch branches unless explicitly asked.
- Do not amend history.
- You may inspect Git history/status/diffs when useful.
- Leave working tree changes for the user to review and commit.

Do not assume `main` should receive work. Work in whichever local branch the user currently has checked out unless explicitly instructed otherwise.

## Verification

After implementation, run the smallest relevant checks available in the project.

Normally prefer:

- Prettier on changed files
- `npm run lint`
- `npm run build` for changes that can affect compilation, routing, server/client boundaries, Prisma generation, or production behavior

For Prisma schema changes, also use the appropriate non-destructive Prisma validation/generation command.

If a check is not run, state that clearly.

Do not automatically run broad dependency upgrade or `npm audit fix` commands as part of unrelated feature work.

## Completion style

At the end of a task, keep the report compact and useful:

- what changed
- important files touched
- checks run and their result
- any decision or risk the user should review

Do not include unnecessary long explanations when the implementation is straightforward.
