"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Orbitron, Rajdhani } from "next/font/google";
import { useAppStore } from "@/lib/store";
import { generateCard, getSpawnInterval } from "@/lib/gameLogic";
import GameCard from "@/components/GameCard";

// Load Gaming Fonts
const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700", "900"] });
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["500", "700"] });

const MAX_NEGATIVE_TAPS = 3;
const GAME_DURATION = 90;

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
  const [isShaking, setIsShaking] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const elapsedTimeRef = useRef(0);
  
  // Audio refs for sound effects
  const jesusClickAudioRef = useRef<HTMLAudioElement | null>(null);
  const devilClickAudioRef = useRef<HTMLAudioElement | null>(null);
  const gameOverAudioRef = useRef<HTMLAudioElement | null>(null);
  const gameSuccessAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio objects
  useEffect(() => {
    jesusClickAudioRef.current = new Audio('/audio/jesus_click.mp3');
    devilClickAudioRef.current = new Audio('/audio/devil_click.mp3');
    gameOverAudioRef.current = new Audio('/audio/game_over.mp3');
    gameSuccessAudioRef.current = new Audio('/audio/game_success.mp3');

    // Preload audio files
    jesusClickAudioRef.current.preload = 'auto';
    devilClickAudioRef.current.preload = 'auto';
    gameOverAudioRef.current.preload = 'auto';
    gameSuccessAudioRef.current.preload = 'auto';

    // Cleanup function
    return () => {
      jesusClickAudioRef.current = null;
      devilClickAudioRef.current = null;
      gameOverAudioRef.current = null;
      gameSuccessAudioRef.current = null;
    };
  }, []);

  // Function to play audio with error handling
  const playAudio = (audioRef: React.RefObject<HTMLAudioElement | null>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset to beginning
      audioRef.current.play().catch(error => {
        console.warn('Audio playback failed:', error);
      });
    }
  };

  // --- LOGIC: GAME STATE & TIMERS (Intact) ---
  useEffect(() => {
    setGameState({ isPlaying: true, timeRemaining: GAME_DURATION, score: 0, negativeCardsTapped: 0, cards: [] });
  }, [setGameState]);

  useEffect(() => {
    if (!gameState.isPlaying) return;
    const timer = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 1;
        elapsedTimeRef.current = newTime;
        return newTime;
      });
      setGameState({ timeRemaining: Math.max(0, gameState.timeRemaining - 1) });
      if (gameState.timeRemaining <= 1 || gameState.negativeCardsTapped >= MAX_NEGATIVE_TAPS) endGame();
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState.isPlaying, gameState.timeRemaining, gameState.negativeCardsTapped]);

  useEffect(() => {
    if (!gameState.isPlaying) return;
    let spawnTimer: NodeJS.Timeout;
    let isActive = true;

    const scheduleNextSpawn = () => {
      if (!isActive) return;
      const interval = getSpawnInterval(elapsedTimeRef.current);
      spawnTimer = setTimeout(() => {
        if (!isActive && gameContainerRef.current) return;
        const { clientWidth, clientHeight } = gameContainerRef.current!;
        const newCard = generateCard(elapsedTimeRef.current, clientWidth, clientHeight);
        addCard(newCard);
        setTimeout(() => removeCard(newCard.id), newCard.lifespan);
        scheduleNextSpawn();
      }, interval);
    };
    scheduleNextSpawn();
    return () => { isActive = false; clearTimeout(spawnTimer); };
  }, [gameState.isPlaying]);

  const handleCardTap = (cardId: string, type: "positive" | "negative") => {
    const card = gameState.cards.find((c) => c.id === cardId);
    if (!card) return;
    
    // Play appropriate sound effect
    if (type === "positive") {
      playAudio(jesusClickAudioRef);
    } else {
      playAudio(devilClickAudioRef);
    }
    
    removeCard(cardId);
    const points = type === "positive" ? 5 : -5;
    incrementScore(points);
    setScorePopups((prev) => [...prev, { id: cardId, points, x: card.x, y: card.y }]);
    setTimeout(() => setScorePopups((prev) => prev.filter((p) => p.id !== cardId)), 800);

    if (type === "negative") {
      incrementNegativeCards();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
    }
  };

  const endGame = () => {
    // Determine if the game was won (time ran out) or lost (3 negative cards tapped)
    const isGameWon = gameState.negativeCardsTapped < MAX_NEGATIVE_TAPS;
    
    // Play appropriate end game sound
    if (isGameWon) {
      playAudio(gameSuccessAudioRef);
    } else {
      playAudio(gameOverAudioRef);
    }
    
    setGameState({ isPlaying: false });
    router.push("/verify");
  };

  return (
    <motion.div
      ref={gameContainerRef}
      animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.2 }}
      className={`relative min-h-screen w-full overflow-hidden bg-[#050510] ${rajdhani.className}`}
    >
      {/* --- BACKGROUND ENHANCEMENTS --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a40_0%,_#050510_100%)]" />
        {/* Animated Particles */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [Math.random() * 1000, -100], 
                opacity: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 100]
              }}
              transition={{ duration: Math.random() * 10 + 5, repeat: Infinity, ease: "linear" }}
              className="absolute w-1 h-1 bg-blue-300 rounded-full blur-[1px]"
              style={{ left: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
        {/* Subtle Edge Vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_150px_black] pointer-events-none" />
      </div>

      {/* --- PREMIUM HUD --- */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 flex justify-between items-center shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          
          {/* Strikes Counter */}
          <div className="flex flex-col items-start px-4">
            <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Soul Health</span>
            <div className="flex gap-2">
              {[...Array(MAX_NEGATIVE_TAPS)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={i < gameState.negativeCardsTapped ? { 
                    backgroundColor: "#ef4444", 
                    boxShadow: "0 0 15px #ef4444",
                    scale: [1, 1.3, 1] 
                  } : {}}
                  className={`w-6 h-2 rounded-full border border-white/20 ${
                    i < gameState.negativeCardsTapped ? "bg-red-500" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Timer with Pulsing Warning */}
          <motion.div 
            animate={gameState.timeRemaining <= 10 ? { 
              scale: [1, 1.1, 1],
              color: ["#ffffff", "#ef4444", "#ffffff"] 
            } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
            className={`flex flex-col items-center ${orbitron.className}`}
          >
            <span className="text-4xl md:text-5xl font-black tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              {gameState.timeRemaining}s
            </span>
          </motion.div>

          {/* Score Counter */}
          <div className="flex flex-col items-end px-4">
            <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Total Glory</span>
            <motion.div 
              key={gameState.score}
              initial={{ scale: 1.2, color: "#facc15" }}
              animate={{ scale: 1, color: "#ffffff" }}
              className={`text-2xl md:text-3xl font-bold ${orbitron.className}`}
            >
              {String(gameState.score).padStart(4, '0')}
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- GAMEPLAY AREA --- */}
      <div className="relative z-10 w-full h-screen">
        <AnimatePresence>
          {gameState.cards.map((card) => (
            <GameCard key={card.id} card={card} onTap={handleCardTap} />
          ))}
        </AnimatePresence>

        {/* --- ENHANCED SCORE POPUPS --- */}
        <AnimatePresence>
          {scorePopups.map((popup) => (
            <motion.div
              key={popup.id}
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: 1, y: -120, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              style={{ position: "absolute", left: popup.x + 40, top: popup.y }}
              className={`text-5xl font-black pointer-events-none ${orbitron.className} ${
                popup.points > 0 
                  ? "text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]" 
                  : "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]"
              }`}
            >
              {popup.points > 0 ? `+${popup.points}` : popup.points}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Subtle Screen Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Scanning line for high-tech feel */}
        <motion.div 
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[1px] bg-white/5 blur-sm"
        />
      </div>

      <style jsx global>{`
        .animate-shake {
          animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </motion.div>
  );
}