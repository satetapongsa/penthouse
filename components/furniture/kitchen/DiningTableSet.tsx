'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import {
  getPaleOakTexture,
  getBoucleFabricTexture,
  LUXURY_PALETTE,
} from '@/lib/materials';

export const DiningTableSet: React.FC = () => {
  const oakTex = useMemo(() => getPaleOakTexture(), []);
  const boucleTex = useMemo(() => getBoucleFabricTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  return (
    <group>
      {/* 1. GRAND DINING TABLE & 8 CHAIRS */}
      <group position={[10.75, 0, -4.2]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.75, 0.38, 0.65]} position={[0, 0.38, 0]} />
        </RigidBody>

        <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.06, 1.25]} />
          <meshStandardMaterial color={colors.travertine} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.705, 0]}>
          <boxGeometry args={[3.32, 0.015, 1.18]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
        </mesh>

        {[-0.95, 0.95].map((bx) => (
          <group key={`table-base-${bx}`} position={[bx, 0.34, 0]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.26, 0.3, 0.68, 20]} />
              <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.32, 0]}>
              <cylinderGeometry args={[0.34, 0.34, 0.04, 20]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* 8 Dining Chairs */}
        {[-1.25, -0.42, 0.42, 1.25].map((cx, idx) => (
          <group key={`chair-north-${idx}`} position={[cx, 0, -0.72]}>
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[0.44, 0.06, 0.44]} />
              <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.72, -0.19]} castShadow>
              <boxGeometry args={[0.44, 0.48, 0.06]} />
              <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
            </mesh>
            {[[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].map(([lx, lz], lidx) => (
              <mesh key={`leg-${lidx}`} position={[lx, 0.22, lz]}>
                <cylinderGeometry args={[0.016, 0.012, 0.44, 8]} />
                <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
              </mesh>
            ))}
          </group>
        ))}

        {[-1.25, -0.42, 0.42, 1.25].map((cx, idx) => (
          <group key={`chair-south-${idx}`} position={[cx, 0, 0.72]} rotation={[0, Math.PI, 0]}>
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[0.44, 0.06, 0.44]} />
              <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.72, -0.19]} castShadow>
              <boxGeometry args={[0.44, 0.48, 0.06]} />
              <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
            </mesh>
            {[[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].map(([lx, lz], lidx) => (
              <mesh key={`leg-${lidx}`} position={[lx, 0.22, lz]}>
                <cylinderGeometry args={[0.016, 0.012, 0.44, 8]} />
                <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Place Settings */}
        {[-1.25, -0.42, 0.42, 1.25].flatMap((px) => [
          { x: px, z: -0.38 },
          { x: px, z: 0.38 },
        ]).map((pos, pidx) => (
          <group key={`setting-${pidx}`} position={[pos.x, 0.77, pos.z]}>
            <mesh position={[0, 0.005, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.008, 16]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.012, 0]}>
              <cylinderGeometry args={[0.13, 0.13, 0.01, 16]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
            </mesh>
            <mesh position={[0.14, 0.07, -0.1]}>
              <cylinderGeometry args={[0.035, 0.02, 0.14, 12]} />
              <meshPhysicalMaterial color="#E8F1F5" roughness={0.05} transmission={0.95} transparent opacity={0.65} />
            </mesh>
          </group>
        ))}

        {/* Centerpiece Pedestal Bowl */}
        <group position={[0, 0.77, 0]}>
          <mesh position={[0, 0.04, 0]} castShadow>
            <cylinderGeometry args={[0.26, 0.08, 0.08, 20]} />
            <meshStandardMaterial color={colors.travertine} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
      </group>

      {/* 2. BACKLIT WINE DISPLAY WALL */}
      <group position={[13.88, 0, -2.0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 3.4, 0.22]} />
          <meshStandardMaterial color={colors.darkOak} roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.7, 0.11]}>
          <planeGeometry args={[3.0, 3.2]} />
          <meshPhysicalMaterial color="#E8F1F5" roughness={0.05} transmission={0.92} transparent opacity={0.4} />
        </mesh>
        {[-0.8, -0.2, 0.4, 1.0].map((wy, widx) => (
          <group key={`wine-row-${widx}`} position={[0, wy + 1.2, 0.05]}>
            {[-1.0, -0.6, -0.2, 0.2, 0.6, 1.0].map((wx, bidx) => (
              <mesh key={`wine-bottle-${bidx}`} position={[wx, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.035, 0.035, 0.28, 10]} />
                <meshPhysicalMaterial color="#223326" roughness={0.1} transmission={0.7} transparent opacity={0.8} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
};
