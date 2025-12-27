"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Orbitron, Rajdhani } from "next/font/google";
import { useAppStore } from "@/lib/store";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700", "900"] });
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["500", "700"] });

const HAIL_MARYS = [
  "Hail Mary 1",
  "Hail Mary 2",
  "Hail Mary 3",
  "Hail Mary 4",
  "Hail Mary 5"
];

export default function VerifyPage() {
  const router = useRouter();
  const securityCode = useAppStore((state) => state.securityCode);

  const [inputCode, setInputCode] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showPunishment, setShowPunishment] = useState(false);
  const [hailMarysChecked, setHailMarysChecked] = useState<boolean[]>(Array(5).fill(false));
  const [isError, setIsError] = useState(false);

  const handleNumberClick = (num: string) => {
    if (inputCode.length < 6) {
      setIsError(false);
      setInputCode(prev => prev + num);
    }
  };

  const handleClear = () => {
    setInputCode("");
    setIsError(false);
  };

  const handleSubmit = () => {
    if (inputCode === securityCode) {
      router.push("/results");
    } else {
      setIsError(true);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 2) {
        setTimeout(() => setShowPunishment(true), 600);
      } else {
        // Shake and reset
        setTimeout(() => setInputCode(""), 500);
      }
    }
  };

  const toggleHailMary = (index: number) => {
    const newChecked = [...hailMarysChecked];
    newChecked[index] = !newChecked[index];
    setHailMarysChecked(newChecked);
  };

  const allHailMarysChecked = hailMarysChecked.every((checked) => checked);

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.05 } }
  };

  const keyVars = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050510] ${rajdhani.className}`}>
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 transition-colors duration-1000 ${showPunishment ? 'bg-red-950/40' : 'bg-indigo-950/20'}`} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,_rgba(120,119,198,0.15)_0%,_transparent_50%)]" />
        {/* Floating Crosses Iconography */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center text-[40rem]">
          †
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showPunishment ? (
          /* --- VERIFICATION VIEW --- */
          <motion.div
            key="verify"
            variants={containerVars}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -50 }}
            className="relative z-10 w-full max-w-md px-6"
          >
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              
              {/* Attempts Tracker */}
              <div className="flex justify-center gap-2 mb-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-12 h-1.5 rounded-full transition-all duration-500 ${i < attempts ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-white/20'}`} />
                  </div>
                ))}
              </div>

              <h1 className="text-2xl font-bold text-white text-center mb-8 tracking-widest uppercase opacity-60">
                Security Mandate
              </h1>

              {/* Code Display Area */}
              <motion.div 
                animate={isError ? { x: [-5, 5, -5, 5, 0] } : {}}
                className={`relative bg-black/40 rounded-2xl p-6 mb-8 border transition-colors ${isError ? 'border-red-500/50' : 'border-white/10'}`}
              >
                <p className={`text-5xl font-black text-center tracking-[0.2em] ${orbitron.className} ${isError ? 'text-red-400' : 'text-white'}`}>
                  {inputCode.padEnd(6, "•").split("").map((char, i) => (
                    <motion.span 
                      key={i} 
                      initial={false}
                      animate={inputCode[i] ? { scale: [1.2, 1], opacity: 1 } : { opacity: 0.3 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </p>
                {isError && <p className="absolute -bottom-6 left-0 w-full text-center text-red-400 text-xs font-bold uppercase tracking-widest">Incorrect Access Code</p>}
              </motion.div>

              {/* Keypad Grid */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "OK"].map((btn) => (
                  <motion.button
                    key={btn}
                    variants={keyVars}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (btn === "C") handleClear();
                      else if (btn === "OK") handleSubmit();
                      else handleNumberClick(btn.toString());
                    }}
                    className={`h-20 rounded-2xl text-2xl font-bold transition-all border flex items-center justify-center ${
                      btn === "OK" 
                        ? (inputCode.length === 6 ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.2)]' : 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed')
                        : btn === "C"
                        ? 'bg-red-500/10 border-red-500/20 text-red-400'
                        : 'bg-white/5 border-white/10 text-white'
                    } ${orbitron.className}`}
                  >
                    {btn}
                  </motion.button>
                ))}
              </div>

              <button
                onClick={() => setShowPunishment(true)}
                className="w-full text-white/30 hover:text-white/60 text-xs uppercase tracking-[0.2em] transition-colors"
              >
                I have forgotten the word
              </button>
            </div>
          </motion.div>
        ) : (
          /* --- PUNISHMENT / PENANCE VIEW --- */
          <motion.div
            key="punishment"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 w-full max-w-2xl px-6"
          >
            <div className="bg-black/60 backdrop-blur-3xl border border-red-500/30 rounded-[3rem] p-8 md:p-12 shadow-[0_0_60px_rgba(239,68,68,0.15)]">
              <div className="text-center mb-10">
                <motion.div 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-red-500 text-6xl mb-4"
                >
                  †
                </motion.div>
                <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">Divine Penance</h2>
                <p className="text-red-400/60 uppercase tracking-widest text-sm">Recite 5 Hail Marys to Redeem your score</p>
              </div>

              <div className="space-y-3 mb-10">
                {HAIL_MARYS.map((prayer, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1, transition: { delay: index * 0.1 } }}
                    onClick={() => toggleHailMary(index)}
                    className={`group relative p-5 rounded-2xl cursor-pointer border-2 transition-all duration-500 ${
                      hailMarysChecked[index]
                        ? "bg-emerald-500/10 border-emerald-500/50"
                        : "bg-white/5 border-white/10 hover:border-red-500/30"
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        hailMarysChecked[index] ? "bg-emerald-500 border-emerald-400 scale-110" : "bg-transparent border-white/20"
                      }`}>
                        {hailMarysChecked[index] && (
                          <motion.svg 
                            initial={{ pathLength: 0 }} 
                            animate={{ pathLength: 1 }} 
                            className="w-5 h-5 text-white" 
                            viewBox="0 0 20 20" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="3"
                          >
                            <polyline points="4 11 8 15 16 6" />
                          </motion.svg>
                        )}
                      </div>
                      <span className={`text-lg font-medium transition-colors ${hailMarysChecked[index] ? 'text-emerald-400' : 'text-white/70'}`}>
                        {prayer}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={allHailMarysChecked ? { scale: 1.02 } : {}}
                whileTap={allHailMarysChecked ? { scale: 0.98 } : {}}
                onClick={() => router.push("/results")}
                disabled={!allHailMarysChecked}
                className={`w-full py-6 rounded-2xl text-xl font-black transition-all duration-500 relative overflow-hidden ${
                  allHailMarysChecked
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_10px_30px_rgba(16,185,129,0.4)]"
                    : "bg-white/5 text-white/20 border border-white/10 cursor-not-allowed"
                }`}
              >
                {allHailMarysChecked && (
                  <motion.div 
                    animate={{ x: ['-100%', '100%'] }} 
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" 
                  />
                )}
                ABSALUTION GRANTED
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}