"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-5xl font-bold text-white text-center mb-8"
        >
          Player Information
        </motion.h1>

        {/* Voice Input for Name */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          <VoiceInput onNameCapture={setName} currentName={name} />
        </motion.div>

        {/* Age Selection */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">Select Your Age</h2>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-3 max-w-4xl mx-auto">
            {AGE_RANGE.map((ageValue) => (
              <motion.button
                key={ageValue}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAge(ageValue)}
                className={`py-3 px-4 rounded-lg font-bold text-lg transition-all ${
                  age === ageValue
                    ? "bg-yellow-400 text-gray-900 shadow-lg scale-110"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {ageValue}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Location Selection */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">Select Your State</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto">
            {INDIAN_STATES.map((state) => (
              <motion.button
                key={state}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLocation(state)}
                className={`py-4 px-4 rounded-lg font-semibold transition-all ${
                  location === state
                    ? "bg-yellow-400 text-gray-900 shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {state}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center mt-12"
        >
          <motion.button
            whileHover={isValid ? { scale: 1.05 } : {}}
            whileTap={isValid ? { scale: 0.95 } : {}}
            onClick={handleContinue}
            disabled={!isValid}
            className={`px-16 py-5 rounded-full text-2xl font-bold transition-all ${
              isValid
                ? "bg-gradient-to-r from-green-400 to-green-600 text-white shadow-2xl cursor-pointer"
                : "bg-gray-500 text-gray-300 cursor-not-allowed"
            }`}
          >
            Continue
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

