'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, CuboidCollider } from '@react-three/rapier';
import { DoorConfig, ARCHITECTURE_CONFIG } from '@/lib/config';
import { useGameStore } from '@/store/useGameStore';

interface DoorProps {
  config: DoorConfig;
}

export const Door: React.FC<DoorProps> = ({ config }) => {
  const isOpen = useGameStore((s) => s.doorStates[config.id] || false);
  const toggleDoor = useGameStore((s) => s.toggleDoor);

  const pivotRef = useRef<THREE.Group>(null);
  const panelRigidBodyRef = useRef<RapierRigidBody>(null);

  const colors = ARCHITECTURE_CONFIG.colors;
  const isSliding = config.type === 'sliding';
  const isTerraceGlass = config.id === 'door-terrace';

  // Animation progress ref (0 = closed, 1 = fully open)
  const animProgress = useRef(0);

  // Geometry calculations
  const jambWidth = 0.07;
  const jambDepth = ARCHITECTURE_CONFIG.wallThickness + 0.02;
  const halfWidth = config.width / 2;
  const halfHeight = config.height / 2;

  // Hinge side offset
  const hingeLeft = config.hingeSide !== 'right';
  const pivotX = hingeLeft ? -halfWidth : halfWidth;
  const maxSwingAngle = hingeLeft ? -Math.PI / 2 : Math.PI / 2;
  const maxSlideDistance = config.slideDirection === 'right' ? config.width * 0.92 : -config.width * 0.92;

  useFrame((_, delta) => {
    const targetProgress = isOpen ? 1 : 0;
    if (Math.abs(animProgress.current - targetProgress) > 0.001) {
      // Smooth easing transition
      animProgress.current = THREE.MathUtils.damp(
        animProgress.current,
        targetProgress,
        5.5,
        delta
      );

      if (pivotRef.current) {
        if (isSliding) {
          pivotRef.current.position.x = animProgress.current * maxSlideDistance;
        } else {
          pivotRef.current.rotation.y = animProgress.current * maxSwingAngle;
        }
      }

      // Update kinematic collider position and rotation in world space
      if (panelRigidBodyRef.current && pivotRef.current) {
        const worldPos = new THREE.Vector3();
        const worldQuat = new THREE.Quaternion();
        pivotRef.current.getWorldPosition(worldPos);
        pivotRef.current.getWorldQuaternion(worldQuat);

        panelRigidBodyRef.current.setNextKinematicTranslation(worldPos);
        panelRigidBodyRef.current.setNextKinematicRotation(worldQuat);
      }
    }
  });

  return (
    <group
      position={config.position}
      rotation={[0, config.rotationY, 0]}
    >
      {/* -------------------- 1. FIXED DOOR FRAME (JAMBS & HEADER) -------------------- */}
      <RigidBody type="fixed" colliders={false}>
        {/* Left Frame Jamb */}
        <CuboidCollider
          args={[jambWidth / 2, halfHeight, jambDepth / 2]}
          position={[-halfWidth - jambWidth / 2, 0, 0]}
        />
        {/* Right Frame Jamb */}
        <CuboidCollider
          args={[jambWidth / 2, halfHeight, jambDepth / 2]}
          position={[halfWidth + jambWidth / 2, 0, 0]}
        />
        {/* Top Header Lintel */}
        <CuboidCollider
          args={[halfWidth + jambWidth, 0.04, jambDepth / 2]}
          position={[0, halfHeight + 0.04, 0]}
        />
      </RigidBody>

      {/* Frame Visual Meshes */}
      <mesh position={[-halfWidth - jambWidth / 2, 0, 0]}>
        <boxGeometry args={[jambWidth, config.height, jambDepth]} />
        <meshStandardMaterial color={colors.brassTrim} roughness={0.35} metalness={0.75} />
      </mesh>
      <mesh position={[halfWidth + jambWidth / 2, 0, 0]}>
        <boxGeometry args={[jambWidth, config.height, jambDepth]} />
        <meshStandardMaterial color={colors.brassTrim} roughness={0.35} metalness={0.75} />
      </mesh>
      <mesh position={[0, halfHeight + 0.04, 0]}>
        <boxGeometry args={[config.width + jambWidth * 2, 0.08, jambDepth]} />
        <meshStandardMaterial color={colors.brassTrim} roughness={0.35} metalness={0.75} />
      </mesh>

      {/* -------------------- 2. ANIMATED DOOR PANEL & KINEMATIC COLLIDER -------------------- */}
      {/* Pivot anchor point */}
      <group position={[isSliding ? 0 : pivotX, 0, 0]} ref={pivotRef}>
        {/* Kinematic rigid body that updates every frame */}
        <RigidBody
          ref={panelRigidBodyRef}
          type="kinematicPosition"
          colliders={false}
        >
          <CuboidCollider
            args={[halfWidth, halfHeight, 0.03]}
            position={[isSliding ? 0 : (hingeLeft ? halfWidth : -halfWidth), 0, 0]}
          />
        </RigidBody>

        {/* Visual Door Leaf Panel */}
        <group
          position={[isSliding ? 0 : (hingeLeft ? halfWidth : -halfWidth), 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            toggleDoor(config.id);
          }}
          userData={{
            interactable: true,
            interactableId: config.id,
            label: isOpen ? `Close ${config.name}` : `Open ${config.name}`,
            onInteract: () => toggleDoor(config.id),
          }}
        >
          {isTerraceGlass ? (
            /* Panoramic Sliding Glass Door Panel */
            <group>
              {/* Outer Brass/Champagne Perimeter Frame */}
              <mesh>
                <boxGeometry args={[config.width, config.height, 0.05]} />
                <meshStandardMaterial color={colors.brassDoor} roughness={0.3} metalness={0.8} />
              </mesh>
              {/* Glass Inset */}
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[config.width - 0.16, config.height - 0.16, 0.02]} />
                <meshPhysicalMaterial
                  color={colors.glassTint}
                  roughness={0.05}
                  transmission={0.9}
                  thickness={0.08}
                  transparent
                  opacity={0.4}
                />
              </mesh>
              {/* Center Architectural Vertical Mullion */}
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.06, config.height, 0.06]} />
                <meshStandardMaterial color={colors.brassDoor} roughness={0.3} metalness={0.8} />
              </mesh>
              {/* Modern Flush Handle */}
              <mesh position={[config.slideDirection === 'right' ? -halfWidth + 0.12 : halfWidth - 0.12, 0, 0.04]}>
                <boxGeometry args={[0.03, 0.6, 0.04]} />
                <meshStandardMaterial color={colors.brassTrim} metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          ) : (
            /* Fluted Pale Oak & Brushed Brass Luxury Interior Door Panel */
            <group>
              {/* Main Pale Oak Slab */}
              <mesh castShadow receiveShadow>
                <boxGeometry args={[config.width - 0.02, config.height - 0.02, 0.045]} />
                <meshStandardMaterial color={colors.paleOak} roughness={0.5} metalness={0.08} />
              </mesh>

              {/* Inlaid Brushed Brass Perimeter Shadow Line */}
              <mesh position={[0, 0, 0.024]}>
                <ringGeometry args={[0.2, 0.22, 4]} />
                <meshStandardMaterial color={colors.brassTrim} metalness={0.85} roughness={0.25} />
              </mesh>

              {/* Vertical Architectural Lever / Handle Bar */}
              <group position={[hingeLeft ? halfWidth - 0.12 : -halfWidth + 0.12, 0, 0]}>
                {/* Front handle */}
                <mesh position={[0, 0, 0.05]}>
                  <boxGeometry args={[0.025, 0.45, 0.04]} />
                  <meshStandardMaterial color={colors.brassTrim} metalness={0.85} roughness={0.25} />
                </mesh>
                {/* Back handle */}
                <mesh position={[0, 0, -0.05]}>
                  <boxGeometry args={[0.025, 0.45, 0.04]} />
                  <meshStandardMaterial color={colors.brassTrim} metalness={0.85} roughness={0.25} />
                </mesh>
              </group>
            </group>
          )}
        </group>
      </group>
    </group>
  );
};
