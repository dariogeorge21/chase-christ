# Project Specification: JAAGO — Chase Christ

Build a complete, production-ready faith-inspired reaction game for church events using Next.js 14+ (App Router), TypeScript, Tailwind CSS, ShadCN UI, and Supabase.

---

## 🎯 Core Game Mechanics

### Game Duration & End Conditions
- **Standard duration**: Exactly 90 seconds
- **Early termination**: Game ends immediately if player taps 3 negative cards (cumulative)
- Display countdown timer prominently during gameplay

### Card Spawning System
- **Spawn location**: Random x,y coordinates within safe viewport boundaries (avoid edges)
- **Spawn timing**: Progressive difficulty - start at 1 card every 2 seconds, gradually increase to 1 card per 0.5 seconds by 60-second mark
- **Maximum concurrent cards**: Cap at 5-7 visible cards to prevent screen clutter
- **Card lifespan**: Start at 3 seconds visibility, decrease to 1 second by end of game
- **Card appearance**: 
  - Random abstract geometric shapes (circle, triangle, hexagon, star, etc.)
  - Vibrant, high-contrast colors
  - Entrance animation: flash/scale-in effect
  - Exit animation: fade-out
- **Card types**:
  - **Positive cards** (Jesus/Lord/Christ/God): Award +5 points on tap
  - **Negative cards** (Satan/Devil/Evil): Deduct -5 points on tap AND increment negative counter
- **Interaction rules**:
  - Each card accepts only ONE tap/click
  - After interaction, card immediately disappears
  - Missed cards (timeout) have no penalty
  - Prevent double-tap exploits

### Difficulty Progression
- Implement smooth difficulty curve over 90 seconds:
  - **0-30s**: Slow spawn rate (2s intervals), long visibility (3s)
  - **30-60s**: Medium spawn rate (1s intervals), medium visibility (2s)
  - **60-90s**: Fast spawn rate (0.5s intervals), short visibility (1s)

---

## 📱 Application Flow & Pages

### Page 1: Landing Page (`/`)
- **Background**: Animated biblical quotes that fade in/out on loop (3-4 quotes minimum)
- **Hero section**: 
  - Jesus-themed hero image (reverent, high-quality)
  - Game title: "JAAGO — Rise & React"
  - Subtitle explaining the game concept briefly
- **CTA button**: Large "Start Game" button with hover effects
- **Design tone**: Clean, reverent, energetic, modern

### Page 2: Player Input Page (`/input`)
**Critical constraint: NO keyboard input allowed - touch/mouse interactions only**

**Required inputs:**
1. **Name**: 
   - Implement browser Web Speech API for voice input
   - Show microphone button with recording indicator
   - Display transcribed name in real-time
   - Provide "Re-record" option
   - Fallback: If voice fails, show on-screen keyboard component (not native keyboard)

2. **Age**: 
   - Display age range buttons: 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35
   - Single-select button group
   - Visual feedback on selection

3. **Location**: 
   - Predefined location buttons (specify 28 Indian states)
   - Grid layout for easy selection
   - Visual feedback on selection

**UI Components:**
- Use ShadCN Magnet button component: `npx shadcn@latest add @react-bits/Magnet-TS-TW`
- Implement magnetic hover effects
- Bouncy click animations
- Clear visual states (default, hover, selected, disabled)

**Validation:**
- All three fields must be completed before proceeding
- Show "Continue" button only when all inputs are valid

### Page 3: Pre-Game Ritual Sequence (`/prepare`)
**Execute the following sequence in order:**

1. **Initial delay**: 4-5 second pause with attractive loading spinner
2. **Motivational messages**: Display 3 animated messages sequentially (1.5s each):
   - "Sharpening your reflexes…"
   - "Angels are watching…"
   - "Temptations incoming…"
3. **Security code generation**:
   - Generate random 6-digit numeric code
   - Display prominently with large, clear typography
   - Show message: "Remember this code!"
   - Store code in React Context or Zustand for later verification
   - Display for 5 seconds minimum
4. **Countdown sequence**:
   - Animate countdown from 5 → 4 → 3 → 2 → 1 → 0
   - Start slow (1.5s per number), accelerate to fast (0.5s per number)
   - Use scale/fade animations
   - At "0", immediately transition to game page

### Page 4: Gameplay Page (`/game`)
**Background:**
- Implement ShadCN LiquidChrome component: `npx shadcn@latest add @react-bits/LiquidChrome-TS-TW`
- Animated liquid chrome background with faith-themed color palette (golds, whites, blues)

**HUD Elements:**
- **Score counter** (top-right): Use ShadCN Counter component `npx shadcn@latest add @react-bits/Counter-TS-TW`
  - Animate on score changes
  - Large, readable font
- **Timer** (top-center): Countdown from 90 to 0 seconds
  - Change color in final 10 seconds (red/urgent)
- **Negative card counter** (optional, top-left): Show "Strikes: X/3"

**Interaction Feedback:**
- **On card tap**: 
  - Ripple effect emanating from tap point
  - Score popup (+5 or -5) that floats upward and fades
  - Haptic feedback (if supported)
- **On negative card tap**:
  - Screen flash (red tint)
  - Shake animation (subtle, 200ms)
  - Warning sound (optional)

**Distractor Elements** (non-interactive, cosmetic only):
- Floating biblical symbols (cross, dove, fish) drifting across screen
- Occasional subtle screen shake (not on negative taps)
- Ambient particle effects
- Optional: Soft background audio ticks

