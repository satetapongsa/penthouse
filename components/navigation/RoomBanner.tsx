'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { ARCHITECTURE_CONFIG } from '@/lib/config';
import { Sparkles } from 'lucide-react';

export const RoomBanner: React.FC = () => {
  const isStarted = useGameStore((s) => s.isStarted);
  const isPaused = useGameStore((s) => s.isPaused);
  const currentRoomId = useGameStore((s) => s.currentRoomId);

  const [visibleRoom, setVisibleRoom] = useState(currentRoomId);
  const [showFullBanner, setShowFullBanner] = useState(true);

  useEffect(() => {
    setVisibleRoom(currentRoomId);
    setShowFullBanner(true);

    const timer = setTimeout(() => {
      setShowFullBanner(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [currentRoomId]);

  if (!isStarted || isPaused) {
    return null;
  }

  const room = ARCHITECTURE_CONFIG.rooms[visibleRoom] || ARCHITECTURE_CONFIG.rooms.living;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={visibleRoom}
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{
            opacity: showFullBanner ? 1 : 0.65,
            y: 0,
            scale: 1,
          }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center px-5 py-2.5 rounded-2xl bg-[#FFFDF9]/85 backdrop-blur-md border border-[#C5A059]/30 shadow-lg min-w-[260px] max-w-sm"
        >
          {/* Subtle Accent Pill */}
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3 h-3 text-[#C5A059]" />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#8C7443]">
              Level 68 · Skyline Penthouse
            </span>
          </div>

          {/* Room Name */}
          <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-[0.12em] uppercase text-[#25221C]">
            {room.name}
          </h2>

          {/* Room Subtitle */}
          {showFullBanner && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[11px] font-light tracking-wider text-[#635E54] mt-0.5 font-sans"
            >
              {room.subtitle}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
