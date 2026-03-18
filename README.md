# MirrorMind

MirrorMind is an Arabic-first immersive personality exploration platform built with Next.js.

## Experience Highlights

- Arabic default language with full RTL direction support
- Instant Arabic/English switcher (text + direction + alignment)
- Interactive 12-question journey with animated one-question-per-screen flow
- Real trait scoring engine across Logic, Creativity, Empathy, and Risk
- Premium cinematic landing, test flow, and polished results view

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Configure Supabase environment variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

3. In Supabase SQL Editor, create the global leaderboard table:

```sql
create extension if not exists pgcrypto;

create table if not exists leaderboard (
	id uuid primary key default gen_random_uuid(),
	player_name text not null,
	score integer not null,
	time double precision,
	game text not null,
	created_at timestamp with time zone not null default now()
);

create index if not exists leaderboard_score_time_idx
	on leaderboard (score desc, time asc, created_at asc);

create index if not exists leaderboard_created_at_idx
	on leaderboard (created_at desc);
```

4. Start the app:

```bash
npm run dev
```

Then open http://localhost:3000.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Framer Motion

