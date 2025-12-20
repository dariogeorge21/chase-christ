"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

const HAIL_MARYS = ["Hail Mary 1", "Hail Mary 2", "Hail Mary 3", "Hail Mary 4", "Hail Mary 5"];

export default function VerifyPage() {
  const router = useRouter();
  const securityCode = useAppStore((state) => state.securityCode);

  const [inputCode, setInputCode] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showPunishment, setShowPunishment] = useState(false);
  const [hailMarysChecked, setHailMarysChecked] = useState<boolean[]>(Array(5).fill(false));
  const [error, setError] = useState("");

  const handleNumberClick = (num: string) => {
    if (inputCode.length < 6) {
      setInputCode(inputCode + num);
    }
  };

  const handleClear = () => {
    setInputCode("");
    setError("");
  };

  const handleSubmit = () => {
    if (inputCode === securityCode) {
      router.push("/results");
    } else {
      setError("Incorrect code!");
      setAttempts((prev) => prev + 1);

      if (attempts + 1 >= 2) {
        setShowPunishment(true);
      } else {
        setTimeout(() => {
          setInputCode("");
          setError("");
        }, 1500);
      }
    }
  };

  const handleForgotCode = () => {
    setShowPunishment(true);
  };

  const toggleHailMary = (index: number) => {
    const newChecked = [...hailMarysChecked];
    newChecked[index] = !newChecked[index];
    setHailMarysChecked(newChecked);
  };

  const allHailMarysChecked = hailMarysChecked.every((checked) => checked);

  const handlePunishmentContinue = () => {
    if (allHailMarysChecked) {
      router.push("/results");
    }
  };

  if (showPunishment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/20"
        >
          <h1 className="text-4xl font-bold text-white text-center mb-6">Penance Required</h1>
          <p className="text-xl text-white/90 text-center mb-8">
            Recite 5 Hail Marys to continue
          </p>

          <div className="space-y-4 mb-8">
            {HAIL_MARYS.map((prayer, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                onClick={() => toggleHailMary(index)}
                className={`p-6 rounded-xl cursor-pointer transition-all ${
                  hailMarysChecked[index]
                    ? "bg-green-500/30 border-2 border-green-400"
                    : "bg-white/5 border-2 border-white/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center ${
                      hailMarysChecked[index]
                        ? "bg-green-500 border-green-400"
                        : "bg-white/10 border-white/30"
                    }`}
                  >
                    {hailMarysChecked[index] && <span className="text-white text-xl">✓</span>}
                  </div>
                  <span className="text-white text-xl font-semibold">{prayer}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={allHailMarysChecked ? { scale: 1.05 } : {}}
            whileTap={allHailMarysChecked ? { scale: 0.95 } : {}}
            onClick={handlePunishmentContinue}
            disabled={!allHailMarysChecked}
            className={`w-full py-5 rounded-full text-2xl font-bold transition-all ${
              allHailMarysChecked
                ? "bg-gradient-to-r from-green-400 to-green-600 text-white cursor-pointer"
                : "bg-gray-500 text-gray-300 cursor-not-allowed"
            }`}
          >
            Continue
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/20"
      >
        <h1 className="text-3xl font-bold text-white text-center mb-6">Enter Security Code</h1>

        {/* Code Display */}
        <div className="bg-white/20 rounded-xl p-6 mb-6">
          <p className="text-5xl font-bold text-white text-center tracking-widest">
            {inputCode || "------"}
          </p>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-300 text-center mb-4 text-lg font-semibold"
          >
            {error}
          </motion.p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <motion.button
              key={num}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleNumberClick(num.toString())}
              className="bg-white/20 hover:bg-white/30 text-white text-3xl font-bold py-6 rounded-xl transition-all"
            >
              {num}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClear}
            className="bg-red-500/50 hover:bg-red-500/70 text-white text-xl font-bold py-4 rounded-xl"
          >
            Clear
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleNumberClick("0")}
            className="bg-white/20 hover:bg-white/30 text-white text-3xl font-bold py-4 rounded-xl"
          >
            0
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={inputCode.length !== 6}
            className={`text-white text-xl font-bold py-4 rounded-xl ${
              inputCode.length === 6
                ? "bg-green-500/50 hover:bg-green-500/70"
                : "bg-gray-500/30 cursor-not-allowed"
            }`}
          >
            Submit
          </motion.button>
        </div>

        <button
          onClick={handleForgotCode}
          className="w-full text-white/60 hover:text-white text-sm underline"
        >
          Forgot Code?
        </button>
      </motion.div>
    </div>
  );
}

