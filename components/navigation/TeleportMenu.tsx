'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { ARCHITECTURE_CONFIG } from '@/lib/config';
import { Compass, X, Sparkles, MoveRight } from 'lucide-react';

export const TeleportMenu: React.FC = () => {
  const isStarted = useGameStore((s) => s.isStarted);
  const isPaused = useGameStore((s) => s.isPaused);
  const isTeleporting = useGameStore((s) => s.isTeleporting);
  const currentRoomId = useGameStore((s) => s.currentRoomId);
  const triggerTeleport = useGameStore((s) => s.triggerTeleport);

  const [isOpen, setIsOpen] = useState(false);

  if (!isStarted || isPaused) {
    return null;
  }

  const rooms = Object.values(ARCHITECTURE_CONFIG.rooms);

  const handleSelectRoom = (spawnPosition: [number, number, number], spawnYaw: number) => {
    setIsOpen(false);
    triggerTeleport(spawnPosition, spawnYaw);
  };

  return (
    <>
      {/* -------------------- 1. FAST TRAVEL DIRECTORY TRIGGER BUTTON -------------------- */}
      <div className="fixed top-16 right-5 z-40 select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFDF9]/90 backdrop-blur-md border border-[#C5A059]/40 text-[#423E36] hover:bg-[#F7F2E7] active:scale-95 shadow-md transition-all cursor-pointer"
          aria-label="Fast Travel Directory"
        >
          <Compass className="w-3.5 h-3.5 text-[#8C7443] transition-transform duration-300 group-hover:rotate-45" />
          <span className="text-[10px] font-mono tracking-wider uppercase">
            Directory
          </span>
        </button>
      </div>

      {/* -------------------- 2. TELEPORT DIRECTORY MODAL -------------------- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md select-none"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full max-h-[85vh] flex flex-col rounded-3xl bg-[#FAF8F3]/95 border border-[#C5A059]/40 shadow-2xl overflow-hidden p-6 text-neutral-800"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD1]">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="text-[10px] font-mono tracking-[0.2em] text-[#8C7443] uppercase">
                      Fast Travel & Directory
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-normal tracking-wider text-[#2A2722] uppercase mt-0.5">
                    Penthouse Suites
                  </h3>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#EFECE1] hover:bg-[#E5E0D0] flex items-center justify-center text-neutral-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Room Cards List */}
              <div className="overflow-y-auto space-y-2 mt-4 pr-1">
                {rooms.map((room) => {
                  const isCurrent = room.id === currentRoomId;
                  return (
                    <button
                      key={room.id}
                      onClick={() => handleSelectRoom(room.spawnPosition, room.spawnYaw)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                        isCurrent
                          ? 'bg-[#F2ECE1] border-[#C5A059] shadow-sm'
                          : 'bg-[#FFFDF9]/80 border-[#E8DFD1] hover:border-[#C5A059]/60 hover:bg-[#F9F6EE]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base tracking-wide text-[#2F2C26] font-medium group-hover:text-[#8C7443] transition-colors">
                            {room.name}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#C5A059] text-white rounded-full">
                              Here
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#6E685D] mt-0.5 line-clamp-1 font-sans">
                          {room.subtitle}
                        </p>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-[#FAF8F3] border border-[#DDD3C3] flex items-center justify-center text-[#8C7443] group-hover:border-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition-all shrink-0">
                        <MoveRight className="w-4 h-4" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------- 3. CINEMATIC FADE-TO-BLACK TRANSITION OVERLAY -------------------- */}
      <AnimatePresence>
        {isTeleporting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 bg-black pointer-events-none"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default TeleportMenu;
