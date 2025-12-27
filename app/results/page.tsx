"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Orbitron, Rajdhani } from "next/font/google";
import { useAppStore } from "@/lib/store";
import { saveGameScore } from "@/lib/supabase";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700", "900"] });
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["500", "700"] });

// --- Component: Sacred Confetti ---
const Confetti = () => {
  const shapes = ["circle", "cross", "star"];
  const colors = ["#FACC15", "#FFFFFF", "#60A5FA", "#F472B6"];
  
  // Memoize particles to prevent recreation on every render
  const particles = useMemo(() => 
    Array.from({ length: 40 }).map(() => ({
      startX: Math.random() * 100,
      endX: Math.random() * 100,
      scale: Math.random() * 0.5 + 0.5,
      duration: 4 + Math.random() * 3,
      delay: Math.random() * 5,
      xWiggle: (Math.random() - 0.5) * 20,
    })),
    []
  );
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle, i) => {
        const shape = shapes[i % shapes.length];
        const color = colors[i % colors.length];
        return (
          <motion.div
            key={i}
            initial={{ y: -20, x: `${particle.startX}%`, opacity: 1, scale: particle.scale }}
            animate={{ 
              y: "110vh", 
              x: `${particle.endX + particle.xWiggle}%`,
              rotate: 720 
            }}
            transition={{ 
              duration: particle.duration, 
              repeat: Infinity, 
              ease: "linear",
              delay: particle.delay 
            }}
            className="fixed"
            style={{ color, left: `${particle.startX}%`, top: "-20px" }}
          >
            {shape === "cross" && <span className="text-xl">†</span>}
            {shape === "circle" && <div className="w-2 h-2 rounded-full bg-current" />}
            {shape === "star" && <span className="text-lg">✦</span>}
          </motion.div>
        );
      })}
    </div>
  );
};

export default function ResultsPage() {
  const router = useRouter();
  const playerData = useAppStore((state) => state.playerData);
  const gameState = useAppStore((state) => state.gameState);
  const resetAll = useAppStore((state) => state.resetAll);

  const [loading, setLoading] = useState(true);
  const [displayScore, setDisplayScore] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showBlast, setShowBlast] = useState(false);

  const finalScore = gameState.score;
  const negativeCards = gameState.negativeCardsTapped;

  // --- Logic: Loading & Saving ---
  useEffect(() => {
    setTimeout(() => setLoading(false), 2500);
  }, []);

  useEffect(() => {
    if (!loading && displayScore < finalScore) {
      const increment = Math.ceil(finalScore / 50) || 1;
      const timer = setTimeout(() => {
        setDisplayScore(Math.min(displayScore + increment, finalScore));
      }, 30);
      return () => clearTimeout(timer);
    } else if (!loading && displayScore === finalScore) {
      setShowBlast(true);
    }
  }, [loading, displayScore, finalScore]);

  useEffect(() => {
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
    if (finalScore > 100) return "Blessed are the swift! Outstanding faith!";
    if (finalScore >= 50) return "Well done, faithful servant!";
    return "Keep practicing! Faith grows with effort.";
  };

  const handlePlayAgain = () => {
    resetAll();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center w-32 h-32">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-b-2 border-yellow-400 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 border-t-2 border-white/20 rounded-full"
          />
          <motion.span 
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white text-4xl"
          >
            †
          </motion.span>
        </div>
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="mt-8 text-white/50 tracking-[0.3em] uppercase text-sm font-light"
        >
          Calculating Eternal Rewards
        </motion.p>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen bg-[#050510] flex items-center justify-center px-4 overflow-hidden ${rajdhani.className}`}>
      
      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#050510_100%)]" />
        <Confetti />
        {/* Divine Light Rays */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-full bg-[conic-gradient(from_0deg_at_50%_0%,_transparent_0%,_rgba(255,255,255,0.03)_25%,_transparent_50%)] animate-[spin_20s_linear_infinite]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 max-w-2xl w-full"
      >
        <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] p-8 md:p-16 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center">
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-2 text-yellow-400 text-xs font-black uppercase tracking-[0.5em]"
          >
            Journey Concluded
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tighter italic">
            GLORY ASCENDED
          </h1>

          {/* Score Monolith */}
          <div className="relative mb-12">
            <AnimatePresence>
              {showBlast && (
                <motion.div 
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl -z-10"
                />
              )}
            </AnimatePresence>
            
            <motion.div
              animate={showBlast ? { scale: [1, 1.05, 1] } : {}}
              className="relative inline-block"
            >
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-1">Final Score</p>
              <p className={`text-white text-8xl md:text-9xl font-black leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] ${orbitron.className}`}>
                {displayScore}
              </p>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center gap-8 mb-12 py-4 border-y border-white/5"
          >
            <div className="text-center">
              <p className="text-white/30 text-[10px] uppercase tracking-widest">Temptations Hit</p>
              <p className="text-red-400 text-2xl font-bold">{negativeCards}</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-center">
              <p className="text-white/30 text-[10px] uppercase tracking-widest">Divine Rank</p>
              <p className="text-emerald-400 text-2xl font-bold">
                {finalScore > 100 ? "Apostle" : finalScore > 50 ? "Disciple" : "Seeker"}
              </p>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-white text-xl md:text-2xl font-medium mb-12 italic leading-relaxed px-4"
          >
            "{getMessage()}"
          </motion.p>

          {/* Premium Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05, translateY: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayAgain}
              className="group relative px-10 py-5 bg-white text-[#050510] rounded-2xl text-lg font-black uppercase tracking-tighter overflow-hidden transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              Play Again
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, translateY: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/score")}
              className="group relative px-10 py-5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-950 rounded-2xl text-lg font-black uppercase tracking-tighter overflow-hidden transition-all shadow-[0_10px_30px_rgba(234,179,8,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              Leaderboard
            </motion.button>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}