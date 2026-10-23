'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';
import {
  getCalacattaMarbleTexture,
  getPaleOakTexture,
  getBoucleFabricTexture,
  LUXURY_PALETTE,
} from '@/lib/materials';
import { LuxuryBookStack, ScentedGlassCandle } from '../decor/BooksAndTrays';
import { LuxuryFramedArt } from '../decor/CuratedArtFrames';
import { TabletopSucculent } from '../decor/LuxuryPlants';

export const FoyerFurniture: React.FC = () => {
  const marbleTex = useMemo(() => getCalacattaMarbleTexture(), []);
  const oakTex = useMemo(() => getPaleOakTexture(), []);
  const boucleTex = useMemo(() => getBoucleFabricTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  return (
    <group>
      {/* -------------------- 1. CONSOLE TABLE & ROUND BRASS MIRROR -------------------- */}
      <group position={[2.1, 0, 2.7]} rotation={[0, -Math.PI / 2, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.8, 0.44, 0.22]} position={[0, 0.44, 0]} />
        </RigidBody>

        {/* Fluted Pale Oak Body */}
        <RoundedBox args={[1.56, 0.78, 0.42]} radius={0.02} smoothness={3} position={[0, 0.41, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.55} />
        </RoundedBox>

        {/* Brushed Brass Base Plinth */}
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[1.52, 0.06, 0.38]} />
          <meshStandardMaterial color={colors.brass} metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Honed Calacatta Marble Top Slab */}
        <RoundedBox args={[1.62, 0.05, 0.45]} radius={0.015} smoothness={3} position={[0, 0.82, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.15} clearcoat={0.8} />
        </RoundedBox>

        {/* Decor on Console */}
        <LuxuryBookStack position={[-0.45, 0.85, 0]} rotationY={0.08} />
        <ScentedGlassCandle position={[0.48, 0.85, 0]} />
        <TabletopSucculent position={[0.05, 0.85, 0]} scale={0.8} />

        {/* Round Brass Wall Mirror */}
        <group position={[0, 1.95, -0.21]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.62, 0.62, 0.04, 36]} />
            <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.22} />
          </mesh>
          <mesh position={[0, 0, 0.022]}>
            <circleGeometry args={[0.55, 36]} />
            <meshPhysicalMaterial color="#F0F4F8" roughness={0.03} metalness={0.95} clearcoat={1.0} reflectivity={1.0} />
          </mesh>
        </group>
      </group>

      {/* -------------------- 2. UPHOLSTERED ENTRYWAY BENCH & SHOE SHELF -------------------- */}
      <group position={[-0.5, 0, 5.8]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.7, 0.24, 0.22]} position={[0, 0.24, 0]} />
        </RigidBody>
        {/* Tapered Brass Legs */}
        {[-0.6, 0.6].map((bx) =>
          [-0.16, 0.16].map((bz) => (
            <mesh key={`foyer-bench-leg-${bx}-${bz}`} position={[bx, 0.18, bz]}>
              <cylinderGeometry args={[0.015, 0.012, 0.36, 12]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
          ))
        )}
        {/* Bottom Slat Shoe Shelf */}
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[1.2, 0.015, 0.34]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
        </mesh>
        {/* Thick Bouclé Padded Cushion */}
        <RoundedBox args={[1.36, 0.12, 0.42]} radius={0.04} smoothness={3} position={[0, 0.42, 0]} castShadow>
          <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
        </RoundedBox>
      </group>

      {/* -------------------- 3. SCULPTURAL BRASS UMBRELLA STAND -------------------- */}
      <group position={[-2.4, 0, 6.0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.15, 0.3, 0.15]} position={[0, 0.3, 0]} />
        </RigidBody>
        <mesh position={[0, 0.28, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.12, 0.56, 20]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Umbrellas */}
        {[-0.03, 0.03].map((ux, uidx) => (
          <group key={`umbrella-${uidx}`} position={[ux, 0.45, 0]} rotation={[0.15 * (uidx === 0 ? 1 : -1), 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.012, 0.012, 0.7, 8]} />
              <meshStandardMaterial color="#2B2824" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.38, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.1, 8]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* -------------------- 4. GALLERY HALLWAY RUNNER RUG & ARTWORKS -------------------- */}
      {/* Long Plush Runner Rug in Gallery Hallway */}
      <mesh position={[-5.0, 0.006, -2.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.6, 6.4]} />
        <meshStandardMaterial color="#EAE3D6" map={boucleTex} roughness={0.85} />
      </mesh>
      {/* Border Trim on Runner Rug */}
      <mesh position={[-5.0, 0.007, -2.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.78, 0.8, 4]} />
        <meshStandardMaterial color={colors.brass} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Curated Triptych Gallery Wall along Hallway (X = -6.45, facing East into hallway) */}
      <LuxuryFramedArt position={[-6.45, 1.9, -4.0]} rotationY={Math.PI / 2} width={0.9} height={1.2} artVariant="arch" />
      <LuxuryFramedArt position={[-6.45, 1.9, -2.0]} rotationY={Math.PI / 2} width={0.9} height={1.2} artVariant="minimalist" />
      <LuxuryFramedArt position={[-6.45, 1.9, 0.0]} rotationY={Math.PI / 2} width={0.9} height={1.2} artVariant="horizon" />
    </group>
  );
};
