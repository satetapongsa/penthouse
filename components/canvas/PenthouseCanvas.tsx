'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { TestRoom } from '@/components/room/TestRoom';
import { Player } from '@/components/player/Player';
import { useGameStore } from '@/store/useGameStore';

interface PenthouseCanvasProps {
  canvasContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const PenthouseCanvas: React.FC<PenthouseCanvasProps> = ({ canvasContainerRef }) => {
  const setWebGlSupported = useGameStore((s) => s.setWebGlSupported);
  const isStarted = useGameStore((s) => s.isStarted);
  const isPaused = useGameStore((s) => s.isPaused);
  const isMobile = useGameStore((s) => s.isMobile);
  const resumeGame = useGameStore((s) => s.resumeGame);

  // Check WebGL availability safely on mount
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

  // Click handler to re-engage pointer lock when in-game and paused
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
          fov: 75,
          near: 0.1,
          far: 500,
          position: [0, 1.8, 2],
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        dpr={[1, Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio : 1.5)]}
      >
        <color attach="background" args={['#F0F6F9']} />

        {/* Rapier Physics World */}
        <Physics gravity={[0, -9.81, 0]}>
          <TestRoom />
          <Player />
        </Physics>
      </Canvas>
    </div>
  );
};

export default PenthouseCanvas;
