'use client';

import React from 'react';
import { RoundedBox } from '@react-three/drei';
import { LUXURY_PALETTE } from '@/lib/materials';

interface BookStackProps {
  position: [number, number, number];
  rotationY?: number;
}

export const LuxuryBookStack: React.FC<BookStackProps> = ({ position, rotationY = 0 }) => {
  const colors = LUXURY_PALETTE.colors;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Bottom Large Linen Art Monograph */}
      <RoundedBox args={[0.34, 0.038, 0.28]} radius={0.008} smoothness={3} position={[0, 0.019, 0]} castShadow>
        <meshStandardMaterial color="#E7DFD3" roughness={0.7} />
      </RoundedBox>
      <mesh position={[0.165, 0.019, 0]}>
        <boxGeometry args={[0.01, 0.032, 0.26]} />
        <meshStandardMaterial color="#FAF8F3" roughness={0.8} />
      </mesh>

      {/* Middle Champagne Architectural Book */}
      <group position={[0.01, 0.048, -0.01]} rotation={[0, 0.06, 0]}>
        <RoundedBox args={[0.3, 0.032, 0.25]} radius={0.007} smoothness={3} castShadow>
          <meshStandardMaterial color={colors.brass} metalness={0.65} roughness={0.35} />
        </RoundedBox>
      </group>

      {/* Top Sage Design Book */}
      <group position={[-0.015, 0.074, 0.015]} rotation={[0, -0.09, 0]}>
        <RoundedBox args={[0.26, 0.026, 0.22]} radius={0.006} smoothness={3} castShadow>
          <meshStandardMaterial color={colors.sage} roughness={0.65} />
        </RoundedBox>
        {/* Brass Debossed Cover Inlay */}
        <mesh position={[0, 0.014, 0]}>
          <planeGeometry args={[0.16, 0.14]} />
          <meshStandardMaterial color={colors.gold} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};

interface TravertineTrayProps {
  position: [number, number, number];
  rotationY?: number;
  width?: number;
  depth?: number;
}

export const TravertineTray: React.FC<TravertineTrayProps> = ({
  position,
  rotationY = 0,
  width = 0.5,
  depth = 0.35,
}) => {
  const colors = LUXURY_PALETTE.colors;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Main Stone Base Slab */}
      <RoundedBox args={[width, 0.024, depth]} radius={0.006} smoothness={3} position={[0, 0.012, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={colors.travertine} roughness={0.35} />
      </RoundedBox>

      {/* Raised Rim Perimeter */}
      <mesh position={[0, 0.028, depth / 2 - 0.008]} castShadow>
        <boxGeometry args={[width, 0.02, 0.016]} />
        <meshStandardMaterial color={colors.travertine} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.028, -depth / 2 + 0.008]} castShadow>
        <boxGeometry args={[width, 0.02, 0.016]} />
        <meshStandardMaterial color={colors.travertine} roughness={0.35} />
      </mesh>
      <mesh position={[width / 2 - 0.008, 0.028, 0]} castShadow>
        <boxGeometry args={[0.016, 0.02, depth]} />
        <meshStandardMaterial color={colors.travertine} roughness={0.35} />
      </mesh>
      <mesh position={[-width / 2 + 0.008, 0.028, 0]} castShadow>
        <boxGeometry args={[0.016, 0.02, depth]} />
        <meshStandardMaterial color={colors.travertine} roughness={0.35} />
      </mesh>

      {/* Brushed Brass Side Handles */}
      {[-width / 2, width / 2].map((hx, idx) => (
        <group key={`handle-${idx}`} position={[hx, 0.035, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.006, 0.006, 0.12, 12]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

interface ScentedCandleProps {
  position: [number, number, number];
  height?: number;
  radius?: number;
}

export const ScentedGlassCandle: React.FC<ScentedCandleProps> = ({
  position,
  height = 0.1,
  radius = 0.045,
}) => {
  return (
    <group position={position}>
      {/* Frosted Ribbed Glass Tumbler */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[radius, radius * 0.95, height, 24]} />
        <meshPhysicalMaterial
          color="#FAF8F5"
          roughness={0.15}
          transmission={0.82}
          thickness={0.03}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Soy Wax Fill */}
      <mesh position={[0, height * 0.45, 0]}>
        <cylinderGeometry args={[radius * 0.9, radius * 0.85, height * 0.75, 20]} />
        <meshStandardMaterial color="#FFF9ED" roughness={0.8} />
      </mesh>

      {/* Wick & Flame Glow */}
      <mesh position={[0, height * 0.85, 0]}>
        <cylinderGeometry args={[0.0015, 0.0015, 0.018, 8]} />
        <meshBasicMaterial color="#332B25" />
      </mesh>
      <mesh position={[0, height * 0.88, 0]}>
        <sphereGeometry args={[0.006, 10, 10]} />
        <meshBasicMaterial color="#FFDD80" />
      </mesh>
    </group>
  );
};

interface SculpturalVaseProps {
  position: [number, number, number];
  scale?: number;
}

export const SculpturalCeramicVase: React.FC<SculpturalVaseProps> = ({ position, scale = 1.0 }) => {
  const colors = LUXURY_PALETTE.colors;

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Matte Travertine / Ceramic Flask Body */}
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.11, 0.32, 24]} />
        <meshStandardMaterial color={colors.cream} roughness={0.55} />
      </mesh>
      {/* Fluted Neck */}
      <mesh position={[0, 0.36, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.065, 0.1, 20]} />
        <meshStandardMaterial color={colors.cream} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.05, 0.04, 0.02, 20]} />
        <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Dried Botanical Stems */}
      {[
        [-0.01, 0.58, 0.01, 0.1],
        [0.02, 0.62, -0.01, -0.15],
        [-0.02, 0.52, 0.02, 0.25],
      ].map(([sx, sy, sz, rot], idx) => (
        <group key={`stem-${idx}`} position={[sx, sy, sz]} rotation={[rot, 0, rot * 0.7]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.002, 0.003, 0.35, 6]} />
            <meshStandardMaterial color="#B0A28E" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.18, 0]} castShadow>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshStandardMaterial color={colors.sage} roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
