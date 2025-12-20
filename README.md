# JAAGO — Rise & React | Chase Christ

A faith-inspired reaction game built for church events. Test your reflexes and faith by tapping positive cards while avoiding negative ones!

## 🎮 Game Features

- **90-second gameplay** with progressive difficulty
- **Voice input** for player name (with fallback)
- **Dynamic card spawning** with random shapes and colors
- **Security code verification** system
- **Real-time leaderboard** with Supabase
- **Smooth animations** with Framer Motion
- **Faith-themed design** with biblical quotes

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Follow instructions in `SUPABASE_SETUP.md`
   - Create a Supabase project
   - Run the SQL schema
   - Enable Realtime on the `game_scores` table

3. **Configure environment variables**
   - Update `.env.local` with your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the game**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Game Flow

1. **Landing Page** (`/`) - Animated biblical quotes and start button
2. **Player Input** (`/input`) - Voice input for name, age and location selection
3. **Pre-Game Ritual** (`/prepare`) - Motivational messages, security code display, countdown
4. **Gameplay** (`/game`) - 90 seconds of card-tapping action
5. **Verification** (`/verify`) - Security code verification or Hail Mary penance
6. **Results** (`/results`) - Score reveal with performance message
7. **Leaderboard** (`/score`) - Real-time top scores

## 🎯 Game Rules

- **Positive cards** (Jesus/Lord/Christ/God): +5 points
- **Negative cards** (Satan/Devil/Evil): -5 points + 1 strike
- **Game ends when**:
  - 90 seconds elapse, OR
  - Player taps 3 negative cards
- **Difficulty increases** over time:
  - Spawn rate: 2s → 0.5s
  - Card lifespan: 3s → 1s

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL + Realtime)

## 🔧 Troubleshooting

### Voice input not working
- Ensure you're using Chrome, Edge, or Safari
- Check microphone permissions
- Use HTTPS in production (required for Web Speech API)

### Supabase connection errors
- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure Realtime is enabled on `game_scores` table

## 📝 Leaderboard Reset

Default password: `JAAGO2024`

---

**May your reflexes be swift and your faith be strong!** ✝️
