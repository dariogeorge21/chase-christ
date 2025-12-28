// Player data types
export interface PlayerData {
  name: string;
  location: string;
}

// Game state types
export interface GameCard {
  id: string;
  type: "positive" | "negative";
  x: number;
  y: number;
  shape: CardShape;
  color: string;
  createdAt: number;
  lifespan: number;
}

export type CardShape = "circle" | "triangle" | "hexagon" | "star" | "square" | "diamond";

export interface GameState {
  score: number;
  negativeCardsTapped: number;
  timeRemaining: number;
  isPlaying: boolean;
  cards: GameCard[];
}

// Database types
export interface GameScore {
  id?: string;
  session_id?: string;
  player_name: string;
  player_location: string;
  final_score: number;
  negative_cards_tapped: number;
  game_duration_seconds: number;
  security_code_hash?: string;
  created_at?: string;
}

// Indian states for location selection
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

export type IndianState = (typeof INDIAN_STATES)[number];


