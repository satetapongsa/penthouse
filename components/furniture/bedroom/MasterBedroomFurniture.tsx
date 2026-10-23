'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';
import {
  getPaleOakTexture,
  getBoucleFabricTexture,
  getCalacattaMarbleTexture,
  LUXURY_PALETTE,
} from '@/lib/materials';
import { useGameStore } from '@/store/useGameStore';
import { MasterBedroomDecor } from './MasterBedroomDecor';
import { ModernWallSconce } from '../decor/LightingFixtures';

export const MasterBedroomFurniture: React.FC = () => {
  const oakTex = useMemo(() => getPaleOakTexture(), []);
  const boucleTex = useMemo(() => getBoucleFabricTexture(), []);
  const marbleTex = useMemo(() => getCalacattaMarbleTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  const enterLying = useGameStore((s) => s.enterLying);
  const isBedroomLightOn = useGameStore((s) => s.lightingStates.master_bedroom ?? true);
  const toggleBedroomLight = useGameStore((s) => s.toggleRoomLight);
  const isWindowOpen = useGameStore((s) => s.windowStates.master_bedroom ?? false);
  const toggleWindow = useGameStore((s) => s.toggleWindow);
  const areCurtainsClosed = useGameStore((s) => s.curtainStates.master_bedroom ?? false);
  const toggleCurtains = useGameStore((s) => s.toggleCurtains);

  const curtainsLeftRef = useRef<THREE.Group>(null);
  const curtainsRightRef = useRef<THREE.Group>(null);
  const windowSashRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (windowSashRef.current) {
      const targetZ = isWindowOpen ? 0.9 : 0;
      windowSashRef.current.position.z = THREE.MathUtils.damp(
        windowSashRef.current.position.z,
        targetZ,
        4.5,
        delta
      );
    }

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

      {/* -------------------- 2. KING BED (BED HEIGHT 0.55m, INTERACTIVE) -------------------- */}
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

        {/* Fluted Architectural Headboard Panel with Brass Frame */}
        <RoundedBox args={[2.8, 1.7, 0.16]} radius={0.05} smoothness={3} position={[0, 0.85, 1.15]} castShadow receiveShadow>
          <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.85} />
        </RoundedBox>
        <mesh position={[0, 0.85, 1.14]}>
          <boxGeometry args={[2.86, 1.76, 0.14]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Pale Oak Floating Bed Frame with Brass Plinth */}
        <RoundedBox args={[2.2, 0.44, 2.2]} radius={0.03} smoothness={3} position={[0, 0.22, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.55} />
        </RoundedBox>
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[2.14, 0.06, 2.14]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Plush Mattress & Ivory Linen Duvet (Bed Height 0.55m) */}
        <RoundedBox args={[2.08, 0.32, 2.05]} radius={0.06} smoothness={4} position={[0, 0.52, 0.05]} castShadow receiveShadow>
          <meshStandardMaterial color="#FAF8F5" roughness={0.85} />
        </RoundedBox>

        {/* Folded Cashmere Throw at Foot */}
        <RoundedBox args={[2.1, 0.04, 0.7]} radius={0.015} smoothness={3} position={[0, 0.69, -0.65]} rotation={[-0.05, 0, 0]} castShadow>
          <meshStandardMaterial color="#C5B19D" roughness={0.9} />
        </RoundedBox>

        {/* Multi-Layered Puffy Pillows */}
        {[-0.55, 0.55].map((px, idx) => (
          <group key={`pillow-back-${idx}`} position={[px, 0.76, 0.88]} rotation={[0.3, 0, 0]}>
            <RoundedBox args={[0.76, 0.42, 0.18]} radius={0.06} smoothness={4} castShadow>
              <meshStandardMaterial color="#FFFFFF" roughness={0.85} />
            </RoundedBox>
          </group>
        ))}
        {[-0.55, 0.55].map((px, idx) => (
          <group key={`pillow-front-${idx}`} position={[px, 0.73, 0.68]} rotation={[0.35, 0, 0]}>
            <RoundedBox args={[0.7, 0.38, 0.16]} radius={0.05} smoothness={4} castShadow>
              <meshStandardMaterial color="#F3EDE3" roughness={0.8} />
            </RoundedBox>
          </group>
        ))}
        <group position={[-0.45, 0.7, 0.5]} rotation={[0.4, 0.1, 0]}>
          <RoundedBox args={[0.45, 0.35, 0.14]} radius={0.05} smoothness={4} castShadow>
            <meshStandardMaterial color={colors.pillowSage} roughness={0.8} />
          </RoundedBox>
        </group>
      </group>

      {/* -------------------- 3. BESPOKE FLUTED NIGHTSTANDS & LAMPS -------------------- */}
      {[-10.9, -7.5].map((nx, idx) => (
        <group key={`nightstand-${idx}`} position={[nx, 0, -0.2]}>
          <RigidBody type="fixed" colliders={false}>
            <CuboidCollider args={[0.34, 0.28, 0.25]} position={[0, 0.28, 0]} />
          </RigidBody>

          {/* Fluted Body */}
          <RoundedBox args={[0.62, 0.54, 0.44]} radius={0.02} smoothness={3} position={[0, 0.27, 0]} castShadow receiveShadow>
            <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
          </RoundedBox>
          {/* Calacatta Top Slab */}
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[0.64, 0.02, 0.46]} />
            <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.15} clearcoat={0.9} />
          </mesh>
          {/* Brass Drawer Handle */}
          <mesh position={[0, 0.32, 0.225]}>
            <boxGeometry args={[0.12, 0.015, 0.01]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Designer Bedside Table Lamp */}
          <group position={[0, 0.56, 0]}>
            <mesh position={[0, 0.14, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.12, 0.28, 20]} />
              <meshStandardMaterial color={colors.travertine} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.36, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.2, 0.22, 24]} />
              <meshStandardMaterial color="#FAF8F3" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.36, 0]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshBasicMaterial color="#FFECC2" />
            </mesh>
          </group>

          {/* Glass Carafe with Tumbler (Interactive on left nightstand) */}
          {idx === 0 && (
            <group position={[0.18, 0.56, 0.1]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.035, 0.045, 0.14, 16]} />
                <meshPhysicalMaterial color="#E8F4F8" roughness={0.05} transmission={0.92} transparent opacity={0.65} />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* -------------------- 4. WALL SCONCES & LIGHT SWITCH -------------------- */}
      <ModernWallSconce position={[-11.6, 1.8, -0.1]} />
      <ModernWallSconce position={[-6.8, 1.8, -0.1]} />

      <group
        position={[-6.55, 1.35, -2.2]}
        rotation={[0, Math.PI / 2, 0]}
        userData={{
          interactable: true,
          interactableId: 'bed-light-switch',
          label: isBedroomLightOn ? 'Turn Off Bedroom Lights' : 'Turn On Bedroom Lights',
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

      {/* -------------------- 5. OPENABLE WINDOW & DRAPES -------------------- */}
      <group position={[-10.5, 1.7, -5.92]}>
        <group
          ref={windowSashRef}
          userData={{
            interactable: true,
            interactableId: 'master-window',
            label: isWindowOpen ? 'Close Window' : 'Open Horizon Window',
            onInteract: () => toggleWindow('master_bedroom'),
          }}
        >
          <mesh>
            <planeGeometry args={[2.4, 3.3]} />
            <meshPhysicalMaterial color="#E8F1F5" roughness={0.05} transmission={0.92} transparent opacity={0.35} />
          </mesh>
          <mesh position={[1.15, 0, 0.02]}>
            <boxGeometry args={[0.03, 0.28, 0.04]} />
            <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
          </mesh>
        </group>

        {/* Curtains */}
        <group
          userData={{
            interactable: true,
            interactableId: 'master-curtains',
            label: areCurtainsClosed ? 'Draw Curtains Open' : 'Close Curtains',
            onInteract: () => toggleCurtains('master_bedroom'),
          }}
        >
          <group ref={curtainsLeftRef} position={[-2.2, 0, 0.12]}>
            <mesh position={[0.7, 0, 0]}>
              <planeGeometry args={[1.4, 3.35]} />
              <meshStandardMaterial color="#FAF7EE" roughness={0.8} transparent opacity={0.65} side={THREE.DoubleSide} />
            </mesh>
          </group>
          <group ref={curtainsRightRef} position={[2.2, 0, 0.12]}>
            <mesh position={[-0.7, 0, 0]}>
              <planeGeometry args={[1.4, 3.35]} />
              <meshStandardMaterial color="#FAF7EE" roughness={0.8} transparent opacity={0.65} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>
      </group>

      {/* -------------------- 6. MASTER BEDROOM DECOR MODULE -------------------- */}
      <MasterBedroomDecor />
    </group>
  );
};
