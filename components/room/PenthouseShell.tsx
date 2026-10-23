'use client';

import React, { useMemo } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { ARCHITECTURE_CONFIG } from '@/lib/config';
import { getTravertineFloorTexture, getTerraceStoneTexture } from '@/lib/materials';
import { useGameStore } from '@/store/useGameStore';
import { Door } from '@/components/doors/Door';
import { PenthouseWalls } from '@/components/room/PenthouseWalls';
import { FoyerFurniture } from '@/components/furniture/foyer/FoyerFurniture';
import { LivingFurniture } from '@/components/furniture/living/LivingFurniture';
import { KitchenDiningFurniture } from '@/components/furniture/kitchen/KitchenDiningFurniture';
import { MasterBedroomFurniture } from '@/components/furniture/bedroom/MasterBedroomFurniture';
import { WardrobeFurniture } from '@/components/furniture/wardrobe/WardrobeFurniture';
import { MasterBathroomFurniture } from '@/components/furniture/bathroom/MasterBathroomFurniture';
import { GuestBedroomFurniture } from '@/components/furniture/guest/GuestBedroomFurniture';
import { PowderRoomFurniture } from '@/components/furniture/powder/PowderRoomFurniture';
import { TerraceFurniture } from '@/components/furniture/terrace/TerraceFurniture';
import { CitySkyline } from '@/components/environment/CitySkyline';
import { AtmosphericLighting } from '@/components/environment/AtmosphericLighting';

