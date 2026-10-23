'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';
import { LUXURY_PALETTE } from '@/lib/materials';
import { useGameStore } from '@/store/useGameStore';
import { LuxurySoapDispenser } from '../decor/PlumbingDetails';
import { ScentedGlassCandle } from '../decor/BooksAndTrays';

export const PowderRoomFurniture: React.FC = () => {
  const colors = LUXURY_PALETTE.colors;

  const toiletLidOpen = useGameStore((s) => s.toiletLidOpen);
  const toggleToiletLid = useGameStore((s) => s.toggleToiletLid);
  const isPowderLightOn = useGameStore((s) => s.lightingStates.powder_room ?? true);
  const togglePowderLight = useGameStore((s) => s.toggleRoomLight);

  const toiletLidRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (toiletLidRef.current) {
      const targetAngle = toiletLidOpen ? -Math.PI / 1.8 : 0;
      toiletLidRef.current.rotation.x = THREE.MathUtils.damp(
        toiletLidRef.current.rotation.x,
        targetAngle,
        6.0,
        delta
      );
    }
  });

  return (
    <group>
      {/* -------------------- 1. FLUTED TRAVERTINE PEDESTAL VANITY -------------------- */}
      <group position={[-5.0, 0, 4.7]} rotation={[0, Math.PI, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.48, 0.45, 0.26]} position={[0, 0.45, 0]} />
        </RigidBody>

        {/* Fluted Travertine Monolith Pedestal Body */}
        <RoundedBox args={[0.92, 0.82, 0.48]} radius={0.03} smoothness={3} position={[0, 0.41, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={colors.travertine} roughness={0.4} />
        </RoundedBox>

        {/* Brushed Brass Reveal Collar */}
        <mesh position={[0, 0.83, 0]}>
          <boxGeometry args={[0.88, 0.02, 0.44]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Honed Stone Top & Integrated Sculptural Basin */}
        <RoundedBox args={[0.96, 0.06, 0.52]} radius={0.02} smoothness={3} position={[0, 0.87, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={colors.travertine} roughness={0.35} />
        </RoundedBox>

        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.22, 0.18, 0.12, 24]} />
          <meshStandardMaterial color="#FAF9F6" roughness={0.3} />
        </mesh>

        {/* Brushed Brass Wall-Mount Spout & Lever */}
        <group position={[0, 1.15, -0.22]}>
          <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.16, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh position={[0.14, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.03, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
          </mesh>
        </group>

        {/* Arch-Top Backlit LED Vanity Mirror */}
        <group position={[0, 1.65, -0.21]}>
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[0.58, 0.98]} />
            <meshBasicMaterial color="#FFF1CC" />
          </mesh>
          <RoundedBox args={[0.56, 0.96, 0.02]} radius={0.08} smoothness={4} position={[0, 0, 0]} castShadow>
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </RoundedBox>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.52, 0.92]} />
            <meshPhysicalMaterial
              color="#F0F4F8"
              roughness={0.03}
              metalness={0.95}
              clearcoat={1.0}
              reflectivity={1.0}
            />
          </mesh>
        </group>

        {/* Soap Dispenser & Luxury Candle */}
        <LuxurySoapDispenser position={[0.32, 0.9, 0.05]} />
        <ScentedGlassCandle position={[-0.32, 0.9, 0.05]} height={0.08} radius={0.035} />
      </group>

      {/* -------------------- 2. MINIMALIST WALL-HUNG TOILET WITH LID -------------------- */}
      <group position={[-6.22, 0, 3.8]} rotation={[0, Math.PI / 2, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.22, 0.3, 0.3]} position={[0, 0.3, 0]} />
        </RigidBody>

        {/* Dual Flush Brass Wall Plate */}
        <mesh position={[0, 0.95, -0.26]}>
          <boxGeometry args={[0.22, 0.15, 0.02]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        <RoundedBox args={[0.36, 0.34, 0.52]} radius={0.04} smoothness={3} position={[0, 0.42, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#FAF9F6" roughness={0.2} />
        </RoundedBox>

        {/* Toilet Lid Toggle */}
        <group
          ref={toiletLidRef}
          position={[0, 0.6, -0.2]}
          userData={{
            interactable: true,
            interactableId: 'powder-toilet-lid',
            label: toiletLidOpen ? 'Close Toilet Lid' : 'Open Toilet Lid',
            onInteract: toggleToiletLid,
          }}
        >
          <RoundedBox args={[0.34, 0.03, 0.44]} radius={0.015} smoothness={3} position={[0, 0.015, 0.22]} castShadow>
            <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
          </RoundedBox>
        </group>
      </group>

      {/* -------------------- 3. POWDER ROOM LIGHT SWITCH -------------------- */}
      <group
        position={[-3.6, 1.35, 3.2]}
        rotation={[0, -Math.PI / 2, 0]}
        userData={{
          interactable: true,
          interactableId: 'powder-light-switch',
          label: isPowderLightOn ? 'Turn Off Powder Room Lights' : 'Turn On Powder Room Lights',
          onInteract: () => togglePowderLight('powder_room'),
        }}
      >
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.12, 0.015]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[0.025, 0.045, 0.01]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.035, 0.01]}>
          <circleGeometry args={[0.004, 16]} />
          <meshBasicMaterial color={isPowderLightOn ? '#4ADE80' : '#E5E7EB'} />
        </mesh>
      </group>
    </group>
  );
};
