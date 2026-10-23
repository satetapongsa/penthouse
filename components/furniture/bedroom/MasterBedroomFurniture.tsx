'use client';

import React, { useMemo } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import {
  getPaleOakTexture,
  getBoucleFabricTexture,
  LUXURY_PALETTE,
} from '@/lib/materials';

export const MasterBedroomFurniture: React.FC = () => {
  const oakTex = useMemo(() => getPaleOakTexture(), []);
  const boucleTex = useMemo(() => getBoucleFabricTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  return (
    <group>
      {/* -------------------- 1. PLUSH WOVEN BEDROOM RUG -------------------- */}
      {/* Positioned under the King Bed (X: -9.2, Z: -1.8, Size: 4.2m x 3.6m) */}
      <mesh position={[-9.2, 0.007, -1.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.2, 3.6]} />
        <meshStandardMaterial color="#EAE4D8" map={boucleTex} roughness={0.9} />
      </mesh>

      {/* -------------------- 2. KING BED WITH PLUSH HEADBOARD & PILLOWS -------------------- */}
      {/* Headboard against South wall at Z = -0.15, Bed extending forward to Z = -2.35 */}
      <group position={[-9.2, 0, -1.35]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.15, 0.45, 1.15]} position={[0, 0.45, 0]} />
        </RigidBody>

        {/* Tall Fluted Upholstered Headboard (Width 2.6m, Height 1.6m, Depth 0.16m) */}
        <mesh position={[0, 0.8, 1.15]} castShadow receiveShadow>
          <boxGeometry args={[2.6, 1.6, 0.16]} />
          <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.85} />
        </mesh>
        {/* Brushed Brass Headboard Perimeter Border */}
        <mesh position={[0, 0.8, 1.15]}>
          <boxGeometry args={[2.64, 1.64, 0.14]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
        </mesh>

        {/* Bed Base Frame (Pale Oak with Brass Plinth) */}
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.44, 2.2]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[2.14, 0.06, 2.14]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Plush King Mattress & Ivory Linen Duvet */}
        <mesh position={[0, 0.52, 0.05]} castShadow receiveShadow>
          <boxGeometry args={[2.08, 0.28, 2.05]} />
          <meshStandardMaterial color="#FAF8F5" roughness={0.85} />
        </mesh>

        {/* Folded Draped Cashmere Throw across Bed Foot */}
        <mesh position={[0, 0.67, -0.65]} rotation={[-0.05, 0, 0]} castShadow>
          <boxGeometry args={[2.1, 0.04, 0.7]} />
          <meshStandardMaterial color="#C5B19D" roughness={0.9} />
        </mesh>

        {/* 6 Luxury Pillows (Sleeping & Decorative Accent Pillows) */}
        {/* Back Sleeping Pillows */}
        {[-0.55, 0.55].map((px, idx) => (
          <mesh key={`back-pillow-${idx}`} position={[px, 0.76, 0.88]} rotation={[0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.75, 0.42, 0.18]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.85} />
          </mesh>
        ))}
        {/* Middle Pillows */}
        {[-0.55, 0.55].map((px, idx) => (
          <mesh key={`mid-pillow-${idx}`} position={[px, 0.73, 0.68]} rotation={[0.35, 0, 0]} castShadow>
            <boxGeometry args={[0.7, 0.38, 0.16]} />
            <meshStandardMaterial color="#F3EDE3" roughness={0.8} />
          </mesh>
        ))}
        {/* Front Decorative Accent Pillows (Sage & Champagne Gold) */}
        <mesh position={[-0.45, 0.7, 0.5]} rotation={[0.4, 0.1, 0]} castShadow>
          <boxGeometry args={[0.45, 0.35, 0.14]} />
          <meshStandardMaterial color={colors.pillowSage} roughness={0.8} />
        </mesh>
        <mesh position={[0.45, 0.7, 0.5]} rotation={[0.4, -0.1, 0]} castShadow>
          <boxGeometry args={[0.45, 0.35, 0.14]} />
          <meshStandardMaterial color={colors.pillowGold} roughness={0.8} />
        </mesh>

        {/* -------------------- TWO NIGHTSTANDS WITH TABLE LAMPS -------------------- */}
        {/* Left Nightstand (X = -1.6, Z = 0.95 relative to bed center) */}
        <group position={[-1.6, 0, 0.95]}>
          <RigidBody type="fixed" colliders={false}>
            <CuboidCollider args={[0.3, 0.28, 0.25]} position={[0, 0.28, 0]} />
          </RigidBody>
          {/* Fluted Oak Nightstand Body */}
          <mesh position={[0, 0.26, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.58, 0.52, 0.48]} />
            <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.53, 0]} castShadow>
            <boxGeometry args={[0.6, 0.02, 0.5]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Luxury Table Lamp */}
          <mesh position={[0, 0.68, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 0.28, 24]} />
            <meshStandardMaterial color={colors.travertine} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.92, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.22, 0.24, 24]} />
            <meshStandardMaterial color="#FFFDF9" roughness={0.3} />
          </mesh>
          <pointLight position={[0, 0.92, 0]} color="#FFF0D4" intensity={0.7} distance={3.5} />
        </group>

        {/* Right Nightstand (X = 1.6, Z = 0.95 relative to bed center) */}
        <group position={[1.6, 0, 0.95]}>
          <RigidBody type="fixed" colliders={false}>
            <CuboidCollider args={[0.3, 0.28, 0.25]} position={[0, 0.28, 0]} />
          </RigidBody>
          <mesh position={[0, 0.26, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.58, 0.52, 0.48]} />
            <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.53, 0]} castShadow>
            <boxGeometry args={[0.6, 0.02, 0.5]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.68, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 0.28, 24]} />
            <meshStandardMaterial color={colors.travertine} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.92, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.22, 0.24, 24]} />
            <meshStandardMaterial color="#FFFDF9" roughness={0.3} />
          </mesh>
          <pointLight position={[0, 0.92, 0]} color="#FFF0D4" intensity={0.7} distance={3.5} />
        </group>
      </group>

      {/* -------------------- 3. READING ARMCHAIR & BRASS FLOOR LAMP -------------------- */}
      {/* Positioned at Northwest corner facing skyline glass (X = -13.2, Z = -4.5) */}
      <group position={[-13.2, 0, -4.5]} rotation={[0, Math.PI / 4, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.45, 0.4, 0.45]} position={[0, 0.4, 0]} />
        </RigidBody>
        {/* Brass Swivel Ring */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.08, 32]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Deep Ivory Bouclé Barrel Seat */}
        <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.46, 0.42, 0.4, 32]} />
          <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.58, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[0.82, 0.44, 0.26]} />
          <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.85} />
        </mesh>
        {/* Accent Lumbar Pillow */}
        <mesh position={[0, 0.44, 0.14]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.22, 0.12]} />
          <meshStandardMaterial color={colors.pillowTerracotta} roughness={0.8} />
        </mesh>

        {/* Reading Floor Lamp */}
        <group position={[-0.65, 0, 0.2]}>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.04, 24]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 1.6, 12]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0.15, 1.55, 0]} rotation={[0, 0, -0.4]} castShadow>
            <cylinderGeometry args={[0.08, 0.14, 0.18, 24]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          <pointLight position={[0.2, 1.48, 0]} color="#FFE8BA" intensity={0.8} distance={3} />
        </group>
      </group>

      {/* -------------------- 4. VANITY DESK WITH ILLUMINATED MIRROR & STOOL -------------------- */}
      {/* Positioned against the West wall (X = -14.15, Z = -2.2, facing East) */}
      <group position={[-14.15, 0, -2.2]} rotation={[0, Math.PI / 2, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.65, 0.4, 0.24]} position={[0, 0.4, 0]} />
        </RigidBody>

        {/* Fluted Pale Oak Vanity Table with Brass Trim */}
        <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.06, 0.48]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.775, 0]}>
          <boxGeometry args={[1.32, 0.01, 0.5]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Tapered Brass Legs */}
        {[-0.58, 0.58].map((vx) =>
          [-0.18, 0.18].map((vz) => (
            <mesh key={`vanity-leg-${vx}-${vz}`} position={[vx, 0.35, vz]} castShadow>
              <cylinderGeometry args={[0.018, 0.025, 0.72, 16]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
          ))
        )}

        {/* Illuminated Arched Brass Vanity Mirror */}
        <group position={[0, 1.45, -0.22]}>
          <mesh>
            <planeGeometry args={[0.7, 0.9]} />
            <meshPhysicalMaterial
              color="#F0F4F8"
              roughness={0.03}
              metalness={0.95}
              clearcoat={1.0}
              reflectivity={1.0}
            />
          </mesh>
          {/* Brass Bevel Frame */}
          <mesh position={[0, 0, -0.01]}>
            <boxGeometry args={[0.74, 0.94, 0.02]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Warm Vanity Backlight */}
          <pointLight position={[0, 0.2, 0.15]} color="#FFF3DD" intensity={1.1} distance={2.5} />
        </group>

        {/* Upholstered Round Bouclé Stool */}
        <group position={[0, 0, 0.5]}>
          <mesh position={[0, 0.24, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.42, 24]} />
            <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.23, 0.23, 0.08, 24]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* -------------------- 5. FLOOR-TO-CEILING SHEER ARCHITECTURAL DRAPES -------------------- */}
      {/* Framing the North skyline window (Z = -5.85, X: -14.3 and X: -6.7) */}
      {[-14.2, -6.8].map((dx, didx) => (
        <group key={`drape-${didx}`} position={[dx, 1.7, -5.85]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.25, 0.28, 3.4, 24]} />
            <meshStandardMaterial
              color="#FAF7F2"
              roughness={0.9}
              transparent
              opacity={0.88}
            />
          </mesh>
        </group>
      ))}

      {/* -------------------- 6. CURATED WALL ART CANVAS -------------------- */}
      {/* Mounted on the East wall (X = -6.65, Y = 1.8, Z = -1.2) */}
      <group position={[-6.65, 1.8, -1.2]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[1.4, 1.8, 0.04]} />
          <meshStandardMaterial color="#F5EFE4" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[1.44, 1.84, 0.04]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};
