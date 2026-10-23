'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import {
  getCalacattaMarbleTexture,
  getPaleOakTexture,
  getBoucleFabricTexture,
  LUXURY_PALETTE,
} from '@/lib/materials';
import { useGameStore } from '@/store/useGameStore';
import { DiningTableSet } from './DiningTableSet';

export const KitchenDiningFurniture: React.FC = () => {
  const marbleTex = useMemo(() => getCalacattaMarbleTexture(), []);
  const oakTex = useMemo(() => getPaleOakTexture(), []);
  const boucleTex = useMemo(() => getBoucleFabricTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  const enterSitting = useGameStore((s) => s.enterSitting);
  const cooktopOn = useGameStore((s) => s.cooktopOn);
  const toggleCooktop = useGameStore((s) => s.toggleCooktop);
  const fridgeOpen = useGameStore((s) => s.fridgeOpen);
  const toggleFridge = useGameStore((s) => s.toggleFridge);
  const cabinetOpen = useGameStore((s) => s.kitchenCabinetOpen);
  const toggleCabinet = useGameStore((s) => s.toggleKitchenCabinet);

  const fridgeDoorRef = useRef<THREE.Group>(null);
  const cabinetDoorRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (fridgeDoorRef.current) {
      const targetAngle = fridgeOpen ? Math.PI / 2.2 : 0;
      fridgeDoorRef.current.rotation.y = THREE.MathUtils.damp(fridgeDoorRef.current.rotation.y, targetAngle, 5.0, delta);
    }
    if (cabinetDoorRef.current) {
      const targetAngle = cabinetOpen ? -Math.PI / 2.2 : 0;
      cabinetDoorRef.current.rotation.y = THREE.MathUtils.damp(cabinetDoorRef.current.rotation.y, targetAngle, 5.0, delta);
    }
  });

  return (
    <group>
      {/* -------------------- 1. WATERFALL CALACATTA MARBLE ISLAND -------------------- */}
      <group position={[10.75, 0, -1.0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.8, 0.46, 0.6]} position={[0, 0.46, 0]} />
        </RigidBody>

        <mesh position={[0, 0.89, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.6, 0.06, 1.2]} />
          <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.12} clearcoat={0.9} />
        </mesh>

        <mesh position={[-1.77, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.06, 0.88, 1.2]} />
          <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.12} clearcoat={0.9} />
        </mesh>
        <mesh position={[1.77, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.06, 0.88, 1.2]} />
          <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.12} clearcoat={0.9} />
        </mesh>

        <mesh position={[0, 0.44, 0.12]} castShadow receiveShadow>
          <boxGeometry args={[3.42, 0.84, 0.92]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </mesh>

        <mesh position={[0, 0.04, 0.12]}>
          <boxGeometry args={[3.44, 0.08, 0.88]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
        </mesh>

        {/* Prep Sink & Brass Gooseneck Faucet */}
        <group position={[-0.8, 0.92, 0.05]}>
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[0.55, 0.2, 0.42]} />
            <meshStandardMaterial color="#2B2824" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.16, -0.18]}>
            <cylinderGeometry args={[0.012, 0.012, 0.32, 12]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.32, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.24, 12]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.2} />
          </mesh>
        </group>

        {/* Flush Induction Cooktop (Interactive) */}
        <group
          position={[0.8, 0.925, 0.05]}
          userData={{
            interactable: true,
            interactableId: 'kitchen-cooktop',
            label: cooktopOn ? 'Turn Off Cooktop' : 'Ignite Cooktop',
            onInteract: toggleCooktop,
          }}
        >
          <mesh>
            <boxGeometry args={[0.78, 0.01, 0.52]} />
            <meshPhysicalMaterial color="#111111" roughness={0.1} clearcoat={1.0} reflectivity={0.9} />
          </mesh>
          {[-0.2, 0.2].flatMap((cx) => [
            { x: cx, z: -0.12, r: 0.08 },
            { x: cx, z: 0.12, r: 0.09 },
          ]).map((burn, bidx) => (
            <mesh key={`burner-${bidx}`} position={[burn.x, 0.006, burn.z]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[burn.r - 0.015, burn.r, 24]} />
              <meshBasicMaterial color={cooktopOn ? '#FF4500' : '#444444'} />
            </mesh>
          ))}
          {cooktopOn && (
            <pointLight position={[0, 0.25, 0]} color="#FF6A3D" intensity={1.5} distance={2.5} />
          )}
        </group>

        {/* 4 Bouclé Bar Stools (Interactive Seating) */}
        {[-1.2, -0.4, 0.4, 1.2].map((bx, idx) => (
          <group
            key={`stool-${idx}`}
            position={[bx, 0, -0.78]}
            userData={{
              interactable: true,
              interactableId: `kitchen-stool-${idx}`,
              label: 'Sit at Kitchen Island',
              onInteract: () => {
                enterSitting({
                  position: [10.75 + bx, 0.95, -1.78],
                  eyeHeight: 0.95,
                  pitch: -0.1,
                  yaw: Math.PI,
                  returnPosition: [10.75 + bx, 1.8, -2.4],
                  returnYaw: Math.PI,
                });
              },
            }}
          >
            <mesh position={[0, 0.62, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.19, 0.1, 20]} />
              <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
            </mesh>
            {[[-0.14, -0.14], [0.14, -0.14], [-0.14, 0.14], [0.14, 0.14]].map(([lx, lz], lidx) => (
              <mesh key={`leg-${lidx}`} position={[lx, 0.3, lz]}>
                <cylinderGeometry args={[0.014, 0.01, 0.6, 8]} />
                <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Trio of Brass Pendants */}
        {[-0.9, 0, 0.9].map((px, idx) => (
          <group key={`pendant-${idx}`} position={[px, 2.5, 0]}>
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 0.9, 8]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.14, 0.18, 16]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.22} />
            </mesh>
            <mesh position={[0, -0.1, 0]}>
              <sphereGeometry args={[0.11, 16, 16]} />
              <meshBasicMaterial color="#FFF9E6" />
            </mesh>
          </group>
        ))}
      </group>

      {/* -------------------- 2. BACK KITCHEN CABINETRY BANK & APPLIANCES -------------------- */}
      <group position={[11.0, 0, 1.86]} rotation={[0, Math.PI, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[2.5, 1.7, 0.32]} position={[0, 1.7, 0]} />
        </RigidBody>

        <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.9, 3.4, 0.62]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </mesh>

        <group position={[0, 1.35, 0.28]}>
          <mesh>
            <boxGeometry args={[2.6, 0.9, 0.1]} />
            <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.15} />
          </mesh>
        </group>

        {/* UPPER CABINET (INTERACTIVE) */}
        <group position={[0, 2.35, 0.28]}>
          <mesh position={[0, 0, -0.05]}>
            <boxGeometry args={[1.2, 0.7, 0.3]} />
            <meshStandardMaterial color="#2B2621" roughness={0.6} />
          </mesh>
          <group
            ref={cabinetDoorRef}
            position={[-0.6, 0, 0.12]}
            userData={{
              interactable: true,
              interactableId: 'kitchen-cabinet',
              label: cabinetOpen ? 'Close Cabinet Door' : 'Open Cabinet Door',
              onInteract: toggleCabinet,
            }}
          >
            <mesh position={[0.6, 0, 0]} castShadow>
              <boxGeometry args={[1.2, 0.72, 0.02]} />
              <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
            </mesh>
            <mesh position={[1.1, 0, 0.02]}>
              <boxGeometry args={[0.02, 0.18, 0.02]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        </group>

        {/* REFRIGERATOR (INTERACTIVE) */}
        <group position={[1.75, 1.7, 0.32]}>
          <mesh position={[0, 0, -0.1]}>
            <boxGeometry args={[0.88, 3.2, 0.4]} />
            <meshStandardMaterial color="#F7F7F8" roughness={0.2} />
          </mesh>
          {fridgeOpen && (
            <pointLight position={[0, 0.8, 0.05]} color="#E6F2FF" intensity={2.2} distance={3.5} />
          )}
          <group
            ref={fridgeDoorRef}
            position={[-0.44, 0, 0.08]}
            userData={{
              interactable: true,
              interactableId: 'kitchen-fridge',
              label: fridgeOpen ? 'Close Refrigerator' : 'Open Refrigerator',
              onInteract: toggleFridge,
            }}
          >
            <mesh position={[0.44, 0, 0]} castShadow>
              <boxGeometry args={[0.88, 3.24, 0.04]} />
              <meshStandardMaterial color="#EDE7DD" roughness={0.35} />
            </mesh>
            <mesh position={[0.82, 0, 0.04]}>
              <boxGeometry args={[0.025, 1.4, 0.03]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        </group>
      </group>

      {/* -------------------- 3. GRAND DINING TABLE SUITE -------------------- */}
      <DiningTableSet />
    </group>
  );
};
