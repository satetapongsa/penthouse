'use client';

import React, { useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { PerformanceMonitor } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import { PenthouseShell } from '@/components/room/PenthouseShell';
import { Player } from '@/components/player/Player';
import { InteractionManager } from '@/components/interaction/InteractionManager';
import { PostProcessingEffects } from '@/components/canvas/PostProcessingEffects';
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
  const quality = useGameStore((s) => s.quality);
  const setQuality = useGameStore((s) => s.setQuality);
  const showPerf = useGameStore((s) => s.showPerf);
  const screenshotTrigger = useGameStore((s) => s.screenshotTrigger);

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

  // Handle Photo Mode Screenshot Download
  useEffect(() => {
    if (screenshotTrigger === 0) return;
    try {
      const canvasEl = canvasContainerRef.current?.querySelector('canvas');
      if (canvasEl) {
        const dataUrl = canvasEl.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `the-skyline-penthouse-${Date.now()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.warn('Screenshot capture error:', err);
    }
  }, [screenshotTrigger, canvasContainerRef]);

  const handleCanvasClick = useCallback(() => {
    if (isMobile) return;
    if (isStarted && isPaused) {
      resumeGame();
    }
  }, [isMobile, isStarted, isPaused, resumeGame]);

  // Capped DPR strictly per quality tier (Low 0.75, Medium 1, High 1.25, Ultra 1.5, never above 1.5)
  const targetDpr =
    quality === 'low'
      ? 0.75
      : quality === 'medium'
      ? 1.0
      : quality === 'high'
      ? 1.25
      : 1.5;

  return (
    <div
      ref={canvasContainerRef}
      onClick={handleCanvasClick}
      className="w-full h-full relative cursor-crosshair outline-hidden select-none"
    >
      <Canvas
        shadows={quality !== 'low'}
        camera={{
          fov: PLAYER_CONFIG.baseFov,
          near: 0.1,
          far: 500,
          position: PLAYER_CONFIG.spawnPosition,
        }}
        gl={{
          antialias: quality !== 'low',
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
          preserveDrawingBuffer: true,
        }}
        dpr={targetDpr}
      >
        <color attach="background" args={['#EEF5F9']} />

        {/* Adaptive Performance Monitor: Fast downgrade when FPS dips below threshold */}
        <PerformanceMonitor
          iterations={2}
          threshold={0.72}
          onDecline={() => {
            const current = useGameStore.getState().quality;
            if (current === 'ultra') setQuality('high');
            else if (current === 'high') setQuality('medium');
            else if (current === 'medium') setQuality('low');
          }}
        />

        {/* Temporary Performance Diagnostics Overlay (Toggle with F3 or O) */}
        {showPerf && <Perf position="top-left" deepAnalyze />}

        {/* Rapier Physics World */}
        <Physics gravity={[0, -9.81, 0]}>
          <PenthouseShell />
          <Player />
          <InteractionManager />
        </Physics>

        {/* Cinematic Post-Processing Stack */}
        <PostProcessingEffects />
      </Canvas>
    </div>
  );
};

export default PenthouseCanvas;
