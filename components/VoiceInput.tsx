"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, RotateCcw } from "lucide-react";

interface VoiceInputProps {
  onNameCapture: (name: string) => void;
  currentName: string;
}

export default function VoiceInput({ onNameCapture, currentName }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(currentName);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (typeof window !== "undefined") {
      setIsSupported("webkitSpeechRecognition" in window || "SpeechRecognition" in window);
    }
  }, []);

  const startListening = () => {
    if (!isSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const name = event.results[0][0].transcript;
      setTranscript(name);
      onNameCapture(name);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleReRecord = () => {
    setTranscript("");
    onNameCapture("");
    startListening();
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-4">
        <label className="block text-white text-lg font-semibold mb-2">Your Name</label>
        {transcript ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
            <p className="text-white text-xl font-medium">{transcript}</p>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-4 border-2 border-dashed border-white/20">
            <p className="text-white/50 text-center">Tap the microphone to speak your name</p>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startListening}
          disabled={isListening || !isSupported}
          className={`flex-1 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 ${
            isListening
              ? "bg-red-500 text-white animate-pulse"
              : isSupported
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          {isListening ? "Listening..." : isSupported ? "Record Name" : "Not Supported"}
        </motion.button>

        {transcript && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReRecord}
            className="py-4 px-6 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Re-record
          </motion.button>
        )}
      </div>

      {!isSupported && (
        <p className="mt-4 text-red-300 text-sm text-center">
          Voice input is not supported in your browser. Please use a modern browser like Chrome or Edge.
        </p>
      )}
    </div>
  );
}

