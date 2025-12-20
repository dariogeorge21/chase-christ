import { create } from "zustand";
import { PlayerData, GameState, GameCard } from "./types";

interface AppState {
  // Player data
  playerData: PlayerData | null;
  setPlayerData: (data: PlayerData) => void;

  // Security code
  securityCode: string;
  setSecurityCode: (code: string) => void;

  // Game state
  gameState: GameState;
  setGameState: (state: Partial<GameState>) => void;
  addCard: (card: GameCard) => void;
  removeCard: (cardId: string) => void;
  incrementScore: (points: number) => void;
  incrementNegativeCards: () => void;
  decrementTime: () => void;
  resetGame: () => void;

  // Reset all state
  resetAll: () => void;
}

const initialGameState: GameState = {
  score: 0,
  negativeCardsTapped: 0,
  timeRemaining: 90,
  isPlaying: false,
  cards: [],
};

export const useAppStore = create<AppState>((set) => ({
  // Player data
  playerData: null,
  setPlayerData: (data) => set({ playerData: data }),

  // Security code
  securityCode: "",
  setSecurityCode: (code) => set({ securityCode: code }),

  // Game state
  gameState: initialGameState,
  setGameState: (state) =>
    set((prev) => ({
      gameState: { ...prev.gameState, ...state },
    })),
  addCard: (card) =>
    set((prev) => ({
      gameState: {
        ...prev.gameState,
        cards: [...prev.gameState.cards, card],
      },
    })),
  removeCard: (cardId) =>
    set((prev) => ({
      gameState: {
        ...prev.gameState,
        cards: prev.gameState.cards.filter((c) => c.id !== cardId),
      },
    })),
  incrementScore: (points) =>
    set((prev) => ({
      gameState: {
        ...prev.gameState,
        score: prev.gameState.score + points,
      },
    })),
  incrementNegativeCards: () =>
    set((prev) => ({
      gameState: {
        ...prev.gameState,
        negativeCardsTapped: prev.gameState.negativeCardsTapped + 1,
      },
    })),
  decrementTime: () =>
    set((prev) => ({
      gameState: {
        ...prev.gameState,
        timeRemaining: Math.max(0, prev.gameState.timeRemaining - 1),
      },
    })),
  resetGame: () =>
    set({
      gameState: initialGameState,
    }),

  // Reset all state
  resetAll: () =>
    set({
      playerData: null,
      securityCode: "",
      gameState: initialGameState,
    }),
}));

