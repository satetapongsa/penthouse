'use client';

import React from 'react';
import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { Compass, Move, Eye, ChevronsUp, ShieldAlert, Sparkles, Smartphone } from 'lucide-react';

interface IntroOverlayProps {
  onEnter: () => void;
}

export const IntroOverlay: React.FC<IntroOverlayProps> = ({ onEnter }) => {
  const isStarted = useGameStore((s) => s.isStarted);
  const isMobile = useGameStore((s) => s.isMobile);
  const { progress, active, loaded, total } = useProgress();

  const isReady = progress >= 100 || !active;

  if (isStarted) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } }}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8 bg-gradient-to-b from-[#FAF8F3]/95 via-[#F4EFE6]/90 to-[#EAE3D2]/95 backdrop-blur-xl text-neutral-800 select-none"
      >
        {/* Subtle decorative luxury background accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
          <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-[#F5E6CA]/60 to-transparent blur-3xl" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-[#D4AF37]/20 to-transparent blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
        </div>

        <div className="relative max-w-2xl w-full mx-auto flex flex-col items-center text-center">
          {/* Architectural Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A059]/40 bg-[#FFFDF9]/80 shadow-sm mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#8C7443] uppercase">
              Architectural Real-Time Walkthrough
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-[0.18em] text-[#222120] uppercase leading-none drop-shadow-sm"
          >
            THE SKYLINE
            <span className="block mt-2 font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#B8963D] via-[#D4AF37] to-[#8C7443]">
              PENTHOUSE
            </span>
          </motion.h1>

          {/* Details / Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-4 text-xs sm:text-sm font-light tracking-[0.25em] text-[#6E6B65] uppercase max-w-lg"
          >
            280 m² Sky Residence · 3.4m Ceilings · Metropolis Panorama
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-3 text-sm text-[#54524D] leading-relaxed max-w-md font-sans"
          >
            Experience pure tranquility bathed in warm morning light, Italian travertine,
            pale Scandinavian oak, and floor-to-ceiling panoramic glass.
          </motion.p>

          {/* Loading Progress Bar */}
          <div className="w-full max-w-md mt-8 mb-6">
            <div className="flex justify-between items-center text-xs font-mono text-[#8C7443] mb-2 px-1">
              <span className="tracking-widest uppercase">
                {isReady ? 'Spatial Engine Ready' : `Calibrating Environment (${loaded}/${total || 1})`}
              </span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#E2DCcf] rounded-full overflow-hidden p-0.5 border border-[#C5A059]/20 shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8963D] rounded-full relative"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.max(progress, 5)}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse-subtle" />
              </motion.div>
            </div>
          </div>

          {/* Enter Button */}
          <motion.button
            onClick={onEnter}
            disabled={!isReady}
            whileHover={isReady ? { scale: 1.02 } : {}}
            whileTap={isReady ? { scale: 0.98 } : {}}
            className={`group relative overflow-hidden px-10 py-4 rounded-full border transition-all duration-300 shadow-lg ${
              isReady
                ? 'cursor-pointer border-[#B8963D] bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#B8963D] text-[#1E1B15] shadow-[#D4AF37]/25 hover:shadow-xl hover:shadow-[#D4AF37]/35'
                : 'cursor-not-allowed border-neutral-300 bg-neutral-200/80 text-neutral-400 opacity-60'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-3 font-serif text-lg tracking-[0.2em] uppercase font-semibold">
              <Compass className="w-5 h-5 transition-transform duration-500 group-hover:rotate-45" />
              Enter Penthouse
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </motion.button>

          {/* Controls Guide Modal / Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 w-full max-w-lg rounded-2xl border border-[#C5A059]/30 bg-[#FFFDF9]/80 backdrop-blur-md p-4 text-left shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#E8DFD1]">
              {isMobile ? (
                <>
                  <Smartphone className="w-4 h-4 text-[#C5A059]" />
                  <span className="text-xs font-semibold tracking-wider uppercase text-[#474238]">
                    Touch Navigation Guide
                  </span>
                </>
              ) : (
                <>
                  <Move className="w-4 h-4 text-[#C5A059]" />
                  <span className="text-xs font-semibold tracking-wider uppercase text-[#474238]">
                    Keyboard & Mouse Controls
                  </span>
                </>
              )}
            </div>

            {isMobile ? (
              <div className="grid grid-cols-2 gap-3 text-xs text-[#5E5950]">
                <div className="flex items-center gap-2">
                  <span className="font-mono px-2 py-0.5 rounded bg-[#EFECE1] text-[#3D3A33] border border-[#DDD3C3]">
                    Left Screen
                  </span>
                  <span>Virtual Joystick (Move)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono px-2 py-0.5 rounded bg-[#EFECE1] text-[#3D3A33] border border-[#DDD3C3]">
                    Right Screen
                  </span>
                  <span>Swipe to Look</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono px-2 py-0.5 rounded bg-[#EFECE1] text-[#3D3A33] border border-[#DDD3C3]">
                    Jump Btn
                  </span>
                  <span>Hop / Step-up</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono px-2 py-0.5 rounded bg-[#EFECE1] text-[#3D3A33] border border-[#DDD3C3]">
                    Action
                  </span>
                  <span>Interact with Doors</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-[#5E5950]">
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-[#EFECE1] font-mono text-[11px] text-[#3D3A33] border border-[#DDD3C3] shadow-xs">
                    W A S D
                  </kbd>
                  <span>Walk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-[#EFECE1] font-mono text-[11px] text-[#3D3A33] border border-[#DDD3C3] shadow-xs">
                    Shift
                  </kbd>
                  <span>Sprint</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-[#EFECE1] font-mono text-[11px] text-[#3D3A33] border border-[#DDD3C3] shadow-xs">
                    Space
                  </kbd>
                  <span>Jump</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-[#EFECE1] font-mono text-[11px] text-[#3D3A33] border border-[#DDD3C3] shadow-xs">
                    C
                  </kbd>
                  <span>Crouch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#8C7443]" />
                  <span>Mouse Look</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-[#EFECE1] font-mono text-[11px] text-[#3D3A33] border border-[#DDD3C3] shadow-xs">
                    E
                  </kbd>
                  <span>Interact</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-[#EFECE1] font-mono text-[11px] text-[#3D3A33] border border-[#DDD3C3] shadow-xs">
                    Esc
                  </kbd>
                  <span>Pause</span>
                </div>
              </div>
            )}
          </motion.div>

          <p className="mt-4 text-[11px] text-[#8C877D] tracking-wide">
            Designed for 60fps hardware-accelerated WebGL. Best experienced in full screen.
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
