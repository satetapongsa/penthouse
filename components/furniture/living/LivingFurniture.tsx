'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';
import {
  getCalacattaMarbleTexture,
  getBoucleFabricTexture,
  getPaleOakTexture,
  LUXURY_PALETTE,
} from '@/lib/materials';
import { useGameStore } from '@/store/useGameStore';
import { LuxuryPottedTree } from '../decor/LuxuryPlants';
import { LuxuryBookStack, ScentedGlassCandle } from '../decor/BooksAndTrays';
import { GrandChandelier } from '../decor/LightingFixtures';
import { LivingEntertainment } from './LivingEntertainment';

export const LivingFurniture: React.FC = () => {
  const marbleTex = useMemo(() => getCalacattaMarbleTexture(), []);
  const boucleTex = useMemo(() => getBoucleFabricTexture(), []);
  const oakTex = useMemo(() => getPaleOakTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  const enterSitting = useGameStore((s) => s.enterSitting);
  const isWindowOpen = useGameStore((s) => s.windowStates.living ?? false);
  const plantGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    // Gentle natural breeze sway for plants
    if (plantGroupRef.current) {
      const time = state.clock.getElapsedTime();
      const swayAmp = isWindowOpen ? 0.035 : 0.015;
      plantGroupRef.current.rotation.z = Math.sin(time * 1.5) * swayAmp;
      plantGroupRef.current.rotation.x = Math.cos(time * 1.2) * swayAmp * 0.7;
    }
  });

  return (
    <group>
      {/* -------------------- 1. DUAL LAYERED LUXURY AREA RUGS -------------------- */}
      {/* Base Rectangular High-Pile Cream Bouclé Rug */}
      <mesh position={[1.8, 0.005, -1.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.8, 5.2]} />
        <meshStandardMaterial color="#EFEBE2" map={boucleTex} roughness={0.9} />
      </mesh>
      {/* Layered Organic Oval Champagne Accent Rug */}
      <mesh position={[2.6, 0.007, -1.4]} rotation={[-Math.PI / 2, 0, 0.15]} receiveShadow>
        <circleGeometry args={[1.8, 32]} />
        <meshStandardMaterial color="#E6DECE" roughness={0.85} />
      </mesh>

      {/* -------------------- 2. SCULPTURAL CEILING CHANDELIER -------------------- */}
      <GrandChandelier position={[1.8, 3.0, -1.8]} length={2.8} />

      {/* -------------------- 3. UPGRADED DESIGNER BOUCLÉ L-SHAPED SECTIONAL -------------------- */}
      {/* Seat height 0.42m, pillowed cushions, piped edges, brass plinth base */}
      <group position={[1.8, 0, -2.4]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.85, 0.42, 0.55]} position={[0, 0.42, -0.6]} />
          <CuboidCollider args={[0.55, 0.42, 1.1]} position={[-1.3, 0.42, 0.5]} />
        </RigidBody>

        {/* Recessed Brushed Brass Plinth Base */}
        <mesh position={[0, 0.05, -0.6]} castShadow receiveShadow>
          <boxGeometry args={[3.6, 0.1, 1.1]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
        </mesh>
        <mesh position={[-1.3, 0.05, 0.5]} castShadow receiveShadow>
          <boxGeometry args={[1.0, 0.1, 1.1]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
        </mesh>

        {/* Interactive Main Seat Cushions with RoundedBox */}
        <group
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
          {/* Main Long Lounge Seat Cushion (Seat Height 0.42m) */}
          <RoundedBox args={[3.55, 0.32, 0.98]} radius={0.06} smoothness={4} position={[0, 0.26, -0.55]} castShadow receiveShadow>
            <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
          </RoundedBox>
          {/* Return Chaise Lounge Cushion */}
          <RoundedBox args={[0.96, 0.32, 1.12]} radius={0.06} smoothness={4} position={[-1.3, 0.26, 0.5]} castShadow receiveShadow>
            <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
          </RoundedBox>
        </group>

        {/* Puffy Curved Backrests */}
        <RoundedBox args={[3.6, 0.44, 0.28]} radius={0.06} smoothness={4} position={[0, 0.58, -1.02]} castShadow receiveShadow>
          <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
        </RoundedBox>
        <RoundedBox args={[0.28, 0.44, 1.8]} radius={0.06} smoothness={4} position={[-1.72, 0.54, 0.0]} castShadow receiveShadow>
          <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
        </RoundedBox>

        {/* Organic Curved Scatter Pillows */}
        {[
          { pos: [-0.8, 0.52, -0.85], color: colors.pillowSage, rot: 0.15 },
          { pos: [0.0, 0.52, -0.85], color: colors.pillowGold, rot: -0.1 },
          { pos: [0.9, 0.52, -0.85], color: colors.pillowTerracotta, rot: 0.12 },
          { pos: [-1.4, 0.52, -0.25], color: colors.cream, rot: 0.2 },
        ].map((pil, idx) => (
          <group key={`pillow-${idx}`} position={pil.pos as [number, number, number]} rotation={[0.2, pil.rot, 0]}>
            <RoundedBox args={[0.42, 0.38, 0.14]} radius={0.05} smoothness={4} castShadow>
              <meshStandardMaterial color={pil.color} roughness={0.7} />
            </RoundedBox>
          </group>
        ))}
      </group>

      {/* -------------------- 4. CONSOLE TABLE BEHIND SOFA -------------------- */}
      <group position={[1.8, 0, -3.55]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.5, 0.38, 0.18]} position={[0, 0.38, 0]} />
        </RigidBody>
        {/* Brass Frame */}
        <RoundedBox args={[2.9, 0.74, 0.32]} radius={0.02} smoothness={3} position={[0, 0.37, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </RoundedBox>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[2.95, 0.02, 0.34]} />
          <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.15} clearcoat={0.9} />
        </mesh>
        {/* Decor on Behind-Sofa Console */}
        <LuxuryBookStack position={[-0.8, 0.76, 0]} rotationY={0.08} />
        <ScentedGlassCandle position={[0.7, 0.76, 0]} />
      </group>

      {/* -------------------- 5. NESTED TRAVERTINE & CALACATTA COFFEE TABLES -------------------- */}
      <group position={[1.9, 0, -1.4]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.72, 0.2, 0.44]} position={[0, 0.2, 0]} />
        </RigidBody>
        {/* Primary Calacatta Marble Table */}
        <RoundedBox args={[1.36, 0.36, 0.8]} radius={0.04} smoothness={4} position={[0, 0.18, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.15} clearcoat={0.9} />
        </RoundedBox>
        <mesh position={[0, 0.015, 0]}>
          <boxGeometry args={[1.28, 0.03, 0.72]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.22} />
        </mesh>
        {/* Secondary Lower Fluted Oak Nested Table */}
        <group position={[0.7, 0.12, 0.3]}>
          <RoundedBox args={[0.6, 0.24, 0.6]} radius={0.03} smoothness={3} castShadow receiveShadow>
            <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.45} />
          </RoundedBox>
        </group>
        {/* Decor on Coffee Table */}
        <LuxuryBookStack position={[-0.3, 0.36, 0.05]} rotationY={-0.1} />
        <ScentedGlassCandle position={[0.3, 0.36, -0.1]} />
      </group>

      {/* -------------------- 6. ROUND BOUCLÉ OTTOMAN / POUF -------------------- */}
      <group position={[3.8, 0, -2.6]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.42, 0.21, 0.42]} position={[0, 0.21, 0]} />
        </RigidBody>
        <mesh position={[0, 0.21, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.44, 0.38, 28]} />
          <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.04, 28]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* -------------------- 7. CURVED BOUCLÉ ACCENT ARMCHAIRS -------------------- */}
      {[-0.6, 4.3].map((cx, idx) => (
        <group
          key={`armchair-${idx}`}
          position={[cx, 0, -1.2]}
          rotation={[0, idx === 0 ? Math.PI / 4 : -Math.PI / 4, 0]}
        >
          <RigidBody type="fixed" colliders={false}>
            <CuboidCollider args={[0.44, 0.38, 0.44]} position={[0, 0.38, 0]} />
          </RigidBody>
          {/* Brass Swivel Base */}
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.08, 20]} />
            <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
          </mesh>
          {/* Rounded Thick Bouclé Seat Cushion (Seat Height 0.42m) */}
          <RoundedBox args={[0.74, 0.26, 0.74]} radius={0.06} smoothness={4} position={[0, 0.28, 0]} castShadow receiveShadow>
            <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
          </RoundedBox>
          {/* Curved Barrel Backrest */}
          <mesh position={[0, 0.54, -0.26]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.38, 24, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* -------------------- 8. WINDOW BENCH WITH CUSHION -------------------- */}
      <group position={[-2.4, 0, -5.2]} rotation={[0, Math.PI / 2, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.75, 0.22, 0.28]} position={[0, 0.22, 0]} />
        </RigidBody>
        <RoundedBox args={[1.5, 0.38, 0.52]} radius={0.03} smoothness={3} position={[0, 0.19, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </RoundedBox>
        <RoundedBox args={[1.44, 0.08, 0.48]} radius={0.02} smoothness={3} position={[0, 0.42, 0]} castShadow>
          <meshStandardMaterial color={colors.linen} roughness={0.8} />
        </RoundedBox>
      </group>

      {/* -------------------- 9. BOTANICAL HIGHLIGHTS -------------------- */}
      <group ref={plantGroupRef}>
        <LuxuryPottedTree position={[6.6, 0, -5.2]} type="olive" scale={1.1} />
        <LuxuryPottedTree position={[-2.8, 0, 1.2]} type="fiddle" scale={0.9} />
      </group>

      {/* -------------------- 10. LIVING ENTERTAINMENT MODULE -------------------- */}
      <LivingEntertainment />
    </group>
  );
};
