'use client';

import React, { useMemo } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import {
  getCalacattaMarbleTexture,
  getPaleOakTexture,
  LUXURY_PALETTE,
} from '@/lib/materials';

export const MasterBathroomFurniture: React.FC = () => {
  const marbleTex = useMemo(() => getCalacattaMarbleTexture(), []);
  const oakTex = useMemo(() => getPaleOakTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  return (
    <group>
      {/* -------------------- 1. DOUBLE VANITY WITH TWO ARROWED MIRRORS & BRASS FAUCETS -------------------- */}
      {/* Along North wall of Master Bath (Z = 0.35, X: -9.8 to -7.2, Width 2.6m, Depth 0.58m) */}
      <group position={[-8.5, 0, 0.35]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.3, 0.44, 0.29]} position={[0, 0.44, 0]} />
        </RigidBody>

        {/* Fluted Pale Oak Vanity Base with Brass Plinth */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.56, 0.76, 0.56]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[2.52, 0.04, 0.52]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Honed Calacatta Marble Double Slab Countertop */}
        <mesh position={[0, 0.81, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.6, 0.06, 0.58]} />
          <meshPhysicalMaterial
            color={colors.calacatta}
            map={marbleTex}
            roughness={0.12}
            clearcoat={0.9}
          />
        </mesh>

        {/* Dual Undermount Basins & Wall Brass Faucets */}
        {[-0.65, 0.65].map((bx, idx) => (
          <group key={`basin-${idx}`} position={[bx, 0.81, 0]}>
            {/* Recessed Basin Cavity */}
            <mesh position={[0, -0.06, 0]}>
              <boxGeometry args={[0.55, 0.14, 0.38]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.15} />
            </mesh>

            {/* Wall-Mounted Gooseneck Brass Faucet */}
            <group position={[0, 0.22, -0.28]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.014, 0.014, 0.18, 16]} />
                <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
              </mesh>
              {/* Spout */}
              <mesh position={[0, -0.04, 0.12]} castShadow>
                <cylinderGeometry args={[0.01, 0.01, 0.08, 16]} />
                <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
              </mesh>
              {/* Knurled Brass Knobs */}
              {[-0.12, 0.12].map((kx) => (
                <mesh key={`knob-${kx}`} position={[kx, 0, 0.02]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.04, 16]} />
                  <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.2} />
                </mesh>
              ))}
            </group>

            {/* Arched Backlit Brass Mirror above each basin */}
            <group position={[0, 0.85, -0.32]}>
              <mesh>
                <planeGeometry args={[0.62, 1.1]} />
                <meshPhysicalMaterial
                  color="#F0F4F8"
                  roughness={0.03}
                  metalness={0.95}
                  clearcoat={1.0}
                  reflectivity={1.0}
                />
              </mesh>
              {/* Brass Frame */}
              <mesh position={[0, 0, -0.01]}>
                <boxGeometry args={[0.66, 1.14, 0.02]} />
                <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
              </mesh>
              {/* Perimeter Backlight */}
              <pointLight position={[0, 0, 0.1]} color="#FFF2DA" intensity={0.9} distance={2.5} />
            </group>
          </group>
        ))}

        {/* Rolled Towels Basket & Potted White Orchid on Counter */}
        <group position={[0, 0.86, 0.05]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.08, 0.12, 16]} />
            <meshStandardMaterial color="#D6CBB8" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.16, 0]} castShadow>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* -------------------- 2. SCULPTURAL FREESTANDING BATHTUB -------------------- */}
      {/* Positioned in the Southeastern zone of Master Bath (X = -7.7, Z = 3.6) */}
      <group position={[-7.7, 0, 3.6]} rotation={[0, -Math.PI / 8, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.9, 0.35, 0.45]} position={[0, 0.35, 0]} />
        </RigidBody>

        {/* Monolithic Matte White Mineral Resin Tub */}
        <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.48, 0.4, 0.64, 32]} />
          <meshPhysicalMaterial
            color="#FAFAF8"
            roughness={0.25}
            clearcoat={0.6}
            clearcoatRoughness={0.2}
          />
        </mesh>
        {/* Interior Cavity (Water Level) */}
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.44, 0.36, 0.2, 32]} />
          <meshPhysicalMaterial
            color="#D8EEF5"
            roughness={0.05}
            transmission={0.85}
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Floor-Mounted Brushed Brass Tub Filler Tap & Hand Wand */}
        <group position={[-0.6, 0, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.025, 0.9, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh position={[0.12, 0.9, 0]} rotation={[0, 0, -Math.PI / 3]} castShadow>
            <cylinderGeometry args={[0.015, 0.018, 0.28, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
          </mesh>
        </group>
      </group>

      {/* -------------------- 3. WALK-IN RAIN SHOWER & GLASS PANEL -------------------- */}
      {/* Positioned in the Northeast alcove (X = -7.1, Z: 0.8 to 2.2) */}
      <group position={[-7.1, 0, 1.5]}>
        {/* Frameless Tempered Glass Shower Partition */}
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[0.02, 3.0, 1.4]} />
          <meshPhysicalMaterial
            color="#E8F4F8"
            roughness={0.03}
            transmission={0.94}
            thickness={0.02}
            transparent
            opacity={0.3}
          />
        </mesh>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.02, 1.5, 0.7]} position={[0, 1.5, 0]} />
        </RigidBody>

        {/* Brass Header Clamp */}
        <mesh position={[0, 3.0, 0]}>
          <boxGeometry args={[0.04, 0.04, 1.4]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Ceiling-Mounted Brass Rain Shower Head (3.1m high) */}
        <group position={[0.3, 3.1, 0]}>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.3, 12]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.02, 32]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
          </mesh>
        </group>

        {/* Recessed Marble Shampoo Niche on East Wall */}
        <group position={[0.55, 1.4, 0]}>
          <mesh>
            <boxGeometry args={[0.1, 0.6, 0.8]} />
            <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.15} />
          </mesh>
        </group>
      </group>

      {/* -------------------- 4. WALL-HUNG MINIMALIST TOILET -------------------- */}
      {/* In private Western alcove (X = -9.8, Z = 4.3, facing East) */}
      <group position={[-9.8, 0, 4.3]} rotation={[0, Math.PI / 2, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.22, 0.3, 0.3]} position={[0, 0.3, 0]} />
        </RigidBody>

        {/* Concealed In-Wall Flush Actuator (Brushed Brass) */}
        <mesh position={[0, 0.95, -0.28]}>
          <boxGeometry args={[0.24, 0.16, 0.02]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Wall-Hung Matte Ceramic Bowl */}
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.38, 0.36, 0.54]} />
          <meshStandardMaterial color="#FAF9F6" roughness={0.2} />
        </mesh>
      </group>

      {/* -------------------- 5. SMALL HIGH FROSTED PRIVACY WINDOW -------------------- */}
      {/* South wall of Master Bath (X = -8.5, Y = 2.4, Z = 4.98) */}
      <group position={[-8.5, 2.4, 4.98]}>
        <mesh>
          <planeGeometry args={[1.4, 0.65]} />
          <meshPhysicalMaterial
            color="#EBF4F7"
            roughness={0.2}
            transmission={0.85}
            transparent
            opacity={0.8}
          />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[1.46, 0.71, 0.03]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
        </mesh>
        <pointLight position={[0, 0, -0.3]} color="#FFF8E7" intensity={1.1} distance={3.5} />
      </group>
    </group>
  );
};
