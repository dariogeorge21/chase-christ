# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in project details and create

## 2. Create the Database Table

Run this SQL in the Supabase SQL Editor:

```sql
CREATE TABLE game_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL DEFAULT uuid_generate_v4(),
  player_name TEXT NOT NULL,
  player_age INTEGER NOT NULL CHECK (player_age >= 16 AND player_age <= 35),
  player_location TEXT NOT NULL,
  final_score INTEGER NOT NULL DEFAULT 0,
  negative_cards_tapped INTEGER NOT NULL DEFAULT 0,
  game_duration_seconds INTEGER NOT NULL,
  security_code_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_scores_leaderboard ON game_scores(final_score DESC, created_at DESC);
```

## 3. Enable Realtime

1. Go to Database → Replication in your Supabase dashboard
2. Find the `game_scores` table
3. Enable replication for INSERT events

## 4. Get Your API Keys

1. Go to Project Settings → API
2. Copy your Project URL
3. Copy your `anon` `public` key

## 5. Configure Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the values with your actual Supabase credentials.

## 6. Test the Connection

Run the development server and check if the leaderboard page loads without errors.

