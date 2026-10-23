'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, TimeOfDay } from '@/store/useGameStore';
import { Camera, Sun, Sunset, Moon, Grid, X, Download } from 'lucide-react';

export const PhotoModeOverlay: React.FC = () => {
  const isPhotoMode = useGameStore((s) => s.isPhotoMode);
  const setPhotoMode = useGameStore((s) => s.setPhotoMode);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const setTimeOfDay = useGameStore((s) => s.setTimeOfDay);
  const triggerScreenshot = useGameStore((s) => s.triggerScreenshot);
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);

  const [showGrid, setShowGrid] = useState(true);
  const [flash, setFlash] = useState(false);

  if (!isPhotoMode) return null;

  const handleCapture = () => {
    // Camera shutter flash effect
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
      triggerScreenshot();
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-40 pointer-events-none select-none">
      {/* Camera Shutter Flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Rule of Thirds Composition Grid */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-25">
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-white" />
          <div className="border-r border-white" />
          <div />
        </div>
      )}

      {/* Viewfinder Corner Brackets */}
      <div className="absolute inset-8 pointer-events-none border border-white/20 rounded-2xl">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]" />
      </div>

      {/* Top Controls Bar */}
      <div className="absolute top-6 inset-x-8 flex justify-between items-center pointer-events-auto">
        <div className="flex items-center gap-2 bg-[#1A1816]/85 backdrop-blur-md px-4 py-2 rounded-full border border-[#C5A059]/40 shadow-xl">
          <Camera className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs font-serif tracking-widest uppercase text-white font-medium">
            Architectural Photo Mode
          </span>
        </div>

        {/* Time of Day Switcher & Grid Toggle */}
        <div className="flex items-center gap-2 bg-[#1A1816]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#C5A059]/40 shadow-xl">
          {(['day', 'sunset', 'night'] as TimeOfDay[]).map((tod) => (
            <button
              key={tod}
              onClick={() => setTimeOfDay(tod)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                timeOfDay === tod
                  ? 'bg-gradient-to-r from-[#C5A059] to-[#8C7443] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tod === 'day' && <Sun className="w-3.5 h-3.5" />}
              {tod === 'sunset' && <Sunset className="w-3.5 h-3.5" />}
              {tod === 'night' && <Moon className="w-3.5 h-3.5" />}
              <span>{tod}</span>
            </button>
          ))}

          <div className="w-px h-4 bg-white/20 mx-1" />

          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Composition Grid"
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              showGrid ? 'text-[#D4AF37] bg-white/10' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>

        {/* Exit Button */}
        <button
          onClick={() => setPhotoMode(false)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1A1816]/85 backdrop-blur-md border border-[#C5A059]/40 text-neutral-300 hover:text-white transition-colors cursor-pointer shadow-xl text-xs uppercase tracking-wider"
        >
          <X className="w-4 h-4" />
          <span>Exit (Esc)</span>
        </button>
      </div>

      {/* Bottom Floating Controls */}
      <div className="absolute bottom-8 inset-x-8 flex flex-col items-center gap-3 pointer-events-auto">
        {/* Focal Length (FOV) Slider */}
        <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-[#1A1816]/85 backdrop-blur-md border border-[#C5A059]/40 shadow-xl text-xs text-white">
          <span className="text-neutral-400 uppercase tracking-wider text-[11px]">Focal FOV</span>
          <input
            type="range"
            min="45"
            max="95"
            step="1"
            value={settings.fov}
            onChange={(e) => updateSettings({ fov: parseInt(e.target.value, 10) })}
            className="w-32 accent-[#C5A059] cursor-pointer"
          />
          <span className="font-mono text-[#D4AF37]">{settings.fov}°</span>
        </div>

        {/* Central Shutter Capture Button */}
        <button
          onClick={handleCapture}
          className="group flex items-center gap-3 px-7 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#A88238] text-[#1E1B15] font-serif text-sm font-bold tracking-[0.2em] uppercase shadow-2xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-3 h-3 rounded-full bg-[#1E1B15] group-hover:scale-125 transition-transform" />
          <Download className="w-4 h-4" />
          <span>Capture Frame (PNG)</span>
        </button>
      </div>
    </div>
  );
};
