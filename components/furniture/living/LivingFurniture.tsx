'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import {
  getCalacattaMarbleTexture,
  getPaleOakTexture,
  getBoucleFabricTexture,
  getBookSpineTexture,
  LUXURY_PALETTE,
} from '@/lib/materials';

export const LivingFurniture: React.FC = () => {
  const marbleTex = useMemo(() => getCalacattaMarbleTexture(), []);
  const oakTex = useMemo(() => getPaleOakTexture(), []);
  const boucleTex = useMemo(() => getBoucleFabricTexture(), []);
  const bookTex = useMemo(() => getBookSpineTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  return (
    <group>
      {/* -------------------- 1. PLUSH WOVEN AREA RUG -------------------- */}
      {/* Centered beneath the living seating group (X: 1.9, Z: -1.2, Size: 5.6m x 4.0m) */}
      <mesh position={[1.9, 0.006, -1.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5.6, 4.0]} />
        <meshStandardMaterial
          color="#EDE7DA"
          map={boucleTex}
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* -------------------- 2. LARGE L-SHAPED BOUCLÉ SECTIONAL SOFA -------------------- */}
      {/* Main back section along Z = 0.2 (X: -0.6 to 4.2), Chaise section along X: -0.6 (Z: 0.2 to -2.2) */}
      <group position={[1.8, 0, -1.0]}>
        {/* Rapier Colliders for Sofa Base */}
        <RigidBody type="fixed" colliders={false}>
          {/* Main seating block collider */}
          <CuboidCollider args={[2.4, 0.45, 0.52]} position={[0, 0.45, 1.2]} />
          {/* Left chaise block collider */}
          <CuboidCollider args={[0.55, 0.45, 1.2]} position={[-1.85, 0.45, -0.1]} />
        </RigidBody>

        {/* Main Seat Cushions */}
        <mesh position={[0, 0.24, 1.2]} castShadow receiveShadow>
          <boxGeometry args={[4.8, 0.46, 1.05]} />
          <meshStandardMaterial
            color={colors.ivory}
            map={boucleTex}
            roughness={0.85}
          />
        </mesh>

        {/* Main Backrest Cushions */}
        <mesh position={[0, 0.65, 1.62]} castShadow receiveShadow>
          <boxGeometry args={[4.8, 0.42, 0.28]} />
          <meshStandardMaterial
            color={colors.ivory}
            map={boucleTex}
            roughness={0.85}
          />
        </mesh>

        {/* Left Chaise Cushion */}
        <mesh position={[-1.88, 0.24, -0.05]} castShadow receiveShadow>
          <boxGeometry args={[1.04, 0.46, 2.3]} />
          <meshStandardMaterial
            color={colors.ivory}
            map={boucleTex}
            roughness={0.85}
          />
        </mesh>

        {/* Right Armrest Block */}
        <mesh position={[2.46, 0.42, 1.2]} castShadow receiveShadow>
          <boxGeometry args={[0.26, 0.52, 1.05]} />
          <meshStandardMaterial
            color={colors.ivory}
            map={boucleTex}
            roughness={0.85}
          />
        </mesh>

        {/* Recessed Brushed Brass Sofa Plinth / Reveal */}
        <mesh position={[0.2, 0.02, 0.6]}>
          <boxGeometry args={[4.7, 0.04, 2.8]} />
          <meshStandardMaterial color={colors.brass} metalness={0.85} roughness={0.3} />
        </mesh>

        {/* Scatter Pillows (Terracotta, Sage & Champagne Gold) */}
        {[
          { pos: [-1.4, 0.56, 1.45], rot: [0.1, 0.2, -0.1], col: colors.pillowTerracotta },
          { pos: [-0.6, 0.56, 1.45], rot: [-0.05, -0.15, 0.1], col: colors.pillowGold },
          { pos: [0.4, 0.56, 1.45], rot: [0.15, 0.05, 0], col: colors.cream },
          { pos: [1.3, 0.56, 1.45], rot: [-0.1, 0.25, 0.05], col: colors.pillowSage },
          { pos: [2.1, 0.56, 1.45], rot: [0.05, -0.2, -0.05], col: colors.pillowGold },
          { pos: [-1.88, 0.56, 0.7], rot: [0.2, 0.1, 0], col: colors.pillowSage },
        ].map((pill, idx) => (
          <mesh
            key={`pillow-${idx}`}
            position={pill.pos as [number, number, number]}
            rotation={pill.rot as [number, number, number]}
            castShadow
          >
            <boxGeometry args={[0.42, 0.38, 0.16]} />
            <meshStandardMaterial color={pill.col} roughness={0.8} />
          </mesh>
        ))}

        {/* Cashmere Throw Blanket draped over chaise corner */}
        <mesh position={[-1.88, 0.48, -0.9]} rotation={[0.08, 0.12, 0]} castShadow>
          <boxGeometry args={[0.85, 0.04, 0.7]} />
          <meshStandardMaterial color="#D6C5B2" roughness={0.9} />
        </mesh>
      </group>

      {/* -------------------- 3. NESTED TRAVERTINE & BRASS COFFEE TABLE -------------------- */}
      {/* Positioned in front of the sofa at X = 1.9, Z = -1.4 */}
      <group position={[1.9, 0, -1.4]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.7, 0.2, 0.42]} position={[0, 0.2, 0]} />
        </RigidBody>

        {/* Main Low Calacatta Slab Table */}
        <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.36, 0.36, 0.8]} />
          <meshPhysicalMaterial
            color={colors.calacatta}
            map={marbleTex}
            roughness={0.15}
            clearcoat={0.9}
          />
        </mesh>
        {/* Brass Plinth */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[1.28, 0.04, 0.72]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.22} />
        </mesh>

        {/* Secondary Tiered Round Accent Disc */}
        <group position={[0.62, 0, -0.28]}>
          <mesh position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.03, 32]} />
            <meshPhysicalMaterial
              color="#FAF8F5"
              roughness={0.1}
              metalness={0.1}
              clearcoat={1.0}
            />
          </mesh>
          <mesh position={[0, 0.11, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.22, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* Curated Coffee Table Monographs */}
        <group position={[-0.32, 0.38, 0.08]} rotation={[0, 0.15, 0]}>
          <mesh position={[0, 0.015, 0]} castShadow>
            <boxGeometry args={[0.28, 0.03, 0.36]} />
            <meshStandardMaterial color="#2B2825" roughness={0.6} />
          </mesh>
          <mesh position={[0.02, 0.04, -0.01]} rotation={[0, -0.08, 0]} castShadow>
            <boxGeometry args={[0.26, 0.025, 0.32]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>

        {/* Fluted Ceramic Sculptural Vase with White Blossoms */}
        <group position={[0.22, 0.37, 0.02]}>
          <mesh position={[0, 0.14, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.06, 0.28, 24]} />
            <meshStandardMaterial color="#F4EFE6" roughness={0.4} />
          </mesh>
          {/* Fresh White Lily / Calla Blossoms */}
          <group position={[0, 0.28, 0]}>
            <mesh position={[0, 0.08, 0]} rotation={[0.2, 0.3, 0]} castShadow>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
            </mesh>
            <mesh position={[0.04, 0.12, -0.02]} rotation={[-0.2, 0.8, 0.1]} castShadow>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
            </mesh>
          </group>
        </group>
      </group>

      {/* -------------------- 4. TWO CURVED BOUCLÉ ACCENT ARMCHAIRS -------------------- */}
      {/* Chair 1 (X = 4.4, Z = -1.0, angled toward coffee table) */}
      <group position={[4.4, 0, -1.0]} rotation={[0, -Math.PI / 3.8, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.42, 0.38, 0.42]} position={[0, 0.38, 0]} />
        </RigidBody>
        {/* Brass Swivel Ring Base */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.08, 32]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.25} />
        </mesh>
        {/* Round Curved Seat */}
        <mesh position={[0, 0.26, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.4, 0.36, 32]} />
          <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.85} />
        </mesh>
        {/* Barrel Curved Backrest */}
        <mesh position={[0, 0.52, 0.18]} castShadow receiveShadow>
          <boxGeometry args={[0.76, 0.38, 0.26]} />
          <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.85} />
        </mesh>
      </group>

      {/* Chair 2 (X = 4.2, Z = -2.3, angled toward coffee table) */}
      <group position={[4.2, 0, -2.3]} rotation={[0, -Math.PI / 2.2, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.42, 0.38, 0.42]} position={[0, 0.38, 0]} />
        </RigidBody>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.08, 32]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.26, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.4, 0.36, 32]} />
          <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.52, 0.18]} castShadow receiveShadow>
          <boxGeometry args={[0.76, 0.38, 0.26]} />
          <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.85} />
        </mesh>
      </group>

      {/* -------------------- 5. TV WALL, FLOATING MEDIA CONSOLE & FIREPLACE -------------------- */}
      {/* Positioned on the South wall of Living Room (X: 5.0, Z: 1.88, facing North) */}
      <group position={[5.0, 0, 1.88]} rotation={[0, Math.PI, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.8, 0.3, 0.25]} position={[0, 0.3, 0]} />
        </RigidBody>

        {/* Fluted Travertine & Oak Architectural Feature Wall Panel */}
        <mesh position={[0, 1.7, -0.06]} receiveShadow>
          <boxGeometry args={[3.8, 3.4, 0.06]} />
          <meshStandardMaterial color="#F4EFE6" roughness={0.6} />
        </mesh>

        {/* Brushed Brass Frame Border */}
        <mesh position={[0, 1.7, -0.02]}>
          <boxGeometry args={[3.84, 3.42, 0.02]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
        </mesh>

        {/* Floating Low Media Console (Pale Oak) */}
        <mesh position={[0, 0.32, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.42, 0.48]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </mesh>
        {/* Brass Console Trim */}
        <mesh position={[0, 0.54, 0.2]}>
          <boxGeometry args={[3.44, 0.02, 0.5]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.22} />
        </mesh>

        {/* 85-inch Ultra-Slim Bezel OLED Screen */}
        <group position={[0, 1.85, 0.02]}>
          {/* Bezel frame */}
          <mesh castShadow>
            <boxGeometry args={[2.0, 1.15, 0.03]} />
            <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Glass Display */}
          <mesh position={[0, 0, 0.016]}>
            <planeGeometry args={[1.96, 1.11]} />
            <meshPhysicalMaterial
              color="#0A0A0A"
              roughness={0.05}
              clearcoat={1.0}
              reflectivity={0.95}
            />
          </mesh>
        </group>

        {/* Modern Linear Recessed Fireplace Cavity */}
        <group position={[0, 0.85, 0.04]}>
          {/* Matte Black Hearth Box */}
          <mesh>
            <boxGeometry args={[1.8, 0.32, 0.16]} />
            <meshStandardMaterial color="#1A1817" roughness={0.8} />
          </mesh>
          {/* Protective Fireplace Glass */}
          <mesh position={[0, 0, 0.08]}>
            <planeGeometry args={[1.76, 0.28]} />
            <meshPhysicalMaterial
              color="#E8F1F5"
              roughness={0.05}
              transmission={0.92}
              transparent
              opacity={0.3}
            />
          </mesh>
          {/* Glowing Ember Bed & Crystal Rocks */}
          <mesh position={[0, -0.1, 0.02]}>
            <boxGeometry args={[1.6, 0.04, 0.1]} />
            <meshBasicMaterial color="#FFB042" />
          </mesh>
          {/* Warm Ambient Fireplace Glow */}
          <pointLight color="#FFA834" intensity={1.8} distance={3.5} decay={2} />
        </group>
      </group>

      {/* -------------------- 6. SCULPTURAL GRAND PIANO IN IVORY & BRASS -------------------- */}
      {/* Positioned at the Northwest window zone (X = -1.2, Z = -4.2) */}
      <group position={[-1.2, 0, -4.2]} rotation={[0, Math.PI / 4, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.9, 0.55, 1.1]} position={[0, 0.55, 0]} />
        </RigidBody>

        {/* Polished White/Ivory Grand Piano Body */}
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.38, 1.8]} />
          <meshPhysicalMaterial
            color="#FCFBF9"
            roughness={0.08}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
          />
        </mesh>

        {/* Curved Rear Wing of Grand Piano */}
        <mesh position={[0.45, 0.72, -0.6]} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.38, 24]} />
          <meshPhysicalMaterial
            color="#FCFBF9"
            roughness={0.08}
            clearcoat={1.0}
          />
        </mesh>

        {/* Keyboard Bed & Lid Shelf */}
        <mesh position={[0, 0.65, 0.95]} castShadow>
          <boxGeometry args={[1.4, 0.1, 0.28]} />
          <meshStandardMaterial color="#2B2621" roughness={0.3} />
        </mesh>

        {/* 88 Piano Keys (Ivory & Ebony) */}
        <mesh position={[0, 0.71, 0.98]}>
          <boxGeometry args={[1.28, 0.02, 0.18]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.73, 0.95]}>
          <boxGeometry args={[1.2, 0.025, 0.1]} />
          <meshStandardMaterial color="#111111" roughness={0.2} />
        </mesh>

        {/* Sculptural Brass Piano Legs (3 Fluted Columns) */}
        {[
          [-0.65, 0.35, 0.7],
          [0.65, 0.35, 0.7],
          [0.35, 0.35, -0.75],
        ].map((leg, idx) => (
          <mesh key={`piano-leg-${idx}`} position={leg as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.05, 0.035, 0.7, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.2} />
          </mesh>
        ))}

        {/* Piano Bench (Ivory Bouclé Cushion + Brass Legs) */}
        <group position={[0, 0, 1.45]}>
          <mesh position={[0, 0.44, 0]} castShadow>
            <boxGeometry args={[0.75, 0.08, 0.36]} />
            <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.8} />
          </mesh>
          {[-0.32, 0.32].map((bx) => (
            <mesh key={`bench-leg-${bx}`} position={[bx, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.015, 0.4, 12]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.25} />
            </mesh>
          ))}
        </group>
      </group>

      {/* -------------------- 7. TALL BRASS & OAK BOOKSHELVES WITH BOOKS -------------------- */}
      {/* Positioned along the West wall of Living Room (X = -3.32, Z = -4.0, facing East) */}
      <group position={[-3.32, 0, -4.0]} rotation={[0, Math.PI / 2, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.9, 1.4, 0.2]} position={[0, 1.4, 0]} />
        </RigidBody>

        {/* Brushed Brass Vertical Upright Frames */}
        {[-0.9, 0.9].map((fx) => (
          <mesh key={`bookcase-frame-${fx}`} position={[fx, 1.4, 0]} castShadow>
            <boxGeometry args={[0.04, 2.8, 0.38]} />
            <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
          </mesh>
        ))}

        {/* 5 Pale Oak Horizontal Shelves */}
        {[0.1, 0.7, 1.3, 1.9, 2.5].map((sy, sidx) => (
          <group key={`shelf-${sidx}`} position={[0, sy, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.82, 0.04, 0.36]} />
              <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
            </mesh>

            {/* Curated Books Collection on Shelves */}
            {sidx < 4 && (
              <mesh position={[(sidx % 2 === 0 ? -0.35 : 0.35), 0.24, 0]} castShadow>
                <boxGeometry args={[0.95, 0.42, 0.24]} />
                <meshStandardMaterial map={bookTex} roughness={0.5} />
              </mesh>
            )}

            {/* Ceramic Decorative Sculptural Vessels on Alternate Shelves */}
            {sidx === 2 && (
              <mesh position={[0.5, 0.18, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.05, 0.3, 16]} />
                <meshStandardMaterial color="#E8E2D5" roughness={0.4} />
              </mesh>
            )}
            {sidx === 4 && (
              <mesh position={[-0.4, 0.16, 0]} castShadow>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color={colors.brass} metalness={0.85} roughness={0.25} />
              </mesh>
            )}
          </group>
        ))}
      </group>

      {/* -------------------- 8. SLENDER ARCHED BRASS FLOOR LAMP -------------------- */}
      {/* Positioned behind sofa chaise (X = 0.1, Z = 0.5) */}
      <group position={[0.1, 0, 0.5]}>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.06, 32]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.25, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 2.4, 16]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Curved Lamp Head & Shade */}
        <mesh position={[0.4, 2.45, -0.3]} castShadow>
          <cylinderGeometry args={[0.18, 0.26, 0.22, 24]} />
          <meshStandardMaterial color="#FAF8F5" roughness={0.3} />
        </mesh>
        <pointLight position={[0.4, 2.35, -0.3]} color="#FFF3DD" intensity={1.2} distance={5} />
      </group>

      {/* -------------------- 9. POTTED OVERSIZED INDOOR TREE IN TRAVERTINE PLANTER -------------------- */}
      {/* Positioned near the East glass corner of Living Room (X = 6.8, Z = -5.0) */}
      <group position={[6.8, 0, -5.0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.38, 0.45, 0.38]} position={[0, 0.45, 0]} />
        </RigidBody>

        {/* Fluted Travertine Planter Pot */}
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.38, 0.3, 0.84, 24]} />
          <meshStandardMaterial color={colors.travertine} roughness={0.4} />
        </mesh>

        {/* Sculptural Tree Trunk & Foliage */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 1.1, 12]} />
          <meshStandardMaterial color="#4A3C31" roughness={0.8} />
        </mesh>
        {/* Soft Sage Leaf Canopy */}
        {[
          { pos: [0, 1.8, 0], scale: 0.42, col: colors.sage },
          { pos: [0.18, 2.05, 0.12], scale: 0.38, col: '#95A693' },
          { pos: [-0.15, 2.1, -0.1], scale: 0.36, col: '#7D8E7B' },
          { pos: [0.05, 2.35, -0.05], scale: 0.34, col: colors.sage },
        ].map((canopy, idx) => (
          <mesh
            key={`canopy-${idx}`}
            position={canopy.pos as [number, number, number]}
            castShadow
          >
            <sphereGeometry args={[canopy.scale, 16, 16]} />
            <meshStandardMaterial color={canopy.col} roughness={0.75} />
          </mesh>
        ))}
      </group>

      {/* -------------------- 10. CURATED MINIMALIST WALL ART CANVAS -------------------- */}
      {/* Mounted on the West wall (X = -3.42, Y = 1.8, Z = -1.2) */}
      <group position={[-3.42, 1.8, -1.2]} rotation={[0, Math.PI / 2, 0]}>
        {/* Canvas Stretcher */}
        <mesh receiveShadow>
          <boxGeometry args={[1.6, 2.0, 0.04]} />
          <meshStandardMaterial color="#F7F3EB" roughness={0.85} />
        </mesh>
        {/* Brushed Champagne Brass Floating Frame */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[1.66, 2.06, 0.05]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
        </mesh>
      </group>
    </group>
  );
};
