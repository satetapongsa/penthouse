'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, TimeOfDay, QualityPreset } from '@/store/useGameStore';
import { ARCHITECTURE_CONFIG } from '@/lib/config';
import { MiniMap } from '@/components/navigation/MiniMap';
import { RoomBanner } from '@/components/navigation/RoomBanner';
import { TeleportMenu } from '@/components/navigation/TeleportMenu';
import { PhotoModeOverlay } from '@/components/ui/PhotoModeOverlay';
import {
  Play,
  RotateCcw,
  Keyboard,
  Compass,
  AlertTriangle,
  Hand,
  Lightbulb,
  Volume2,
  VolumeX,
  Camera,
  Sun,
  Sunset,
  Moon,
  Maximize,
  Minimize,
  Sliders,
} from 'lucide-react';

interface HUDProps {
  onRequestPointerLock: () => void;
}

export const HUD: React.FC<HUDProps> = ({ onRequestPointerLock }) => {
  const isStarted = useGameStore((s) => s.isStarted);
  const isPaused = useGameStore((s) => s.isPaused);
  const isMobile = useGameStore((s) => s.isMobile);
  const webGlSupported = useGameStore((s) => s.webGlSupported);
  const activeInteractable = useGameStore((s) => s.activeInteractable);
  const posture = useGameStore((s) => s.posture);
  const exitSitting = useGameStore((s) => s.exitSitting);
  const exitLying = useGameStore((s) => s.exitLying);

  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const cycleTimeOfDay = useGameStore((s) => s.cycleTimeOfDay);
  const quality = useGameStore((s) => s.quality);
  const setQuality = useGameStore((s) => s.setQuality);
  const isPhotoMode = useGameStore((s) => s.isPhotoMode);
  const setPhotoMode = useGameStore((s) => s.setPhotoMode);

  const resumeGame = useGameStore((s) => s.resumeGame);
  const exitToIntro = useGameStore((s) => s.exitToIntro);
  const triggerTeleport = useGameStore((s) => s.triggerTeleport);
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);
  const setVolume = useGameStore((s) => s.setVolume);
  const toggleMute = useGameStore((s) => s.toggleMute);

  const lightingStates = useGameStore((s) => s.lightingStates);
  const toggleRoomLight = useGameStore((s) => s.toggleRoomLight);
  const setAllLights = useGameStore((s) => s.setAllLights);

  const [activeTab, setActiveTab] = useState<'menu' | 'lighting' | 'teleport' | 'controls' | 'settings'>('menu');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const rooms = Object.values(ARCHITECTURE_CONFIG.rooms);

  const handleResume = () => {
    resumeGame();
    if (!isMobile) {
      onRequestPointerLock();
    }
  };

  const handleExit = () => {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
    exitToIntro();
  };

  const handleTeleportFromPause = (pos: [number, number, number], yaw: number) => {
    resumeGame();
    triggerTeleport(pos, yaw);
    if (!isMobile) {
      onRequestPointerLock();
    }
  };

  const handleStandUp = () => {
    if (posture === 'sitting') {
      exitSitting();
    } else if (posture === 'lying') {
      exitLying();
    }
  };

  const toggleFullscreen = () => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <>
      {/* -------------------- 1. WEBGL FALLBACK MODAL -------------------- */}
      {!webGlSupported && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FAF8F3]/95 backdrop-blur-xl">
          <div className="max-w-md w-full p-6 rounded-2xl bg-white border border-amber-300 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-neutral-800">
              WebGL Hardware Acceleration Required
            </h2>
            <p className="mt-2 text-sm text-neutral-600 leading-relaxed font-sans">
              The Skyline Penthouse relies on real-time 3D rendering. Please verify that hardware
              acceleration is enabled in your browser settings to enter the walkthrough.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C5A059] to-[#8C7443] text-white text-sm font-semibold tracking-wider uppercase shadow-md cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      )}

      {/* -------------------- 2. TOP RIGHT FLOATING CONTROLS (TIME & PHOTO) -------------------- */}
      {isStarted && !isPaused && !isPhotoMode && (
        <div className="fixed top-6 right-6 z-30 flex items-center gap-2 pointer-events-auto">
          {/* Time of Day Cycle Button */}
          <button
            onClick={cycleTimeOfDay}
            title="Click to toggle Time of Day (Day / Sunset / Night)"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1816]/85 backdrop-blur-md border border-[#C5A059]/50 text-white shadow-xl hover:bg-[#25221F] transition-all cursor-pointer text-xs uppercase font-medium tracking-wider"
          >
            {timeOfDay === 'day' && <Sun className="w-3.5 h-3.5 text-[#F5C542]" />}
            {timeOfDay === 'sunset' && <Sunset className="w-3.5 h-3.5 text-[#FF8E4D]" />}
            {timeOfDay === 'night' && <Moon className="w-3.5 h-3.5 text-[#A5C8FF]" />}
            <span>{timeOfDay}</span>
          </button>

          {/* Photo Mode Button */}
          <button
            onClick={() => {
              if (document.pointerLockElement) {
                document.exitPointerLock();
              }
              setPhotoMode(true);
            }}
            title="Enter Photo Mode"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1816]/85 backdrop-blur-md border border-[#C5A059]/50 text-[#D4AF37] shadow-xl hover:bg-[#25221F] transition-all cursor-pointer text-xs uppercase font-medium tracking-wider"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Photo Mode</span>
          </button>
        </div>
      )}

      {/* -------------------- 3. DYNAMIC INTERACTIVE CROSSHAIR & PROMPT -------------------- */}
      {isStarted && !isPaused && !isMobile && posture === 'standing' && !isPhotoMode && (
        <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center">
          <div className="relative flex flex-col items-center justify-center">
            {/* Center Crosshair Dot / Focus Ring */}
            <motion.div
              animate={{
                scale: activeInteractable ? 1.6 : 1.0,
              }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative flex items-center justify-center"
            >
              <div
                className={`rounded-full transition-all duration-200 ${
                  activeInteractable
                    ? 'w-2.5 h-2.5 bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,1)] border border-white'
                    : 'w-1.5 h-1.5 bg-[#FAF8F3] shadow-[0_0_4px_rgba(197,160,89,0.9)] border border-[#C5A059]/60'
                }`}
              />
              {activeInteractable && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 1 }}
                  className="absolute w-6 h-6 rounded-full border-2 border-[#D4AF37]/80"
                />
              )}
            </motion.div>

            {/* Interaction Prompt Label */}
            <AnimatePresence>
              {activeInteractable && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 18 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1F1E1B]/85 backdrop-blur-md border border-[#C5A059]/60 text-white shadow-xl whitespace-nowrap"
                >
                  <Hand className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-xs font-medium tracking-wide">
                    {activeInteractable.label}
                  </span>
                  <kbd className="px-1.5 py-0.5 rounded bg-[#C5A059] text-[#1E1B15] font-mono text-[10px] font-bold">
                    E
                  </kbd>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* -------------------- 4. POSTURE EXIT PROMPT (SEATED / LYING) -------------------- */}
      {isStarted && !isPaused && posture !== 'standing' && !isPhotoMode && (
        <div className="fixed bottom-12 inset-x-0 z-30 flex justify-center pointer-events-auto">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={handleStandUp}
            className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#1F1E1B]/90 backdrop-blur-md border border-[#C5A059] text-white shadow-2xl cursor-pointer hover:bg-[#2A2722] transition-colors"
          >
            <span className="text-xs font-medium tracking-wider uppercase text-[#E8DFD1]">
              {posture === 'sitting' ? 'Seated Comfortably' : 'Lying Down in Suite'}
            </span>
            <div className="flex items-center gap-1.5">
              <kbd className="px-2 py-0.5 rounded bg-[#C5A059] text-[#1E1B15] font-mono text-xs font-bold shadow-sm">
                E
              </kbd>
              <span className="text-xs text-neutral-400">or</span>
              <kbd className="px-2 py-0.5 rounded bg-[#C5A059] text-[#1E1B15] font-mono text-xs font-bold shadow-sm">
                Space
              </kbd>
              <span className="text-xs text-[#FAF8F3] ml-1">Stand Up</span>
            </div>
          </motion.button>
        </div>
      )}

      {/* -------------------- 5. NAVIGATION UI ELEMENTS -------------------- */}
      {!isPhotoMode && (
        <>
          <RoomBanner />
          <MiniMap />
          <TeleportMenu />
        </>
      )}

      {/* -------------------- 6. PHOTO MODE OVERLAY -------------------- */}
      <PhotoModeOverlay />

      {/* -------------------- 7. PAUSE MENU OVERLAY -------------------- */}
      <AnimatePresence>
        {isStarted && isPaused && !isPhotoMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md select-none"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative max-w-lg w-full rounded-3xl bg-[#FAF8F3]/95 border border-[#C5A059]/40 shadow-2xl overflow-hidden p-6 text-neutral-800"
            >
              {/* Header */}
              <div className="text-center pb-3 border-b border-[#E8DFD1]">
                <span className="text-[11px] font-mono tracking-[0.25em] text-[#8C7443] uppercase">
                  Walkthrough Paused
                </span>
                <h2 className="font-serif text-3xl font-light tracking-widest text-[#2D2A26] uppercase mt-0.5">
                  The Skyline Penthouse
                </h2>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-[#E8DFD1] my-3 text-xs overflow-x-auto">
                {(['menu', 'lighting', 'teleport', 'controls', 'settings'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 min-w-[70px] py-2 font-medium tracking-wider uppercase border-b-2 transition-colors cursor-pointer ${
                      activeTab === tab
                        ? 'border-[#C5A059] text-[#8C7443]'
                        : 'border-transparent text-neutral-400 hover:text-neutral-600'
                    }`}
                  >
                    {tab === 'lighting' ? 'Lighting' : tab}
                  </button>
                ))}
              </div>

              {/* TAB 1: ACTIONS */}
              {activeTab === 'menu' && (
                <div className="space-y-3 pt-1">
                  <button
                    onClick={handleResume}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#B8963D] text-[#1E1B15] font-serif text-base tracking-[0.15em] uppercase font-semibold flex items-center justify-center gap-2 shadow-md hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Resume Walkthrough
                  </button>

                  <button
                    onClick={() => {
                      resumeGame();
                      setPhotoMode(true);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[#FFFDF9] border border-[#DDD3C3] text-[#4A453B] font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#F3EFE6] transition-colors cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-[#8C7443]" />
                    Enter Photo Mode
                  </button>

                  <button
                    onClick={() => setActiveTab('lighting')}
                    className="w-full py-3 px-4 rounded-xl bg-[#FFFDF9] border border-[#DDD3C3] text-[#4A453B] font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#F3EFE6] transition-colors cursor-pointer"
                  >
                    <Lightbulb className="w-4 h-4 text-[#8C7443]" />
                    Scene Lighting Panel
                  </button>

                  <button
                    onClick={() => setActiveTab('teleport')}
                    className="w-full py-3 px-4 rounded-xl bg-[#FFFDF9] border border-[#DDD3C3] text-[#4A453B] font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#F3EFE6] transition-colors cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-[#8C7443]" />
                    Fast Travel / Teleport
                  </button>

                  <button
                    onClick={() => setActiveTab('controls')}
                    className="w-full py-3 px-4 rounded-xl bg-[#FFFDF9] border border-[#DDD3C3] text-[#4A453B] font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#F3EFE6] transition-colors cursor-pointer"
                  >
                    <Keyboard className="w-4 h-4 text-[#8C7443]" />
                    Controls & Audio Guide
                  </button>

                  <button
                    onClick={handleExit}
                    className="w-full py-3 px-4 rounded-xl bg-[#FFFDF9] border border-[#DDD3C3] text-[#7A3E3E] font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#FCE8E8] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-[#7A3E3E]" />
                    Exit to Intro
                  </button>
                </div>
              )}

              {/* TAB 2: SCENE LIGHTING PANEL */}
              {activeTab === 'lighting' && (
                <div className="pt-1 space-y-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAllLights(true)}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#FAF4E6] border border-[#C5A059] text-[#8C7443] font-semibold text-xs tracking-wider uppercase cursor-pointer hover:bg-[#F5EDD6] transition-colors"
                    >
                      Turn All On
                    </button>
                    <button
                      onClick={() => setAllLights(false)}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#ECE7DC] border border-[#DDD3C3] text-[#5A5448] font-semibold text-xs tracking-wider uppercase cursor-pointer hover:bg-[#E2DCCF] transition-colors"
                    >
                      Turn All Off
                    </button>
                  </div>

                  <div className="max-h-[220px] overflow-y-auto space-y-1.5 pr-1">
                    {Object.entries({
                      living: 'Grand Living Gallery',
                      kitchen_dining: 'Kitchen & Dining Pavilion',
                      terrace: 'Private Sky Terrace',
                      hallway: 'Gallery Hallway',
                      master_bedroom: 'Master Bedroom Suite',
                      wardrobe: 'Walk-in Wardrobe',
                      master_bathroom: 'Master Bath & Spa',
                      powder_room: 'Guest Powder Room',
                      guest_bedroom: 'Guest Bedroom Suite',
                      foyer: 'Entrance Foyer',
                    }).map(([key, name]) => {
                      const isOn = lightingStates[key] ?? true;
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between p-2 rounded-xl bg-[#FFFDF9] border border-[#E8DFD1]"
                        >
                          <span className="text-xs font-serif text-[#2D2A26] font-medium">
                            {name}
                          </span>
                          <button
                            onClick={() => toggleRoomLight(key)}
                            className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold cursor-pointer transition-colors ${
                              isOn
                                ? 'bg-[#D4AF37] text-white shadow-sm'
                                : 'bg-[#E5DFD4] text-[#7A7469]'
                            }`}
                          >
                            {isOn ? 'ON' : 'OFF'}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setActiveTab('menu')}
                    className="w-full mt-2 py-2 rounded-lg bg-[#EFECE1] text-[#4A453B] font-medium text-xs uppercase cursor-pointer"
                  >
                    Back to Actions
                  </button>
                </div>
              )}

              {/* TAB 3: FAST TRAVEL */}
              {activeTab === 'teleport' && (
                <div className="pt-1 max-h-[300px] overflow-y-auto space-y-2 pr-1">
                  {rooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => handleTeleportFromPause(room.spawnPosition, room.spawnYaw)}
                      className="w-full text-left p-2.5 rounded-xl border border-[#E8DFD1] bg-[#FFFDF9] hover:border-[#C5A059] hover:bg-[#FAF6EC] flex items-center justify-between text-xs transition-colors cursor-pointer"
                    >
                      <span className="font-serif font-medium text-sm text-[#2A2722]">
                        {room.name}
                      </span>
                      <span className="text-[10px] text-[#8C7443] font-mono">Teleport</span>
                    </button>
                  ))}
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="w-full mt-2 py-2 rounded-lg bg-[#EFECE1] text-[#4A453B] font-medium text-xs uppercase cursor-pointer"
                  >
                    Back to Actions
                  </button>
                </div>
              )}

              {/* TAB 4: CONTROLS GUIDE */}
              {activeTab === 'controls' && (
                <div className="pt-1 text-xs space-y-2 text-[#545046]">
                  <div className="flex justify-between items-center py-1.5 border-b border-[#ECE7DC]">
                    <span>Walk / Explore</span>
                    <span className="font-mono bg-[#EFECE1] px-2 py-0.5 rounded border border-[#DDD3C3]">
                      W, A, S, D / Arrows
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-[#ECE7DC]">
                    <span>Interact / Sit / Lie Down</span>
                    <span className="font-mono bg-[#EFECE1] px-2 py-0.5 rounded border border-[#DDD3C3]">
                      E Key / Click
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-[#ECE7DC]">
                    <span>Stand Up (from Bed/Sofa)</span>
                    <span className="font-mono bg-[#EFECE1] px-2 py-0.5 rounded border border-[#DDD3C3]">
                      E / Spacebar / WASD
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-[#ECE7DC]">
                    <span>Quick Mute Music & Audio</span>
                    <span className="font-mono bg-[#EFECE1] px-2 py-0.5 rounded border border-[#DDD3C3]">
                      M Key
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-[#ECE7DC]">
                    <span>Sprint / Fast Stroll</span>
                    <span className="font-mono bg-[#EFECE1] px-2 py-0.5 rounded border border-[#DDD3C3]">
                      Hold Shift
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-[#ECE7DC]">
                    <span>Jump / Crouch</span>
                    <span className="font-mono bg-[#EFECE1] px-2 py-0.5 rounded border border-[#DDD3C3]">
                      Space / C Key
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="w-full mt-3 py-2 rounded-lg bg-[#EFECE1] text-[#4A453B] font-medium text-xs uppercase cursor-pointer"
                  >
                    Back to Actions
                  </button>
                </div>
              )}

              {/* TAB 5: ADVANCED SETTINGS & QUALITY */}
              {activeTab === 'settings' && (
                <div className="pt-1 text-xs space-y-3.5 text-[#545046]">
                  {/* Graphics Quality Preset */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Sliders className="w-4 h-4 text-[#8C7443]" />
                        <span>Graphics Preset</span>
                      </div>
                      <span className="font-mono font-bold text-[#8C7443] uppercase text-[11px]">
                        {quality}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['low', 'medium', 'high', 'ultra'] as QualityPreset[]).map((q) => (
                        <button
                          key={q}
                          onClick={() => setQuality(q)}
                          className={`py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                            quality === q
                              ? 'bg-[#D4AF37] text-white shadow-sm'
                              : 'bg-[#EFECE1] text-[#545046] hover:bg-[#E5DFD4]'
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Master Volume */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-1.5 font-medium">
                        {settings.isMuted ? (
                          <VolumeX className="w-4 h-4 text-red-500" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-[#8C7443]" />
                        )}
                        <span>Master Volume</span>
                      </div>
                      <span className="font-mono font-semibold text-[#8C7443]">
                        {settings.isMuted ? 'Muted' : `${Math.round(settings.volume * 100)}%`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={settings.volume}
                        disabled={settings.isMuted}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full accent-[#C5A059] cursor-pointer disabled:opacity-40"
                      />
                      <button
                        onClick={toggleMute}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase font-bold cursor-pointer transition-colors ${
                          settings.isMuted
                            ? 'bg-red-100 text-red-700 border border-red-300'
                            : 'bg-[#EFECE1] text-[#545046] border border-[#DDD3C3]'
                        }`}
                      >
                        {settings.isMuted ? 'Unmute' : 'Mute'}
                      </button>
                    </div>
                  </div>

                  {/* Look Sensitivity */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-medium">Look Sensitivity</span>
                      <span className="font-mono font-semibold text-[#8C7443]">
                        {Math.round(settings.mouseSensitivity * 10000)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.001"
                      max="0.005"
                      step="0.0002"
                      value={settings.mouseSensitivity}
                      onChange={(e) =>
                        updateSettings({
                          mouseSensitivity: parseFloat(e.target.value),
                          mobileSensitivity: parseFloat(e.target.value) * 1.5,
                        })
                      }
                      className="w-full accent-[#C5A059] cursor-pointer"
                    />
                  </div>

                  {/* Field of View */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-medium">Field of View (FOV)</span>
                      <span className="font-mono font-semibold text-[#8C7443]">
                        {settings.fov}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min="65"
                      max="90"
                      step="1"
                      value={settings.fov}
                      onChange={(e) => updateSettings({ fov: parseInt(e.target.value, 10) })}
                      className="w-full accent-[#C5A059] cursor-pointer"
                    />
                  </div>

                  {/* Head-Bob & Fullscreen Toggles */}
                  <div className="pt-1 flex items-center justify-between border-t border-[#ECE7DC]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.headBobEnabled ?? true}
                        onChange={(e) => updateSettings({ headBobEnabled: e.target.checked })}
                        className="rounded accent-[#C5A059] cursor-pointer"
                      />
                      <span>Head-Bob Animation</span>
                    </label>

                    <button
                      onClick={toggleFullscreen}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#EFECE1] hover:bg-[#E5DFD4] text-[#545046] transition-colors cursor-pointer text-xs uppercase"
                    >
                      {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                      <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveTab('menu')}
                    className="w-full mt-2 py-2 rounded-lg bg-[#EFECE1] text-[#4A453B] font-medium text-xs uppercase cursor-pointer"
                  >
                    Back to Actions
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
