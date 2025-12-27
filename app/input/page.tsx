"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { INDIAN_STATES } from "@/lib/types";
import VoiceInput from "@/components/VoiceInput";

export default function InputPage() {
  const router = useRouter();
  const setPlayerData = useAppStore((state) => state.setPlayerData);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [useKeyboard, setUseKeyboard] = useState(false);

  const isValid = name.trim() !== "" && location !== "";

  const handleContinue = () => {
    if (isValid) {
      setPlayerData({ name, location });
      router.push("/prepare");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0a0a1a] flex flex-col items-center py-12 px-4">
      {/* Background */}
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
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
            Player Profile
          </h1>
          <p className="text-white/40 uppercase tracking-[0.2em] text-sm">
            Step 1: Identification
          </p>
        </motion.div>

        {/* Main Card */}
        <div className="bg-white/[0.02] border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          {/* NAME INPUT */}
          <motion.section variants={itemVariants} className="mb-14">
            <div className="flex flex-col items-center text-center">
              <span className="text-yellow-400/80 text-xs font-bold uppercase tracking-widest mb-4">
                Identity
              </span>

              <div className="w-full max-w-md">
                {!useKeyboard ? (
                  <>
                    <VoiceInput
                      onNameCapture={setName}
                      currentName={name}
                    />
                    <p className="mt-4 text-white/50 text-sm">
                      Say your name clearly into the microphone
                    </p>

                    <button
                      onClick={() => setUseKeyboard(true)}
                      className="mt-3 text-sm underline text-yellow-400 hover:text-yellow-300"
                    >
                      Use Keyboard Instead
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name will appear here"
                      className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
                    />

                    <button
                      onClick={() => setUseKeyboard(false)}
                      className="mt-3 text-sm underline text-yellow-400 hover:text-yellow-300"
                    >
                      Use Microphone Instead
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.section>

          {/* STATE SELECTION */}
          <motion.section variants={itemVariants} className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">
              Your State
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

        {/* CONTINUE BUTTON */}
        <motion.div variants={itemVariants} className="flex flex-col items-center mt-12">
          <AnimatePresence>
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
            className={`px-20 py-5 rounded-2xl text-xl font-black transition-all duration-500 ${
              isValid
                ? "bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 text-gray-950 shadow-[0_10px_40px_rgba(16,185,129,0.3)]"
                : "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
            }`}
          >
            CONTINUE →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
