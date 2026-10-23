'use client';

import React from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';
import { LUXURY_PALETTE } from '@/lib/materials';

export const GrandPianoSet: React.FC = () => {
  const colors = LUXURY_PALETTE.colors;

  return (
    <group position={[-1.8, 0, 0.8]} rotation={[0, Math.PI / 4, 0]}>
      {/* Physics Collider for Piano */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.75, 0.5, 0.65]} position={[0, 0.5, 0]} />
        {/* Bench Collider */}
        <CuboidCollider args={[0.42, 0.24, 0.22]} position={[0, 0.24, -0.92]} />
      </RigidBody>

      {/* 1. White Lacquer Grand Piano Body */}
      <mesh position={[0, 0.68, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.32, 1.2]} />
        <meshPhysicalMaterial color="#FAF9F5" roughness={0.08} clearcoat={1.0} reflectivity={0.9} />
      </mesh>

      {/* Piano Legs with Brass Ferrules */}
      {[
        [-0.6, -0.4],
        [0.6, -0.4],
        [0, 0.45],
      ].map(([px, pz], pidx) => (
        <group key={`piano-leg-${pidx}`} position={[px, 0, pz]}>
          <mesh position={[0, 0.26, 0]}>
            <cylinderGeometry args={[0.035, 0.025, 0.52, 16]} />
            <meshPhysicalMaterial color="#FAF9F5" roughness={0.08} clearcoat={1.0} />
          </mesh>
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.026, 0.026, 0.08, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Lyre & Brass Pedals */}
      <group position={[0, 0.2, 0]}>
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.12, 0.24, 0.03]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
        {[-0.03, 0, 0.03].map((px, idx) => (
          <mesh key={`pedal-${idx}`} position={[px, 0.02, 0.04]} castShadow>
            <boxGeometry args={[0.015, 0.012, 0.08]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
          </mesh>
        ))}
      </group>

      {/* Keyboard Bed & Ivory/Ebony Keys */}
      <mesh position={[0, 0.69, -0.52]}>
        <boxGeometry args={[1.1, 0.04, 0.16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
      </mesh>
      {/* Brass Music Stand */}
      <group position={[0, 0.88, -0.42]} rotation={[-0.35, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.22, 0.012]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* 2. Designer Piano Bench with Cushion */}
      <group position={[0, 0, -0.92]}>
        {/* Tapered Brass Legs */}
        {[-0.32, 0.32].map((bx) =>
          [-0.14, 0.14].map((bz) => (
            <mesh key={`bench-leg-${bx}-${bz}`} position={[bx, 0.2, bz]}>
              <cylinderGeometry args={[0.016, 0.012, 0.4, 12]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
          ))
        )}
        {/* Ivory Bouclé Cushioned Seat */}
        <RoundedBox args={[0.78, 0.1, 0.38]} radius={0.03} smoothness={3} position={[0, 0.45, 0]} castShadow>
          <meshStandardMaterial color={colors.cream} roughness={0.8} />
        </RoundedBox>
      </group>
    </group>
  );
};
