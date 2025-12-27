"use client";

import { motion } from "framer-motion";
import { Delete } from "lucide-react";

interface OnScreenKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
}

export default function OnScreenKeyboard({ onKeyPress, onBackspace }: OnScreenKeyboardProps) {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const keyVariants = {
    tap: { scale: 0.95, backgroundColor: "rgba(255, 255, 255, 0.2)" },
    hover: { scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/[0.02] border border-white/10 backdrop-blur-2xl rounded-2xl p-4 md:p-6">
        {/* Letter Rows */}
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex justify-center gap-1 md:gap-2 mb-2"
            style={{
              paddingLeft: rowIndex === 1 ? '1.5rem' : rowIndex === 2 ? '3rem' : '0'
            }}
          >
            {row.map((letter) => (
              <motion.button
                key={letter}
                variants={keyVariants}
                whileTap="tap"
                whileHover="hover"
                onClick={() => onKeyPress(letter)}
                className="w-8 h-8 md:w-10 md:h-10 bg-white/10 border border-white/20 rounded-lg text-white font-semibold text-sm md:text-base hover:border-yellow-400/50 transition-colors duration-200"
              >
                {letter}
              </motion.button>
            ))}
          </div>
        ))}

        {/* Bottom Row with Space and Backspace */}
        <div className="flex justify-center gap-2 mt-4">
          <motion.button
            variants={keyVariants}
            whileTap="tap"
            whileHover="hover"
            onClick={() => onKeyPress(' ')}
            className="px-6 py-2 md:px-8 md:py-3 bg-white/10 border border-white/20 rounded-lg text-white font-semibold text-sm md:text-base hover:border-yellow-400/50 transition-colors duration-200"
          >
            SPACE
          </motion.button>
          <motion.button
            variants={keyVariants}
            whileTap="tap"
            whileHover="hover"
            onClick={onBackspace}
            className="px-4 py-2 md:px-6 md:py-3 bg-white/10 border border-white/20 rounded-lg text-white font-semibold hover:border-red-400/50 transition-colors duration-200 flex items-center gap-2"
          >
            <Delete className="w-4 h-4" />
            <span className="hidden md:inline text-sm">BACK</span>
          </motion.button>
        </div>

        {/* Helper Text */}
        <p className="text-center text-white/40 text-xs mt-4">
          Tap the keys above to enter your name
        </p>
      </div>
    </div>
  );
}
