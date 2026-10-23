'use client';

import React, { useMemo } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import {
  getPaleOakTexture,
  getCalacattaMarbleTexture,
  LUXURY_PALETTE,
} from '@/lib/materials';

export const WardrobeFurniture: React.FC = () => {
  const oakTex = useMemo(() => getPaleOakTexture(), []);
  const marbleTex = useMemo(() => getCalacattaMarbleTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  return (
    <group>
      {/* -------------------- 1. FULL-HEIGHT OPEN WARDROBE CABINETRY & HANGING RAILS -------------------- */}
      {/* Along West wall (X = -14.2, Z: 0.8 to 4.2, Height 3.2m, Depth 0.55m) */}
      <group position={[-14.18, 0, 2.5]} rotation={[0, Math.PI / 2, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.7, 1.6, 0.28]} position={[0, 1.6, 0]} />
        </RigidBody>

        {/* Main Cabinetry Carcass (Pale Scandinavian Oak) */}
        <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 3.2, 0.55]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.55} />
        </mesh>

        {/* Internal Vertical Partitions */}
        {[-0.55, 0.55].map((px) => (
          <mesh key={`wardrobe-part-${px}`} position={[px, 1.6, 0.05]}>
            <boxGeometry args={[0.03, 3.16, 0.5]} />
            <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
          </mesh>
        ))}

        {/* Horizontal Shelves & Warm Backlit LED Strips */}
        {[0.6, 1.6, 2.4, 3.0].map((sy, sidx) => (
          <group key={`w-shelf-${sidx}`} position={[0, sy, 0.05]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[3.36, 0.03, 0.5]} />
              <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
            </mesh>
            {/* LED Glow under shelf */}
            <mesh position={[0, -0.02, 0.2]}>
              <boxGeometry args={[3.3, 0.01, 0.02]} />
              <meshBasicMaterial color="#FFF2DA" />
            </mesh>
          </group>
        ))}

        {/* Brushed Brass Hanging Rails */}
        {[-1.1, 0, 1.1].map((rx, ridx) => (
          <group key={`rail-${ridx}`} position={[rx, 2.3, 0.05]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.015, 0.015, 1.05, 16]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Clothes Shapes on Hangers (Suits, Coats, Dresses) */}
            {[-0.38, -0.22, -0.06, 0.1, 0.26, 0.42].map((cx, cidx) => (
              <group key={`clothes-${ridx}-${cidx}`} position={[cx, -0.38, 0]}>
                {/* Hanger */}
                <mesh position={[0, 0.35, 0]}>
                  <boxGeometry args={[0.42, 0.02, 0.01]} />
                  <meshStandardMaterial color={colors.brass} metalness={0.9} />
                </mesh>
                {/* Garment Shape */}
                <mesh castShadow>
                  <boxGeometry args={[0.12, 0.72, 0.36]} />
                  <meshStandardMaterial
                    color={cidx % 3 === 0 ? '#38322B' : cidx % 2 === 0 ? '#E8E2D5' : '#8A9586'}
                    roughness={0.8}
                  />
                </mesh>
              </group>
            ))}
          </group>
        ))}

        {/* Lower Built-in Drawers with Brass Finger Pulls */}
        {[-1.1, 0, 1.1].map((dx, didx) => (
          <group key={`drawer-${didx}`} position={[dx, 0.3, 0.2]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.04, 0.54, 0.12]} />
              <meshStandardMaterial color="#EAE3D6" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.065]}>
              <boxGeometry args={[0.3, 0.02, 0.02]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* -------------------- 2. BACKLIT LUXURY SHOE DISPLAY WALL -------------------- */}
      {/* Along South wall (Z = 4.8, X: -13.8 to -11.2) */}
      <group position={[-12.5, 0, 4.8]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.2, 1.3, 0.18]} position={[0, 1.3, 0]} />
        </RigidBody>

        {/* Shelving Frame */}
        <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 2.6, 0.35]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </mesh>

        {/* 5 Angled Illuminated Shelves with Luxury Footwear Pairs */}
        {[0.4, 0.9, 1.4, 1.9, 2.4].map((sy, sidx) => (
          <group key={`shoe-shelf-${sidx}`} position={[0, sy, 0.02]}>
            <mesh rotation={[-0.15, 0, 0]}>
              <boxGeometry args={[2.3, 0.025, 0.3]} />
              <meshStandardMaterial color={colors.brass} metalness={0.85} roughness={0.25} />
            </mesh>
            {/* Pairs of Shoes */}
            {[-0.8, -0.4, 0, 0.4, 0.8].map((sx, idx) => (
              <group key={`shoes-${sidx}-${idx}`} position={[sx, 0.06, 0]}>
                <mesh position={[-0.05, 0, 0]} castShadow>
                  <boxGeometry args={[0.08, 0.06, 0.22]} />
                  <meshStandardMaterial color={idx % 2 === 0 ? '#26221D' : '#FAF8F5'} roughness={0.4} />
                </mesh>
                <mesh position={[0.05, 0, 0]} castShadow>
                  <boxGeometry args={[0.08, 0.06, 0.22]} />
                  <meshStandardMaterial color={idx % 2 === 0 ? '#26221D' : '#FAF8F5'} roughness={0.4} />
                </mesh>
              </group>
            ))}
          </group>
        ))}
        <pointLight position={[0, 1.5, 0.25]} color="#FFF3DD" intensity={1.0} distance={3} />
      </group>

      {/* -------------------- 3. CENTRAL LUXURY ACCESSORY DRESSING ISLAND -------------------- */}
      {/* Positioned at X = -12.4, Z = 3.4 (maintaining clear pathways to doors) */}
      <group position={[-12.4, 0, 3.4]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.42, 0.45, 0.32]} position={[0, 0.45, 0]} />
        </RigidBody>

        {/* Pale Oak Island Body */}
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.82, 0.82, 0.62]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[0.84, 0.06, 0.64]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Calacatta Marble Top with Recessed Velvet Jewelry Tray */}
        <mesh position={[0, 0.86, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.88, 0.06, 0.68]} />
          <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.15} />
        </mesh>
        {/* Smoked Protective Glass Top Insert */}
        <mesh position={[0, 0.9, 0]}>
          <boxGeometry args={[0.7, 0.015, 0.5]} />
          <meshPhysicalMaterial
            color="#222222"
            roughness={0.05}
            transmission={0.85}
            transparent
            opacity={0.4}
          />
        </mesh>
      </group>

      {/* -------------------- 4. FULL-LENGTH BRASS DRESSING MIRROR -------------------- */}
      {/* Mounted on East wall recess (X = -10.65, Z = 4.3, Y = 1.6) */}
      <group position={[-10.65, 1.6, 4.3]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[0.75, 2.3]} />
          <meshPhysicalMaterial
            color="#F0F4F8"
            roughness={0.03}
            metalness={0.95}
            clearcoat={1.0}
            reflectivity={1.0}
          />
        </mesh>
        {/* Brass Perimeter Bevel */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[0.8, 2.36, 0.03]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
        <pointLight position={[0, 0.2, 0.2]} color="#FFF3DD" intensity={0.8} distance={2.5} />
      </group>
    </group>
  );
};
