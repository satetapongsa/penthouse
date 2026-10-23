'use client';

import React, { useMemo } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';
import {
  getPaleOakTexture,
  getBoucleFabricTexture,
  getCalacattaMarbleTexture,
  LUXURY_PALETTE,
} from '@/lib/materials';
import { useGameStore } from '@/store/useGameStore';
import { LuxuryFramedArt } from '../decor/CuratedArtFrames';
import { SculpturalCeramicVase } from '../decor/BooksAndTrays';

export const GuestBedroomFurniture: React.FC = () => {
  const oakTex = useMemo(() => getPaleOakTexture(), []);
  const boucleTex = useMemo(() => getBoucleFabricTexture(), []);
  const marbleTex = useMemo(() => getCalacattaMarbleTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  const enterLying = useGameStore((s) => s.enterLying);
  const enterSitting = useGameStore((s) => s.enterSitting);
  const isGuestLightOn = useGameStore((s) => s.lightingStates.guest_bedroom ?? true);
  const toggleGuestLight = useGameStore((s) => s.toggleRoomLight);

  return (
    <group>
      {/* -------------------- 1. GUEST BEDROOM AREA RUG -------------------- */}
      <mesh position={[6.2, 0.007, 3.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, 3.0]} />
        <meshStandardMaterial color="#EAE4D8" map={boucleTex} roughness={0.9} />
      </mesh>

      {/* -------------------- 2. QUEEN BED (HEIGHT 0.55m, INTERACTIVE) -------------------- */}
      <group
        position={[6.2, 0, 3.2]}
        userData={{
          interactable: true,
          interactableId: 'guest-bed',
          label: 'Lie Down on Bed',
          onInteract: () => {
            enterLying({
              position: [6.2, 0.54, 2.7],
              eyeHeight: 0.35,
              pitch: -0.9,
              yaw: 0,
              returnPosition: [4.8, 1.8, 3.2],
              returnYaw: Math.PI / 2,
            });
          },
        }}
      >
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.95, 0.42, 1.05]} position={[0, 0.42, 0]} />
        </RigidBody>

        {/* Headboard */}
        <RoundedBox args={[2.2, 1.44, 0.14]} radius={0.04} smoothness={3} position={[0, 0.72, -1.0]} castShadow receiveShadow>
          <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.85} />
        </RoundedBox>
        <mesh position={[0, 0.72, -1.0]}>
          <boxGeometry args={[2.24, 1.48, 0.12]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Bed Base */}
        <RoundedBox args={[1.82, 0.44, 2.05]} radius={0.02} smoothness={3} position={[0, 0.22, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.55} />
        </RoundedBox>

        {/* Mattress (Bed Height 0.55m) */}
        <RoundedBox args={[1.74, 0.28, 1.95]} radius={0.05} smoothness={4} position={[0, 0.5, 0.05]} castShadow receiveShadow>
          <meshStandardMaterial color="#FAF8F5" roughness={0.8} />
        </RoundedBox>

        {/* Terracotta Blanket */}
        <RoundedBox args={[1.76, 0.04, 0.65]} radius={0.015} smoothness={2} position={[0, 0.65, 0.6]} castShadow>
          <meshStandardMaterial color={colors.pillowTerracotta} roughness={0.85} />
        </RoundedBox>

        {/* Puffy Pillows */}
        {[-0.45, 0.45].map((px, idx) => (
          <group key={`guest-pillow-${idx}`} position={[px, 0.72, -0.68]} rotation={[-0.3, 0, 0]}>
            <RoundedBox args={[0.62, 0.38, 0.16]} radius={0.05} smoothness={4} castShadow>
              <meshStandardMaterial color="#FFFFFF" roughness={0.85} />
            </RoundedBox>
          </group>
        ))}
        {[-0.45, 0.45].map((px, idx) => (
          <group key={`guest-accent-pillow-${idx}`} position={[px, 0.68, -0.48]} rotation={[-0.35, 0, 0]}>
            <RoundedBox args={[0.42, 0.32, 0.14]} radius={0.04} smoothness={4} castShadow>
              <meshStandardMaterial color={idx === 0 ? colors.pillowSage : colors.pillowGold} roughness={0.8} />
            </RoundedBox>
          </group>
        ))}

        {/* Nightstands & Lamps */}
        {[-1.3, 1.3].map((nx, nidx) => (
          <group key={`g-nightstand-${nidx}`} position={[nx, 0, -0.8]}>
            <RigidBody type="fixed" colliders={false}>
              <CuboidCollider args={[0.26, 0.26, 0.22]} position={[0, 0.26, 0]} />
            </RigidBody>
            <RoundedBox args={[0.5, 0.48, 0.42]} radius={0.02} smoothness={3} position={[0, 0.24, 0]} castShadow receiveShadow>
              <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
            </RoundedBox>
            <mesh position={[0, 0.49, 0]} castShadow>
              <boxGeometry args={[0.52, 0.02, 0.44]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.62, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.09, 0.24, 20]} />
              <meshStandardMaterial color={colors.travertine} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.82, 0]} castShadow>
              <cylinderGeometry args={[0.13, 0.18, 0.2, 20]} />
              <meshStandardMaterial color="#FFFDF9" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.82, 0]}>
              <sphereGeometry args={[0.03, 10, 10]} />
              <meshBasicMaterial color="#FFE6B2" />
            </mesh>
          </group>
        ))}
      </group>

      {/* -------------------- 3. WORK DESK WITH CHAIR (HEIGHT 0.75m, INTERACTIVE) -------------------- */}
      <group position={[9.18, 0, 3.6]} rotation={[0, -Math.PI / 2, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.6, 0.38, 0.28]} position={[0, 0.38, 0]} />
        </RigidBody>

        {/* Desk Top Slab (Height 0.75m) */}
        <RoundedBox args={[1.2, 0.05, 0.54]} radius={0.015} smoothness={3} position={[0, 0.725, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </RoundedBox>
        {[-0.52, 0.52].map((dx) =>
          [-0.2, 0.2].map((dz) => (
            <mesh key={`desk-leg-${dx}-${dz}`} position={[dx, 0.35, dz]} castShadow>
              <cylinderGeometry args={[0.016, 0.022, 0.7, 16]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
          ))
        )}

        {/* Notebook & Pen on Desk */}
        <group position={[-0.2, 0.76, 0]}>
          <RoundedBox args={[0.18, 0.015, 0.24]} radius={0.005} smoothness={2} castShadow>
            <meshStandardMaterial color="#FAF8F3" roughness={0.7} />
          </RoundedBox>
          <mesh position={[0.12, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.004, 0.004, 0.16, 8]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* Brass Task Lamp */}
        <group position={[0.42, 0.75, -0.15]}>
          <mesh position={[0, 0.01, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.16, 0]} castShadow>
            <cylinderGeometry args={[0.006, 0.006, 0.3, 8]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[-0.06, 0.32, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
            <coneGeometry args={[0.06, 0.12, 16]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[-0.08, 0.3, 0]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshBasicMaterial color="#FFECC2" />
          </mesh>
        </group>

        {/* Ergonomic Desk Chair (Seat Height 0.45m, Interactive Sit) */}
        <group
          position={[0, 0, 0.58]}
          userData={{
            interactable: true,
            interactableId: 'guest-desk-chair',
            label: 'Sit at Desk',
            onInteract: () => {
              enterSitting({
                position: [8.5, 0.85, 3.6],
                eyeHeight: 0.85,
                pitch: -0.1,
                yaw: Math.PI / 2,
                returnPosition: [8.2, 1.8, 3.6],
                returnYaw: Math.PI / 2,
              });
            },
          }}
        >
          <RoundedBox args={[0.44, 0.08, 0.44]} radius={0.03} smoothness={3} position={[0, 0.45, 0]} castShadow>
            <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
          </RoundedBox>
          <RoundedBox args={[0.42, 0.36, 0.05]} radius={0.02} smoothness={3} position={[0, 0.68, 0.19]} castShadow>
            <meshStandardMaterial color={colors.cream} map={boucleTex} roughness={0.85} />
          </RoundedBox>
          {[[-0.16, -0.16], [0.16, -0.16], [-0.16, 0.16], [0.16, 0.16]].map(([cx, cz], cidx) => (
            <mesh key={`chair-leg-${cidx}`} position={[cx, 0.22, cz]}>
              <cylinderGeometry args={[0.015, 0.01, 0.44, 8]} />
              <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
            </mesh>
          ))}
        </group>
      </group>

      {/* -------------------- 4. GUEST ROOM CREDENZA WITH ARTWORK -------------------- */}
      <group position={[6.0, 0, 6.2]} rotation={[0, Math.PI, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.65, 0.4, 0.2]} position={[0, 0.4, 0]} />
        </RigidBody>
        <RoundedBox args={[1.3, 0.8, 0.4]} radius={0.02} smoothness={3} position={[0, 0.4, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </RoundedBox>
        <mesh position={[0, 0.81, 0]} castShadow>
          <boxGeometry args={[1.34, 0.02, 0.42]} />
          <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.15} clearcoat={0.9} />
        </mesh>
        <SculpturalCeramicVase position={[-0.35, 0.82, 0]} scale={0.85} />
      </group>

      {/* -------------------- 5. CURATED WALL ARTWORK -------------------- */}
      <LuxuryFramedArt position={[6.0, 2.0, 6.38]} rotationY={Math.PI} width={1.0} height={1.2} artVariant="minimalist" />

      {/* -------------------- 6. GUEST ROOM LIGHT SWITCH -------------------- */}
      <group
        position={[2.7, 1.35, 4.25]}
        rotation={[0, Math.PI / 2, 0]}
        userData={{
          interactable: true,
          interactableId: 'guest-light-switch',
          label: isGuestLightOn ? 'Turn Off Guest Room Lights' : 'Turn On Guest Room Lights',
          onInteract: () => toggleGuestLight('guest_bedroom'),
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
          <meshBasicMaterial color={isGuestLightOn ? '#4ADE80' : '#E5E7EB'} />
        </mesh>
      </group>
    </group>
  );
};
