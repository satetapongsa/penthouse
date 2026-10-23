'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useGameStore } from '@/store/useGameStore';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';
import { useDeviceDetect } from '@/hooks/useDeviceDetect';
import { IntroOverlay } from '@/components/intro/IntroOverlay';
import { HUD } from '@/components/ui/HUD';
import { MobileControls } from '@/components/mobile/MobileControls';
import { requestCanvasPointerLock } from '@/lib/pointerLock';

// Dynamically load the WebGL Three.js Canvas with ssr: false
const PenthouseCanvas = dynamic(
  () => import('@/components/canvas/PenthouseCanvas').then((mod) => mod.PenthouseCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#FAF8F3] text-[#8C7443]">
        <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-serif tracking-[0.2em] text-sm uppercase">
          Initializing Spatial Engine...
        </span>
      </div>
    ),
  }
);

export const PenthouseExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize unified input and device listeners
  useKeyboardControls();
  useDeviceDetect();

  const isMobile = useGameStore((s) => s.isMobile);
  const startGame = useGameStore((s) => s.startGame);

  // Unified pointer lock requester
  const requestPointerLock = useCallback(() => {
    if (isMobile) return;
    const canvas = containerRef.current?.querySelector('canvas') || document.querySelector('canvas');
    requestCanvasPointerLock(canvas);
  }, [isMobile]);

  // Synchronous Enter handler inside direct user activation gesture
  const handleEnter = useCallback(() => {
    startGame();
    if (!isMobile) {
      const canvas = containerRef.current?.querySelector('canvas') || document.querySelector('canvas');
      requestCanvasPointerLock(canvas);
    }
  }, [startGame, isMobile]);

  // Single global pointer lock state sync and pause-on-lock-loss listener
  useEffect(() => {
    const handlePointerLockChange = () => {
      const canvas = document.querySelector('canvas');
      const isLocked = !!canvas && document.pointerLockElement === canvas;
      useGameStore.getState().setPointerLocked(isLocked);

      // Lock dropped (e.g. Esc pressed) while actively exploring -> trigger pause menu
      const { isStarted, isPaused, isMobile: mobile, isPhotoMode, pauseGame } = useGameStore.getState();
      if (!isLocked && isStarted && !isPaused && !mobile && !isPhotoMode) {
        pauseGame();
      }
    };

    const handlePointerLockError = () => {
      // Gracefully handle browser cooldown delay without breaking state
      useGameStore.getState().setPointerLocked(false);
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('pointerlockerror', handlePointerLockError);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('pointerlockerror', handlePointerLockError);
    };
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#FAF8F3]">
      {/* 3D WebGL Canvas Layer */}
      <PenthouseCanvas canvasContainerRef={containerRef} />

      {/* Intro Experience Overlay */}
      <IntroOverlay onEnter={handleEnter} />

      {/* HUD (Crosshair, Pause Menu, Mute, Click to Resume & Navigation) */}
      <HUD onRequestPointerLock={requestPointerLock} />

      {/* Mobile Touch Navigation Overlay */}
      <MobileControls />
    </main>
  );
};

export default PenthouseExperience;
