'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import {
  getPaleOakTexture,
  getBoucleFabricTexture,
  LUXURY_PALETTE,
} from '@/lib/materials';
import { useGameStore } from '@/store/useGameStore';

export const MasterBedroomFurniture: React.FC = () => {
  const oakTex = useMemo(() => getPaleOakTexture(), []);
  const boucleTex = useMemo(() => getBoucleFabricTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  // Zustand Store Interactions
  const enterLying = useGameStore((s) => s.enterLying);
  const isBedroomLightOn = useGameStore((s) => s.lightingStates.master_bedroom ?? true);
  const toggleBedroomLight = useGameStore((s) => s.toggleRoomLight);
  const isWindowOpen = useGameStore((s) => s.windowStates.master_bedroom ?? false);
  const toggleWindow = useGameStore((s) => s.toggleWindow);
  const areCurtainsClosed = useGameStore((s) => s.curtainStates.master_bedroom ?? false);
  const toggleCurtains = useGameStore((s) => s.toggleCurtains);

  // References for Breeze & Curtain Animation
  const curtainsLeftRef = useRef<THREE.Group>(null);
  const curtainsRightRef = useRef<THREE.Group>(null);
  const windowSashRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Sliding Window Sash Animation
    if (windowSashRef.current) {
      const targetZ = isWindowOpen ? 0.9 : 0;
      windowSashRef.current.position.z = THREE.MathUtils.damp(
        windowSashRef.current.position.z,
        targetZ,
        4.5,
        delta
      );
    }

    // 2. Curtains Animation & Wind Flutter
    const breeze = isWindowOpen ? Math.sin(time * 3.8) * 0.05 : 0;
    if (curtainsLeftRef.current) {
      const targetScaleZ = areCurtainsClosed ? 2.5 : 0.85;
      curtainsLeftRef.current.scale.z = THREE.MathUtils.damp(curtainsLeftRef.current.scale.z, targetScaleZ, 3.5, delta);
      curtainsLeftRef.current.rotation.x = breeze;
    }
    if (curtainsRightRef.current) {
      const targetScaleZ = areCurtainsClosed ? 2.5 : 0.85;
      curtainsRightRef.current.scale.z = THREE.MathUtils.damp(curtainsRightRef.current.scale.z, targetScaleZ, 3.5, delta);
      curtainsRightRef.current.rotation.x = -breeze;
    }
  });

  return (
    <group>
      {/* -------------------- 1. PLUSH WOVEN BEDROOM RUG -------------------- */}
      <mesh position={[-9.2, 0.007, -1.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.2, 3.6]} />
        <meshStandardMaterial color="#EAE4D8" map={boucleTex} roughness={0.9} />
      </mesh>

      {/* -------------------- 2. KING BED (INTERACTIVE LIE DOWN) -------------------- */}
      <group
        position={[-9.2, 0, -1.35]}
        userData={{
          interactable: true,
          interactableId: 'master-bed',
          label: 'Lie Down on Bed',
          onInteract: () => {
            enterLying({
              position: [-9.2, 0.58, -0.9],
              eyeHeight: 0.35,
              pitch: -0.95,
              yaw: 0,
              returnPosition: [-7.5, 1.8, -1.8],
              returnYaw: -Math.PI / 2,
            });
          },
        }}
      >
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.15, 0.45, 1.15]} position={[0, 0.45, 0]} />
        </RigidBody>

        {/* Headboard */}
        <mesh position={[0, 0.8, 1.15]} castShadow receiveShadow>
          <boxGeometry args={[2.6, 1.6, 0.16]} />
          <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.8, 1.15]}>
          <boxGeometry args={[2.64, 1.64, 0.14]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
        </mesh>

        {/* Bed Frame & Brass Plinth */}
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.44, 2.2]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[2.14, 0.06, 2.14]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* King Mattress & Ivory Linen Duvet */}
        <mesh position={[0, 0.52, 0.05]} castShadow receiveShadow>
          <boxGeometry args={[2.08, 0.28, 2.05]} />
          <meshStandardMaterial color="#FAF8F5" roughness={0.85} />
        </mesh>

        {/* Folded Draped Cashmere Throw */}
        <mesh position={[0, 0.67, -0.65]} rotation={[-0.05, 0, 0]} castShadow>
          <boxGeometry args={[2.1, 0.04, 0.7]} />
          <meshStandardMaterial color="#C5B19D" roughness={0.9} />
        </mesh>

        {/* Luxury Pillows */}
        {[-0.55, 0.55].map((px, idx) => (
          <mesh key={`back-pillow-${idx}`} position={[px, 0.76, 0.88]} rotation={[0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.75, 0.42, 0.18]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.85} />
          </mesh>
        ))}
        {[-0.55, 0.55].map((px, idx) => (
          <mesh key={`mid-pillow-${idx}`} position={[px, 0.73, 0.68]} rotation={[0.35, 0, 0]} castShadow>
            <boxGeometry args={[0.7, 0.38, 0.16]} />
            <meshStandardMaterial color="#F3EDE3" roughness={0.8} />
          </mesh>
        ))}
        <mesh position={[-0.45, 0.7, 0.5]} rotation={[0.4, 0.1, 0]} castShadow>
          <boxGeometry args={[0.45, 0.35, 0.14]} />
          <meshStandardMaterial color={colors.pillowSage} roughness={0.8} />
        </mesh>
        <mesh position={[0.45, 0.7, 0.5]} rotation={[0.4, -0.1, 0]} castShadow>
          <boxGeometry args={[0.45, 0.35, 0.14]} />
          <meshStandardMaterial color={colors.pillowGold} roughness={0.8} />
        </mesh>

        {/* -------------------- TWO NIGHTSTANDS & BEDSIDE LAMPS -------------------- */}
        {/* Left Nightstand */}
        <group position={[-1.6, 0, 0.95]}>
          <RigidBody type="fixed" colliders={false}>
            <CuboidCollider args={[0.3, 0.28, 0.25]} position={[0, 0.28, 0]} />
          </RigidBody>
          <mesh position={[0, 0.26, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.58, 0.52, 0.48]} />
            <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.53, 0]} castShadow>
            <boxGeometry args={[0.6, 0.02, 0.5]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.68, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 0.28, 24]} />
            <meshStandardMaterial color={colors.travertine} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.92, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.22, 0.24, 24]} />
            <meshStandardMaterial color="#FFFDF9" roughness={0.3} />
          </mesh>
          {isBedroomLightOn && (
            <pointLight position={[0, 0.92, 0]} color="#FFF0D4" intensity={0.7} distance={3.5} />
          )}
        </group>

        {/* Right Nightstand */}
        <group position={[1.6, 0, 0.95]}>
          <RigidBody type="fixed" colliders={false}>
            <CuboidCollider args={[0.3, 0.28, 0.25]} position={[0, 0.28, 0]} />
          </RigidBody>
          <mesh position={[0, 0.26, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.58, 0.52, 0.48]} />
            <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.53, 0]} castShadow>
            <boxGeometry args={[0.6, 0.02, 0.5]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.68, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 0.28, 24]} />
            <meshStandardMaterial color={colors.travertine} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.92, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.22, 0.24, 24]} />
            <meshStandardMaterial color="#FFFDF9" roughness={0.3} />
          </mesh>
          {isBedroomLightOn && (
            <pointLight position={[0, 0.92, 0]} color="#FFF0D4" intensity={0.7} distance={3.5} />
          )}
        </group>
      </group>

      {/* -------------------- 3. READING ARMCHAIR & FLOOR LAMP -------------------- */}
      <group position={[-13.2, 0, -4.5]} rotation={[0, Math.PI / 4, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.45, 0.4, 0.45]} position={[0, 0.4, 0]} />
        </RigidBody>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.08, 32]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.46, 0.42, 0.4, 32]} />
          <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.58, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[0.82, 0.44, 0.26]} />
          <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.44, 0.14]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.22, 0.12]} />
          <meshStandardMaterial color={colors.pillowTerracotta} roughness={0.8} />
        </mesh>

        <group position={[-0.65, 0, 0.2]}>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.04, 24]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 1.6, 12]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0.15, 1.55, 0]} rotation={[0, 0, -0.4]} castShadow>
            <cylinderGeometry args={[0.08, 0.14, 0.18, 24]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          {isBedroomLightOn && (
            <pointLight position={[0.2, 1.48, 0]} color="#FFE8BA" intensity={0.8} distance={3} />
          )}
        </group>
      </group>

      {/* -------------------- 4. VANITY DESK & ARMORED MIRROR -------------------- */}
      <group position={[-14.15, 0, -2.2]} rotation={[0, Math.PI / 2, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.65, 0.4, 0.24]} position={[0, 0.4, 0]} />
        </RigidBody>
        <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.06, 0.48]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.775, 0]}>
          <boxGeometry args={[1.32, 0.01, 0.5]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
        {[-0.58, 0.58].map((vx) =>
          [-0.18, 0.18].map((vz) => (
            <mesh key={`vanity-leg-${vx}-${vz}`} position={[vx, 0.35, vz]} castShadow>
              <cylinderGeometry args={[0.018, 0.025, 0.72, 16]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
          ))
        )}

        <group position={[0, 1.45, -0.22]}>
          <mesh>
            <planeGeometry args={[0.7, 0.9]} />
            <meshPhysicalMaterial color="#F0F4F8" roughness={0.03} metalness={0.95} clearcoat={1.0} reflectivity={1.0} />
          </mesh>
          <mesh position={[0, 0, -0.01]}>
            <boxGeometry args={[0.74, 0.94, 0.02]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          {isBedroomLightOn && (
            <pointLight position={[0, 0.2, 0.15]} color="#FFF3DD" intensity={1.1} distance={2.5} />
          )}
        </group>

        {/* Stool */}
        <group position={[0, 0, 0.5]}>
          <mesh position={[0, 0.24, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.42, 24]} />
            <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.23, 0.23, 0.08, 24]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* -------------------- 5. OPENABLE WEST WINDOW & CURTAINS -------------------- */}
      {/* Positioned on West bedroom facade (X = -14.42, Z: -4.8 to -3.2) */}
      <group position={[-14.42, 0, -4.0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Curtains Track */}
        <mesh position={[0, 3.32, 0.15]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 2.8, 16]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Curtains Toggle Area */}
        <group
          position={[0, 1.7, 0.16]}
          userData={{
            interactable: true,
            interactableId: 'bedroom-curtains',
            label: areCurtainsClosed ? 'Draw Open Bedroom Curtains' : 'Pull Closed Bedroom Curtains',
            onInteract: toggleCurtains,
          }}
        >
          <group ref={curtainsLeftRef} position={[-1.1, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.5, 3.2, 0.06]} />
              <meshStandardMaterial color="#FAF7F2" roughness={0.85} transparent opacity={0.85} />
            </mesh>
          </group>
          <group ref={curtainsRightRef} position={[1.1, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.5, 3.2, 0.06]} />
              <meshStandardMaterial color="#FAF7F2" roughness={0.85} transparent opacity={0.85} />
            </mesh>
          </group>
        </group>

        {/* Sliding Window Sash */}
        <group
          ref={windowSashRef}
          position={[0, 1.7, 0]}
          userData={{
            interactable: true,
            interactableId: 'bedroom-window',
            label: isWindowOpen ? 'Close Bedroom Window' : 'Open Bedroom Window',
            onInteract: () => toggleWindow('master_bedroom'),
          }}
        >
          <mesh>
            <boxGeometry args={[1.2, 3.2, 0.04]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.1, 3.1, 0.02]} />
            <meshPhysicalMaterial color="#E8F1F5" roughness={0.05} transmission={0.94} transparent opacity={0.35} />
          </mesh>
        </group>
      </group>

      {/* -------------------- 6. MASTER SUITE WALL LIGHT SWITCH -------------------- */}
      {/* Positioned on East wall next to hallway door (X = -6.55, Y = 1.35, Z = -2.4) */}
      <group
        position={[-6.55, 1.35, -2.4]}
        rotation={[0, -Math.PI / 2, 0]}
        userData={{
          interactable: true,
          interactableId: 'bedroom-light-switch',
          label: isBedroomLightOn ? 'Turn Off Suite Lights' : 'Turn On Suite Lights',
          onInteract: () => toggleBedroomLight('master_bedroom'),
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
          <meshBasicMaterial color={isBedroomLightOn ? '#4ADE80' : '#E5E7EB'} />
        </mesh>
      </group>
    </group>
  );
};
