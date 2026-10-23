'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, QualityPreset } from '@/store/useGameStore';
import { ARCHITECTURE_CONFIG } from '@/lib/config';
import {
  Play,
  Camera,
  MapPin,
  Settings,
  HelpCircle,
  LogOut,
  Sliders,
  Volume2,
  VolumeX,
  Eye,
  Maximize,
  Sparkles,
  Lightbulb,
  Activity,
} from 'lucide-react';

const CONTROLS_LIST = [
  { label: 'Movement', keys: 'W, A, S, D / Arrows' },
  { label: 'Look Around', keys: 'Mouse Look' },
  { label: 'Interact', keys: 'E Key / Left Click' },
  { label: 'Sprint', keys: 'Shift (Hold)' },
  { label: 'Jump / Stand Up', keys: 'Spacebar' },
  { label: 'Crouch', keys: 'C Key' },
  { label: 'Photo Mode', keys: 'P Key' },
  { label: 'Perf Stats', keys: 'F3 / O Key' },
];

interface PauseMenuProps {
  onRequestPointerLock?: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({ onRequestPointerLock }) => {
  const isStarted = useGameStore((s) => s.isStarted);
  const isPaused = useGameStore((s) => s.isPaused);
  const isPhotoMode = useGameStore((s) => s.isPhotoMode);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const exitToIntro = useGameStore((s) => s.exitToIntro);
  const setPhotoMode = useGameStore((s) => s.setPhotoMode);
  const triggerTeleport = useGameStore((s) => s.triggerTeleport);
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);
  const lightingStates = useGameStore((s) => s.lightingStates);
  const toggleRoomLight = useGameStore((s) => s.toggleRoomLight);
  const setAllLights = useGameStore((s) => s.setAllLights);
  const showPerf = useGameStore((s) => s.showPerf);
  const togglePerf = useGameStore((s) => s.togglePerf);

  const [activeTab, setActiveTab] = useState<'menu' | 'lighting' | 'teleport' | 'controls' | 'settings'>('menu');

  if (!isStarted || !isPaused || isPhotoMode) {
    return null;
  }

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const roomsList = Object.values(ARCHITECTURE_CONFIG.rooms);

  return (
    <AnimatePresence>
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

          {/* TAB 1: MAIN MENU ACTIONS */}
          {activeTab === 'menu' && (
            <div className="space-y-3 pt-1">
              <button
                onClick={resumeGame}
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
                <MapPin className="w-4 h-4 text-[#8C7443]" />
                Fast Travel Directory
              </button>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => setActiveTab('controls')}
                  className="py-2.5 px-3 rounded-xl bg-[#FFFDF9] border border-[#DDD3C3] text-[#4A453B] font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 hover:bg-[#F3EFE6] transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#8C7443]" />
                  Controls
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="py-2.5 px-3 rounded-xl bg-[#FFFDF9] border border-[#DDD3C3] text-[#4A453B] font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 hover:bg-[#F3EFE6] transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-[#8C7443]" />
                  Settings
                </button>
              </div>

              <button
                onClick={exitToIntro}
                className="w-full py-2.5 px-4 text-xs font-mono text-neutral-400 hover:text-red-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer pt-2"
              >
                <LogOut className="w-3 h-3" />
                Return to Title Screen
              </button>
            </div>
          )}

