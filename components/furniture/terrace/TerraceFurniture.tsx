'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { LUXURY_PALETTE } from '@/lib/materials';
import { useGameStore } from '@/store/useGameStore';

export const TerraceFurniture: React.FC = () => {
  const colors = LUXURY_PALETTE.colors;
  const waterMeshRef = useRef<THREE.Mesh>(null);
  const waterGeomRef = useRef<THREE.PlaneGeometry>(null);

  const enterSitting = useGameStore((s) => s.enterSitting);
  const isNearJacuzzi = useGameStore((s) => s.isNearJacuzzi);
  const jacuzziJetsOn = useGameStore((s) => s.jacuzziJetsOn);
  const toggleJacuzziJets = useGameStore((s) => s.toggleJacuzziJets);
  const isTerraceLightOn = useGameStore((s) => s.lightingStates.terrace ?? true);

  // Animated procedural water surface displacement inside the Jacuzzi basin
  useFrame(({ clock }) => {
    if (!waterGeomRef.current) return;

    // Fast active ripples when player is near or when jets are turned on
    const isActive = isNearJacuzzi || jacuzziJetsOn;
    const speedMult = isActive ? 3.4 : 1.4;
    const ampMult = isActive ? 1.8 : 0.9;

    const time = clock.getElapsedTime() * speedMult;
    const posAttr = waterGeomRef.current.attributes.position;

    for (let i = 0; i < posAttr.count; i++) {
      const u = posAttr.getX(i);
      const v = posAttr.getY(i);
      const z =
        (Math.sin(u * 2.8 + time * 1.6) * 0.025 +
         Math.cos(v * 3.2 + time * 1.4) * 0.02 +
         Math.sin((u + v) * 2.2 + time * 2.0) * 0.015) * ampMult;
      posAttr.setZ(i, z);
    }
    posAttr.needsUpdate = true;
    waterGeomRef.current.computeVertexNormals();
  });

  return (
    <group>
      {/* -------------------- 1. ANIMATED JACUZZI POOL WATER SURFACE -------------------- */}
      <group position={[10.75, 0.38, -9.5]}>
        {/* Animated Ripple Water Mesh */}
        <mesh
          ref={waterMeshRef}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry ref={waterGeomRef} args={[3.7, 3.2, 32, 32]} />
          <meshPhysicalMaterial
            color="#2EADC7"
            roughness={0.06}
            transmission={0.88}
            thickness={0.5}
            ior={1.333}
            reflectivity={0.92}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Submerged Luxury Pool Ambient Lighting */}
        <pointLight
          position={[0, -0.15, 0]}
          color="#38D7F5"
          intensity={jacuzziJetsOn ? 2.4 : 1.6}
          distance={5.5}
          decay={2}
        />

        {/* Jacuzzi Spa Bubble Jets Accents */}
        {[-1.2, -0.4, 0.4, 1.2].map((jx) => (
          <mesh key={`jet-${jx}`} position={[jx, -0.02, 0]}>
            <circleGeometry args={[jacuzziJetsOn ? 0.14 : 0.08, 16]} />
            <meshBasicMaterial color="#E0F8FF" transparent opacity={jacuzziJetsOn ? 0.9 : 0.6} />
          </mesh>
        ))}

        {/* Interactive Rim Jet Controller */}
        <group
          position={[-1.95, 0.18, 0]}
          userData={{
            interactable: true,
            interactableId: 'terrace-jacuzzi-jets',
            label: jacuzziJetsOn ? 'Stop Jacuzzi Jets' : 'Start Jacuzzi Jets',
            onInteract: toggleJacuzziJets,
          }}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* -------------------- 2. OUTDOOR LOUNGE SECTIONAL (INTERACTIVE SIT) -------------------- */}
      <group
        position={[0.5, 0, -9.2]}
        userData={{
          interactable: true,
          interactableId: 'terrace-lounge',
          label: 'Sit on Terrace Lounge',
          onInteract: () => {
            enterSitting({
              position: [0.5, 0, -8.4],
              eyeHeight: 0.96,
              pitch: -0.05,
              yaw: 0,
              returnPosition: [0.5, 1.8, -7.0],
              returnYaw: 0,
            });
          },
        }}
      >
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.6, 0.4, 0.5]} position={[0, 0.4, 0.8]} />
          <CuboidCollider args={[0.5, 0.4, 0.9]} position={[-1.1, 0.4, -0.3]} />
        </RigidBody>

        {/* Weathered Teak Slat Base & Backing */}
        <mesh position={[0, 0.18, 0.8]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.36, 1.0]} />
          <meshStandardMaterial color="#B09E8B" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.54, 1.25]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.36, 0.2]} />
          <meshStandardMaterial color="#B09E8B" roughness={0.7} />
        </mesh>
        <mesh position={[-1.1, 0.18, -0.3]} castShadow receiveShadow>
          <boxGeometry args={[1.0, 0.36, 1.8]} />
          <meshStandardMaterial color="#B09E8B" roughness={0.7} />
        </mesh>

        {/* Ivory Cushions */}
        <mesh position={[0, 0.38, 0.8]} castShadow receiveShadow>
          <boxGeometry args={[3.1, 0.2, 0.9]} />
          <meshStandardMaterial color="#FAF7F0" roughness={0.8} />
        </mesh>
        <mesh position={[-1.1, 0.38, -0.3]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.2, 1.7]} />
          <meshStandardMaterial color="#FAF7F0" roughness={0.8} />
        </mesh>

        {/* Outdoor Pillows */}
        {[
          { pos: [-0.8, 0.52, 1.15], col: colors.pillowSage },
          { pos: [0.1, 0.52, 1.15], col: '#D8CAB7' },
          { pos: [0.9, 0.52, 1.15], col: colors.pillowSage },
          { pos: [-1.1, 0.52, 0.3], col: '#D8CAB7' },
        ].map((pill, idx) => (
          <mesh key={`out-pillow-${idx}`} position={pill.pos as [number, number, number]} castShadow>
            <boxGeometry args={[0.38, 0.32, 0.14]} />
            <meshStandardMaterial color={pill.col} roughness={0.85} />
          </mesh>
        ))}
      </group>

      {/* -------------------- 3. LOW OUTDOOR COFFEE TABLE -------------------- */}
      <group position={[0.5, 0, -8.0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.65, 0.18, 0.4]} position={[0, 0.18, 0]} />
        </RigidBody>

        <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.32, 0.8]} />
          <meshStandardMaterial color={colors.travertine} roughness={0.5} />
        </mesh>

        <group position={[0.1, 0.33, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.02, 24]} />
            <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
          </mesh>
          <mesh position={[-0.06, 0.14, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.06, 0.26, 16]} />
            <meshPhysicalMaterial color="#FFFFFF" roughness={0.05} transmission={0.9} transparent opacity={0.5} />
          </mesh>
        </group>
      </group>

      {/* -------------------- 4. LARGE PLANTERS -------------------- */}
      {[
        [-3.0, 0, -6.8],
        [-3.0, 0, -11.4],
        [4.8, 0, -11.4],
      ].map((pos, pidx) => (
        <group key={`terrace-planter-${pidx}`} position={pos as [number, number, number]}>
          <RigidBody type="fixed" colliders={false}>
            <CuboidCollider args={[0.38, 0.42, 0.38]} position={[0, 0.42, 0]} />
          </RigidBody>
          <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.76, 0.76, 0.76]} />
            <meshStandardMaterial color={colors.travertine} roughness={0.5} />
          </mesh>
          <group position={[0, 0.82, 0]}>
            <mesh position={[0, 0.35, 0]} castShadow>
              <sphereGeometry args={[0.42, 16, 16]} />
              <meshStandardMaterial color={colors.sage} roughness={0.75} />
            </mesh>
            <mesh position={[0.14, 0.52, 0.1]} castShadow>
              <sphereGeometry args={[0.36, 16, 16]} />
              <meshStandardMaterial color="#7D8E7B" roughness={0.75} />
            </mesh>
          </group>
        </group>
      ))}

      {/* -------------------- 5. OUTDOOR AMBIENT LANTERNS -------------------- */}
      {[
        [-1.8, 0, -7.0],
        [2.8, 0, -7.0],
        [7.2, 0, -11.4],
      ].map((lpos, lidx) => (
        <group key={`lantern-${lidx}`} position={lpos as [number, number, number]}>
          <mesh position={[0, 0.22, 0]} castShadow>
            <boxGeometry args={[0.2, 0.44, 0.2]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <boxGeometry args={[0.16, 0.38, 0.16]} />
            <meshBasicMaterial color={isTerraceLightOn ? '#FFE8BA' : '#4A453B'} />
          </mesh>
          {isTerraceLightOn && (
            <pointLight position={[0, 0.24, 0]} color="#FFE0A0" intensity={0.9} distance={3.5} />
          )}
        </group>
      ))}
    </group>
  );
};