**Game state management:**
- Track: current score, negative card count, elapsed time, active cards array
- Update UI reactively
- Check end conditions every frame

### Page 5: Post-Game Verification (`/verify`)
**Security code verification:**
1. Display input field: "Enter your 6-digit security code"
2. Show numeric keypad (on-screen, NOT native keyboard)
3. On submit:
   - If correct: Proceed to results
   - If incorrect: Show error, allow retry (max 2 attempts)
4. After 2 failed attempts OR user clicks "Forgot Code?":
   - Show punishment screen:
     - Message: "Recite 5 Hail Marys to continue"
     - Display 5 large, attractive checkboxes labeled "Hail Mary 1", "Hail Mary 2", "Hail Mary 3", "Hail Mary 4", "Hail Mary 5"
     - User must check all 5 to proceed
     - "Continue" button enabled only when all checked

### Page 6: Results Page (`/results`)
**Sequence:**
1. Show loading spinner (2-3 seconds)
2. Animate score reveal:
   - Count up from 0 to final score
   - Confetti/celebration effects for high scores
3. Display:
   - Final score (large, prominent)
   - Negative cards tapped count
   - Encouraging message based on performance:
     - High score (>100): "Blessed are the swift! Outstanding faith!"
     - Medium score (50-100): "Well done, faithful servant!"
     - Low score (<50): "Keep practicing! Faith grows with effort."
4. Show "Play Again" button → redirects to landing page
5. Show "View Leaderboard" button → redirects to `/score`
6. **On navigation away**: Fully reset game state (clear context/store)

### Page 7: Leaderboard Page (`/score`)
**Features:**
- Display top 10-20 players in descending score order
- Real-time updates using Supabase
- Columns: Rank, Name, Age, Location, Score, Timestamp
- Highlight current player's entry (if in top list)
- **Manual reset button** (admin-only or password-protected):
  - Confirmation dialog before reset
  - Clears all scores from database
  - Intended for event organizers between sessions
- Auto-refresh on new score submissions
- Smooth animations for rank changes

---

## 🗄️ Database Schema (Supabase)

### Table: `game_scores`
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

### Supabase Realtime Setup
- Enable Realtime on `game_scores` table
- Subscribe to INSERT events on `/score` page
- Update leaderboard UI reactively on new scores

### Environment Variables
Developer must provide in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🎨 UI/UX Requirements

### Design Principles
- **Reverent but energetic**: Balance faith themes with exciting gameplay
- **High contrast**: Ensure readability on all backgrounds
- **Smooth animations**: 60fps target, use Framer Motion for complex animations
- **Responsive**: Support laptops (1366x768+), desktops (1920x1080+), tablets (768x1024+)
- **NO mobile phone support**: Block or show warning on screens <768px width

### Animation Guidelines
- Use Framer Motion for page transitions, card animations, score popups
- Keep animations under 300ms for interactions
- Use spring physics for natural feel
- Avoid animation overload - prioritize performance

### Accessibility Considerations
- High contrast text
- Large touch targets (min 44x44px)
- Clear visual feedback for all interactions
- Optional audio cues (can be muted)

---

## 🧑‍💻 Technical Implementation

### Tech Stack (Required)
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI + specified React Bits components
- **Animations**: Framer Motion
- **State Management**: Zustand OR React Context API (choose one, be consistent)
- **Data Fetching**: React Query OR SWR (for Supabase queries)
- **Backend**: Supabase (Database + Realtime)

### Code Quality Standards
- TypeScript strict mode enabled
- Proper type definitions for all props, state, API responses
- Component-based architecture
- Separation of concerns (game logic, UI, data layer)
- Error boundaries for graceful error handling
- Loading states for all async operations
- No console errors or warnings in production build

### Performance Requirements
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Smooth 60fps gameplay (no frame drops)
- Optimized images (WebP format, lazy loading)
- Code splitting for route-based chunks

---

## ✅ Acceptance Criteria

**The deliverable is complete when:**
1. All 7 pages are implemented and navigable
2. Game mechanics work exactly as specified (90s duration, card spawning, scoring, difficulty scaling)
3. Voice input for name works reliably (with fallback)
4. Security code verification flow works correctly
5. Supabase database stores scores correctly
6. Leaderboard updates in real-time
7. Manual leaderboard reset works
8. All animations are smooth and polished
9. UI is visually appealing and faith-themed
10. No keyboard input is required anywhere
11. Game works on laptops, desktops, and tablets
12. Code is clean, typed, and well-organized
13. No overengineering - keep it simple and functional
14. Ready for deployment at a church event

---

## 🚀 Development Approach

1. **Initialize project**: `npx create-next-app@latest` with TypeScript, Tailwind, App Router
2. **Install dependencies**: ShadCN UI, Framer Motion, Supabase client, Zustand/React Query
3. **Set up Supabase**: Create project, configure database, enable Realtime
4. **Build pages sequentially**: Landing → Input → Prepare → Game → Verify → Results → Leaderboard
5. **Implement game logic**: Card spawning, scoring, difficulty scaling, end conditions
6. **Add animations and polish**: Framer Motion transitions, feedback effects, loading states
7. **Test thoroughly**: All user flows, edge cases, performance, cross-device compatibility

---

**Deliver a complete, polished, church-event-ready game that brings faith and fun together.**