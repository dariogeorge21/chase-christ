"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { generateCard, getSpawnInterval } from "@/lib/gameLogic";
import GameCard from "@/components/GameCard";

const MAX_CONCURRENT_CARDS = 7;
const GAME_DURATION = 90;
const MAX_NEGATIVE_TAPS = 3;

export default function GamePage() {
  const router = useRouter();
  const gameState = useAppStore((state) => state.gameState);
  const setGameState = useAppStore((state) => state.setGameState);
  const addCard = useAppStore((state) => state.addCard);
  const removeCard = useAppStore((state) => state.removeCard);
  const incrementScore = useAppStore((state) => state.incrementScore);
  const incrementNegativeCards = useAppStore((state) => state.incrementNegativeCards);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [scorePopups, setScorePopups] = useState<{ id: string; points: number; x: number; y: number }[]>([]);
  const [shake, setShake] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const elapsedTimeRef = useRef(0);

  // Initialize game
  useEffect(() => {
    setGameState({ isPlaying: true, timeRemaining: GAME_DURATION, score: 0, negativeCardsTapped: 0, cards: [] });
  }, [setGameState]);

  // Timer
  useEffect(() => {
    if (!gameState.isPlaying) return;

    const timer = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 1;
        elapsedTimeRef.current = newTime;
        return newTime;
      });
      setGameState({ timeRemaining: Math.max(0, gameState.timeRemaining - 1) });

      // Check end conditions
      if (gameState.timeRemaining <= 1) {
        endGame();
      }
      if (gameState.negativeCardsTapped >= MAX_NEGATIVE_TAPS) {
        endGame();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isPlaying, gameState.timeRemaining, gameState.negativeCardsTapped, setGameState]);

  // Card spawning
  useEffect(() => {
    if (!gameState.isPlaying) return;

    let spawnTimer: NodeJS.Timeout;
    let isActive = true;

    const scheduleNextSpawn = () => {
      if (!isActive) return;
      
      const interval = getSpawnInterval(elapsedTimeRef.current);
      
      spawnTimer = setTimeout(() => {
        if (!isActive) return;
        
        if (gameContainerRef.current) {
          const { clientWidth, clientHeight } = gameContainerRef.current;
          const newCard = generateCard(elapsedTimeRef.current, clientWidth, clientHeight);
          addCard(newCard);

          // Auto-remove card after lifespan
          setTimeout(() => {
            removeCard(newCard.id);
          }, newCard.lifespan);
        }
        
        // Schedule next spawn
        scheduleNextSpawn();
      }, interval);
    };

    // Start spawning immediately
    scheduleNextSpawn();

    return () => {
      isActive = false;
      if (spawnTimer) clearTimeout(spawnTimer);
    };
  }, [gameState.isPlaying, addCard, removeCard]);

  const handleCardTap = (cardId: string, type: "positive" | "negative") => {
    const card = gameState.cards.find((c) => c.id === cardId);
    if (!card) return;

    // Remove card
    removeCard(cardId);

    // Update score
    const points = type === "positive" ? 5 : -5;
    incrementScore(points);

    // Show score popup
    setScorePopups((prev) => [...prev, { id: cardId, points, x: card.x, y: card.y }]);
    setTimeout(() => {
      setScorePopups((prev) => prev.filter((p) => p.id !== cardId));
    }, 1000);

    // Handle negative card
    if (type === "negative") {
      incrementNegativeCards();
      setShake(true);
      setTimeout(() => setShake(false), 200);

      // Check if game should end
      if (gameState.negativeCardsTapped + 1 >= MAX_NEGATIVE_TAPS) {
        setTimeout(endGame, 500);
      }
    }
  };

  const endGame = () => {
    setGameState({ isPlaying: false });
    router.push("/verify");
  };

  return (
    <div
      ref={gameContainerRef}
      className={`relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 ${
        shake ? "animate-shake" : ""
      }`}
    >
      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-black/30 backdrop-blur-sm">
        <div className="text-white text-2xl font-bold">
          Strikes: <span className="text-red-400">{gameState.negativeCardsTapped}/{MAX_NEGATIVE_TAPS}</span>
        </div>
        <div className="text-white text-4xl font-bold">
          {gameState.timeRemaining}s
        </div>
        <div className="text-white text-2xl font-bold">
          Score: <span className="text-yellow-400">{gameState.score}</span>
        </div>
      </div>

      {/* Game Cards */}
      <AnimatePresence>
        {gameState.cards.map((card) => (
          <GameCard key={card.id} card={card} onTap={handleCardTap} />
        ))}
      </AnimatePresence>

      {/* Score Popups */}
      <AnimatePresence>
        {scorePopups.map((popup) => (
          <motion.div
            key={popup.id}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -100, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ position: "absolute", left: popup.x + 50, top: popup.y }}
            className={`text-4xl font-bold pointer-events-none ${
              popup.points > 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {popup.points > 0 ? "+" : ""}{popup.points}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

