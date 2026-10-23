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
import { ScentedGlassCandle } from '../decor/BooksAndTrays';

export const MasterBedroomDecor: React.FC = () => {
  const marbleTex = useMemo(() => getCalacattaMarbleTexture(), []);
  const oakTex = useMemo(() => getPaleOakTexture(), []);
  const boucleTex = useMemo(() => getBoucleFabricTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  return (
    <group>
      {/* -------------------- 1. UPHOLSTERED FOOT BENCH AT FOOT OF BED -------------------- */}
      <group position={[-9.2, 0, -0.05]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.95, 0.24, 0.25]} position={[0, 0.24, 0]} />
        </RigidBody>

        {/* Tapered Brass Legs */}
        {[-0.8, 0.8].map((bx) =>
          [-0.18, 0.18].map((bz) => (
            <mesh key={`bench-leg-${bx}-${bz}`} position={[bx, 0.18, bz]}>
              <cylinderGeometry args={[0.016, 0.012, 0.36, 12]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
          ))
        )}

        {/* Thick Padded Bouclé Bench Cushion */}
        <RoundedBox args={[1.8, 0.14, 0.48]} radius={0.04} smoothness={3} position={[0, 0.42, 0]} castShadow>
          <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
        </RoundedBox>

        {/* Folded Cashmere Plaid Throw */}
        <RoundedBox args={[0.5, 0.03, 0.49]} radius={0.01} smoothness={2} position={[0.45, 0.5, 0]} castShadow>
          <meshStandardMaterial color="#C5B19D" roughness={0.8} />
        </RoundedBox>
      </group>

      {/* -------------------- 2. MASTER BEDROOM DRESSER & VANITY MIRROR -------------------- */}
      <group position={[-14.15, 0, -3.2]} rotation={[0, Math.PI / 2, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.9, 0.45, 0.24]} position={[0, 0.45, 0]} />
        </RigidBody>

        {/* Fluted Pale Oak Dresser Body */}
        <RoundedBox args={[1.76, 0.86, 0.46]} radius={0.02} smoothness={3} position={[0, 0.43, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </RoundedBox>

        {/* Calacatta Marble Top Slab */}
        <mesh position={[0, 0.87, 0]} castShadow>
          <boxGeometry args={[1.8, 0.02, 0.48]} />
          <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.15} clearcoat={0.9} />
        </mesh>

        {/* Slim Brass Drawer Pulls */}
        {[-0.45, 0.45].flatMap((dx) => [0.25, 0.55, 0.75].map((dy) => ({ x: dx, y: dy }))).map((dp, idx) => (
          <mesh key={`dresser-pull-${idx}`} position={[dp.x, dp.y, 0.235]}>
            <boxGeometry args={[0.12, 0.015, 0.012]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
        ))}

        {/* Standing Brass Arched Vanity Mirror */}
        <group position={[0, 1.45, -0.05]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.025, 32]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.014]}>
            <circleGeometry args={[0.32, 32]} />
            <meshPhysicalMaterial color="#F4F8FA" roughness={0.03} metalness={0.95} clearcoat={1.0} reflectivity={1.0} />
          </mesh>
        </group>

        {/* Fragrance Flacons & Tray on Dresser */}
        <group position={[-0.45, 0.88, 0]}>
          <RoundedBox args={[0.38, 0.02, 0.24]} radius={0.005} smoothness={2} position={[0, 0.01, 0]} castShadow>
            <meshStandardMaterial color={colors.travertine} roughness={0.35} />
          </RoundedBox>
          <mesh position={[-0.06, 0.06, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.08, 16]} />
            <meshPhysicalMaterial color="#F7F1E6" roughness={0.1} transmission={0.8} transparent opacity={0.65} />
          </mesh>
          <mesh position={[0.06, 0.07, 0]} castShadow>
            <boxGeometry args={[0.04, 0.1, 0.04]} />
            <meshPhysicalMaterial color="#EAF1F5" roughness={0.1} transmission={0.8} transparent opacity={0.65} />
          </mesh>
        </group>

        <ScentedGlassCandle position={[0.5, 0.88, 0.05]} />
      </group>
    </group>
  );
};
