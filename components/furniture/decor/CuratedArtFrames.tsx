'use client';

import React from 'react';
import { RoundedBox } from '@react-three/drei';
import { LUXURY_PALETTE } from '@/lib/materials';

interface FramedArtProps {
  position: [number, number, number];
  rotationY?: number;
  width?: number;
  height?: number;
  artVariant?: 'arch' | 'minimalist' | 'horizon';
  hasPictureLight?: boolean;
}

export const LuxuryFramedArt: React.FC<FramedArtProps> = ({
  position,
  rotationY = 0,
  width = 1.0,
  height = 1.4,
  artVariant = 'arch',
  hasPictureLight = true,
}) => {
  const colors = LUXURY_PALETTE.colors;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 1. Heavy Brushed Brass Frame with Depth */}
      <mesh position={[0, 0, 0.015]} castShadow>
        <boxGeometry args={[width, height, 0.03]} />
        <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
      </mesh>

      {/* 2. Recessed Museum Archival Mat Board */}
      <mesh position={[0, 0, 0.026]}>
        <planeGeometry args={[width - 0.08, height - 0.08]} />
        <meshStandardMaterial color="#FAF8F3" roughness={0.85} />
      </mesh>

      {/* 3. High-End Canvas Artwork with Subtle Geometric Composition */}
      <mesh position={[0, 0, 0.028]}>
        <planeGeometry args={[width - 0.22, height - 0.22]} />
        <meshStandardMaterial
          color={artVariant === 'arch' ? '#EAE3D5' : artVariant === 'minimalist' ? '#F2EDE4' : '#E5DDD0'}
          roughness={0.7}
        />
      </mesh>

      {/* Textured Abstract Forms on Canvas */}
      {artVariant === 'arch' && (
        <group position={[0, -0.05, 0.03]}>
          <mesh>
            <circleGeometry args={[(width - 0.3) / 2, 32]} />
            <meshStandardMaterial color="#D8C7B0" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.15, 0.001]}>
            <ringGeometry args={[0.08, 0.12, 32]} />
            <meshStandardMaterial color={colors.brass} metalness={0.85} roughness={0.3} />
          </mesh>
        </group>
      )}

      {artVariant === 'minimalist' && (
        <group position={[0, 0, 0.03]}>
          <mesh position={[0.05, 0.05, 0]}>
            <planeGeometry args={[(width - 0.35) * 0.7, (height - 0.35) * 0.5]} />
            <meshStandardMaterial color="#CFBFA8" roughness={0.65} />
          </mesh>
          <mesh position={[-0.06, -0.08, 0.001]}>
            <circleGeometry args={[0.14, 24]} />
            <meshStandardMaterial color={colors.sage} roughness={0.6} />
          </mesh>
        </group>
      )}

      {/* 4. Above-Frame Brass Picture Light */}
      {hasPictureLight && (
        <group position={[0, height / 2 + 0.12, 0.1]}>
          {/* Wall mount backplate */}
          <mesh position={[0, 0, -0.09]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.015, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Curved Gooseneck Arm */}
          <mesh position={[0, 0, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.1, 8]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Horizontal Linear Lamp Shade */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, width * 0.45, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Warm Emissive Underside Light Wash */}
          <mesh position={[0, -0.014, 0]}>
            <planeGeometry args={[width * 0.42, 0.02]} />
            <meshBasicMaterial color="#FFF1CC" />
          </mesh>
        </group>
      )}
    </group>
  );
};
