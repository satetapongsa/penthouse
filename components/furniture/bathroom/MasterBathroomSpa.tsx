'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { LUXURY_PALETTE } from '@/lib/materials';
import { useGameStore } from '@/store/useGameStore';
import { BathtubCaddyTray } from '../decor/PlumbingDetails';

export const MasterBathroomSpa: React.FC = () => {
  const colors = LUXURY_PALETTE.colors;

  const showerRunning = useGameStore((s) => s.showerRunning);
  const toggleShower = useGameStore((s) => s.toggleShower);

  const showerStreamRef = useRef<THREE.Group>(null);
  const steamGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    // Rain shower falling droplets
    if (showerRunning && showerStreamRef.current) {
      showerStreamRef.current.children.forEach((droplet, i) => {
        droplet.position.y -= delta * 5.5;
        if (droplet.position.y < 0.05) {
          droplet.position.y = 3.0 + (i % 5) * 0.1;
        }
      });
    }

    // Rising steam mist
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
      {/* -------------------- 1. SCULPTURAL FREESTANDING OVAL BATHTUB -------------------- */}
      <group position={[-7.7, 0, 3.6]} rotation={[0, -Math.PI / 8, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.92, 0.36, 0.46]} position={[0, 0.36, 0]} />
        </RigidBody>

        {/* Sculptural Matte White Solid-Surface Tub Basin */}
        <mesh position={[0, 0.34, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.42, 0.68, 36]} />
          <meshPhysicalMaterial color="#FAF9F6" roughness={0.2} clearcoat={0.8} clearcoatRoughness={0.15} />
        </mesh>

        {/* Inner Water Volume */}
        <mesh position={[0, 0.54, 0]}>
          <cylinderGeometry args={[0.46, 0.38, 0.22, 36]} />
          <meshPhysicalMaterial color="#D4EDF5" roughness={0.04} transmission={0.9} transparent opacity={0.65} />
        </mesh>

        {/* Freestanding Brushed Brass Gooseneck Tub Filler */}
        <group position={[-0.62, 0, 0]}>
          <mesh position={[0, 0.46, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.025, 0.92, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh position={[0.12, 0.92, 0]} rotation={[0, 0, -Math.PI / 3]} castShadow>
            <cylinderGeometry args={[0.016, 0.018, 0.28, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
          </mesh>
        </group>

        {/* Wooden Bathtub Caddy Tray with Book, Candle, & Sea Sponge */}
        <BathtubCaddyTray position={[0, 0.69, 0]} width={0.84} />
      </group>

      {/* -------------------- 2. WALK-IN RAIN SHOWER & RECESSED NICHE -------------------- */}
      <group position={[-7.1, 0, 1.5]}>
        {/* Crystal Glass Partition with Brass Header Clamp */}
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[0.02, 3.0, 1.4]} />
          <meshPhysicalMaterial color="#E8F4F8" roughness={0.03} transmission={0.94} thickness={0.02} transparent opacity={0.3} />
        </mesh>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.02, 1.5, 0.7]} position={[0, 1.5, 0]} />
        </RigidBody>
        <mesh position={[0, 2.98, 0]}>
          <boxGeometry args={[0.03, 0.04, 1.42]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Ceiling-Mounted Large Square Rain Shower Head */}
        <group position={[0.3, 3.12, 0]}>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.28, 12]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh castShadow>
            <boxGeometry args={[0.36, 0.02, 0.36]} />
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
            <boxGeometry args={[0.14, 0.26, 0.02]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.04, 0.025]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.024, 0.024, 0.03, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.15} />
          </mesh>
        </group>

        {/* Recessed Travertine Shampoo Niche in Wall */}
        <group position={[0.58, 1.5, 0.3]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh position={[0, 0, -0.04]}>
            <boxGeometry args={[0.5, 0.32, 0.1]} />
            <meshStandardMaterial color={colors.travertine} roughness={0.35} />
          </mesh>
          {/* Internal LED Light Wash */}
          <mesh position={[0, 0.15, -0.02]}>
            <planeGeometry args={[0.48, 0.02]} />
            <meshBasicMaterial color="#FFF1CC" />
          </mesh>
          {/* Amenity Bottles */}
          {[-0.14, 0.0, 0.14].map((bx, bidx) => (
            <mesh key={`niche-bottle-${bidx}`} position={[bx, -0.06, -0.02]} castShadow>
              <cylinderGeometry args={[0.022, 0.025, 0.1, 12]} />
              <meshStandardMaterial color="#FAF8F3" roughness={0.2} />
            </mesh>
          ))}
        </group>

        {/* Falling Rain Water Droplets */}
        {showerRunning && (
          <group ref={showerStreamRef} position={[0.3, 0, 0]}>
            {[-0.12, -0.06, 0, 0.06, 0.12].map((rx) =>
              [-0.12, -0.06, 0, 0.06, 0.12].map((rz) => (
                <mesh key={`drop-${rx}-${rz}`} position={[rx, 1.8 + Math.random(), rz]}>
                  <cylinderGeometry args={[0.003, 0.003, 0.25, 6]} />
                  <meshPhysicalMaterial color="#D8EEF8" roughness={0.05} transmission={0.95} transparent opacity={0.7} />
                </mesh>
              ))
            )}
          </group>
        )}

        {/* Rising Steam Mist */}
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
    </group>
  );
};
