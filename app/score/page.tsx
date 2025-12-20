"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getLeaderboard, resetLeaderboard, supabase } from "@/lib/supabase";
import { GameScore } from "@/lib/types";
import { useAppStore } from "@/lib/store";

export default function LeaderboardPage() {
  const router = useRouter();
  const playerData = useAppStore((state) => state.playerData);

  const [scores, setScores] = useState<GameScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetPassword, setResetPassword] = useState("");

  useEffect(() => {
    loadScores();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("game_scores_changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "game_scores" }, () => {
        loadScores();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadScores = async () => {
    setLoading(true);
    const data = await getLeaderboard(20);
    setScores(data);
    setLoading(false);
  };

  const handleReset = async () => {
    // Simple password protection (in production, use proper auth)
    if (resetPassword === "JAAGO2024") {
      const { success } = await resetLeaderboard();
      if (success) {
        setScores([]);
        setShowResetConfirm(false);
        setResetPassword("");
        alert("Leaderboard reset successfully!");
      } else {
        alert("Failed to reset leaderboard");
      }
    } else {
      alert("Incorrect password!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">🏆 Leaderboard 🏆</h1>
          <p className="text-white/70 text-xl">Top Faithful Servants</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : scores.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-white/60 text-2xl">No scores yet. Be the first to play!</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border-2 border-white/20"
          >
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 p-4 bg-white/5 border-b border-white/20 font-bold text-white text-sm md:text-base">
              <div className="text-center">Rank</div>
              <div>Name</div>
              <div className="text-center">Age</div>
              <div>Location</div>
              <div className="text-center">Score</div>
              <div className="text-center">Strikes</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-white/10">
              {scores.map((score, index) => {
                const isCurrentPlayer = playerData && score.player_name === playerData.name;
                const rankColor =
                  index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-300" : index === 2 ? "text-orange-400" : "text-white";

                return (
                  <motion.div
                    key={score.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`grid grid-cols-6 gap-4 p-4 text-white text-sm md:text-base ${
                      isCurrentPlayer ? "bg-green-500/20 border-l-4 border-green-400" : ""
                    }`}
                  >
                    <div className={`text-center font-bold text-xl ${rankColor}`}>
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                    </div>
                    <div className="font-semibold truncate">{score.player_name}</div>
                    <div className="text-center">{score.player_age}</div>
                    <div className="truncate text-sm">{score.player_location}</div>
                    <div className="text-center font-bold text-yellow-400">{score.final_score}</div>
                    <div className="text-center text-red-400">{score.negative_cards_tapped}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="px-8 py-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xl font-bold rounded-full shadow-lg"
          >
            Back to Home
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowResetConfirm(true)}
            className="px-8 py-4 bg-gradient-to-r from-red-400 to-red-600 text-white text-xl font-bold rounded-full shadow-lg"
          >
            Reset Leaderboard
          </motion.button>
        </motion.div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full border-2 border-white/20"
            >
              <h2 className="text-3xl font-bold text-white mb-4">Reset Leaderboard</h2>
              <p className="text-white/80 mb-6">Enter password to reset all scores:</p>
              <input
                type="password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border-2 border-white/30 mb-6 text-lg"
                placeholder="Password"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold"
                >
                  Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

