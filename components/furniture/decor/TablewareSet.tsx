'use client';

import React from 'react';
import { RoundedBox } from '@react-three/drei';
import { LUXURY_PALETTE } from '@/lib/materials';

interface PlaceSettingProps {
  position: [number, number, number];
  rotationY?: number;
}

export const DiningPlaceSetting: React.FC<PlaceSettingProps> = ({ position, rotationY = 0 }) => {
  const colors = LUXURY_PALETTE.colors;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 1. Large Champagne Brass Charger Plate */}
      <mesh position={[0, 0.005, 0]} receiveShadow>
        <cylinderGeometry args={[0.16, 0.14, 0.008, 28]} />
        <meshStandardMaterial color={colors.brass} metalness={0.85} roughness={0.25} />
      </mesh>

      {/* 2. Fine Bone China Dinner Plate with Gold Rim */}
      <mesh position={[0, 0.013, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.13, 0.11, 0.008, 28]} />
        <meshPhysicalMaterial color="#FFFEFA" roughness={0.12} clearcoat={0.9} />
      </mesh>
      <mesh position={[0, 0.0175, 0]}>
        <ringGeometry args={[0.125, 0.13, 28]} />
        <meshStandardMaterial color={colors.gold} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 3. Folded Woven Linen Napkin with Brass Ring */}
      <group position={[0, 0.024, 0]}>
        <RoundedBox args={[0.07, 0.016, 0.18]} radius={0.004} smoothness={2} castShadow>
          <meshStandardMaterial color={colors.linen} roughness={0.8} />
        </RoundedBox>
        {/* Brass Ring */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 0.02, 16]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* 4. Brushed Brass Cutlery Set */}
      {/* Dinner Fork (Left) */}
      <group position={[-0.19, 0.006, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.012, 0.004, 0.19]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
      {/* Dinner Knife (Right) */}
      <group position={[0.19, 0.006, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.014, 0.004, 0.2]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
      {/* Soup Spoon (Far Right) */}
      <group position={[0.22, 0.006, -0.01]}>
        <mesh castShadow>
          <boxGeometry args={[0.016, 0.004, 0.17]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* 5. Crystal Wine Glass (Top Right) */}
      <group position={[0.15, 0.006, -0.16]}>
        {/* Base */}
        <mesh position={[0, 0.002, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.004, 16]} />
          <meshPhysicalMaterial color="#EAF4F8" roughness={0.05} transmission={0.92} transparent opacity={0.4} />
        </mesh>
        {/* Stem */}
        <mesh position={[0, 0.045, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 0.085, 12]} />
          <meshPhysicalMaterial color="#EAF4F8" roughness={0.05} transmission={0.92} transparent opacity={0.4} />
        </mesh>
        {/* Bowl */}
        <mesh position={[0, 0.115, 0]} castShadow>
          <cylinderGeometry args={[0.034, 0.02, 0.065, 20]} />
          <meshPhysicalMaterial color="#EAF4F8" roughness={0.05} transmission={0.92} transparent opacity={0.4} />
        </mesh>
      </group>

      {/* 6. Crystal Water Tumbler (Top Left) */}
      <group position={[-0.14, 0.006, -0.15]}>
        <mesh position={[0, 0.045, 0]} castShadow>
          <cylinderGeometry args={[0.032, 0.028, 0.085, 20]} />
          <meshPhysicalMaterial color="#EAF4F8" roughness={0.05} transmission={0.92} transparent opacity={0.4} />
        </mesh>
      </group>
    </group>
  );
};

export const LuxuryEspressoMachine: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({
  position,
  rotationY = 0,
}) => {
  const colors = LUXURY_PALETTE.colors;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Heavy Polished Body */}
      <RoundedBox args={[0.34, 0.36, 0.36]} radius={0.02} smoothness={3} position={[0, 0.18, 0]} castShadow>
        <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
      </RoundedBox>

      {/* Mirror Stainless Steel / Chrome Faceplate */}
      <mesh position={[0, 0.18, 0.182]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshPhysicalMaterial color="#F4F8FA" roughness={0.05} metalness={0.95} clearcoat={1.0} />
      </mesh>

      {/* Pressure Gauge & Dials */}
      <mesh position={[-0.08, 0.28, 0.19]}>
        <circleGeometry args={[0.022, 16]} />
        <meshBasicMaterial color="#FAF5EB" />
      </mesh>
      <mesh position={[-0.08, 0.28, 0.186]}>
        <ringGeometry args={[0.022, 0.026, 16]} />
        <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Dual Portafilter Spouts with Walnut Handles */}
      {[-0.05, 0.05].map((px, idx) => (
        <group key={`group-head-${idx}`} position={[px, 0.16, 0.19]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.03, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.015, 0.08]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.01, 0.12, 12]} />
            <meshStandardMaterial color="#584534" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Drip Tray with Perforated Stainless Grate */}
      <mesh position={[0, 0.02, 0.14]}>
        <boxGeometry args={[0.3, 0.03, 0.12]} />
        <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Espresso Cups on Warming Tray Top */}
      {[-0.07, 0.07].map((cx, idx) => (
        <mesh key={`cup-${idx}`} position={[cx, 0.38, 0]} castShadow>
          <cylinderGeometry args={[0.028, 0.02, 0.038, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
};