export const PenthouseShell: React.FC = () => {
  const colors = ARCHITECTURE_CONFIG.colors;
  const ceilingH = ARCHITECTURE_CONFIG.ceilingHeight;

  const currentRoomId = useGameStore((s) => s.currentRoomId);
  const lightingStates = useGameStore((s) => s.lightingStates);
  const toggleRoomLight = useGameStore((s) => s.toggleRoomLight);

  // Cached procedural textures (reused, zero re-generation on render)
  const travertineTexture = useMemo(() => getTravertineFloorTexture(), []);
  const terraceStoneTexture = useMemo(() => getTerraceStoneTexture(), []);

  // Room Culling & Dynamic Lighting: Calculate visible & lit rooms based on player room & adjacency
  const visibleRooms = useMemo(() => {
    const adjacent = ARCHITECTURE_CONFIG.roomAdjacency[currentRoomId] || [];
    return new Set<string>([currentRoomId, ...adjacent]);
  }, [currentRoomId]);

  return (
    <group>
      {/* -------------------- 1. ATMOSPHERIC LIGHTING & SUN -------------------- */}
      <AtmosphericLighting />

      {/* Dynamic Capped Point Lights: Only active for the player's current room and directly adjacent rooms */}
      {lightingStates.living && visibleRooms.has('living') && (
        <pointLight position={[2.0, ceilingH - 0.2, -2.0]} color="#FFF3DD" intensity={1.2} distance={10} />
      )}
      {lightingStates.kitchen_dining && visibleRooms.has('kitchen_dining') && (
        <pointLight position={[10.5, ceilingH - 0.2, -2.0]} color="#FFF3DD" intensity={1.0} distance={9} />
      )}
      {lightingStates.master_bedroom && visibleRooms.has('master_bedroom') && (
        <pointLight position={[-10.5, ceilingH - 0.2, -3.0]} color="#FFF3DD" intensity={1.1} distance={9} />
      )}
      {lightingStates.master_bathroom && visibleRooms.has('master_bathroom') && (
        <pointLight position={[-8.5, ceilingH - 0.2, 2.5]} color="#FFF3DD" intensity={1.0} distance={7} />
      )}
      {lightingStates.wardrobe && visibleRooms.has('wardrobe') && (
        <pointLight position={[-12.5, ceilingH - 0.2, 2.5]} color="#FFF3DD" intensity={0.9} distance={7} />
      )}
      {lightingStates.foyer && visibleRooms.has('foyer') && (
        <pointLight position={[-0.5, ceilingH - 0.2, 4.0]} color="#FFF3DD" intensity={0.9} distance={7} />
      )}
      {lightingStates.guest_bedroom && visibleRooms.has('guest_bedroom') && (
        <pointLight position={[6.0, ceilingH - 0.2, 4.25]} color="#FFF3DD" intensity={0.9} distance={8} />
      )}
      {lightingStates.hallway && visibleRooms.has('hallway') && (
        <pointLight position={[-5.0, ceilingH - 0.2, -2.0]} color="#FFF3DD" intensity={0.9} distance={8} />
      )}
      {lightingStates.powder_room && visibleRooms.has('powder_room') && (
        <pointLight position={[-5.0, ceilingH - 0.2, 3.5]} color="#FFF3DD" intensity={0.8} distance={6} />
      )}

      {/* Wall Light Switches */}
      <group
        position={[0.3, 1.35, 6.42]}
        rotation={[0, Math.PI, 0]}
        userData={{
          interactable: true,
          interactableId: 'foyer-light-switch',
          label: lightingStates.foyer ? 'Turn Off Foyer Lights' : 'Turn On Foyer Lights',
          onInteract: () => toggleRoomLight('foyer'),
        }}
      >
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.12, 0.015]} />
          <meshStandardMaterial color={colors.brassTrim} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[0.025, 0.045, 0.01]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.035, 0.01]}>
          <circleGeometry args={[0.004, 16]} />
          <meshBasicMaterial color={lightingStates.foyer ? '#4ADE80' : '#E5E7EB'} />
        </mesh>
      </group>

      <group
        position={[-6.42, 1.35, -2.0]}
        rotation={[0, Math.PI / 2, 0]}
        userData={{
          interactable: true,
          interactableId: 'hallway-light-switch',
          label: lightingStates.hallway ? 'Turn Off Hallway Lights' : 'Turn On Hallway Lights',
          onInteract: () => toggleRoomLight('hallway'),
        }}
      >
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.12, 0.015]} />
          <meshStandardMaterial color={colors.brassTrim} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[0.025, 0.045, 0.01]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.035, 0.01]}>
          <circleGeometry args={[0.004, 16]} />
          <meshBasicMaterial color={lightingStates.hallway ? '#4ADE80' : '#E5E7EB'} />
        </mesh>
      </group>

      {/* -------------------- 2. HIGH-PERFORMANCE FLOORS & CEILINGS -------------------- */}
      {/* Indoor Main Floor Slab with Clearcoat MeshPhysicalMaterial (Butter-smooth, zero extra scene render pass) */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[15.0, 0.15, 7.0]} position={[-0.25, -0.15, 0.25]} />
      </RigidBody>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.25, 0, 0.25]} receiveShadow>
        <planeGeometry args={[28.5, 12.5]} />
        <meshPhysicalMaterial
          color={colors.floorTravertine}
          map={travertineTexture || undefined}
          roughness={0.16}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          metalness={0.02}
          reflectivity={0.65}
        />
      </mesh>

      {/* Indoor Ceiling Slab */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[15.0, 0.15, 7.0]} position={[-0.25, ceilingH + 0.15, 0.25]} />
      </RigidBody>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[-0.25, ceilingH, 0.25]}>
        <planeGeometry args={[28.5, 12.5]} />
        <meshStandardMaterial color={colors.ceiling} roughness={0.8} />
      </mesh>

      {/* Outdoor Sky Terrace Floor Slab */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[8.75, 0.15, 3.0]} position={[5.25, -0.15, -9.0]} />
      </RigidBody>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.25, 0, -9.0]} receiveShadow>
        <planeGeometry args={[17.5, 6.0]} />
        <meshStandardMaterial
          color={colors.floorTerrace}
          map={terraceStoneTexture || undefined}
          roughness={0.65}
        />
      </mesh>

      {/* -------------------- 3. ARCHITECTURAL WALLS & DOORS -------------------- */}
      <PenthouseWalls />

      {ARCHITECTURE_CONFIG.doors.map((doorConfig) => (
        <Door key={doorConfig.id} config={doorConfig} />
      ))}

      {/* -------------------- 4. ROOM FURNITURE WITH OCCLUSION CULLING -------------------- */}
      <group visible={visibleRooms.has('foyer')}>
        <FoyerFurniture />
      </group>

      <group visible={visibleRooms.has('living')}>
        <LivingFurniture />
      </group>

      <group visible={visibleRooms.has('kitchen_dining')}>
        <KitchenDiningFurniture />
      </group>

      <group visible={visibleRooms.has('master_bedroom')}>
        <MasterBedroomFurniture />
      </group>

      <group visible={visibleRooms.has('wardrobe')}>
        <WardrobeFurniture />
      </group>

      <group visible={visibleRooms.has('master_bathroom')}>
        <MasterBathroomFurniture />
      </group>

      <group visible={visibleRooms.has('guest_bedroom')}>
        <GuestBedroomFurniture />
      </group>

      <group visible={visibleRooms.has('powder_room')}>
        <PowderRoomFurniture />
      </group>

      <group visible={visibleRooms.has('terrace')}>
        <TerraceFurniture />
      </group>

      {/* Jacuzzi Rim Coping on Terrace */}
      <group position={[10.75, 0.25, -9.5]} visible={visibleRooms.has('terrace')}>
        <mesh position={[0, 0.15, -1.85]} receiveShadow>
          <boxGeometry args={[4.5, 0.5, 0.4]} />
          <meshStandardMaterial color={colors.floorTravertine} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.15, 1.85]} receiveShadow>
          <boxGeometry args={[4.5, 0.5, 0.4]} />
          <meshStandardMaterial color={colors.floorTravertine} roughness={0.4} />
        </mesh>
        <mesh position={[-2.1, 0.15, 0]} receiveShadow>
          <boxGeometry args={[0.4, 0.5, 3.3]} />
          <meshStandardMaterial color={colors.floorTravertine} roughness={0.4} />
        </mesh>
        <mesh position={[2.1, 0.15, 0]} receiveShadow>
          <boxGeometry args={[0.4, 0.5, 3.3]} />
          <meshStandardMaterial color={colors.floorTravertine} roughness={0.4} />
        </mesh>

        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[2.25, 0.25, 0.2]} position={[0, 0.15, -1.85]} />
          <CuboidCollider args={[2.25, 0.25, 0.2]} position={[0, 0.15, 1.85]} />
          <CuboidCollider args={[0.2, 0.25, 1.65]} position={[-2.1, 0.15, 0]} />
          <CuboidCollider args={[0.2, 0.25, 1.65]} position={[2.1, 0.15, 0]} />
        </RigidBody>

        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[3.8, 0.1, 3.3]} />
          <meshStandardMaterial color="#DDD3C3" roughness={0.5} />
        </mesh>

        <mesh position={[-2.45, 0.05, 0]}>
          <boxGeometry args={[0.35, 0.2, 1.6]} />
          <meshStandardMaterial color={colors.floorTravertine} roughness={0.4} />
        </mesh>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.175, 0.1, 0.8]} position={[-2.45, 0.05, 0]} />
        </RigidBody>
      </group>

      {/* -------------------- 5. CITY SKYLINE -------------------- */}
      <CitySkyline />
    </group>
  );
};
