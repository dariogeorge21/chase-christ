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
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a1a] flex items-center justify-center font-sans">
      
      {/* --- BACKGROUND LAYER --- */}
      {/* Dynamic Mesh Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#0a0a1a_100%)]" />
      </div>

      {/* Animated Background Quotes (Ethereal) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuoteIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 0.07, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="text-white text-3xl md:text-5xl lg:text-7xl font-serif italic text-center px-10 max-w-6xl leading-tight"
          >
            {BIBLICAL_QUOTES[currentQuoteIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- MAIN INTERFACE --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-4xl mx-4"
      >
        {/* Glass Card Container */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl px-8 py-16 md:px-16 md:py-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center">
          
          {/* Logo with Glow */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-32 h-32 md:w-44 md:h-44 mb-8"
          >
            <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full" />
            <img
              src="/jaago.png"
              alt="Jaago Logo"
              className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            />
          </motion.div>

          {/* Titles */}
          <div className="text-center space-y-2 mb-8">
            <motion.h1
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              animate={{ opacity: 1, letterSpacing: "0.05em" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 leading-none"
            >
              JAAGO
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xl md:text-2xl font-medium tracking-[0.3em] uppercase text-yellow-400/90"
            >
              Rise & React
            </motion.h2>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-white/60 text-center max-w-lg mb-12 text-base md:text-lg leading-relaxed font-light"
          >
            A high-speed spiritual journey. Test your reflexes, avoid distractions, and 
            <span className="text-white font-medium"> chase Christ </span> with precision.
          </motion.p>

          {/* Luxury CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/input")}
            className="group relative px-10 py-5 bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 rounded-2xl shadow-[0_0_20px_rgba(234,179,8,0.3)] overflow-hidden transition-all duration-300"
          >
            {/* Button Shimmer Effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            
            <span className="relative z-10 text-gray-950 text-xl font-bold tracking-tight">
              Enter The Game
            </span>
          </motion.button>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-12 flex items-center gap-3 text-white/30 text-xs tracking-widest uppercase"
          >
            <div className="h-px w-8 bg-white/20" />
            Faith-Inspired Experience
            <div className="h-px w-8 bg-white/20" />
          </motion.div>
        </div>
      </motion.div>

      {/* --- DECORATIVE FLOATING ELEMENTS --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <FloatingIcon icon="✨" delay={0} top="15%" left="10%" />
        <FloatingIcon icon="🕊️" delay={2} bottom="15%" right="10%" />
        <FloatingIcon icon="⭐" delay={1} top="40%" right="5%" />
        <FloatingIcon icon="🛡️" delay={3} bottom="20%" left="5%" />
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

function FloatingIcon({ icon, delay, top, bottom, left, right }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0.1, 0.3, 0.1],
        y: [0, -20, 0],
      }}
      transition={{ 
        duration: 5, 
        delay, 
        repeat: Infinity,
        ease: "easeInOut" 
      }}
      style={{ position: 'absolute', top, bottom, left, right }}
      className="text-4xl md:text-6xl filter blur-[1px]"
    >
      {icon}
    </motion.div>
  );
}