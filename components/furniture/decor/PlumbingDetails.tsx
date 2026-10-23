'use client';

import React from 'react';
import { RoundedBox } from '@react-three/drei';
import { LUXURY_PALETTE } from '@/lib/materials';

export const HeatedTowelRail: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({
  position,
  rotationY = 0,
}) => {
  const colors = LUXURY_PALETTE.colors;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Vertical Brass Ladder Rails */}
      {[-0.24, 0.24].map((rx, idx) => (
        <group key={`towel-rail-${idx}`} position={[rx, 0.7, 0.05]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.012, 0.012, 1.4, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Wall Mount Stanchions */}
          {[-0.6, 0.6].map((sy, sidx) => (
            <mesh key={`stan-${sidx}`} position={[0, sy, -0.025]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.05, 12]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Horizontal Heated Rungs */}
      {[0.2, 0.45, 0.7, 0.95, 1.2].map((ry, idx) => (
        <mesh key={`rung-${idx}`} position={[0, ry, 0.05]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.48, 16]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* Folded Plush Waffle-Weave Towels Draped Over Rungs */}
      <group position={[0, 0.7, 0.05]}>
        <RoundedBox args={[0.38, 0.36, 0.05]} radius={0.015} smoothness={3} castShadow>
          <meshStandardMaterial color="#FAF7F2" roughness={0.9} />
        </RoundedBox>
      </group>
      <group position={[0, 0.45, 0.05]}>
        <RoundedBox args={[0.34, 0.3, 0.045]} radius={0.012} smoothness={3} castShadow>
          <meshStandardMaterial color="#EAE4D8" roughness={0.9} />
        </RoundedBox>
      </group>
    </group>
  );
};

export const BathtubCaddyTray: React.FC<{ position: [number, number, number]; width?: number }> = ({
  position,
  width = 0.82,
}) => {
  const colors = LUXURY_PALETTE.colors;

  return (
    <group position={position}>
      {/* Sleek Pale Oak Slat Caddy */}
      <RoundedBox args={[width, 0.018, 0.22]} radius={0.005} smoothness={2} position={[0, 0.01, 0]} castShadow>
        <meshStandardMaterial color={colors.paleOak} roughness={0.45} />
      </RoundedBox>

      {/* Folded Brass Book Rest */}
      <group position={[0, 0.06, -0.04]} rotation={[-0.3, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.14, 0.008]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
        </mesh>
      </group>

      {/* Scented Tea Candle */}
      <mesh position={[0.22, 0.025, 0.02]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.02, 16]} />
        <meshStandardMaterial color="#FAF6EE" roughness={0.4} />
      </mesh>
      <mesh position={[0.22, 0.038, 0.02]}>
        <sphereGeometry args={[0.004, 8, 8]} />
        <meshBasicMaterial color="#FFDC85" />
      </mesh>

      {/* Natural Sea Sponge */}
      <mesh position={[-0.22, 0.035, 0.01]} castShadow>
        <dodecahedronGeometry args={[0.038, 1]} />
        <meshStandardMaterial color="#E5CCA8" roughness={0.9} />
      </mesh>
    </group>
  );
};

export const LuxurySoapDispenser: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const colors = LUXURY_PALETTE.colors;

  return (
    <group position={position}>
      {/* Ceramic Bottle */}
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.032, 0.035, 0.12, 16]} />
        <meshStandardMaterial color="#FAF8F3" roughness={0.3} />
      </mesh>
      {/* Brass Pump Head */}
      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.02, 12]} />
        <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
      </mesh>
      <mesh position={[0.015, 0.145, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.004, 0.004, 0.04, 8]} />
        <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
      </mesh>
    </group>
  );
};
