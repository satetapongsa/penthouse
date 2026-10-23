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

export const KitchenDiningFurniture: React.FC = () => {
  const marbleTex = useMemo(() => getCalacattaMarbleTexture(), []);
  const oakTex = useMemo(() => getPaleOakTexture(), []);
  const boucleTex = useMemo(() => getBoucleFabricTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  // Zustand Store Interactions
  const enterSitting = useGameStore((s) => s.enterSitting);
  const cooktopOn = useGameStore((s) => s.cooktopOn);
  const toggleCooktop = useGameStore((s) => s.toggleCooktop);
  const fridgeOpen = useGameStore((s) => s.fridgeOpen);
  const toggleFridge = useGameStore((s) => s.toggleFridge);
  const cabinetOpen = useGameStore((s) => s.kitchenCabinetOpen);
  const toggleCabinet = useGameStore((s) => s.toggleKitchenCabinet);
  const isKitchenLightOn = useGameStore((s) => s.lightingStates.kitchen_dining ?? true);
  const toggleKitchenLight = useGameStore((s) => s.toggleRoomLight);

  // Animated Pivots
  const fridgeDoorRef = useRef<THREE.Group>(null);
  const cabinetDoorRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    // 1. Refrigerator Door Smooth Swing
    if (fridgeDoorRef.current) {
      const targetAngle = fridgeOpen ? Math.PI / 2.2 : 0;
      fridgeDoorRef.current.rotation.y = THREE.MathUtils.damp(
        fridgeDoorRef.current.rotation.y,
        targetAngle,
        5.0,
        delta
      );
    }

    // 2. Kitchen Cabinet Smooth Swing
    if (cabinetDoorRef.current) {
      const targetAngle = cabinetOpen ? -Math.PI / 2.2 : 0;
      cabinetDoorRef.current.rotation.y = THREE.MathUtils.damp(
        cabinetDoorRef.current.rotation.y,
        targetAngle,
        5.0,
        delta
      );
    }
  });

  return (
    <group>
      {/* -------------------- 1. WATERFALL CALACATTA MARBLE ISLAND -------------------- */}
      <group position={[10.75, 0, -1.0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.8, 0.46, 0.6]} position={[0, 0.46, 0]} />
        </RigidBody>

        {/* Countertop Slab */}
        <mesh position={[0, 0.89, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.6, 0.06, 1.2]} />
          <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.12} clearcoat={0.9} />
        </mesh>

        {/* Waterfall Marble Edges */}
        <mesh position={[-1.77, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.06, 0.88, 1.2]} />
          <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.12} clearcoat={0.9} />
        </mesh>
        <mesh position={[1.77, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.06, 0.88, 1.2]} />
          <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.12} clearcoat={0.9} />
        </mesh>

        {/* Under-Cabinetry Base */}
        <mesh position={[0, 0.44, 0.12]} castShadow receiveShadow>
          <boxGeometry args={[3.42, 0.84, 0.92]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </mesh>

        {/* Brass Toe Kick */}
        <mesh position={[0, 0.04, 0.12]}>
          <boxGeometry args={[3.44, 0.08, 0.88]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
        </mesh>

        {/* Undermount Prep Sink */}
        <group position={[-0.8, 0.92, 0.05]}>
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[0.55, 0.2, 0.42]} />
            <meshStandardMaterial color="#2B2824" metalness={0.8} roughness={0.3} />
          </mesh>
          <group position={[0, 0.1, -0.18]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.015, 0.02, 0.26, 16]} />
              <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
            </mesh>
            <mesh position={[0, 0.16, 0.08]} rotation={[Math.PI / 2.5, 0, 0]} castShadow>
              <cylinderGeometry args={[0.012, 0.015, 0.2, 16]} />
              <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
            </mesh>
          </group>
        </group>

        {/* -------------------- INDUCTION COOKTOP (INTERACTIVE) -------------------- */}
        <group
          position={[0.7, 0.925, 0.05]}
          userData={{
            interactable: true,
            interactableId: 'kitchen-cooktop',
            label: cooktopOn ? 'Turn Off Cooktop' : 'Turn On Cooktop',
            onInteract: toggleCooktop,
          }}
        >
          {/* Glass Cooktop Plate */}
          <mesh>
            <boxGeometry args={[0.85, 0.01, 0.52]} />
            <meshPhysicalMaterial color="#111111" roughness={0.05} clearcoat={1.0} reflectivity={0.9} />
          </mesh>

          {/* 4 Induction Rings */}
          {[-0.22, 0.22].map((cx) =>
            [-0.12, 0.12].map((cz) => (
              <mesh key={`ring-${cx}-${cz}`} position={[cx, 0.007, cz]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.065, 0.075, 32]} />
                <meshBasicMaterial color={cooktopOn ? '#FF4411' : 'rgba(255, 255, 255, 0.35)'} />
              </mesh>
            ))
          )}

          {/* Glowing Red Heating Coils when Cooktop is On */}
          {cooktopOn && (
            <>
              {[-0.22, 0.22].map((cx) =>
                [-0.12, 0.12].map((cz) => (
                  <mesh key={`glow-${cx}-${cz}`} position={[cx, 0.006, cz]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[0.065, 32]} />
                    <meshBasicMaterial color="#FF3B00" transparent opacity={0.8} />
                  </mesh>
                ))
              )}
              <pointLight position={[0, 0.2, 0]} color="#FF4500" intensity={1.5} distance={2.5} />
            </>
          )}
        </group>

        {/* -------------------- 4 BAR STOOLS (INTERACTIVE SIT) -------------------- */}
        {[-1.2, -0.4, 0.4, 1.2].map((bx, idx) => (
          <group
            key={`stool-${idx}`}
            position={[bx, 0, -0.68]}
            userData={{
              interactable: true,
              interactableId: `kitchen-stool-${idx}`,
              label: 'Sit at Kitchen Bar',
              onInteract: () => {
                enterSitting({
                  position: [10.75 + bx, 0, -1.68],
                  eyeHeight: 1.15,
                  pitch: -0.05,
                  yaw: 0,
                  returnPosition: [10.75 + bx, 1.8, -2.4],
                  returnYaw: 0,
                });
              },
            }}
          >
            <mesh position={[0, 0.32, 0]} castShadow>
              <cylinderGeometry args={[0.018, 0.025, 0.64, 16]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.22, 0]}>
              <torusGeometry args={[0.16, 0.012, 12, 24]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.66, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.18, 0.08, 24]} />
              <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.8, -0.16]} castShadow>
              <boxGeometry args={[0.34, 0.18, 0.04]} />
              <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Pendant Lights Over Island */}
        {[-1.0, 0, 1.0].map((px, pidx) => (
          <group key={`pendant-${pidx}`} position={[px, 2.3, 0]}>
            <mesh position={[0, 0.55, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 1.1, 8]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.14, 0.18, 24]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.22} />
            </mesh>
            <mesh position={[0, -0.1, 0]}>
              <sphereGeometry args={[0.11, 24, 24]} />
              <meshBasicMaterial color="#FFF9E6" />
            </mesh>
            {isKitchenLightOn && (
              <pointLight position={[0, -0.18, 0]} color="#FFF3DD" intensity={0.9} distance={4} />
            )}
          </group>
        ))}
      </group>

      {/* -------------------- 2. BACK KITCHEN CABINETRY BANK & APPLIANCES -------------------- */}
      <group position={[11.0, 0, 1.86]} rotation={[0, Math.PI, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[2.5, 1.7, 0.32]} position={[0, 1.7, 0]} />
        </RigidBody>

        {/* Cabinet Wall Shell */}
        <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.9, 3.4, 0.62]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </mesh>

        {/* Recessed Niche */}
        <group position={[0, 1.35, 0.28]}>
          <mesh>
            <boxGeometry args={[2.6, 0.9, 0.1]} />
            <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.15} />
          </mesh>
          {isKitchenLightOn && (
            <pointLight position={[0, 0.4, 0.1]} color="#FFF0D4" intensity={1.1} distance={3} />
          )}
        </group>

        {/* -------------------- UPPER CABINET (INTERACTIVE) -------------------- */}
        <group position={[0, 2.35, 0.28]}>
          {/* Cabinet Interior Cavity */}
          <mesh position={[0, 0, -0.05]}>
            <boxGeometry args={[1.2, 0.7, 0.3]} />
            <meshStandardMaterial color="#2B2621" roughness={0.6} />
          </mesh>
          {/* Glassware inside */}
          {[-0.35, 0, 0.35].map((gx) => (
            <mesh key={`glass-${gx}`} position={[gx, -0.15, 0]}>
              <cylinderGeometry args={[0.04, 0.035, 0.14, 16]} />
              <meshPhysicalMaterial color="#E8F1F5" roughness={0.05} transmission={0.95} transparent opacity={0.6} />
            </mesh>
          ))}

          {/* Swinging Cabinet Door */}
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

        {/* -------------------- REFRIGERATOR (INTERACTIVE) -------------------- */}
        <group position={[1.75, 1.7, 0.32]}>
          {/* Fridge Interior Cavity */}
          <mesh position={[0, 0, -0.1]}>
            <boxGeometry args={[0.88, 3.2, 0.4]} />
            <meshStandardMaterial color="#F7F7F8" roughness={0.2} />
          </mesh>

          {/* Interior Shelves & Beverages */}
          {[-0.8, -0.2, 0.4, 1.0].map((sy) => (
            <mesh key={`shelf-${sy}`} position={[0, sy, -0.05]}>
              <boxGeometry args={[0.84, 0.02, 0.32]} />
              <meshPhysicalMaterial color="#DDE8F0" roughness={0.1} transmission={0.8} transparent opacity={0.5} />
            </mesh>
          ))}
          {/* Chilled Beverage Bottles */}
          {[-0.2, 0.2].map((bx) => (
            <mesh key={`bottle-${bx}`} position={[bx, -0.05, -0.05]}>
              <cylinderGeometry args={[0.035, 0.035, 0.24, 16]} />
              <meshPhysicalMaterial color="#689E6E" roughness={0.1} transmission={0.85} transparent opacity={0.7} />
            </mesh>
          ))}

          {/* Interior Cool White LED Light (lights up when fridge opens) */}
          {fridgeOpen && (
            <pointLight position={[0, 0.8, 0.05]} color="#E6F2FF" intensity={2.2} distance={3.5} />
          )}

          {/* Swinging Fridge Door with Pivot on Left */}
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
            {/* Long Vertical Brass Door Handle */}
            <mesh position={[0.82, 0, 0.04]}>
              <boxGeometry args={[0.025, 1.4, 0.03]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        </group>
      </group>

      {/* -------------------- 3. GRAND DINING TABLE & 8 CHAIRS -------------------- */}
      <group position={[10.75, 0, -4.2]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.75, 0.38, 0.65]} position={[0, 0.38, 0]} />
        </RigidBody>

        <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.06, 1.25]} />
          <meshStandardMaterial color={colors.travertine} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.705, 0]}>
          <boxGeometry args={[3.32, 0.015, 1.18]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
        </mesh>

        {[-0.95, 0.95].map((bx) => (
          <group key={`table-base-${bx}`} position={[bx, 0.34, 0]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.26, 0.3, 0.68, 32]} />
              <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.32, 0]}>
              <cylinderGeometry args={[0.34, 0.34, 0.04, 32]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* 8 Dining Chairs */}
        {[-1.25, -0.42, 0.42, 1.25].map((cx, idx) => (
          <group key={`chair-north-${idx}`} position={[cx, 0, -0.72]}>
            <mesh position={[0, 0.22, 0]} castShadow>
              <cylinderGeometry args={[0.015, 0.022, 0.44, 12]} />
              <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.46, 0]} castShadow>
              <boxGeometry args={[0.48, 0.08, 0.48]} />
              <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.68, -0.21]} castShadow>
              <boxGeometry args={[0.46, 0.38, 0.05]} />
              <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.8} />
            </mesh>
          </group>
        ))}

        {[-1.25, -0.42, 0.42, 1.25].map((cx, idx) => (
          <group key={`chair-south-${idx}`} position={[cx, 0, 0.72]} rotation={[0, Math.PI, 0]}>
            <mesh position={[0, 0.22, 0]} castShadow>
              <cylinderGeometry args={[0.015, 0.022, 0.44, 12]} />
              <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.46, 0]} castShadow>
              <boxGeometry args={[0.48, 0.08, 0.48]} />
              <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.68, -0.21]} castShadow>
              <boxGeometry args={[0.46, 0.38, 0.05]} />
              <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>

      {/* -------------------- 4. KITCHEN WALL LIGHT SWITCH -------------------- */}
      {/* Positioned on West kitchen wall (X = 7.55, Y = 1.35, Z = 0.5) */}
      <group
        position={[7.55, 1.35, 0.5]}
        rotation={[0, Math.PI / 2, 0]}
        userData={{
          interactable: true,
          interactableId: 'kitchen-light-switch',
          label: isKitchenLightOn ? 'Turn Off Kitchen Lights' : 'Turn On Kitchen Lights',
          onInteract: () => toggleKitchenLight('kitchen_dining'),
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
          <meshBasicMaterial color={isKitchenLightOn ? '#4ADE80' : '#E5E7EB'} />
        </mesh>
      </group>
    </group>
  );
};
