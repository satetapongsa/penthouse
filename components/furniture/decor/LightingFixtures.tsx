'use client';

import React from 'react';
import { RoundedBox } from '@react-three/drei';
import { LUXURY_PALETTE } from '@/lib/materials';

interface GrandChandelierProps {
  position: [number, number, number];
  length?: number;
}

export const GrandChandelier: React.FC<GrandChandelierProps> = ({ position, length = 2.4 }) => {
  const colors = LUXURY_PALETTE.colors;

  return (
    <group position={position}>
      {/* Ceiling Mounting Canopy */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 20]} />
        <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Vertical Suspension Rods */}
      {[-length * 0.3, length * 0.3].map((rx, idx) => (
        <mesh key={`suspension-rod-${idx}`} position={[rx, 0.22, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.45, 8]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* Main Horizontal Sculptural Brass Beam */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, length, 16]} />
        <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Staggered Glowing Frosted Glass Diffuser Spheres */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((gx, idx) => {
        const offsetY = idx % 2 === 0 ? -0.12 : 0.12;
        const offsetZ = idx % 3 === 0 ? 0.08 : -0.08;
        return (
          <group key={`globe-${idx}`} position={[gx, offsetY, offsetZ]}>
            {/* Brass Stalk */}
            <mesh position={[0, -offsetY / 2, -offsetZ / 2]}>
              <cylinderGeometry args={[0.004, 0.004, 0.14, 8]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Glowing Frosted Orb */}
            <mesh castShadow>
              <sphereGeometry args={[0.09, 20, 20]} />
              <meshStandardMaterial
                color="#FFFDF7"
                emissive="#FFEEC2"
                emissiveIntensity={0.8}
                roughness={0.2}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

interface WallSconceProps {
  position: [number, number, number];
  rotationY?: number;
}

export const ModernWallSconce: React.FC<WallSconceProps> = ({ position, rotationY = 0 }) => {
  const colors = LUXURY_PALETTE.colors;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Sleek Vertical Brass Spine */}
      <RoundedBox args={[0.04, 0.45, 0.04]} radius={0.008} smoothness={2} position={[0, 0, 0.02]} castShadow>
        <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
      </RoundedBox>

      {/* Top and Bottom Glowing Light Apertures */}
      <mesh position={[0, 0.22, 0.02]}>
        <cylinderGeometry args={[0.018, 0.018, 0.02, 16]} />
        <meshStandardMaterial color="#FFF9ED" emissive="#FFEAB2" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, -0.22, 0.02]}>
        <cylinderGeometry args={[0.018, 0.018, 0.02, 16]} />
        <meshStandardMaterial color="#FFF9ED" emissive="#FFEAB2" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
};

export const TerraceFireBowl: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const colors = LUXURY_PALETTE.colors;

  return (
    <group position={position}>
      {/* Heavy Travertine Plinth Base */}
      <RoundedBox args={[0.9, 0.35, 0.9]} radius={0.04} smoothness={3} position={[0, 0.175, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={colors.travertine} roughness={0.45} />
      </RoundedBox>

      {/* Recessed Cast Iron Fire Basin */}
      <mesh position={[0, 0.34, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.32, 0.08, 24]} />
        <meshStandardMaterial color="#2B2824" roughness={0.8} />
      </mesh>

      {/* Glowing Embers & Black Lava Stones */}
      <mesh position={[0, 0.37, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.03, 20]} />
        <meshStandardMaterial
          color="#3A2D23"
          emissive="#FF7722"
          emissiveIntensity={1.4}
          roughness={0.85}
        />
      </mesh>

      {/* Scattered Volcanic Rocks */}
      {[-0.15, -0.05, 0.08, 0.16].map((rx, idx) => (
        <mesh key={`rock-${idx}`} position={[rx, 0.4, (idx % 2 === 0 ? 0.08 : -0.08)]} castShadow>
          <dodecahedronGeometry args={[0.045, 0]} />
          <meshStandardMaterial
            color="#2A2420"
            emissive="#FF5500"
            emissiveIntensity={0.6 + idx * 0.2}
            roughness={0.9}
          />
        </mesh>
      ))}
    </group>
  );
};
