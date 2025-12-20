"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const BIBLICAL_QUOTES = [
  "Be watchful, stand firm in the faith, act like men, be strong. — 1 Corinthians 16:13",
  "I can do all things through Christ who strengthens me. — Philippians 4:13",
  "The Lord is my strength and my shield. — Psalm 28:7",
  "Be strong and courageous. Do not be afraid. — Joshua 1:9",
];

export default function LandingPage() {
  const router = useRouter();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % BIBLICAL_QUOTES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Animated Background Quotes */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuoteIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1 }}
            className="text-white text-4xl md:text-6xl font-bold text-center px-8 max-w-5xl"
          >
            {BIBLICAL_QUOTES[currentQuoteIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Hero Image/Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-6xl md:text-8xl">✝️</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl font-bold text-white text-center mb-4"
        >
          JAAGO
        </motion.h1>

        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-2xl md:text-4xl font-semibold text-yellow-300 text-center mb-6"
        >
          Rise & React
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-lg md:text-xl text-white/90 text-center max-w-2xl mb-12 px-4"
        >
          Test your reflexes and faith! Tap the positive cards, avoid the negative ones.
          <br />
          Chase Christ with speed and precision!
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 215, 0, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/input")}
          className="px-12 py-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 text-2xl font-bold rounded-full shadow-2xl hover:from-yellow-300 hover:to-yellow-500 transition-all duration-300"
        >
          Start Game
        </motion.button>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12 text-white/60 text-sm text-center"
        >
          A faith-inspired game for church events
        </motion.p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-white/20 text-6xl animate-pulse">✨</div>
      <div className="absolute bottom-10 right-10 text-white/20 text-6xl animate-pulse delay-1000">🕊️</div>
      <div className="absolute top-1/2 right-20 text-white/20 text-4xl animate-bounce">⭐</div>
    </div>
  );
}
