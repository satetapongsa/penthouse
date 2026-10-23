'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { MiniMap } from '@/components/navigation/MiniMap';
import { TeleportMenu } from '@/components/navigation/TeleportMenu';
import { PhotoModeOverlay } from '@/components/ui/PhotoModeOverlay';
import { PauseMenu } from '@/components/ui/PauseMenu';
import {
  Pause,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  Camera,
  Activity,
  Volume2,
  VolumeX,
  MousePointer,
} from 'lucide-react';

interface HUDProps {
  onRequestPointerLock?: () => void;
}

export const HUD: React.FC<HUDProps> = ({ onRequestPointerLock }) => {
  const isStarted = useGameStore((s) => s.isStarted);
  const isPaused = useGameStore((s) => s.isPaused);
  const isPointerLocked = useGameStore((s) => s.isPointerLocked);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const isPhotoMode = useGameStore((s) => s.isPhotoMode);
  const setPhotoMode = useGameStore((s) => s.setPhotoMode);
  const activeInteractable = useGameStore((s) => s.activeInteractable);
  const isMobile = useGameStore((s) => s.isMobile);

  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const cycleTimeOfDay = useGameStore((s) => s.cycleTimeOfDay);
  const quality = useGameStore((s) => s.quality);
  const showPerf = useGameStore((s) => s.showPerf);
  const togglePerf = useGameStore((s) => s.togglePerf);

  const settings = useGameStore((s) => s.settings);
  const toggleMute = useGameStore((s) => s.toggleMute);
  const muteToast = useGameStore((s) => s.muteToast);

  if (!isStarted) {
    return null;
  }

  return (
    <>
      {/* -------------------- 1. CROSSHAIR & INTERACTION PROMPT -------------------- */}
      {!isPaused && !isPhotoMode && (
        <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center">
          {/* Subtle Dynamic Center Dot */}
          <div
            className={`rounded-full border transition-all duration-200 ${
              activeInteractable
                ? 'w-6 h-6 border-[#D4AF37] bg-[#D4AF37]/20 scale-125 shadow-[0_0_12px_rgba(212,175,55,0.6)]'
                : 'w-2 h-2 border-white/80 bg-white/40 shadow-[0_0_4px_rgba(0,0,0,0.3)]'
            }`}
          />

          {/* Centered Interaction Tooltip Badge */}
          {activeInteractable && (
            <div className="absolute top-[calc(50%+24px)] flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1816]/85 backdrop-blur-md border border-[#C5A059]/60 shadow-xl text-white">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#C5A059] text-[10px] font-bold text-neutral-900 font-mono">
                E
              </span>
              <span className="text-xs font-serif tracking-wider uppercase text-[#FAF8F3]">
                {activeInteractable.label}
              </span>
            </div>
          )}
        </div>
      )}

      {/* -------------------- 2. TOP RIGHT QUICK CONTROLS PILL -------------------- */}
      {!isPaused && !isPhotoMode && (
        <div className="fixed top-5 right-5 z-40 flex items-center gap-2 select-none">
          {/* Performance Stats Quick Button (F3) */}
          <button
            onClick={togglePerf}
            title="Toggle Performance Diagnostics (F3 / O)"
            className={`h-9 px-2.5 rounded-full backdrop-blur-md border transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
              showPerf
                ? 'bg-[#1E1B15] border-[#D4AF37] text-[#D4AF37]'
                : 'bg-[#FFFDF9]/90 border-[#C5A059]/40 text-[#4A453B] hover:bg-[#F5EFE6]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono font-medium hidden sm:inline">F3</span>
          </button>

          {/* Time of Day Cycle Button */}
          <button
            onClick={cycleTimeOfDay}
            title={`Time of Day: ${timeOfDay.toUpperCase()} (Click to cycle)`}
            className="h-9 px-3 rounded-full bg-[#FFFDF9]/90 backdrop-blur-md border border-[#C5A059]/40 text-[#4A453B] hover:bg-[#F5EFE6] transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            {timeOfDay === 'day' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
            {timeOfDay === 'sunset' && <Sunset className="w-3.5 h-3.5 text-orange-500" />}
            {timeOfDay === 'night' && <Moon className="w-3.5 h-3.5 text-indigo-400" />}
            <span className="text-[11px] font-mono tracking-wider uppercase">
              {timeOfDay}
            </span>
          </button>

          {/* Quality Indicator Badge */}
          <div className="hidden sm:flex h-9 px-3 rounded-full bg-[#FFFDF9]/90 backdrop-blur-md border border-[#C5A059]/40 text-[#4A453B] items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3 text-[#C5A059]" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-600">
              {quality}
            </span>
          </div>

          {/* Photo Mode Trigger */}
          <button
            onClick={() => setPhotoMode(true)}
            title="Enter Photo Mode (P)"
            className="w-9 h-9 rounded-full bg-[#FFFDF9]/90 backdrop-blur-md border border-[#C5A059]/40 text-[#4A453B] hover:bg-[#F5EFE6] transition-all flex items-center justify-center cursor-pointer shadow-lg"
          >
            <Camera className="w-4 h-4 text-[#8C7443]" />
          </button>

          {/* Audio Mute Button (Volume2 / VolumeX) */}
          <button
            onClick={toggleMute}
            title={settings.isMuted ? 'Unmute Audio (M)' : 'Mute Audio (M)'}
            className={`w-9 h-9 rounded-full backdrop-blur-md border transition-all flex items-center justify-center cursor-pointer shadow-lg ${
              settings.isMuted
                ? 'bg-[#2E1A1A]/90 border-red-400/60 text-red-400 hover:bg-[#3D2222]'
                : 'bg-[#FFFDF9]/90 border-[#C5A059]/40 text-[#4A453B] hover:bg-[#F5EFE6]'
            }`}
          >
            {settings.isMuted ? (
              <VolumeX className="w-4 h-4 text-red-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#8C7443]" />
            )}
          </button>

          {/* Pause Button */}
          <button
            onClick={pauseGame}
            title="Pause Walkthrough (Esc)"
            className="w-9 h-9 rounded-full bg-[#FFFDF9]/90 backdrop-blur-md border border-[#C5A059]/40 text-[#4A453B] hover:bg-[#F5EFE6] transition-all flex items-center justify-center cursor-pointer shadow-lg"
          >
            <Pause className="w-4 h-4 text-[#8C7443]" />
          </button>
        </div>
      )}

      {/* -------------------- 3. TOP LEFT ARCHITECTURAL BRANDING & MUTED BADGE -------------------- */}
      {!isPaused && !isPhotoMode && (
        <div className="fixed top-5 left-5 z-40 pointer-events-none select-none">
          <div className="text-[10px] font-mono tracking-[0.25em] text-[#8C7443] uppercase">
            3D Walkthrough
          </div>
          <h1 className="font-serif text-lg tracking-widest text-[#2D2A26] uppercase">
            The Skyline Penthouse
          </h1>
          {/* Persistent Muted Indicator in HUD corner */}
          {settings.isMuted && (
            <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1A1816]/85 border border-red-500/40 text-red-300 text-[10px] font-mono tracking-wider">
              <VolumeX className="w-3 h-3 text-red-400" />
              <span>SOUND MUTED (M)</span>
            </div>
          )}
        </div>
      )}

      {/* -------------------- 4. AUDIO MUTE/UNMUTE TOAST -------------------- */}
      <AnimatePresence>
        {muteToast && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1816]/90 border border-[#C5A059]/50 shadow-2xl backdrop-blur-md text-[#FAF8F3] text-xs font-mono tracking-wider select-none"
          >
            {settings.isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#D4AF37]" />
            )}
            <span>{muteToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------- 5. CLICK TO RESUME OVERLAY (WHEN UNLOCKED BUT ACTIVE) -------------------- */}
      {!isPaused && !isPointerLocked && !isMobile && !isPhotoMode && (
        <div
          onClick={onRequestPointerLock}
          className="fixed inset-0 z-35 flex items-center justify-center bg-black/20 backdrop-blur-[2px] cursor-pointer select-none"
        >
          <div className="flex flex-col items-center gap-2 px-6 py-4 rounded-2xl bg-[#FAF8F3]/95 border border-[#C5A059]/60 shadow-2xl text-center hover:scale-105 transition-transform">
            <div className="w-9 h-9 rounded-full bg-[#F3EDE2] border border-[#C5A059]/40 flex items-center justify-center text-[#8C7443]">
              <MousePointer className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="font-serif text-sm tracking-wider uppercase text-[#2D2A26] font-medium">
                Click to Resume Mouse Look
              </div>
              <div className="text-[10px] font-mono text-[#8C7443] mt-0.5">
                Press ESC to pause · M to mute sound
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- 6. NAVIGATION SUITE -------------------- */}
      {!isPaused && !isPhotoMode && (
        <>
          <MiniMap />
          <TeleportMenu />
        </>
      )}

      {/* -------------------- 7. ARCHITECTURAL PHOTO STUDIO -------------------- */}
      <PhotoModeOverlay />

      {/* -------------------- 8. PAUSE MENU & SETTINGS MODAL -------------------- */}
      <PauseMenu onRequestPointerLock={onRequestPointerLock} />
    </>
  );
};

export default HUD;
