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

export default function PreparePage() {
  const router = useRouter();
  const setSecurityCode = useAppStore((state) => state.setSecurityCode);

  const [stage, setStage] = useState<"loading" | "messages" | "code" | "countdown">("loading");
  const [messageIndex, setMessageIndex] = useState(0);
  const [securityCode, setLocalSecurityCode] = useState("");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Stage 1: Initial loading (4-5 seconds)
    const loadingTimer = setTimeout(() => {
      setStage("messages");
    }, 4500);

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    if (stage === "messages") {
      // Stage 2: Show motivational messages (1.5s each)
      if (messageIndex < MOTIVATIONAL_MESSAGES.length) {
        const messageTimer = setTimeout(() => {
          setMessageIndex((prev) => prev + 1);
        }, 1500);
        return () => clearTimeout(messageTimer);
      } else {
        // Stage 3: Generate and show security code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setLocalSecurityCode(code);
        setSecurityCode(code);
        setStage("code");
      }
    }
  }, [stage, messageIndex, setSecurityCode]);

  useEffect(() => {
    if (stage === "code") {
      // Show code for 5 seconds then move to countdown
      const codeTimer = setTimeout(() => {
        setStage("countdown");
      }, 5000);
      return () => clearTimeout(codeTimer);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === "countdown") {
      // Stage 4: Countdown from 5 to 0
      if (countdown > 0) {
        const countdownTimer = setTimeout(() => {
          setCountdown((prev) => prev - 1);
        }, countdown > 2 ? 1500 : 500); // Slow at first, then fast
        return () => clearTimeout(countdownTimer);
      } else {
        // Navigate to game
        router.push("/game");
      }
    }
  }, [stage, countdown, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {stage === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 border-8 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-white text-2xl font-semibold">Preparing your journey...</p>
          </motion.div>
        )}

        {stage === "messages" && (
          <motion.div
            key={`message-${messageIndex}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-white text-4xl md:text-6xl font-bold px-8">
              {MOTIVATIONAL_MESSAGES[messageIndex]}
            </p>
          </motion.div>
        )}

        {stage === "code" && (
          <motion.div
            key="code"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="text-center"
          >
            <motion.p
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-yellow-300 text-3xl font-bold mb-8"
            >
              Remember this code!
            </motion.p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border-4 border-yellow-400 shadow-2xl"
            >
              <p className="text-white text-8xl font-bold tracking-widest">{securityCode}</p>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-white/70 text-xl mt-6"
            >
              You'll need this later...
            </motion.p>
          </motion.div>
        )}

        {stage === "countdown" && (
          <motion.div
            key={`countdown-${countdown}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: countdown > 2 ? 0.5 : 0.3 }}
            className="text-center"
          >
            <p className="text-white text-9xl font-bold">{countdown}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

