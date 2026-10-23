'use client';

import React, { useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { PenthouseShell } from '@/components/room/PenthouseShell';
import { Player } from '@/components/player/Player';
import { InteractionManager } from '@/components/interaction/InteractionManager';
import { useGameStore } from '@/store/useGameStore';
import { PLAYER_CONFIG } from '@/lib/config';

interface PenthouseCanvasProps {
  canvasContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const PenthouseCanvas: React.FC<PenthouseCanvasProps> = ({ canvasContainerRef }) => {
  const setWebGlSupported = useGameStore((s) => s.setWebGlSupported);
  const isStarted = useGameStore((s) => s.isStarted);
  const isPaused = useGameStore((s) => s.isPaused);
  const isMobile = useGameStore((s) => s.isMobile);
  const resumeGame = useGameStore((s) => s.resumeGame);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) {
        setWebGlSupported(false);
      }
    } catch {
      setWebGlSupported(false);
    }
  }, [setWebGlSupported]);

  const handleCanvasClick = useCallback(() => {
    if (isMobile) return;
    if (isStarted && isPaused) {
      resumeGame();
    }
  }, [isMobile, isStarted, isPaused, resumeGame]);

  return (
    <div
      ref={canvasContainerRef}
      onClick={handleCanvasClick}
      className="w-full h-full relative cursor-crosshair outline-hidden select-none"
    >
      <Canvas
        shadows
        camera={{
          fov: PLAYER_CONFIG.baseFov,
          near: 0.1,
          far: 500,
          position: PLAYER_CONFIG.spawnPosition,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        dpr={[1, Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio : 1.5)]}
      >
        <color attach="background" args={['#EEF5F9']} />

        {/* Rapier Physics World */}
        <Physics gravity={[0, -9.81, 0]}>
          <PenthouseShell />
          <Player />
          <InteractionManager />
        </Physics>
      </Canvas>
    </div>
  );
};

export default PenthouseCanvas;
