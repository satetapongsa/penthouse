'use client';

import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useGameStore } from '@/store/useGameStore';

export const PostProcessingEffects: React.FC = () => {
  const quality = useGameStore((s) => s.quality);
  const timeOfDay = useGameStore((s) => s.timeOfDay);

  // Disable on low quality for 60+ FPS on all devices
  if (quality === 'low') {
    return null;
  }

  const bloomIntensity =
    quality === 'ultra'
      ? timeOfDay === 'night' ? 0.65 : 0.48
      : quality === 'high'
      ? timeOfDay === 'night' ? 0.5 : 0.38
      : 0.28;

  const bloomThreshold = timeOfDay === 'night' ? 0.75 : 0.84;

  return (
    <EffectComposer multisampling={quality === 'ultra' ? 4 : 2}>
      {/* Subtle architectural bloom on reflective surfaces, lamps, fireplace, and skyline */}
      <Bloom
        luminanceThreshold={bloomThreshold}
        luminanceSmoothing={0.3}
        intensity={bloomIntensity}
        mipmapBlur
      />
      {/* Cinematic subtle vignette framing */}
      <Vignette
        eskil={false}
        offset={0.28}
        darkness={quality === 'ultra' ? 0.42 : 0.35}
      />
    </EffectComposer>
  );
};
