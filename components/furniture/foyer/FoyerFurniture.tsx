'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import {
  getCalacattaMarbleTexture,
  getPaleOakTexture,
  LUXURY_PALETTE,
} from '@/lib/materials';

export const FoyerFurniture: React.FC = () => {
  const marbleTex = useMemo(() => getCalacattaMarbleTexture(), []);
  const oakTex = useMemo(() => getPaleOakTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  return (
    <group>
      {/* -------------------- 1. CONSOLE TABLE & ROUND BRASS MIRROR -------------------- */}
      {/* Positioned against the East wall alcove of Foyer (X = 2.1, Z = 2.7, facing West) */}
      <group position={[2.1, 0, 2.7]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Physical Collider for Console Table */}
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.8, 0.44, 0.22]} position={[0, 0.44, 0]} />
        </RigidBody>

        {/* Fluted Pale Oak Body */}
        <mesh position={[0, 0.41, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.56, 0.78, 0.42]} />
          <meshStandardMaterial
            color={colors.paleOak}
            map={oakTex}
            roughness={0.55}
            metalness={0.04}
          />
        </mesh>

        {/* Brushed Brass Base Plinth */}
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[1.52, 0.06, 0.38]} />
          <meshStandardMaterial color={colors.brass} metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Honed Calacatta Marble Top Slab with Waterfall Rim */}
        <mesh position={[0, 0.82, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.62, 0.05, 0.45]} />
          <meshPhysicalMaterial
            color={colors.calacatta}
            map={marbleTex}
            roughness={0.15}
            metalness={0.05}
            clearcoat={0.8}
            clearcoatRoughness={0.15}
          />
        </mesh>

        {/* Brass Inlay Trim under Marble Top */}
        <mesh position={[0, 0.795, 0]}>
          <boxGeometry args={[1.58, 0.015, 0.43]} />
          <meshStandardMaterial color={colors.gold} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Decorative Objects on Console */}
        {/* Architectural Art Monographs */}
        <group position={[-0.45, 0.86, 0.05]} rotation={[0, 0.08, 0]}>
          <mesh position={[0, 0.015, 0]} castShadow>
            <boxGeometry args={[0.26, 0.03, 0.32]} />
            <meshStandardMaterial color="#3A352F" roughness={0.6} />
          </mesh>
          <mesh position={[0.02, 0.04, -0.01]} rotation={[0, 0.05, 0]} castShadow>
            <boxGeometry args={[0.24, 0.025, 0.3]} />
            <meshStandardMaterial color="#EAE3D5" roughness={0.5} />
          </mesh>
        </group>

        {/* Sculptural Brass Catchall Bowl */}
        <group position={[0.1, 0.87, 0.02]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.07, 0.05, 24]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.25} />
          </mesh>
        </group>

        {/* Luxury Scented Candle in Frosted Ribbed Glass */}
        <group position={[0.48, 0.89, -0.04]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.1, 24]} />
            <meshPhysicalMaterial
              color="#FAF8F5"
              roughness={0.2}
              transmission={0.8}
              thickness={0.04}
              transparent
              opacity={0.6}
            />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshBasicMaterial color="#FFE8A3" />
          </mesh>
        </group>

        {/* -------------------- ROUND BRASS WALL MIRROR -------------------- */}
        <group position={[0, 1.95, -0.21]}>
          {/* Heavy Brushed Brass Bevel Frame */}
          <mesh>
            <ringGeometry args={[0.55, 0.62, 48]} />
            <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.22} />
          </mesh>
          {/* Outer Frame Depth */}
          <mesh position={[0, 0, -0.02]}>
            <cylinderGeometry args={[0.62, 0.62, 0.04, 48]} />
            <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.22} />
          </mesh>
          {/* High-Reflective Mirror Pane */}
          <mesh position={[0, 0, 0.005]}>
            <circleGeometry args={[0.55, 48]} />
            <meshPhysicalMaterial
              color="#F0F4F8"
              roughness={0.03}
              metalness={0.95}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
              reflectivity={1.0}
            />
          </mesh>
        </group>
      </group>

      {/* -------------------- 2. RIBBED SHOE CABINET & SMALL PLANT -------------------- */}
      {/* Positioned on West wall of Foyer (X = -3.25, Z = 5.2, facing East) */}
      <group position={[-3.25, 0, 5.2]} rotation={[0, Math.PI / 2, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.7, 0.48, 0.2]} position={[0, 0.48, 0]} />
        </RigidBody>

        {/* Fluted Oak Credenza Cabinet */}
        <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.36, 0.82, 0.38]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </mesh>

        {/* Honed Travertine Top */}
        <mesh position={[0, 0.87, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.04, 0.4]} />
          <meshStandardMaterial color={colors.travertine} roughness={0.35} />
        </mesh>

        {/* Minimalist Brass Handles */}
        {[-0.25, 0.25].map((hx) => (
          <mesh key={`handle-${hx}`} position={[hx, 0.5, 0.2]}>
            <boxGeometry args={[0.02, 0.2, 0.02]} />
            <meshStandardMaterial color={colors.brass} metalness={0.85} roughness={0.25} />
          </mesh>
        ))}

        {/* Potted Fiddle Leaf Plant on Top of Cabinet */}
        <group position={[0.35, 0.89, 0]}>
          {/* Ribbed Ceramic Pot */}
          <mesh position={[0, 0.12, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.08, 0.22, 24]} />
            <meshStandardMaterial color="#FAF8F3" roughness={0.4} />
          </mesh>
          {/* Plant Foliage (Curved organic sage leaves) */}
          <group position={[0, 0.22, 0]}>
            {[
              { pos: [0, 0.12, 0], rot: [0.2, 0.4, 0], scale: 0.14 },
              { pos: [0.08, 0.18, 0.05], rot: [-0.3, 1.2, 0.2], scale: 0.13 },
              { pos: [-0.07, 0.2, -0.04], rot: [0.4, -0.8, -0.3], scale: 0.13 },
              { pos: [0.03, 0.28, -0.05], rot: [-0.2, -0.2, 0.1], scale: 0.15 },
              { pos: [-0.02, 0.35, 0.02], rot: [0.1, 0.6, -0.1], scale: 0.12 },
            ].map((leaf, idx) => (
              <mesh
                key={`foyer-leaf-${idx}`}
                position={leaf.pos as [number, number, number]}
                rotation={leaf.rot as [number, number, number]}
                castShadow
              >
                <sphereGeometry args={[leaf.scale, 12, 12]} />
                <meshStandardMaterial color={colors.sage} roughness={0.7} />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {/* -------------------- 3. SCULPTURAL ART PIECE ON TRAVERTINE PEDESTAL -------------------- */}
      {/* Positioned in the Southwest corner of Foyer (X = -2.7, Z = 5.9) */}
      <group position={[-2.7, 0, 5.9]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.2, 0.5, 0.2]} position={[0, 0.5, 0]} />
        </RigidBody>

        {/* Fluted Travertine Pedestal Column */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.38, 1.0, 0.38]} />
          <meshStandardMaterial color={colors.travertine} roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.01, 0]} castShadow>
          <boxGeometry args={[0.42, 0.03, 0.42]} />
          <meshStandardMaterial color={colors.brass} metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Modernist Organic Bronze & Gold Ribbon Sculpture */}
        <group position={[0, 1.24, 0]}>
          <mesh rotation={[0.4, 0.6, 0.2]} castShadow>
            <torusGeometry args={[0.16, 0.035, 16, 48, Math.PI * 1.8]} />
            <meshStandardMaterial color={colors.gold} metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh rotation={[-0.5, -0.4, 0.8]} position={[0.02, 0.08, 0]} castShadow>
            <torusGeometry args={[0.12, 0.03, 16, 48, Math.PI * 1.6]} />
            <meshStandardMaterial color={colors.bronze} metalness={0.88} roughness={0.24} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
