'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { LUXURY_PALETTE } from '@/lib/materials';
import { useGameStore } from '@/store/useGameStore';

export const PowderRoomFurniture: React.FC = () => {
  const colors = LUXURY_PALETTE.colors;

  const faucetRunning = useGameStore((s) => s.faucetRunning);
  const toggleFaucet = useGameStore((s) => s.toggleFaucet);
  const toiletLidOpen = useGameStore((s) => s.toiletLidOpen);
  const toggleToiletLid = useGameStore((s) => s.toggleToiletLid);
  const isPowderLightOn = useGameStore((s) => s.lightingStates.powder_room ?? true);
  const togglePowderLight = useGameStore((s) => s.toggleRoomLight);

  const toiletLidRef = useRef<THREE.Group>(null);
  const waterStreamRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (toiletLidRef.current) {
      const targetAngle = toiletLidOpen ? -Math.PI / 1.8 : 0;
      toiletLidRef.current.rotation.x = THREE.MathUtils.damp(
        toiletLidRef.current.rotation.x,
        targetAngle,
        6.0,
        delta
      );
    }
    if (waterStreamRef.current) {
      waterStreamRef.current.scale.x = 0.9 + Math.sin(state.clock.elapsedTime * 25) * 0.15;
    }
  });

  return (
    <group>
      {/* -------------------- 1. MONOLITHIC STONE BASIN VANITY -------------------- */}
      <group position={[-5.0, 0, 2.32]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.38, 0.44, 0.25]} position={[0, 0.44, 0]} />
        </RigidBody>

        <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.74, 0.86, 0.48]} />
          <meshStandardMaterial color={colors.travertine} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.88, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.76, 0.04, 0.5]} />
          <meshStandardMaterial color={colors.travertine} roughness={0.35} />
        </mesh>

        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.18, 0.14, 0.08, 24]} />
          <meshStandardMaterial color="#FAF9F6" roughness={0.3} />
        </mesh>

        {/* Interactive Powder Faucet */}
        <group
          position={[0, 1.12, -0.24]}
          userData={{
            interactable: true,
            interactableId: 'powder-faucet',
            label: faucetRunning ? 'Turn Off Water' : 'Turn On Water',
            onInteract: toggleFaucet,
          }}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.16, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh position={[0, -0.04, 0.1]} castShadow>
            <cylinderGeometry args={[0.009, 0.009, 0.06, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh position={[0.1, 0, 0.01]}>
            <cylinderGeometry args={[0.018, 0.018, 0.03, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.2} />
          </mesh>

          {/* Flowing Water Stream */}
          {faucetRunning && (
            <mesh ref={waterStreamRef} position={[0, -0.15, 0.1]}>
              <cylinderGeometry args={[0.008, 0.012, 0.18, 12]} />
              <meshPhysicalMaterial color="#CCE5FF" roughness={0.05} transmission={0.95} transparent opacity={0.8} />
            </mesh>
          )}
        </group>

        {/* Backlit Mirror */}
        <group position={[0, 1.8, -0.23]}>
          <mesh>
            <planeGeometry args={[0.52, 1.1]} />
            <meshPhysicalMaterial color="#F0F4F8" roughness={0.03} metalness={0.95} clearcoat={1.0} reflectivity={1.0} />
          </mesh>
          <mesh position={[0, 0, -0.01]}>
            <boxGeometry args={[0.56, 1.14, 0.02]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          {isPowderLightOn && (
            <pointLight position={[0, 0, 0.12]} color="#FFF0D4" intensity={0.9} distance={2.5} />
          )}
        </group>

        {/* Diffuser */}
        <group position={[-0.24, 0.93, 0.05]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.03, 0.035, 0.08, 16]} />
            <meshPhysicalMaterial color="#38322B" roughness={0.2} transmission={0.6} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.003, 0.003, 0.18, 8]} />
            <meshStandardMaterial color="#8C7D6B" roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* -------------------- 2. WALL-HUNG TOILET WITH LID -------------------- */}
      <group position={[-6.22, 0, 3.8]} rotation={[0, Math.PI / 2, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.22, 0.3, 0.3]} position={[0, 0.3, 0]} />
        </RigidBody>

        <mesh position={[0, 0.95, -0.26]}>
          <boxGeometry args={[0.22, 0.15, 0.02]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.36, 0.34, 0.52]} />
          <meshStandardMaterial color="#FAF9F6" roughness={0.2} />
        </mesh>

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
          <mesh position={[0, 0.015, 0.22]} castShadow>
            <boxGeometry args={[0.34, 0.03, 0.44]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
          </mesh>
        </group>
      </group>

      {/* -------------------- 3. POWDER ROOM LIGHT SWITCH -------------------- */}
      {/* Positioned on East wall near door from foyer (X = -3.6, Y = 1.35, Z = 3.2) */}
      <group
        position={[-3.6, 1.35, 3.2]}
        rotation={[0, -Math.PI / 2, 0]}
        userData={{
          interactable: true,
          interactableId: 'powder-light-switch',
          label: isPowderLightOn ? 'Turn Off Powder Lights' : 'Turn On Powder Lights',
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
