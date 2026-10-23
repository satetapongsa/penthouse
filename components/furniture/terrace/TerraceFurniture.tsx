'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';
import { LUXURY_PALETTE } from '@/lib/materials';
import { useGameStore } from '@/store/useGameStore';
import { TerraceFireBowl } from '../decor/LightingFixtures';

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

      {/* -------------------- 2. OUTDOOR MODULAR LOUNGE SECTIONAL (INTERACTIVE SIT) -------------------- */}
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

        {/* Rounded Weatherproof Linen Cushions */}
        <RoundedBox args={[3.1, 0.2, 0.9]} radius={0.04} smoothness={3} position={[0, 0.38, 0.8]} castShadow receiveShadow>
          <meshStandardMaterial color="#FAF7F0" roughness={0.8} />
        </RoundedBox>
        <RoundedBox args={[0.9, 0.2, 1.7]} radius={0.04} smoothness={3} position={[-1.1, 0.38, -0.3]} castShadow receiveShadow>
          <meshStandardMaterial color="#FAF7F0" roughness={0.8} />
        </RoundedBox>

        {/* Outdoor Throw Pillows */}
        {[
          { pos: [-0.8, 0.52, 1.15], col: colors.pillowSage },
          { pos: [0.1, 0.52, 1.15], col: '#D8CAB7' },
          { pos: [0.9, 0.52, 1.15], col: colors.pillowSage },
          { pos: [-1.1, 0.52, 0.3], col: '#D8CAB7' },
        ].map((pill, idx) => (
          <group key={`out-pillow-${idx}`} position={pill.pos as [number, number, number]}>
            <RoundedBox args={[0.38, 0.32, 0.14]} radius={0.04} smoothness={3} castShadow>
              <meshStandardMaterial color={pill.col} roughness={0.85} />
            </RoundedBox>
          </group>
        ))}
      </group>

      {/* -------------------- 3. LOW OUTDOOR TRAVERTINE COFFEE TABLE -------------------- */}
      <group position={[0.5, 0, -8.0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.65, 0.18, 0.4]} position={[0, 0.18, 0]} />
        </RigidBody>

        <RoundedBox args={[1.3, 0.32, 0.8]} radius={0.03} smoothness={3} position={[0, 0.16, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={colors.travertine} roughness={0.5} />
        </RoundedBox>

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

      {/* -------------------- 4. POOLSIDE SUN LOUNGERS & DRINK TABLES -------------------- */}
      {[-8.3, -9.9].map((lz, idx) => (
        <group key={`sun-lounger-${idx}`} position={[6.6, 0, lz]}>
          <RigidBody type="fixed" colliders={false}>
            <CuboidCollider args={[0.95, 0.2, 0.38]} position={[0, 0.2, 0]} />
          </RigidBody>

          {/* Teak Lounger Frame */}
          <RoundedBox args={[1.9, 0.14, 0.72]} radius={0.02} smoothness={2} position={[0, 0.14, 0]} castShadow>
            <meshStandardMaterial color="#B09E8B" roughness={0.7} />
          </RoundedBox>
          {/* Reclined Padded Cushion */}
          <RoundedBox args={[1.86, 0.1, 0.68]} radius={0.03} smoothness={3} position={[0, 0.24, 0]} castShadow>
            <meshStandardMaterial color="#FAF7F0" roughness={0.8} />
          </RoundedBox>
          {/* Angled Headrest Cushion */}
          <group position={[-0.68, 0.35, 0]} rotation={[0, 0, 0.35]}>
            <RoundedBox args={[0.5, 0.1, 0.68]} radius={0.03} smoothness={3} castShadow>
              <meshStandardMaterial color="#FAF7F0" roughness={0.8} />
            </RoundedBox>
          </group>

          {/* Low Teak Cocktail Table */}
          <group position={[0, 0, 0.58]}>
            <mesh position={[0, 0.15, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.3, 16]} />
              <meshStandardMaterial color={colors.travertine} roughness={0.5} />
            </mesh>
          </group>
        </group>
      ))}

      {/* -------------------- 5. MODERN TRAVERTINE FIRE BOWL -------------------- */}
      <group position={[-1.8, 0, -8.2]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.45, 0.22, 0.45]} position={[0, 0.22, 0]} />
        </RigidBody>
        <TerraceFireBowl position={[0, 0, 0]} />
      </group>

      {/* -------------------- 6. LARGE SCULPTURAL PLANTERS -------------------- */}
      {[
        [-3.0, 0, -6.8],
        [-3.0, 0, -11.4],
        [4.8, 0, -11.4],
      ].map((pos, pidx) => (
        <group key={`terrace-planter-${pidx}`} position={pos as [number, number, number]}>
          <RigidBody type="fixed" colliders={false}>
            <CuboidCollider args={[0.38, 0.42, 0.38]} position={[0, 0.42, 0]} />
          </RigidBody>
          <RoundedBox args={[0.76, 0.76, 0.76]} radius={0.04} smoothness={3} position={[0, 0.38, 0]} castShadow receiveShadow>
            <meshStandardMaterial color={colors.travertine} roughness={0.5} />
          </RoundedBox>
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

      {/* -------------------- 7. OUTDOOR AMBIENT BRASS LANTERNS -------------------- */}
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
          {/* Emissive candle glass (Zero extra realtime point light cost) */}
          <mesh position={[0, 0.22, 0]}>
            <boxGeometry args={[0.16, 0.38, 0.16]} />
            <meshStandardMaterial
              color="#FFE8BA"
              emissive={isTerraceLightOn ? '#FFAA33' : '#000000'}
              emissiveIntensity={isTerraceLightOn ? 1.2 : 0}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};
