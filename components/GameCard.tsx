"use client";

import { motion } from "framer-motion";
import { GameCard as GameCardType } from "@/lib/types";
import { getCardLabel } from "@/lib/gameLogic";

interface GameCardProps {
  card: GameCardType;
  onTap: (cardId: string, type: "positive" | "negative") => void;
}

export default function GameCard({ card, onTap }: GameCardProps) {
  const handleClick = () => {
    onTap(card.id, card.type);
  };

  const getShapePath = () => {
    switch (card.shape) {
      case "circle":
        return "50%";
      case "square":
        return "0%";
      case "triangle":
        return "polygon(50% 0%, 0% 100%, 100% 100%)";
      case "hexagon":
        return "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";
      case "star":
        return "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
      case "diamond":
        return "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";
      default:
        return "50%";
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={handleClick}
      style={{
        position: "absolute",
        left: card.x,
        top: card.y,
        width: "100px",
        height: "100px",
        backgroundColor: card.color,
        clipPath: getShapePath(),
        borderRadius: card.shape === "circle" ? "50%" : "0%",
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
      className="flex items-center justify-center select-none"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <span className="text-white font-bold text-sm text-center px-2">{getCardLabel(card.type)}</span>
    </motion.div>
  );
}

