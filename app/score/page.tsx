"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Orbitron, Rajdhani } from "next/font/google";
import { getLeaderboard, resetLeaderboard, supabase } from "@/lib/supabase";
import { GameScore } from "@/lib/types";
import { useAppStore } from "@/lib/store";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700", "900"] });
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["500", "700"] });

export default function LeaderboardPage() {
  const router = useRouter();
  const playerData = useAppStore((state) => state.playerData);

  const [scores, setScores] = useState<GameScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetPassword, setResetPassword] = useState("");

  useEffect(() => {
    loadScores();
    const channel = supabase
      .channel("game_scores_changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "game_scores" }, () => {
        loadScores();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadScores = async () => {
    setLoading(true);
    const data = await getLeaderboard(20);
    setScores(data);
    setLoading(false);
  };

  const handleReset = async () => {
    if (resetPassword === "jaago") {
      const { success } = await resetLeaderboard();
      if (success) {
        setScores([]);
        setShowResetConfirm(false);
        setResetPassword("");
      }
    }
  };

  return (
    <div className={`relative min-h-screen bg-[#050510] py-12 px-4 overflow-x-hidden ${rajdhani.className}`}>
      
      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1e1b4b_0%,_#050510_100%)]" />
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [-20, -1200], opacity: [0, 0.3, 0], x: [0, Math.random() * 50] }}
            transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, ease: "linear" }}
            className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
            style={{ left: `${Math.random() * 100}%`, bottom: "-5%" }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block text-6xl mb-4"
          >
            🏆
          </motion.div>
          <h1 className={`text-5xl md:text-7xl font-black text-white tracking-tighter italic ${orbitron.className}`}>
            HALL OF LIGHT
          </h1>
          <div className="h-1 w-24 bg-yellow-400 mx-auto rounded-full mt-4 shadow-[0_0_20px_#eab308]" />
        </motion.div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-t-4 border-yellow-400 border-r-4 border-transparent rounded-full shadow-[0_0_15px_#eab308]"
            />
            <p className="mt-6 text-white/40 tracking-widest uppercase text-sm animate-pulse">Consulting the Scrolls...</p>
          </div>
        ) : (
          <motion.div
            className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
          >
            {/* Legend Header */}
            <div className="grid grid-cols-6 gap-4 p-6 bg-white/5 border-b border-white/10 text-white/40 font-bold uppercase tracking-widest text-[10px] md:text-xs">
              <div className="text-center">Rank</div>
              <div className="col-span-2">Servant</div>
              <div className="text-center">Origin</div>
              <div className="text-center">Glory</div>
              <div className="text-center">Strikes</div>
            </div>

            {/* List Body */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              <AnimatePresence>
                {scores.map((score, index) => {
                  const isCurrentPlayer = playerData && score.player_name === playerData.name;
                  const isTopThree = index < 3;
                  const rankColors = ["text-yellow-400", "text-slate-300", "text-amber-600"];

                  return (
                    <motion.div
                      key={score.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.05)", scale: 1.01 }}
                      className={`grid grid-cols-6 gap-4 p-5 items-center transition-all border-b border-white/5 ${
                        isCurrentPlayer ? "bg-emerald-500/10 border-l-4 border-l-emerald-400" : ""
                      }`}
                    >
                      <div className={`text-center font-black text-2xl ${orbitron.className} ${isTopThree ? rankColors[index] : "text-white/20"}`}>
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                      </div>
                      
                      <div className="col-span-2 flex flex-col">
                        <span className="text-white font-bold text-lg md:text-xl truncate flex items-center gap-2">
                          {score.player_name}
                          {isCurrentPlayer && (
                            <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full animate-pulse">YOU</span>
                          )}
                        </span>
                        <span className="text-white/30 text-xs">Age: {score.player_age}</span>
                      </div>

                      <div className="text-center text-white/60 text-sm truncate">{score.player_location}</div>
                      
                      <div className={`text-center font-black text-xl md:text-2xl ${orbitron.className} ${isTopThree ? "text-yellow-400" : "text-white"}`}>
                        {score.final_score}
                      </div>

                      <div className="text-center">
                        <div className="inline-flex gap-1">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full ${i < score.negative_cards_tapped ? "bg-red-500 shadow-[0_0_8px_red]" : "bg-white/10"}`} />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="px-12 py-5 bg-white text-gray-950 text-xl font-black rounded-2xl shadow-[0_10px_30px_rgba(255,255,255,0.1)] flex items-center gap-3"
          >
            <span>←</span> RETURN TO HOME
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowResetConfirm(true)}
            className="px-8 py-5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-lg font-bold rounded-2xl transition-all"
          >
            RESET TEMPLE SCROLLS
          </motion.button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#050510]/95 backdrop-blur-md flex items-center justify-center z-[100] px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white/[0.05] border border-white/10 rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-[0_0_50px_rgba(0,0,0,1)]"
            >
              <div className="text-red-500 text-5xl mb-6">⚠️</div>
              <h2 className={`text-2xl font-black text-white mb-2 ${orbitron.className}`}>PURGE RECORDS?</h2>
              <p className="text-white/50 mb-8 uppercase tracking-widest text-xs">Enter High Priest Password</p>
              
              <input
                type="password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-xl bg-white/5 text-white border border-white/10 mb-8 text-center text-2xl focus:outline-none focus:border-yellow-400 transition-colors"
                placeholder="••••"
              />
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-4 text-white/40 font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-4 bg-red-500 text-white rounded-xl font-black shadow-[0_10px_20px_rgba(239,68,68,0.3)]"
                >
                  PURGE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}