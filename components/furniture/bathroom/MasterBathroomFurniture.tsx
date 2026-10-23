'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';
import {
  getCalacattaMarbleTexture,
  getPaleOakTexture,
  getBoucleFabricTexture,
  LUXURY_PALETTE,
} from '@/lib/materials';
import { useGameStore } from '@/store/useGameStore';
import { HeatedTowelRail, LuxurySoapDispenser } from '../decor/PlumbingDetails';
import { MasterBathroomSpa } from './MasterBathroomSpa';

export const MasterBathroomFurniture: React.FC = () => {
  const marbleTex = useMemo(() => getCalacattaMarbleTexture(), []);
  const oakTex = useMemo(() => getPaleOakTexture(), []);
  const boucleTex = useMemo(() => getBoucleFabricTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  const faucetRunning = useGameStore((s) => s.faucetRunning);
  const toggleFaucet = useGameStore((s) => s.toggleFaucet);
  const toiletLidOpen = useGameStore((s) => s.toiletLidOpen);
  const toggleToiletLid = useGameStore((s) => s.toggleToiletLid);
  const isBathLightOn = useGameStore((s) => s.lightingStates.master_bathroom ?? true);
  const toggleBathLight = useGameStore((s) => s.toggleRoomLight);
  const isWindowOpen = useGameStore((s) => s.windowStates.master_bathroom ?? false);
  const toggleWindow = useGameStore((s) => s.toggleWindow);

  const toiletLidRef = useRef<THREE.Group>(null);
  const windowTiltRef = useRef<THREE.Group>(null);
  const faucetStreamRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Toilet Lid Smooth Rotation
    if (toiletLidRef.current) {
      const targetAngle = toiletLidOpen ? -Math.PI / 1.8 : 0;
      toiletLidRef.current.rotation.x = THREE.MathUtils.damp(
        toiletLidRef.current.rotation.x,
        targetAngle,
        6.0,
        delta
      );
    }

    // 2. Bathroom Window Tilt
    if (windowTiltRef.current) {
      const targetTilt = isWindowOpen ? 0.35 : 0;
      windowTiltRef.current.rotation.x = THREE.MathUtils.damp(
        windowTiltRef.current.rotation.x,
        targetTilt,
        4.5,
        delta
      );
    }

    // 3. Flowing Water Faucet Pulse
    if (faucetStreamRef.current) {
      faucetStreamRef.current.scale.x = 0.9 + Math.sin(time * 25) * 0.15;
      faucetStreamRef.current.scale.z = 0.9 + Math.cos(time * 25) * 0.15;
    }
  });

  return (
    <group>
      {/* -------------------- 1. DOUBLE VANITY WITH ARCHED LED MIRRORS -------------------- */}
      <group position={[-8.5, 0, 0.35]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.3, 0.44, 0.29]} position={[0, 0.44, 0]} />
        </RigidBody>

        {/* Fluted Pale Oak Vanity Credenza */}
        <RoundedBox args={[2.56, 0.76, 0.56]} radius={0.02} smoothness={3} position={[0, 0.4, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </RoundedBox>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[2.52, 0.04, 0.52]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Calacatta Gold Marble Slab Countertop */}
        <RoundedBox args={[2.6, 0.06, 0.58]} radius={0.015} smoothness={3} position={[0, 0.81, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.12} clearcoat={0.9} />
        </RoundedBox>

        {/* Dual Undermount Basins & Wall Faucets */}
        {[-0.65, 0.65].map((bx, idx) => (
          <group key={`basin-${idx}`} position={[bx, 0.81, 0]}>
            <mesh position={[0, -0.06, 0]}>
              <boxGeometry args={[0.55, 0.14, 0.38]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.15} />
            </mesh>

            {/* Interactive Brass Gooseneck Faucet */}
            <group
              position={[0, 0.05, -0.22]}
              userData={{
                interactable: true,
                interactableId: `bath-faucet-${idx}`,
                label: faucetRunning ? 'Turn Off Tap' : 'Turn On Tap',
                onInteract: toggleFaucet,
              }}
            >
              <mesh castShadow>
                <cylinderGeometry args={[0.012, 0.012, 0.24, 16]} />
                <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
              </mesh>
              <mesh position={[0, 0.14, 0.08]} rotation={[Math.PI / 2.8, 0, 0]} castShadow>
                <cylinderGeometry args={[0.01, 0.01, 0.18, 16]} />
                <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
              </mesh>
            </group>

            {/* Flowing Water Mesh on Left Faucet */}
            {idx === 0 && faucetRunning && (
              <mesh ref={faucetStreamRef} position={[0, -0.01, -0.08]}>
                <cylinderGeometry args={[0.007, 0.007, 0.16, 12]} />
                <meshPhysicalMaterial color="#C5E8F8" roughness={0.05} transmission={0.95} transparent opacity={0.8} />
              </mesh>
            )}

            {/* Arched Backlit LED Vanity Mirror */}
            <group position={[0, 1.25, -0.27]}>
              {/* Backlit Halo Glow */}
              <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[0.66, 1.06]} />
                <meshBasicMaterial color="#FFF1CC" />
              </mesh>
              {/* Beveled Brass Rim */}
              <mesh castShadow>
                <boxGeometry args={[0.64, 1.04, 0.02]} />
                <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
              </mesh>
              {/* High Reflective Mirror Face */}
              <mesh position={[0, 0, 0.012]}>
                <planeGeometry args={[0.6, 1.0]} />
                <meshPhysicalMaterial
                  color="#F4F8FA"
                  roughness={0.03}
                  metalness={0.95}
                  clearcoat={1.0}
                  clearcoatRoughness={0.05}
                  reflectivity={1.0}
                />
              </mesh>
            </group>
          </group>
        ))}

        {/* Soap Dispensers & Vanity Amenities */}
        <LuxurySoapDispenser position={[-0.2, 0.84, 0.12]} />
        <LuxurySoapDispenser position={[0.2, 0.84, 0.12]} />

        {/* Grooming Vanity Stool with Bouclé Cushion */}
        <group position={[0, 0, 0.72]}>
          <RigidBody type="fixed" colliders={false}>
            <CuboidCollider args={[0.22, 0.24, 0.22]} position={[0, 0.24, 0]} />
          </RigidBody>
          <RoundedBox args={[0.42, 0.08, 0.42]} radius={0.03} smoothness={3} position={[0, 0.44, 0]} castShadow>
            <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
          </RoundedBox>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.18, 0.2, 0.42, 20]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.22} />
          </mesh>
        </group>
      </group>

      {/* -------------------- 2. HEATED TOWEL LADDER RAIL -------------------- */}
      <HeatedTowelRail position={[-10.42, 0.4, 4.0]} rotationY={Math.PI / 2} />

      {/* -------------------- 3. WALL-HUNG TOILET WITH OPENABLE LID -------------------- */}
      <group position={[-9.8, 0, 4.3]} rotation={[0, Math.PI / 2, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.22, 0.3, 0.3]} position={[0, 0.3, 0]} />
        </RigidBody>

        <mesh position={[0, 0.95, -0.28]}>
          <boxGeometry args={[0.24, 0.16, 0.02]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        <RoundedBox args={[0.38, 0.36, 0.54]} radius={0.04} smoothness={3} position={[0, 0.42, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#FAF9F6" roughness={0.2} />
        </RoundedBox>

        {/* Toilet Seat & Animated Hinged Lid */}
        <group
          ref={toiletLidRef}
          position={[0, 0.61, -0.2]}
          userData={{
            interactable: true,
            interactableId: 'bath-toilet-lid',
            label: toiletLidOpen ? 'Close Toilet Lid' : 'Open Toilet Lid',
            onInteract: toggleToiletLid,
          }}
        >
          <RoundedBox args={[0.36, 0.03, 0.48]} radius={0.015} smoothness={3} position={[0, 0.015, 0.24]} castShadow>
            <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
          </RoundedBox>
        </group>
      </group>

      {/* -------------------- 4. FROSTED HIGH WINDOW (OPENABLE TILT) -------------------- */}
      <group position={[-8.5, 2.4, 4.98]}>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[1.46, 0.71, 0.03]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
        </mesh>
        <group
          ref={windowTiltRef}
          position={[0, -0.3, 0]}
          userData={{
            interactable: true,
            interactableId: 'bath-window',
            label: isWindowOpen ? 'Close Frosted Window' : 'Tilt Open Window',
            onInteract: () => toggleWindow('master_bathroom'),
          }}
        >
          <mesh position={[0, 0.3, 0]}>
            <planeGeometry args={[1.4, 0.65]} />
            <meshPhysicalMaterial color="#EBF4F7" roughness={0.2} transmission={0.85} transparent opacity={0.8} />
          </mesh>
        </group>
      </group>

      {/* -------------------- 5. BATHROOM WALL LIGHT SWITCH -------------------- */}
      <group
        position={[-10.45, 1.35, 2.0]}
        rotation={[0, Math.PI / 2, 0]}
        userData={{
          interactable: true,
          interactableId: 'bath-light-switch',
          label: isBathLightOn ? 'Turn Off Bath Lights' : 'Turn On Bath Lights',
          onInteract: () => toggleBathLight('master_bathroom'),
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
          <meshBasicMaterial color={isBathLightOn ? '#4ADE80' : '#E5E7EB'} />
        </mesh>
      </group>

      {/* -------------------- 6. FREESTANDING TUB & RAIN SHOWER SPA MODULE -------------------- */}
      <MasterBathroomSpa />
    </group>
  );
};
