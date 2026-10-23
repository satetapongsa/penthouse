'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import {
  getCalacattaMarbleTexture,
  getBoucleFabricTexture,
  LUXURY_PALETTE,
} from '@/lib/materials';
import { useGameStore } from '@/store/useGameStore';
import { LivingEntertainment } from './LivingEntertainment';

export const LivingFurniture: React.FC = () => {
  const marbleTex = useMemo(() => getCalacattaMarbleTexture(), []);
  const boucleTex = useMemo(() => getBoucleFabricTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  const enterSitting = useGameStore((s) => s.enterSitting);
  const isWindowOpen = useGameStore((s) => s.windowStates.living ?? false);
  const plantGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    // Sway indoor tree gently with breeze
    if (plantGroupRef.current) {
      const time = state.clock.getElapsedTime();
      const swayAmp = isWindowOpen ? 0.04 : 0.015;
      plantGroupRef.current.rotation.z = Math.sin(time * 1.5) * swayAmp;
      plantGroupRef.current.rotation.x = Math.cos(time * 1.2) * swayAmp * 0.7;
    }
  });

  return (
    <group>
      {/* -------------------- 1. HIGH-PILE TEXTURED AREA RUG -------------------- */}
      <mesh position={[1.8, 0.005, -1.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.8, 5.2]} />
        <meshStandardMaterial
          color="#EFEBE2"
          map={boucleTex}
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* -------------------- 2. BOUCLÉ L-SHAPED SECTIONAL SOFA -------------------- */}
      <group position={[1.8, 0, -2.4]}>
        <RigidBody type="fixed" colliders={false}>
          {/* Main Back Lounge Collider */}
          <CuboidCollider args={[1.85, 0.42, 0.55]} position={[0, 0.42, -0.6]} />
          {/* Return Chaise Lounge Collider */}
          <CuboidCollider args={[0.55, 0.42, 1.1]} position={[-1.3, 0.42, 0.5]} />
        </RigidBody>

        {/* Sofa Base Plinth */}
        <mesh position={[0, 0.08, -0.6]} castShadow receiveShadow>
          <boxGeometry args={[3.6, 0.16, 1.1]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
        </mesh>
        <mesh position={[-1.3, 0.08, 0.5]} castShadow receiveShadow>
          <boxGeometry args={[1.0, 0.16, 1.1]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
        </mesh>

        {/* Seat Cushions (Interactive Seating Hotspot) */}
        <group
          position={[0, 0, 0]}
          userData={{
            interactable: true,
            interactableId: 'living-sofa-seat',
            label: 'Sit on Bouclé Sofa',
            onInteract: () => {
              enterSitting({
                position: [1.8, 0.85, -2.4],
                eyeHeight: 0.88,
                pitch: -0.05,
                yaw: 0,
                returnPosition: [1.8, 1.8, -1.2],
                returnYaw: 0,
              });
            },
          }}
        >
          {/* Main Seat Cushion */}
          <mesh position={[0, 0.28, -0.55]} castShadow receiveShadow>
            <boxGeometry args={[3.55, 0.24, 0.95]} />
            <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
          </mesh>
          {/* Left Chaise Cushion */}
          <mesh position={[-1.3, 0.28, 0.48]} castShadow receiveShadow>
            <boxGeometry args={[0.95, 0.24, 1.1]} />
            <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
          </mesh>
        </group>

        {/* Sofa Backrest */}
        <mesh position={[0, 0.56, -1.02]} castShadow receiveShadow>
          <boxGeometry args={[3.6, 0.36, 0.26]} />
          <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
        </mesh>
        {/* Left Backrest Extension */}
        <mesh position={[-1.72, 0.52, 0.0]} castShadow receiveShadow>
          <boxGeometry args={[0.24, 0.36, 1.8]} />
          <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
        </mesh>

        {/* Scatter Pillows */}
        {[
          { pos: [-0.8, 0.48, -0.85], color: colors.pillowSage },
          { pos: [0.0, 0.48, -0.85], color: colors.pillowGold },
          { pos: [0.9, 0.48, -0.85], color: colors.pillowTerracotta },
          { pos: [-1.4, 0.48, -0.3], color: colors.cream },
        ].map((pil, idx) => (
          <mesh key={`pillow-${idx}`} position={pil.pos as [number, number, number]} rotation={[0.2, 0.1 * idx, 0]} castShadow>
            <boxGeometry args={[0.38, 0.36, 0.12]} />
            <meshStandardMaterial color={pil.color} roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* -------------------- 3. NESTED TRAVERTINE & BRASS COFFEE TABLE -------------------- */}
      <group position={[1.9, 0, -1.4]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.7, 0.2, 0.42]} position={[0, 0.2, 0]} />
        </RigidBody>
        <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.36, 0.36, 0.8]} />
          <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.15} clearcoat={0.9} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[1.28, 0.04, 0.72]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.22} />
        </mesh>
      </group>

      {/* -------------------- 4. CURVED BOUCLÉ ACCENT ARMCHAIRS -------------------- */}
      {[-0.6, 4.2].map((cx, idx) => (
        <group
          key={`armchair-${idx}`}
          position={[cx, 0, -1.2]}
          rotation={[0, idx === 0 ? Math.PI / 4 : -Math.PI / 4, 0]}
        >
          <RigidBody type="fixed" colliders={false}>
            <CuboidCollider args={[0.42, 0.38, 0.42]} position={[0, 0.38, 0]} />
          </RigidBody>
          {/* Brass Swivel Base */}
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.08, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
          </mesh>
          {/* Seat Cushion */}
          <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.42, 0.38, 0.24, 20]} />
            <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
          </mesh>
          {/* Curved Back */}
          <mesh position={[0, 0.52, -0.22]} castShadow receiveShadow>
            <boxGeometry args={[0.76, 0.32, 0.18]} />
            <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* -------------------- 5. ARCHED BRASS FLOOR LAMP -------------------- */}
      <group position={[4.6, 0, -3.2]}>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.06, 16]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.016, 0.016, 2.2, 12]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-0.45, 2.18, 0.4]} rotation={[0.4, 0, 0]}>
          <coneGeometry args={[0.2, 0.18, 16, 1, true]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* -------------------- 6. INDOOR POTTED TREE -------------------- */}
      <group ref={plantGroupRef} position={[-2.8, 0, -4.8]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.22, 0.6, 16]} />
          <meshStandardMaterial color="#DDD3C3" roughness={0.7} />
        </mesh>
        {/* Soil */}
        <mesh position={[0, 0.58, 0]}>
          <circleGeometry args={[0.28, 16]} />
          <meshStandardMaterial color="#2B241D" roughness={0.9} />
        </mesh>
        {/* Trunk & Foliage */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.05, 1.2, 8]} />
          <meshStandardMaterial color="#5C4D3C" roughness={0.8} />
        </mesh>
        {[
          [0, 1.8, 0, 0.45],
          [0.15, 2.1, 0.1, 0.38],
          [-0.12, 2.3, -0.08, 0.32],
        ].map(([lx, ly, lz, lr], lidx) => (
          <mesh key={`foliage-${lidx}`} position={[lx, ly, lz]} castShadow>
            <sphereGeometry args={[lr, 10, 10]} />
            <meshStandardMaterial color={colors.sage} roughness={0.75} />
          </mesh>
        ))}
      </group>

      {/* -------------------- 7. ENTERTAINMENT & FIREPLACE SUITE -------------------- */}
      <LivingEntertainment />
    </group>
  );
};
