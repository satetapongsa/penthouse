'use client';

import React, { useMemo } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';
import {
  getCalacattaMarbleTexture,
  getPaleOakTexture,
  getBoucleFabricTexture,
  LUXURY_PALETTE,
} from '@/lib/materials';
import { DiningPlaceSetting } from '../decor/TablewareSet';
import { GrandChandelier } from '../decor/LightingFixtures';
import { SculpturalCeramicVase } from '../decor/BooksAndTrays';

export const DiningTableSet: React.FC = () => {
  const marbleTex = useMemo(() => getCalacattaMarbleTexture(), []);
  const oakTex = useMemo(() => getPaleOakTexture(), []);
  const boucleTex = useMemo(() => getBoucleFabricTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  return (
    <group>
      {/* -------------------- 1. SCULPTURAL CHANDELIER OVER DINING -------------------- */}
      <GrandChandelier position={[10.75, 2.9, -4.2]} length={2.4} />

      {/* -------------------- 2. GRAND CALACATTA MARBLE DINING TABLE & 8 CHAIRS -------------------- */}
      {/* Table height 0.75m, chair seat height 0.45m */}
      <group position={[10.75, 0, -4.2]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.75, 0.38, 0.65]} position={[0, 0.38, 0]} />
        </RigidBody>

        {/* Grand Beveled Calacatta Gold Marble Top Slab (Height 0.75m) */}
        <RoundedBox args={[3.4, 0.06, 1.25]} radius={0.03} smoothness={3} position={[0, 0.72, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.15} clearcoat={0.9} />
        </RoundedBox>

        {/* Brushed Brass Reveal Inlay Trim under Marble Top */}
        <mesh position={[0, 0.685, 0]}>
          <boxGeometry args={[3.3, 0.015, 1.15]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Fluted Roman Travertine Pedestal Columns */}
        {[-0.95, 0.95].map((bx) => (
          <group key={`table-base-${bx}`} position={[bx, 0.34, 0]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.26, 0.3, 0.66, 24]} />
              <meshStandardMaterial color={colors.travertine} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.32, 0]}>
              <cylinderGeometry args={[0.34, 0.34, 0.04, 24]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* 8 Designer Dining Chairs with Curved Bouclé Backs (Seat Height 0.45m) */}
        {[-1.25, -0.42, 0.42, 1.25].map((cx, idx) => (
          <group key={`chair-north-${idx}`} position={[cx, 0, -0.72]}>
            {/* Rounded Bouclé Seat Cushion */}
            <RoundedBox args={[0.46, 0.08, 0.46]} radius={0.03} smoothness={3} position={[0, 0.45, 0]} castShadow>
              <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
            </RoundedBox>
            {/* Curved Padded Backrest */}
            <RoundedBox args={[0.44, 0.38, 0.06]} radius={0.03} smoothness={3} position={[0, 0.68, -0.2]} castShadow>
              <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
            </RoundedBox>
            {/* Tapered Brass Legs */}
            {[[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].map(([lx, lz], lidx) => (
              <mesh key={`leg-n-${lidx}`} position={[lx, 0.22, lz]}>
                <cylinderGeometry args={[0.015, 0.01, 0.44, 10]} />
                <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
              </mesh>
            ))}
          </group>
        ))}

        {[-1.25, -0.42, 0.42, 1.25].map((cx, idx) => (
          <group key={`chair-south-${idx}`} position={[cx, 0, 0.72]} rotation={[0, Math.PI, 0]}>
            <RoundedBox args={[0.46, 0.08, 0.46]} radius={0.03} smoothness={3} position={[0, 0.45, 0]} castShadow>
              <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
            </RoundedBox>
            <RoundedBox args={[0.44, 0.38, 0.06]} radius={0.03} smoothness={3} position={[0, 0.68, -0.2]} castShadow>
              <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
            </RoundedBox>
            {[[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].map(([lx, lz], lidx) => (
              <mesh key={`leg-s-${lidx}`} position={[lx, 0.22, lz]}>
                <cylinderGeometry args={[0.015, 0.01, 0.44, 10]} />
                <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
              </mesh>
            ))}
          </group>
        ))}

        {/* 6 Luxury Dining Place Settings */}
        {[-1.25, 0, 1.25].flatMap((px) => [
          { x: px, z: -0.38, rot: 0 },
          { x: px, z: 0.38, rot: Math.PI },
        ]).map((pos, pidx) => (
          <DiningPlaceSetting key={`place-setting-${pidx}`} position={[pos.x, 0.75, pos.z]} rotationY={pos.rot} />
        ))}

        {/* Centerpiece: Low Travertine Bowl with Florals & Tea Candles */}
        <group position={[0, 0.75, 0]}>
          <mesh position={[0, 0.035, 0]} castShadow>
            <cylinderGeometry args={[0.26, 0.1, 0.07, 24]} />
            <meshStandardMaterial color={colors.travertine} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color={colors.sage} roughness={0.7} />
          </mesh>
          {[-0.45, 0.45].map((tx, tidx) => (
            <group key={`candle-holder-${tidx}`} position={[tx, 0, 0]}>
              <mesh position={[0, 0.02, 0]} castShadow>
                <cylinderGeometry args={[0.035, 0.04, 0.04, 16]} />
                <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.05, 0]}>
                <sphereGeometry args={[0.005, 8, 8]} />
                <meshBasicMaterial color="#FFDD80" />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* -------------------- 3. ILLUMINATED PALE OAK & BRASS WINE CABINET (BRIGHT THEME FIX) -------------------- */}
      <group position={[13.88, 0, -2.0]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Replaced dark oak with bright pale oak & champagne warm white theme */}
        <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 3.4, 0.22]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.7, 0.11]}>
          <planeGeometry args={[3.0, 3.2]} />
          <meshPhysicalMaterial color="#FAF5EE" roughness={0.05} transmission={0.9} transparent opacity={0.35} />
        </mesh>
        {/* Soft Warm Internal Glow Strip */}
        <mesh position={[0, 3.15, 0.08]}>
          <planeGeometry args={[2.9, 0.04]} />
          <meshBasicMaterial color="#FFF1CC" />
        </mesh>

        {[-0.8, -0.2, 0.4, 1.0].map((wy, widx) => (
          <group key={`wine-row-${widx}`} position={[0, wy + 1.2, 0.05]}>
            {/* Brass Display Rails */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2.8, 0.015, 0.12]} />
              <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
            </mesh>
            {[-1.0, -0.6, -0.2, 0.2, 0.6, 1.0].map((wx, bidx) => (
              <mesh key={`wine-bottle-${bidx}`} position={[wx, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.035, 0.035, 0.28, 12]} />
                <meshPhysicalMaterial color="#3A4D3B" roughness={0.1} transmission={0.7} transparent opacity={0.75} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* -------------------- 4. ENTERTAINING SIDEBOARD CREDENZA -------------------- */}
      <group position={[13.6, 0, -5.2]} rotation={[0, -Math.PI / 2, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.75, 0.42, 0.22]} position={[0, 0.42, 0]} />
        </RigidBody>
        <RoundedBox args={[1.5, 0.84, 0.44]} radius={0.02} smoothness={3} position={[0, 0.42, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </RoundedBox>
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[1.54, 0.02, 0.46]} />
          <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.15} clearcoat={0.9} />
        </mesh>
        <SculpturalCeramicVase position={[0.4, 0.86, 0]} scale={0.9} />
      </group>
    </group>
  );
};
