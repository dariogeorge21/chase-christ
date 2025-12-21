"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { INDIAN_STATES, AGE_RANGE } from "@/lib/types";
import VoiceInput from "@/components/VoiceInput";

export default function InputPage() {
  const router = useRouter();
  const setPlayerData = useAppStore((state) => state.setPlayerData);

  const [name, setName] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [location, setLocation] = useState("");

  const isValid = name.trim() !== "" && age !== null && location !== "";

  const handleContinue = () => {
    if (isValid) {
      setPlayerData({ name, age: age!, location });
      router.push("/prepare");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0a0a1a] flex flex-col items-center py-12 px-4">
      
      {/* --- BACKGROUND DECOR (Consistent with Landing) --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-5xl"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            Player Profile
          </h1>
          <p className="text-white/40 uppercase tracking-[0.2em] text-sm">Step 1: Identification</p>
        </motion.div>

        {/* Main Glass Form Container */}
        <div className="bg-white/[0.02] border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          
          {/* 1. Voice Input Section */}
          <motion.section variants={itemVariants} className="mb-14">
            <div className="flex flex-col items-center">
              <span className="text-yellow-400/80 text-xs font-bold uppercase tracking-widest mb-4">Identity</span>
              <div className="p-1 rounded-full bg-gradient-to-r from-white/5 to-white/10 border border-white/10">
                <VoiceInput onNameCapture={setName} currentName={name} />
              </div>
              <p className="mt-4 text-white/50 text-sm">Speak or click the mic to enter your name</p>
            </div>
          </motion.section>

          {/* 2. Age Selection */}
          <motion.section variants={itemVariants} className="mb-14">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-white/20" />
              Select Your Age
              <span className="h-px w-8 bg-white/20" />
            </h2>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {AGE_RANGE.map((ageValue) => (
                <button
                  key={ageValue}
                  onClick={() => setAge(ageValue)}
                  className={`relative min-w-[50px] h-[50px] rounded-xl font-bold transition-all duration-300 overflow-hidden border ${
                    age === ageValue
                      ? "bg-yellow-400 text-gray-950 border-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.4)] scale-110"
                      : "bg-white/5 text-white border-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  {ageValue}
                </button>
              ))}
            </div>
          </motion.section>

          {/* 3. Location Selection */}
          <motion.section variants={itemVariants} className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-white/20" />
              Your State
              <span className="h-px w-8 bg-white/20" />
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {INDIAN_STATES.map((state) => (
                <button
                  key={state}
                  onClick={() => setLocation(state)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
                    location === state
                      ? "bg-white text-gray-950 border-white shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                      : "bg-white/5 text-white/70 border-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Continue Button Area */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col items-center mt-12"
        >
          <AnimatePresence mode="wait">
            {!isValid && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="text-white/30 text-sm mb-4 italic"
              >
                Please complete all fields to proceed
              </motion.p>
            )}
          </AnimatePresence>

          <button
            onClick={handleContinue}
            disabled={!isValid}
            className={`group relative px-20 py-5 rounded-2xl text-xl font-black transition-all duration-500 overflow-hidden ${
              isValid
                ? "bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 text-gray-950 shadow-[0_10px_40px_rgba(16,185,129,0.3)] cursor-pointer"
                : "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
            }`}
          >
            {/* Shimmer for active button */}
            {isValid && (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              CONTINUE {isValid && <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity }}>→</motion.span>}
            </span>
          </button>
        </motion.div>
      </motion.div>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        /* Custom scrollbar for better aesthetics if needed */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}