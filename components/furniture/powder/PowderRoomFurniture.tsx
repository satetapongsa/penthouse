'use client';

import React from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { LUXURY_PALETTE } from '@/lib/materials';

export const PowderRoomFurniture: React.FC = () => {
  const colors = LUXURY_PALETTE.colors;

  return (
    <group>
      {/* -------------------- 1. MONOLITHIC FLUTED STONE BASIN VANITY & MIRROR -------------------- */}
      {/* Positioned on North wall of Powder Room (X = -5.0, Z = 2.32, facing South) */}
      <group position={[-5.0, 0, 2.32]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.38, 0.44, 0.25]} position={[0, 0.44, 0]} />
        </RigidBody>

        {/* Fluted Travertine Monolithic Vanity Block */}
        <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.74, 0.86, 0.48]} />
          <meshStandardMaterial color={colors.travertine} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.88, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.76, 0.04, 0.5]} />
          <meshStandardMaterial color={colors.travertine} roughness={0.35} />
        </mesh>

        {/* Integrated Circular Stone Basin */}
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.18, 0.14, 0.08, 24]} />
          <meshStandardMaterial color="#FAF9F6" roughness={0.3} />
        </mesh>

        {/* Wall-Mounted Brushed Brass Faucet */}
        <group position={[0, 1.12, -0.24]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.16, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh position={[0, -0.04, 0.1]} castShadow>
            <cylinderGeometry args={[0.009, 0.009, 0.06, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh position={[0.1, 0, 0.01]}>
            <cylinderGeometry args={[0.018, 0.018, 0.03, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.2} />
          </mesh>
        </group>

        {/* Tall Backlit Pill-Shaped Brass Mirror */}
        <group position={[0, 1.8, -0.23]}>
          <mesh>
            <planeGeometry args={[0.52, 1.1]} />
            <meshPhysicalMaterial
              color="#F0F4F8"
              roughness={0.03}
              metalness={0.95}
              clearcoat={1.0}
              reflectivity={1.0}
            />
          </mesh>
          <mesh position={[0, 0, -0.01]}>
            <boxGeometry args={[0.56, 1.14, 0.02]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          <pointLight position={[0, 0, 0.12]} color="#FFF0D4" intensity={0.9} distance={2.5} />
        </group>

        {/* Reed Fragrance Diffuser & Soap Dispenser */}
        <group position={[-0.24, 0.93, 0.05]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.03, 0.035, 0.08, 16]} />
            <meshPhysicalMaterial color="#38322B" roughness={0.2} transmission={0.6} transparent opacity={0.8} />
          </mesh>
          {/* Reeds */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.003, 0.003, 0.18, 8]} />
            <meshStandardMaterial color="#8C7D6B" roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* -------------------- 2. WALL-HUNG MINIMALIST TOILET -------------------- */}
      {/* Positioned on West wall of Powder Room (X = -6.22, Z = 3.8, facing East) */}
      <group position={[-6.22, 0, 3.8]} rotation={[0, Math.PI / 2, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.22, 0.3, 0.3]} position={[0, 0.3, 0]} />
        </RigidBody>

        {/* Dual-Flush Brass Wall Actuator Plate */}
        <mesh position={[0, 0.95, -0.26]}>
          <boxGeometry args={[0.22, 0.15, 0.02]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Wall-Hung Matte Ceramic Bowl */}
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.36, 0.34, 0.52]} />
          <meshStandardMaterial color="#FAF9F6" roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};
