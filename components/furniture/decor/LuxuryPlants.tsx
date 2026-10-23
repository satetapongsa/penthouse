'use client';

import React from 'react';
import * as THREE from 'three';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';
import { LUXURY_PALETTE } from '@/lib/materials';

interface PottedTreeProps {
  position: [number, number, number];
  type?: 'olive' | 'fiddle';
  scale?: number;
}

export const LuxuryPottedTree: React.FC<PottedTreeProps> = ({
  position,
  type = 'olive',
  scale = 1.0,
}) => {
  const colors = LUXURY_PALETTE.colors;

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Physical Collider for the Planter Pot */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.32, 0.4, 0.32]} position={[0, 0.4, 0]} />
      </RigidBody>

      {/* Fluted Travertine Architectural Planter */}
      <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.28, 0.72, 24]} />
        <meshStandardMaterial color={colors.travertine} roughness={0.45} />
      </mesh>

      {/* Brushed Brass Base Rim */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.29, 0.29, 0.04, 24]} />
        <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Dark Organic Top Soil */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.04, 20]} />
        <meshStandardMaterial color="#352D26" roughness={0.9} />
      </mesh>

      {/* Sculptural Woody Stem/Trunk */}
      <group position={[0, 0.7, 0]}>
        <mesh position={[0, 0.65, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.045, 1.3, 10]} />
          <meshStandardMaterial color="#6B5949" roughness={0.8} />
        </mesh>
        <mesh position={[0.08, 1.05, 0.04]} rotation={[0.2, 0.4, 0.3]} castShadow>
          <cylinderGeometry args={[0.02, 0.028, 0.7, 8]} />
          <meshStandardMaterial color="#6B5949" roughness={0.8} />
        </mesh>
        <mesh position={[-0.06, 0.95, -0.05]} rotation={[-0.2, -0.3, -0.25]} castShadow>
          <cylinderGeometry args={[0.02, 0.028, 0.65, 8]} />
          <meshStandardMaterial color="#6B5949" roughness={0.8} />
        </mesh>

        {/* Clustered Foliage Canopy */}
        {type === 'olive' ? (
          // Delicate Sage Leaves for Olive Tree
          [
            [0, 1.35, 0, 0.35],
            [0.18, 1.45, 0.08, 0.28],
            [-0.15, 1.3, -0.1, 0.3],
            [0.08, 1.6, -0.05, 0.25],
            [-0.1, 1.52, 0.12, 0.26],
            [0.22, 1.25, -0.12, 0.24],
          ].map(([lx, ly, lz, lr], idx) => (
            <mesh key={`olive-cluster-${idx}`} position={[lx, ly, lz]} castShadow>
              <sphereGeometry args={[lr, 10, 10]} />
              <meshStandardMaterial color={idx % 2 === 0 ? colors.sage : '#97A994'} roughness={0.65} />
            </mesh>
          ))
        ) : (
          // Broad Sculptural Fiddle Leaf Fig Leaves
          [
            [0.12, 1.25, 0.08, 0.4, 0.3],
            [-0.12, 1.15, -0.08, 0.38, -0.4],
            [0.16, 1.45, -0.06, 0.42, 0.25],
            [-0.14, 1.4, 0.1, 0.38, -0.3],
            [0, 1.62, 0, 0.44, 0.1],
          ].map(([fx, fy, fz, fr, frot], idx) => (
            <group key={`fiddle-leaf-${idx}`} position={[fx, fy, fz]} rotation={[0, frot, 0.2]}>
              <RoundedBox args={[fr, 0.015, fr * 0.7]} radius={0.01} smoothness={3}>
                <meshStandardMaterial color={colors.sage} roughness={0.5} />
              </RoundedBox>
            </group>
          ))
        )}
      </group>
    </group>
  );
};

interface TablePlantProps {
  position: [number, number, number];
  scale?: number;
}

export const TabletopSucculent: React.FC<TablePlantProps> = ({ position, scale = 1.0 }) => {
  const colors = LUXURY_PALETTE.colors;

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Ribbed Brass Planter Bowl */}
      <mesh castShadow>
        <cylinderGeometry args={[0.09, 0.06, 0.08, 20]} />
        <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.25} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.038, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.01, 16]} />
        <meshStandardMaterial color="#352D26" roughness={0.9} />
      </mesh>
      {/* Sculptural Rosette Succulent Petals */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={`succulent-petal-${i}`}
          position={[Math.sin((i / 6) * Math.PI * 2) * 0.04, 0.06, Math.cos((i / 6) * Math.PI * 2) * 0.04]}
          rotation={[0.3, (i / 6) * Math.PI * 2, 0]}
          castShadow
        >
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color={colors.sage} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 0.08, 0]} castShadow>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#9EB09A" roughness={0.6} />
      </mesh>
    </group>
  );
};