          {/* TAB 2: SCENE LIGHTING PANEL */}
          {activeTab === 'lighting' && (
            <div className="space-y-3 pt-1 max-h-[340px] overflow-y-auto pr-1">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8DFD1]">
                <button
                  onClick={() => setAllLights(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#FAF5EC] border border-[#C5A059]/40 text-[#8C7443] text-xs font-medium hover:bg-[#F3EFE6] cursor-pointer"
                >
                  Turn All On
                </button>
                <button
                  onClick={() => setAllLights(false)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-300 text-neutral-600 text-xs font-medium hover:bg-neutral-200 cursor-pointer"
                >
                  Turn All Off
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {roomsList.map((room) => {
                  const key = room.id;
                  const isOn = lightingStates[key] ?? true;
                  return (
                    <div
                      key={key}
                      className="p-2.5 rounded-xl border border-[#E8DFD1] bg-[#FFFDF9] flex items-center justify-between"
                    >
                      <span className="truncate pr-1 font-medium text-neutral-700">{room.name}</span>
                      <button
                        onClick={() => toggleRoomLight(key)}
                        className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${
                          isOn ? 'bg-[#C5A059]' : 'bg-neutral-300'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                            isOn ? 'left-4.5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: TELEPORT DIRECTORY */}
          {activeTab === 'teleport' && (
            <div className="space-y-2 pt-1 max-h-[340px] overflow-y-auto pr-1">
              {roomsList.map((room) => (
                <button
                  key={room.id}
                  onClick={() => triggerTeleport(room.spawnPosition, room.spawnYaw)}
                  className="w-full p-3 rounded-xl border border-[#E8DFD1] bg-[#FFFDF9] hover:bg-[#F3EFE6] hover:border-[#C5A059] flex items-center justify-between transition-colors text-left cursor-pointer"
                >
                  <div>
                    <div className="font-serif text-sm tracking-wide text-neutral-900">{room.name}</div>
                    <div className="text-[10px] text-neutral-500 font-mono">{room.subtitle}</div>
                  </div>
                  <MapPin className="w-4 h-4 text-[#C5A059]" />
                </button>
              ))}
            </div>
          )}

          {/* TAB 4: CONTROLS */}
          {activeTab === 'controls' && (
            <div className="space-y-2 pt-1 max-h-[340px] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {CONTROLS_LIST.map((c, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#FFFDF9] border border-[#E8DFD1]">
                    <div className="font-mono text-[10px] text-[#8C7443] uppercase">{c.label}</div>
                    <div className="font-semibold text-neutral-900 mt-0.5">{c.keys}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-3 pt-1 max-h-[340px] overflow-y-auto pr-1">
              <div>
                <label className="text-[11px] font-mono tracking-wider text-neutral-500 uppercase flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-3 h-3 text-[#C5A059]" /> Visual Quality
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['low', 'medium', 'high', 'ultra'] as QualityPreset[]).map((q) => (
                    <button
                      key={q}
                      onClick={() => updateSettings({ quality: q })}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                        settings.quality === q
                          ? 'bg-[#C5A059] text-white shadow-sm'
                          : 'bg-[#FFFDF9] border border-[#E8DFD1] text-neutral-600 hover:bg-[#F3EFE6]'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[11px] font-mono text-neutral-500 uppercase mb-1">
                  <span className="flex items-center gap-1">
                    {settings.isMuted ? <VolumeX className="w-3 h-3 text-red-500" /> : <Volume2 className="w-3 h-3 text-[#C5A059]" />}
                    Audio Volume
                  </span>
                  <span>{settings.isMuted ? 'Muted' : `${Math.round(settings.volume * 100)}%`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.volume}
                    onChange={(e) => updateSettings({ volume: parseFloat(e.target.value) })}
                    className="w-full accent-[#C5A059] cursor-pointer"
                  />
                  <button
                    onClick={() => updateSettings({ isMuted: !settings.isMuted })}
                    className="px-2 py-1 rounded-md text-[10px] font-mono border border-[#DDD3C3] hover:bg-[#F3EFE6] cursor-pointer"
                  >
                    {settings.isMuted ? 'Unmute' : 'Mute'}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-neutral-500 uppercase mb-1">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-[#C5A059]" /> Field of View (FOV)
                  </span>
                  <span>{settings.fov}°</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="90"
                  step="1"
                  value={settings.fov}
                  onChange={(e) => updateSettings({ fov: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#C5A059] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-neutral-500 uppercase mb-1">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-[#C5A059]" /> Mouse Sensitivity
                  </span>
                  <span>{(settings.mouseSensitivity * 1000).toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.001"
                  max="0.005"
                  step="0.0002"
                  value={settings.mouseSensitivity}
                  onChange={(e) => updateSettings({ mouseSensitivity: parseFloat(e.target.value) })}
                  className="w-full accent-[#C5A059] cursor-pointer"
                />
              </div>

              <div className="pt-1 border-t border-[#E8DFD1] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-700">Head Bob Animation</span>
                  <input
                    type="checkbox"
                    checked={settings.headBobEnabled}
                    onChange={(e) => updateSettings({ headBobEnabled: e.target.checked })}
                    className="w-4 h-4 accent-[#C5A059] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-700 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-[#C5A059]" /> Performance Diagnostics (F3)
                  </span>
                  <input
                    type="checkbox"
                    checked={showPerf}
                    onChange={togglePerf}
                    className="w-4 h-4 accent-[#C5A059] cursor-pointer"
                  />
                </div>

                <button
                  onClick={handleToggleFullscreen}
                  className="w-full py-2 px-3 rounded-lg border border-[#DDD3C3] bg-[#FFFDF9] hover:bg-[#F3EFE6] text-xs font-mono text-neutral-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Maximize className="w-3.5 h-3.5 text-[#8C7443]" />
                  Toggle Fullscreen
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
