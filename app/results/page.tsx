"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { saveGameScore } from "@/lib/supabase";

export default function ResultsPage() {
  const router = useRouter();
  const playerData = useAppStore((state) => state.playerData);
  const gameState = useAppStore((state) => state.gameState);
  const resetAll = useAppStore((state) => state.resetAll);

  const [loading, setLoading] = useState(true);
  const [displayScore, setDisplayScore] = useState(0);
  const [saved, setSaved] = useState(false);

  const finalScore = gameState.score;
  const negativeCards = gameState.negativeCardsTapped;

  useEffect(() => {
    // Loading phase
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);

  useEffect(() => {
    // Animate score count-up
    if (!loading && displayScore < finalScore) {
      const increment = Math.ceil(finalScore / 50);
      const timer = setTimeout(() => {
        setDisplayScore(Math.min(displayScore + increment, finalScore));
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [loading, displayScore, finalScore]);

  useEffect(() => {
    // Save score to database
    if (!loading && !saved && playerData) {
      const saveScore = async () => {
        await saveGameScore({
          player_name: playerData.name,
          player_age: playerData.age,
          player_location: playerData.location,
          final_score: finalScore,
          negative_cards_tapped: negativeCards,
          game_duration_seconds: 90 - gameState.timeRemaining,
        });
        setSaved(true);
      };
      saveScore();
    }
  }, [loading, saved, playerData, finalScore, negativeCards, gameState.timeRemaining]);

  const getMessage = () => {
    if (finalScore > 100) {
      return "Blessed are the swift! Outstanding faith!";
    } else if (finalScore >= 50) {
      return "Well done, faithful servant!";
    } else {
      return "Keep practicing! Faith grows with effort.";
    }
  };

  const handlePlayAgain = () => {
    resetAll();
    router.push("/");
  };

  const handleViewLeaderboard = () => {
    router.push("/score");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 border-8 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-white text-2xl font-semibold">Calculating your results...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center px-4 overflow-hidden">
      {/* Confetti effect for high scores */}
      {finalScore > 100 && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 1 }}
              animate={{ y: window.innerHeight + 100, rotate: 360 }}
              transition={{ duration: 3 + Math.random() * 2, delay: Math.random() * 2 }}
              className="absolute w-3 h-3 bg-yellow-400 rounded-full"
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-3xl p-12 border-2 border-white/20 text-center"
      >
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-bold text-white mb-8"
        >
          Game Complete!
        </motion.h1>

        {/* Score Display */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
          className="mb-8"
        >
          <p className="text-yellow-300 text-2xl font-semibold mb-2">Final Score</p>
          <p className="text-white text-8xl font-bold">{displayScore}</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8 space-y-2"
        >
          <p className="text-white/80 text-xl">
            Negative Cards Tapped: <span className="text-red-400 font-bold">{negativeCards}</span>
          </p>
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white text-2xl font-semibold mb-12 italic"
        >
          "{getMessage()}"
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayAgain}
            className="px-8 py-4 bg-gradient-to-r from-green-400 to-green-600 text-white text-xl font-bold rounded-full shadow-lg"
          >
            Play Again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewLeaderboard}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 text-xl font-bold rounded-full shadow-lg"
          >
            View Leaderboard
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

