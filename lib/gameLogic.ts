import { GameCard, CardShape } from "./types";

const CARD_SHAPES: CardShape[] = ["circle", "triangle", "hexagon", "star", "square", "diamond"];

const POSITIVE_WORDS = ["Jesus", "Lord", "Christ", "God"];
const NEGATIVE_WORDS = ["Satan", "Devil", "Evil"];

const COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#FFA07A", // Light Salmon
  "#98D8C8", // Mint
  "#F7DC6F", // Yellow
  "#BB8FCE", // Purple
  "#85C1E2", // Sky Blue
];

export function generateCard(elapsedTime: number, viewportWidth: number, viewportHeight: number): GameCard {
  // Random type (70% positive, 30% negative)
  const type = Math.random() < 0.7 ? "positive" : "negative";

  // Random position (with safe margins)
  const margin = 100;
  const x = margin + Math.random() * (viewportWidth - 2 * margin - 100);
  const y = margin + Math.random() * (viewportHeight - 2 * margin - 100);

  // Random shape and color
  const shape = CARD_SHAPES[Math.floor(Math.random() * CARD_SHAPES.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];

  // Calculate lifespan based on elapsed time (3s -> 1s)
  const lifespanProgress = Math.min(elapsedTime / 60, 1); // 0 to 1 over 60 seconds
  const lifespan = 3000 - lifespanProgress * 2000; // 3000ms to 1000ms

  return {
    id: `card-${Date.now()}-${Math.random()}`,
    type,
    x,
    y,
    shape,
    color,
    createdAt: Date.now(),
    lifespan,
  };
}

export function getSpawnInterval(elapsedTime: number): number {
  // Calculate spawn interval based on elapsed time (2s -> 0.5s)
  const progress = Math.min(elapsedTime / 60, 1); // 0 to 1 over 60 seconds
  return 2000 - progress * 1500; // 2000ms to 500ms
}

export function getCardLabel(type: "positive" | "negative"): string {
  if (type === "positive") {
    return POSITIVE_WORDS[Math.floor(Math.random() * POSITIVE_WORDS.length)];
  } else {
    return NEGATIVE_WORDS[Math.floor(Math.random() * NEGATIVE_WORDS.length)];
  }
}

