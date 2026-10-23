'use client';

import React, { useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useGameStore } from '@/store/useGameStore';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';
import { useDeviceDetect } from '@/hooks/useDeviceDetect';
import { IntroOverlay } from '@/components/intro/IntroOverlay';
import { HUD } from '@/components/ui/HUD';
import { MobileControls } from '@/components/mobile/MobileControls';

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

  // Helper to request pointer lock on the canvas element
  const requestPointerLock = useCallback(() => {
    if (isMobile) return;
    try {
      const canvasEl = containerRef.current?.querySelector('canvas');
      if (canvasEl && document.pointerLockElement !== canvasEl) {
        canvasEl.requestPointerLock();
      }
    } catch (err) {
      console.warn('Pointer lock request error:', err);
    }
  }, [isMobile]);

  // Handle Enter button from intro
  const handleEnter = useCallback(() => {
    startGame();
    // Slight tick delay allows state to transition before locking pointer
    setTimeout(() => {
      requestPointerLock();
    }, 50);
  }, [startGame, requestPointerLock]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#FAF8F3]">
      {/* 3D WebGL Canvas Layer */}
      <PenthouseCanvas canvasContainerRef={containerRef} />

      {/* Intro Experience Overlay */}
      <IntroOverlay onEnter={handleEnter} />

      {/* HUD (Crosshair, Pause Menu & WebGL notification) */}
      <HUD onRequestPointerLock={requestPointerLock} />

      {/* Mobile Touch Navigation Overlay */}
      <MobileControls />
    </main>
  );
};

export default PenthouseExperience;
