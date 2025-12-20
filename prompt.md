

## 🔔 Project Name

**JAAGO — Chase Christ**

*A fast-paced faith-inspired real-time reaction game for church events*

---

## 🎯 Objective

Build a **90-second solo real-time reaction game** designed for a **church event**, where players tap fast-spawning cards based on biblical references. The game emphasizes **speed, focus, faith symbolism, and fun distractions**, with live leaderboard updates using **Supabase Realtime**.

No accounts. No keyboard input. Touch or mouse only.

---

## 🧠 Core Game Rules

### ⏱ Game Duration

* **Fixed duration: 90 seconds**
* Game ends early if:

  * Player hits **3 negative cards total** (–5 × 3 → instant Game Over)

---

### 🃏 Card System

* Cards spawn at **random positions**
* Each card:

  * Random abstract shape
  * Vibrant color
  * Flash + fade animation
* Card types:

  * **Jesus / Lord** → `+5 points`
  * **Satan / Devil** → `–5 points`
* Rules:

  * Only **one interaction per card**
  * Missed cards = no penalty
  * No double tapping

---

### 📈 Difficulty Scaling

* Over time:

  * Card visibility duration **decreases**
  * Spawn frequency **increases**
* Cap visible cards on screen (5–7 max) to avoid clutter
* Increase **pressure**, not chaos

---

## 🏆 Leaderboard Rules

* **Live leaderboard** on `/score` page
* Fetch scores **in real-time**
* Shows **Top players**
* **Manual reset button** on `/score` page
* No automatic reset (event-controlled)
* Built specifically for **church event usage**

---

## 🧩 Pages & Workflow

### 1️⃣ Landing Page

* Biblical background quotes (subtle fade loop)
* Jesus-themed hero image
* Game title: **JAAGO — Rise & React**
* CTA: **Start Game**
* Clean, reverent but energetic UI

---

### 2️⃣ Input Page (NO KEYBOARD)

**All interactions via mouse or touch only**

Inputs:

* **Name** → captured via **voice input**
* **Age** → selectable range buttons (16–35)
* **Where are you from?** → predefined selectable buttons (location presets)

UI:

* Buttons use
  `npx shadcn@latest add @react-bits/Magnet-TS-TW`
* Fun, bouncy, magnetic interactions

---

### 3️⃣ Pre-Game Ritual Sequence

After inputs:

1. **4–5 second delay**
2. Funny / attractive loading spinner
3. Sequential playful messages (animated):

   * “Sharpening your reflexes…”
   * “Angels are watching…”
   * “Temptations incoming…”
4. Generate **6-digit security code**

   * Display clearly
   * Tell player to **remember it**
   * Store in **React Context**
5. Countdown:

   * Starts **slow**
   * Gradually speeds up
   * From **5 → 0**
6. Game starts instantly at `0`

---

## 🎮 Gameplay UI

### Background

* Use
  `npx shadcn@latest add @react-bits/LiquidChrome-TS-TW`
* Animated liquid chrome faith-themed background

### HUD

* **Top-right live score counter** using
  `npx shadcn@latest add @react-bits/Counter-TS-TW`
* Timer visible
* Subtle leaderboard preview optional

### UX Enhancements

* Ripple effects on taps
* Score popups (+5 / –5)
* Flash effects for negative cards
* Distractor animations (harmless but attention-breaking):

  * Floating symbols
  * Slight screen shakes
  * Light audio ticks (optional)

---

## ❌ Game End Conditions

* 90 seconds completed OR
* 3 negative cards tapped

---

## 🔐 Post-Game Verification

1. Ask user to **re-enter the same 6-digit security code**
2. If forgotten:

   * Show **“Forgot Code?”**
   * Punishment screen:

     * “Recite 3 Hail Marys”
     * Show **3 attractive checkboxes**
     * User checks each after reciting
3. Continue only after completion

---

## 🏁 Results Screen

* Loading spinner
* Score reveal animation
* Thank-you message
* Godly / uplifting messages
* Restart button → returns to Landing Page
* Game state fully reset

---

## 🗄 Database (Supabase)

Store:

* Name
* Age
* Location
* Final score
* Negative count
* Game session ID
* Timestamp
* Security code hash (optional)

Use:

* Supabase Database
* Supabase Realtime for:

  * Score updates
  * Leaderboard sync

---

## 🧑‍💻 Tech Stack

### Frontend

* NextJS (App Router)
* TypeScript
* TailwindCSS
* ShadCN UI
* Framer Motion (animations)
* Zustand or Context API (state)
* React Query / SWR

### Backend

* Supabase
* Realtime channels
* Manual `.env` credentials (developer provided)

---

## 🖥 Platform Restrictions

* Supported:

  * Laptops
  * Desktops
  * Tablets
* ❌ Mobile phones not targeted

---

## ✅ Final Deliverable

* Fully working game
* Polished UI/UX
* Smooth animations
* Clean code
* No overengineering
* Church-event ready

---