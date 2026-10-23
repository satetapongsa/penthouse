'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import {
  getCalacattaMarbleTexture,
  getPaleOakTexture,
  LUXURY_PALETTE,
} from '@/lib/materials';
import { useGameStore } from '@/store/useGameStore';

export const MasterBathroomFurniture: React.FC = () => {
  const marbleTex = useMemo(() => getCalacattaMarbleTexture(), []);
  const oakTex = useMemo(() => getPaleOakTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  // Zustand Store Interactions
  const faucetRunning = useGameStore((s) => s.faucetRunning);
  const toggleFaucet = useGameStore((s) => s.toggleFaucet);
  const showerRunning = useGameStore((s) => s.showerRunning);
  const toggleShower = useGameStore((s) => s.toggleShower);
  const toiletLidOpen = useGameStore((s) => s.toiletLidOpen);
  const toggleToiletLid = useGameStore((s) => s.toggleToiletLid);
  const isBathLightOn = useGameStore((s) => s.lightingStates.master_bathroom ?? true);
  const toggleBathLight = useGameStore((s) => s.toggleRoomLight);
  const isWindowOpen = useGameStore((s) => s.windowStates.master_bathroom ?? false);
  const toggleWindow = useGameStore((s) => s.toggleWindow);

  // Animated Nodes
  const toiletLidRef = useRef<THREE.Group>(null);
  const windowTiltRef = useRef<THREE.Group>(null);
  const showerStreamRef = useRef<THREE.Group>(null);
  const steamGroupRef = useRef<THREE.Group>(null);
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

    // 4. Rain Shower Falling Particles & Steam Rise
    if (showerRunning && showerStreamRef.current) {
      showerStreamRef.current.children.forEach((droplet, i) => {
        droplet.position.y -= delta * 5.5;
        if (droplet.position.y < 0.05) {
          droplet.position.y = 3.0 + (i % 5) * 0.1;
        }
      });
    }

    if (showerRunning && steamGroupRef.current) {
      steamGroupRef.current.children.forEach((puff, i) => {
        puff.position.y += delta * 0.6;
        puff.rotation.z += delta * 0.2;
        if (puff.position.y > 2.8) {
          puff.position.y = 0.4 + (i % 4) * 0.3;
        }
      });
    }
  });

  return (
    <group>
      {/* -------------------- 1. DOUBLE VANITY WITH TWO ARROWED MIRRORS & FAUCETS -------------------- */}
      <group position={[-8.5, 0, 0.35]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.3, 0.44, 0.29]} position={[0, 0.44, 0]} />
        </RigidBody>

        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.56, 0.76, 0.56]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[2.52, 0.04, 0.52]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        <mesh position={[0, 0.81, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.6, 0.06, 0.58]} />
          <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.12} clearcoat={0.9} />
        </mesh>

        {/* Dual Basins */}
        {[-0.65, 0.65].map((bx, idx) => (
          <group key={`basin-${idx}`} position={[bx, 0.81, 0]}>
            <mesh position={[0, -0.06, 0]}>
              <boxGeometry args={[0.55, 0.14, 0.38]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.15} />
            </mesh>

            {/* Interactive Faucet (Click to toggle water) */}
            <group
              position={[0, 0.22, -0.28]}
              userData={{
                interactable: true,
                interactableId: `bath-faucet-${idx}`,
                label: faucetRunning ? 'Turn Off Water' : 'Turn On Water',
                onInteract: toggleFaucet,
              }}
            >
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.014, 0.014, 0.18, 16]} />
                <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
              </mesh>
              <mesh position={[0, -0.04, 0.12]} castShadow>
                <cylinderGeometry args={[0.01, 0.01, 0.08, 16]} />
                <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
              </mesh>
              {[-0.12, 0.12].map((kx) => (
                <mesh key={`knob-${kx}`} position={[kx, 0, 0.02]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.04, 16]} />
                  <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.2} />
                </mesh>
              ))}

              {/* Real-Time Water Stream Flowing from Spout */}
              {faucetRunning && (
                <group position={[0, -0.16, 0.12]}>
                  <mesh ref={faucetStreamRef}>
                    <cylinderGeometry args={[0.012, 0.016, 0.2, 12]} />
                    <meshPhysicalMaterial
                      color="#CCE5FF"
                      roughness={0.05}
                      transmission={0.95}
                      transparent
                      opacity={0.8}
                    />
                  </mesh>
                  {/* Water Puddle in Basin */}
                  <mesh position={[0, -0.08, 0]}>
                    <cylinderGeometry args={[0.09, 0.09, 0.01, 16]} />
                    <meshPhysicalMaterial
                      color="#B8DEFF"
                      roughness={0.02}
                      transmission={0.9}
                      transparent
                      opacity={0.7}
                    />
                  </mesh>
                </group>
              )}
            </group>

            {/* Arched Backlit Brass Mirror */}
            <group position={[0, 0.85, -0.32]}>
              <mesh>
                <planeGeometry args={[0.62, 1.1]} />
                <meshPhysicalMaterial color="#F0F4F8" roughness={0.03} metalness={0.95} clearcoat={1.0} reflectivity={1.0} />
              </mesh>
              <mesh position={[0, 0, -0.01]}>
                <boxGeometry args={[0.66, 1.14, 0.02]} />
                <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
              </mesh>
              {isBathLightOn && (
                <pointLight position={[0, 0, 0.1]} color="#FFF2DA" intensity={0.9} distance={2.5} />
              )}
            </group>
          </group>
        ))}

        {/* Rolled Towels & Orchid */}
        <group position={[0, 0.86, 0.05]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.08, 0.12, 16]} />
            <meshStandardMaterial color="#D6CBB8" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.16, 0]} castShadow>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* -------------------- 2. SCULPTURAL BATHTUB -------------------- */}
      <group position={[-7.7, 0, 3.6]} rotation={[0, -Math.PI / 8, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.9, 0.35, 0.45]} position={[0, 0.35, 0]} />
        </RigidBody>
        <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.48, 0.4, 0.64, 32]} />
          <meshPhysicalMaterial color="#FAFAF8" roughness={0.25} clearcoat={0.6} clearcoatRoughness={0.2} />
        </mesh>
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.44, 0.36, 0.2, 32]} />
          <meshPhysicalMaterial color="#D8EEF5" roughness={0.05} transmission={0.85} transparent opacity={0.6} />
        </mesh>

        <group position={[-0.6, 0, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.025, 0.9, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh position={[0.12, 0.9, 0]} rotation={[0, 0, -Math.PI / 3]} castShadow>
            <cylinderGeometry args={[0.015, 0.018, 0.28, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
          </mesh>
        </group>
      </group>

      {/* -------------------- 3. WALK-IN RAIN SHOWER (INTERACTIVE) -------------------- */}
      <group position={[-7.1, 0, 1.5]}>
        {/* Glass Partition */}
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[0.02, 3.0, 1.4]} />
          <meshPhysicalMaterial color="#E8F4F8" roughness={0.03} transmission={0.94} thickness={0.02} transparent opacity={0.3} />
        </mesh>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.02, 1.5, 0.7]} position={[0, 1.5, 0]} />
        </RigidBody>

        {/* Rain Shower Head */}
        <group position={[0.3, 3.1, 0]}>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.3, 12]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.02, 32]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
          </mesh>
        </group>

        {/* Thermostatic Brass Shower Valve (Interactive) */}
        <group
          position={[0.55, 1.1, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          userData={{
            interactable: true,
            interactableId: 'bath-shower',
            label: showerRunning ? 'Stop Shower' : 'Start Rain Shower',
            onInteract: toggleShower,
          }}
        >
          <mesh castShadow>
            <boxGeometry args={[0.12, 0.24, 0.02]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.04, 0.025]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.03, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.15} />
          </mesh>
        </group>

        {/* Falling Rain Water Droplets when Shower Running */}
        {showerRunning && (
          <group ref={showerStreamRef} position={[0.3, 0, 0]}>
            {[-0.12, -0.06, 0, 0.06, 0.12].map((rx) =>
              [-0.12, -0.06, 0, 0.06, 0.12].map((rz) => (
                <mesh key={`drop-${rx}-${rz}`} position={[rx, 1.8 + Math.random(), rz]}>
                  <cylinderGeometry args={[0.003, 0.003, 0.25, 6]} />
                  <meshPhysicalMaterial
                    color="#D8EEF8"
                    roughness={0.05}
                    transmission={0.95}
                    transparent
                    opacity={0.7}
                  />
                </mesh>
              ))
            )}
          </group>
        )}

        {/* Rising Steam Mist when Shower Running */}
        {showerRunning && (
          <group ref={steamGroupRef} position={[0.3, 0.8, 0]}>
            {[0, 1, 2, 3].map((sidx) => (
              <mesh key={`steam-${sidx}`} position={[(sidx % 2 - 0.5) * 0.2, sidx * 0.4, ((sidx > 1 ? 1 : -1) * 0.2)]}>
                <sphereGeometry args={[0.3 + sidx * 0.05, 12, 12]} />
                <meshStandardMaterial color="#FFFFFF" roughness={1.0} transparent opacity={0.15} />
              </mesh>
            ))}
          </group>
        )}
      </group>

      {/* -------------------- 4. WALL-HUNG TOILET WITH OPENABLE LID -------------------- */}
      <group position={[-9.8, 0, 4.3]} rotation={[0, Math.PI / 2, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.22, 0.3, 0.3]} position={[0, 0.3, 0]} />
        </RigidBody>

        <mesh position={[0, 0.95, -0.28]}>
          <boxGeometry args={[0.24, 0.16, 0.02]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.38, 0.36, 0.54]} />
          <meshStandardMaterial color="#FAF9F6" roughness={0.2} />
        </mesh>

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
          <mesh position={[0, 0.015, 0.24]} castShadow>
            <boxGeometry args={[0.36, 0.03, 0.48]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
          </mesh>
        </group>
      </group>

      {/* -------------------- 5. FROSTED HIGH WINDOW (OPENABLE TILT) -------------------- */}
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

      {/* -------------------- 6. BATHROOM WALL LIGHT SWITCH -------------------- */}
      {/* Positioned on West wall near wardrobe sliding door (X = -10.45, Y = 1.35, Z = 2.0) */}
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
    </group>
  );
};
