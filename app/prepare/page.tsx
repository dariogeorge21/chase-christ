"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

const MOTIVATIONAL_MESSAGES = [
  "Sharpening your reflexes…",
  "Angels are watching…",
  "Temptations incoming…",
];

// Custom floating symbol component for the background
const FloatingSymbol = ({ icon, delay, left, size }: any) => (
  <motion.div
    initial={{ y: "110vh", opacity: 0 }}
    animate={{ 
      y: "-10vh", 
      opacity: [0, 0.4, 0],
      rotate: 360 
    }}
    transition={{ 
      duration: 15, 
      repeat: Infinity, 
      delay, 
      ease: "linear" 
    }}
    className="absolute pointer-events-none text-white/10"
    style={{ left, fontSize: size }}
  >
    {icon}
  </motion.div>
);

export default function PreparePage() {
  const router = useRouter();
  const setSecurityCode = useAppStore((state) => state.setSecurityCode);

  const [stage, setStage] = useState<"loading" | "messages" | "code" | "countdown">("loading");
  const [messageIndex, setMessageIndex] = useState(0);
  const [securityCode, setLocalSecurityCode] = useState("");
  const [countdown, setCountdown] = useState(5);

  // Logic remains unchanged as per requirements
  useEffect(() => {
    const loadingTimer = setTimeout(() => setStage("messages"), 4500);
    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    if (stage === "messages") {
      if (messageIndex < MOTIVATIONAL_MESSAGES.length) {
        const messageTimer = setTimeout(() => setMessageIndex((prev) => prev + 1), 1500);
        return () => clearTimeout(messageTimer);
      } else {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setLocalSecurityCode(code);
        setSecurityCode(code);
        setStage("code");
      }
    }
  }, [stage, messageIndex, setSecurityCode]);

  useEffect(() => {
    if (stage === "code") {
      const codeTimer = setTimeout(() => setStage("countdown"), 5000);
      return () => clearTimeout(codeTimer);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === "countdown") {
      if (countdown > 0) {
        const countdownTimer = setTimeout(() => setCountdown((prev) => prev - 1), countdown > 2 ? 1500 : 500);
        return () => clearTimeout(countdownTimer);
      } else {
        router.push("/game");
      }
    }
  }, [stage, countdown, router]);

  return (
    <div className="relative min-h-screen bg-[#0a0a1a] flex items-center justify-center overflow-hidden">
      
      {/* --- LAYER 1: DIVINE BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950 opacity-50" />
        
        {/* Animated Light Rays */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,_rgba(120,119,198,0.3)_0%,_transparent_50%)]" />
        
        {/* Floating Symbols */}
        <FloatingSymbol icon="✨" delay={0} left="10%" size="2rem" />
        <FloatingSymbol icon="🕊️" delay={5} left="80%" size="3rem" />
        <FloatingSymbol icon="⭐" delay={2} left="40%" size="1.5rem" />
        <FloatingSymbol icon="✨" delay={8} left="70%" size="2.5rem" />
        
        {/* Subtle Particle Field */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      {/* --- LAYER 2: INTERACTIVE STAGES --- */}
      <AnimatePresence mode="wait">
        
        {/* STAGE 1: SACRED LOADING */}
        {stage === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 text-center"
          >
            <div className="relative w-32 h-32 mx-auto mb-10">
              {/* Pulsing Ripple Rings */}
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 border-2 border-white/20 rounded-full"
              />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                className="absolute inset-0 border-4 border-t-yellow-400 border-r-transparent border-b-white/10 border-l-transparent rounded-full animate-spin"
              />
              <div className="absolute inset-4 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
                <span className="text-2xl">🙏</span>
              </div>
            </div>
            <motion.p 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white text-2xl font-light tracking-[0.3em] uppercase"
            >
              Preparing your journey
            </motion.p>
          </motion.div>
        )}

        {/* STAGE 2: MOTIVATIONAL MESSAGES */}
        {stage === "messages" && (
          <motion.div
            key={`message-${messageIndex}`}
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)", scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 text-center px-6"
          >
            <h2 className="text-white text-4xl md:text-7xl font-black italic tracking-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              {MOTIVATIONAL_MESSAGES[messageIndex]}
            </h2>
            <div className="mt-6 h-1 w-24 bg-yellow-400 mx-auto rounded-full shadow-[0_0_15px_rgba(234,179,8,1)]" />
          </motion.div>
        )}

        {/* STAGE 3: SECURITY CODE (THE MANDATE) */}
        {stage === "code" && (
          <motion.div
            key="code"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -100 }}
            className="relative z-10 text-center"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-yellow-400 text-sm font-bold uppercase tracking-[0.5em] mb-4">Divine Mandate</p>
              <h3 className="text-white text-3xl font-light mb-8 italic">Memorize this code</h3>
            </motion.div>
            
            <div className="group relative">
              {/* Glowing Aura */}
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-[2rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              
              <motion.div
                initial={{ rotateX: 90 }}
                animate={{ rotateX: 0 }}
                transition={{ type: "spring", damping: 12 }}
                className="relative bg-white/[0.03] backdrop-blur-2xl rounded-[2rem] border-2 border-yellow-500/50 p-10 md:p-16 shadow-[0_0_50px_rgba(234,179,8,0.2)]"
              >
                <p className="text-white text-7xl md:text-9xl font-black tracking-[0.2em] drop-shadow-2xl">
                  {securityCode}
                </p>
                
                {/* Scanning line effect */}
                <motion.div 
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-[2px] bg-yellow-400/30 blur-sm"
                />
              </motion.div>
            </div>

            <p className="text-white/40 text-lg mt-10 font-light italic">
              "Thy word have I hid in mine heart..."
            </p>
          </motion.div>
        )}

        {/* STAGE 4: EXPLOSIVE COUNTDOWN */}
        {stage === "countdown" && (
          <motion.div
            key={`countdown-${countdown}`}
            initial={{ opacity: 0, scale: 4, filter: "blur(20px)" }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              filter: "blur(0px)",
              color: countdown <= 2 ? "#ef4444" : countdown <= 3 ? "#eab308" : "#ffffff"
            }}
            exit={{ opacity: 0, scale: 0, filter: "blur(20px)" }}
            transition={{ duration: 0.4, type: "spring", stiffness: 150 }}
            className="relative z-10 text-center"
          >
            <div className="relative">
              <span className="text-[12rem] md:text-[20rem] font-black leading-none drop-shadow-[0_0_60px_rgba(255,255,255,0.2)]">
                {countdown}
              </span>
              {/* Radial shockwave on each number change */}
              <motion.div
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 border-8 border-current rounded-full"
              />
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Persistent Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] z-20" />
    </div>
  );
}