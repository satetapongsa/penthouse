'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import {
  Play,
  RotateCcw,
  Sliders,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  Keyboard,
  Info,
  AlertTriangle,
} from 'lucide-react';

interface HUDProps {
  onRequestPointerLock: () => void;
}

export const HUD: React.FC<HUDProps> = ({ onRequestPointerLock }) => {
  const isStarted = useGameStore((s) => s.isStarted);
  const isPaused = useGameStore((s) => s.isPaused);
  const isMobile = useGameStore((s) => s.isMobile);
  const webGlSupported = useGameStore((s) => s.webGlSupported);

  const resumeGame = useGameStore((s) => s.resumeGame);
  const exitToIntro = useGameStore((s) => s.exitToIntro);
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);

  const [activeTab, setActiveTab] = useState<'menu' | 'controls' | 'settings'>('menu');

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
              className="mt-6 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C5A059] to-[#8C7443] text-white text-sm font-semibold tracking-wider uppercase shadow-md"
            >
              Reload Page
            </button>
          </div>
        </div>
      )}

      {/* -------------------- 2. MINIMAL CROSSHAIR DOT -------------------- */}
      {isStarted && !isPaused && !isMobile && (
        <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Center dot */}
            <div className="w-1.5 h-1.5 rounded-full bg-[#FAF8F3] shadow-[0_0_4px_rgba(197,160,89,0.9)] border border-[#C5A059]/60" />
            {/* Subtle outer focus ring */}
            <div className="absolute w-6 h-6 rounded-full border border-[#FAF8F3]/25" />
          </div>
        </div>
      )}

      {/* -------------------- 3. PAUSE MENU OVERLAY -------------------- */}
      <AnimatePresence>
        {isStarted && isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md select-none"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative max-w-md w-full rounded-3xl bg-[#FAF8F3]/95 border border-[#C5A059]/40 shadow-2xl overflow-hidden p-6 text-neutral-800"
            >
              {/* Header */}
              <div className="text-center pb-5 border-b border-[#E8DFD1]">
                <span className="text-[11px] font-mono tracking-[0.25em] text-[#8C7443] uppercase">
                  Walkthrough Paused
                </span>
                <h2 className="font-serif text-3xl font-light tracking-widest text-[#2D2A26] uppercase mt-1">
                  The Skyline Penthouse
                </h2>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-[#E8DFD1] my-4 text-xs">
                <button
                  onClick={() => setActiveTab('menu')}
                  className={`flex-1 py-2 font-medium tracking-wider uppercase border-b-2 transition-colors ${
                    activeTab === 'menu'
                      ? 'border-[#C5A059] text-[#8C7443]'
                      : 'border-transparent text-neutral-400 hover:text-neutral-600'
                  }`}
                >
                  Actions
                </button>
                <button
                  onClick={() => setActiveTab('controls')}
                  className={`flex-1 py-2 font-medium tracking-wider uppercase border-b-2 transition-colors ${
                    activeTab === 'controls'
                      ? 'border-[#C5A059] text-[#8C7443]'
                      : 'border-transparent text-neutral-400 hover:text-neutral-600'
                  }`}
                >
                  Controls
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex-1 py-2 font-medium tracking-wider uppercase border-b-2 transition-colors ${
                    activeTab === 'settings'
                      ? 'border-[#C5A059] text-[#8C7443]'
                      : 'border-transparent text-neutral-400 hover:text-neutral-600'
                  }`}
                >
                  Settings
                </button>
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
                    onClick={() => setActiveTab('controls')}
                    className="w-full py-3 px-4 rounded-xl bg-[#FFFDF9] border border-[#DDD3C3] text-[#4A453B] font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#F3EFE6] transition-colors cursor-pointer"
                  >
                    <Keyboard className="w-4 h-4 text-[#8C7443]" />
                    View Controls
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

              {/* TAB 2: CONTROLS GUIDE */}
              {activeTab === 'controls' && (
                <div className="pt-1 text-xs space-y-2.5 text-[#545046]">
                  <div className="flex justify-between items-center py-1.5 border-b border-[#ECE7DC]">
                    <span className="font-sans">Movement</span>
                    <span className="font-mono bg-[#EFECE1] px-2 py-0.5 rounded border border-[#DDD3C3]">
                      W, A, S, D / Arrows
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-[#ECE7DC]">
                    <span className="font-sans">Sprint</span>
                    <span className="font-mono bg-[#EFECE1] px-2 py-0.5 rounded border border-[#DDD3C3]">
                      Hold Shift
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-[#ECE7DC]">
                    <span className="font-sans">Jump / Step-up</span>
                    <span className="font-mono bg-[#EFECE1] px-2 py-0.5 rounded border border-[#DDD3C3]">
                      Spacebar
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-[#ECE7DC]">
                    <span className="font-sans">Crouch</span>
                    <span className="font-mono bg-[#EFECE1] px-2 py-0.5 rounded border border-[#DDD3C3]">
                      C Key
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-[#ECE7DC]">
                    <span className="font-sans">Look Around</span>
                    <span className="font-mono bg-[#EFECE1] px-2 py-0.5 rounded border border-[#DDD3C3]">
                      Mouse / Swipe
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="font-sans">Pause / Menu</span>
                    <span className="font-mono bg-[#EFECE1] px-2 py-0.5 rounded border border-[#DDD3C3]">
                      Esc
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="w-full mt-4 py-2 rounded-lg bg-[#EFECE1] text-[#4A453B] font-medium text-xs uppercase"
                  >
                    Back to Actions
                  </button>
                </div>
              )}

              {/* TAB 3: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="pt-1 text-xs space-y-4 text-[#545046]">
                  {/* Mouse Sensitivity */}
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

                  {/* Camera FOV */}
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

                  <button
                    onClick={() => setActiveTab('menu')}
                    className="w-full mt-2 py-2 rounded-lg bg-[#EFECE1] text-[#4A453B] font-medium text-xs uppercase"
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
