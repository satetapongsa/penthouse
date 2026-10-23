'use client';

import React, { useMemo } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import {
  getPaleOakTexture,
  getBoucleFabricTexture,
  LUXURY_PALETTE,
} from '@/lib/materials';

export const GuestBedroomFurniture: React.FC = () => {
  const oakTex = useMemo(() => getPaleOakTexture(), []);
  const boucleTex = useMemo(() => getBoucleFabricTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  return (
    <group>
      {/* -------------------- 1. GUEST BEDROOM AREA RUG -------------------- */}
      {/* Under the Double Bed (X: 6.2, Z: 3.5, Size: 3.2m x 3.0m) */}
      <mesh position={[6.2, 0.007, 3.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, 3.0]} />
        <meshStandardMaterial color="#EAE4D8" map={boucleTex} roughness={0.9} />
      </mesh>

      {/* -------------------- 2. DOUBLE BED WITH HEADBOARD & LINEN -------------------- */}
      {/* Headboard against North wall (Z = 2.2), Bed extending south to Z = 4.2 */}
      <group position={[6.2, 0, 3.2]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.95, 0.42, 1.05]} position={[0, 0.42, 0]} />
        </RigidBody>

        {/* Headboard (Width 2.2m, Height 1.4m) */}
        <mesh position={[0, 0.72, -1.0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 1.44, 0.14]} />
          <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.72, -1.0]}>
          <boxGeometry args={[2.24, 1.48, 0.12]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Bed Base (Pale Oak) */}
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.82, 0.44, 2.05]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.55} />
        </mesh>

        {/* Mattress & Crisp Ivory Bedding */}
        <mesh position={[0, 0.5, 0.05]} castShadow receiveShadow>
          <boxGeometry args={[1.74, 0.26, 1.95]} />
          <meshStandardMaterial color="#FAF8F5" roughness={0.8} />
        </mesh>

        {/* Terracotta Blanket at Foot */}
        <mesh position={[0, 0.64, 0.6]} castShadow>
          <boxGeometry args={[1.76, 0.04, 0.65]} />
          <meshStandardMaterial color={colors.pillowTerracotta} roughness={0.85} />
        </mesh>

        {/* 4 Sleeping & Accent Pillows */}
        {[-0.45, 0.45].map((px, idx) => (
          <mesh key={`guest-pillow-${idx}`} position={[px, 0.72, -0.68]} rotation={[-0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.62, 0.38, 0.16]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.85} />
          </mesh>
        ))}
        {[-0.45, 0.45].map((px, idx) => (
          <mesh key={`guest-accent-pillow-${idx}`} position={[px, 0.68, -0.48]} rotation={[-0.35, 0, 0]} castShadow>
            <boxGeometry args={[0.42, 0.32, 0.14]} />
            <meshStandardMaterial color={idx === 0 ? colors.pillowSage : colors.pillowGold} roughness={0.8} />
          </mesh>
        ))}

        {/* Two Nightstands with Lamps */}
        {[-1.3, 1.3].map((nx, nidx) => (
          <group key={`g-nightstand-${nidx}`} position={[nx, 0, -0.8]}>
            <RigidBody type="fixed" colliders={false}>
              <CuboidCollider args={[0.26, 0.26, 0.22]} position={[0, 0.26, 0]} />
            </RigidBody>
            <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.5, 0.48, 0.42]} />
              <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.49, 0]} castShadow>
              <boxGeometry args={[0.52, 0.02, 0.44]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Table Lamp */}
            <mesh position={[0, 0.62, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.09, 0.24, 20]} />
              <meshStandardMaterial color={colors.travertine} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.82, 0]} castShadow>
              <cylinderGeometry args={[0.13, 0.18, 0.2, 20]} />
              <meshStandardMaterial color="#FFFDF9" roughness={0.3} />
            </mesh>
            <pointLight position={[0, 0.82, 0]} color="#FFF0D4" intensity={0.6} distance={3} />
          </group>
        ))}
      </group>

      {/* -------------------- 3. WORK DESK WITH CHAIR & TABLE LAMP -------------------- */}
      {/* Positioned against East wall (X = 9.18, Z = 3.6, facing East) */}
      <group position={[9.18, 0, 3.6]} rotation={[0, -Math.PI / 2, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.6, 0.38, 0.28]} position={[0, 0.38, 0]} />
        </RigidBody>

        {/* Pale Oak Desk Top (Width 1.2m, Depth 0.55m, Height 0.75m) */}
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.05, 0.54]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </mesh>
        {/* Tapered Brass Legs */}
        {[-0.52, 0.52].map((dx) =>
          [-0.2, 0.2].map((dz) => (
            <mesh key={`desk-leg-${dx}-${dz}`} position={[dx, 0.35, dz]} castShadow>
              <cylinderGeometry args={[0.016, 0.022, 0.7, 16]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
          ))
        )}

        {/* Laptop on Desk */}
        <group position={[-0.1, 0.75, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.01, 0.2]} />
            <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.1, -0.09]} rotation={[-0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.3, 0.2, 0.01]} />
            <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* Minimalist Brass Desk Lamp */}
        <group position={[0.42, 0.75, -0.1]}>
          <mesh position={[0, 0.18, 0]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.36, 12]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[-0.08, 0.36, 0]} rotation={[0, 0, Math.PI / 3]} castShadow>
            <cylinderGeometry args={[0.04, 0.08, 0.12, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          <pointLight position={[-0.1, 0.32, 0]} color="#FFE8BA" intensity={0.7} distance={2.5} />
        </group>

        {/* Modernist Desk Chair */}
        <group position={[0, 0, 0.42]} rotation={[0, Math.PI, 0]}>
          <mesh position={[0, 0.44, 0]} castShadow>
            <boxGeometry args={[0.44, 0.06, 0.42]} />
            <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.72, -0.18]} castShadow>
            <boxGeometry args={[0.44, 0.36, 0.06]} />
            <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.44, 12]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* -------------------- 4. GUEST WARDROBE CLOSET -------------------- */}
      {/* Positioned on South wall (Z = 6.22, X = 6.0, Width 2.2m, Height 2.8m, Depth 0.52m) */}
      <group position={[6.0, 0, 6.22]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.1, 1.4, 0.26]} position={[0, 1.4, 0]} />
        </RigidBody>
        <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 2.8, 0.52]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </mesh>
        {/* Brass Flush Handles */}
        {[-0.2, 0.2].map((hx) => (
          <mesh key={`wardrobe-handle-${hx}`} position={[hx, 1.2, -0.27]}>
            <boxGeometry args={[0.025, 0.6, 0.02]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* -------------------- 5. CURATED WALL ART OVER BED -------------------- */}
      <group position={[6.2, 2.1, 2.05]}>
        <mesh receiveShadow>
          <boxGeometry args={[1.6, 0.9, 0.03]} />
          <meshStandardMaterial color="#F4EFE6" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[1.64, 0.94, 0.02]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};
