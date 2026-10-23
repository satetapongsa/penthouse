'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { MeshReflectorMaterial } from '@react-three/drei';
import { ARCHITECTURE_CONFIG } from '@/lib/config';
import { useGameStore } from '@/store/useGameStore';
import { Door } from '@/components/doors/Door';
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

interface WallSegmentProps {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  hasBaseboard?: boolean;
}

const WallSegment: React.FC<WallSegmentProps> = ({
  position,
  size,
  color = ARCHITECTURE_CONFIG.colors.wallPlaster,
  hasBaseboard = true,
}) => {
  const [w, h, d] = size;
  const colors = ARCHITECTURE_CONFIG.colors;

  return (
    <group position={position}>
      {/* Physics Collider */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[w / 2, h / 2, d / 2]} />
      </RigidBody>

      {/* Wall Mesh */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.02} />
      </mesh>

      {/* Baseboard Trim */}
      {hasBaseboard && h >= 2.0 && (
        <mesh position={[0, -h / 2 + 0.06, 0]}>
          <boxGeometry args={[w + 0.01, 0.12, d + 0.02]} />
          <meshStandardMaterial
            color={colors.brassTrim}
            roughness={0.35}
            metalness={0.75}
          />
        </mesh>
      )}

      {/* Crown Molding Trim */}
      {h >= 2.0 && (
        <mesh position={[0, h / 2 - 0.06, 0]}>
          <boxGeometry args={[w + 0.01, 0.12, d + 0.02]} />
          <meshStandardMaterial
            color={colors.ceiling}
            roughness={0.6}
            metalness={0.05}
          />
        </mesh>
      )}
    </group>
  );
};

export const PenthouseShell: React.FC = () => {
  const colors = ARCHITECTURE_CONFIG.colors;
  const ceilingH = ARCHITECTURE_CONFIG.ceilingHeight; // 3.4m
  const halfCeiling = ceilingH / 2; // 1.7m
  const wallThick = ARCHITECTURE_CONFIG.wallThickness; // 0.22m

  const lightingStates = useGameStore((s) => s.lightingStates);
  const toggleRoomLight = useGameStore((s) => s.toggleRoomLight);
  const quality = useGameStore((s) => s.quality);

  // Procedural Travertine Tile Texture for indoor floors
  const travertineTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = colors.floorTravertine;
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle veins
    ctx.fillStyle = 'rgba(230, 222, 208, 0.5)';
    for (let i = 0; i < 50; i++) {
      const y = Math.random() * 1024;
      ctx.fillRect(0, y, 1024, Math.random() * 6 + 2);
    }

    // Grid lines for 1.2m x 1.2m tiles
    ctx.strokeStyle = colors.floorGrout;
    ctx.lineWidth = 3;
    for (let i = 0; i <= 1024; i += 256) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 1024);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(1024, i);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(12, 10);
    return tex;
  }, [colors.floorTravertine, colors.floorGrout]);

  // Procedural Outdoor Stone Texture for Sky Terrace
  const terraceStoneTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = colors.floorTerrace;
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#D4CBBD';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 512; i += 128) {
      ctx.strokeRect(i, 0, 128, 512);
      ctx.strokeRect(0, i, 512, 128);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 4);
    return tex;
  }, [colors.floorTerrace]);

  return (
    <group>
      {/* -------------------- 1. ATMOSPHERIC LIGHTING & SUN -------------------- */}
      <AtmosphericLighting />

      {/* Warm Ambient Downlights across main zones (dynamically toggled per zone) */}
      {lightingStates.living && (
        <pointLight position={[2.0, ceilingH - 0.2, -2.0]} color="#FFF3DD" intensity={1.2} distance={10} />
      )}
      {lightingStates.kitchen_dining && (
        <pointLight position={[10.5, ceilingH - 0.2, -2.0]} color="#FFF3DD" intensity={1.0} distance={9} />
      )}
      {lightingStates.master_bedroom && (
        <pointLight position={[-10.5, ceilingH - 0.2, -3.0]} color="#FFF3DD" intensity={1.1} distance={9} />
      )}
      {lightingStates.master_bathroom && (
        <pointLight position={[-8.5, ceilingH - 0.2, 2.5]} color="#FFF3DD" intensity={1.0} distance={7} />
      )}
      {lightingStates.wardrobe && (
        <pointLight position={[-12.5, ceilingH - 0.2, 2.5]} color="#FFF3DD" intensity={0.9} distance={7} />
      )}
      {lightingStates.foyer && (
        <pointLight position={[-0.5, ceilingH - 0.2, 4.0]} color="#FFF3DD" intensity={0.9} distance={7} />
      )}
      {lightingStates.guest_bedroom && (
        <pointLight position={[6.0, ceilingH - 0.2, 4.25]} color="#FFF3DD" intensity={0.9} distance={8} />
      )}
      {lightingStates.hallway && (
        <pointLight position={[-5.0, ceilingH - 0.2, -2.0]} color="#FFF3DD" intensity={0.9} distance={8} />
      )}
      {lightingStates.powder_room && (
        <pointLight position={[-5.0, ceilingH - 0.2, 3.5]} color="#FFF3DD" intensity={0.8} distance={6} />
      )}

      {/* Foyer Wall Light Switch */}
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

      {/* Hallway Wall Light Switch */}
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

      {/* -------------------- 2. FLOORS & CEILINGS -------------------- */}
      {/* Indoor Main Floor Slab (X: -14.5 to 14.0, Z: -6.0 to 6.5) */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[15.0, 0.15, 7.0]} position={[-0.25, -0.15, 0.25]} />
      </RigidBody>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.25, 0, 0.25]} receiveShadow>
        <planeGeometry args={[28.5, 12.5]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={quality === 'low' ? 128 : quality === 'medium' ? 256 : 512}
          mixBlur={0.8}
          mixStrength={1.2}
          roughness={0.25}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color={colors.floorTravertine}
          metalness={0.05}
          mirror={quality === 'low' ? 0.15 : 0.35}
        />
      </mesh>

      {/* Indoor Ceiling Slab (Standard Height 3.4m) */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[15.0, 0.15, 7.0]} position={[-0.25, ceilingH + 0.15, 0.25]} />
      </RigidBody>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[-0.25, ceilingH, 0.25]}>
        <planeGeometry args={[28.5, 12.5]} />
        <meshStandardMaterial color={colors.ceiling} roughness={0.8} />
      </mesh>

      {/* Outdoor Sky Terrace Floor Slab (X: -3.5 to 14.0, Z: -12.0 to -6.0) */}
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

      {/* -------------------- 3. PERIMETER FACADES & WINDOW WALLS -------------------- */}
      {/* North Living & Dining Floor-to-Ceiling Glass Wall (Z = -6.0, X: -3.5 to 14.0) */}
      <group position={[0, 0, -6.0]}>
        {/* Left glass segment: X: -3.5 to 0.9 */}
        <mesh position={[-1.3, halfCeiling, 0]}>
          <planeGeometry args={[4.4, ceilingH]} />
          <meshPhysicalMaterial
            color={colors.glassTint}
            roughness={0.05}
            transmission={0.92}
            thickness={0.08}
            transparent
            opacity={0.35}
          />
        </mesh>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[2.2, halfCeiling, 0.08]} position={[-1.3, halfCeiling, 0]} />
        </RigidBody>

        {/* Right glass segment: X: 3.1 to 14.0 */}
        <mesh position={[8.55, halfCeiling, 0]}>
          <planeGeometry args={[10.9, ceilingH]} />
          <meshPhysicalMaterial
            color={colors.glassTint}
            roughness={0.05}
            transmission={0.92}
            thickness={0.08}
            transparent
            opacity={0.35}
          />
        </mesh>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[5.45, halfCeiling, 0.08]} position={[8.55, halfCeiling, 0]} />
        </RigidBody>

        {/* Header transom above terrace sliding door (X: 0.9 to 3.1, Y: 2.6 to 3.4) */}
        <WallSegment
          position={[2.0, 3.0, 0]}
          size={[2.2, 0.8, wallThick]}
          hasBaseboard={false}
        />

        {/* Architectural Glass Mullions */}
        {[-3.5, -1.3, 0.9, 3.1, 5.5, 8.0, 11.0, 14.0].map((mx, idx) => (
          <mesh key={`north-mullion-${idx}`} position={[mx, halfCeiling, 0]}>
            <boxGeometry args={[0.08, ceilingH, 0.12]} />
            <meshStandardMaterial color={colors.brassTrim} roughness={0.35} metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* North Master Bedroom Panoramic Window Wall (Z = -6.0, X: -14.5 to -6.5) */}
      <group position={[-10.5, halfCeiling, -6.0]}>
        <mesh>
          <planeGeometry args={[8.0, ceilingH]} />
          <meshPhysicalMaterial
            color={colors.glassTint}
            roughness={0.05}
            transmission={0.92}
            thickness={0.08}
            transparent
            opacity={0.35}
          />
        </mesh>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[4.0, halfCeiling, 0.08]} />
        </RigidBody>
        {/* Mullions */}
        {[-4.0, -1.33, 1.33, 4.0].map((mx, idx) => (
          <mesh key={`master-mullion-${idx}`} position={[mx, 0, 0]}>
            <boxGeometry args={[0.08, ceilingH, 0.12]} />
            <meshStandardMaterial color={colors.brassTrim} roughness={0.35} metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* South Perimeter Wall (Core) */}
      {/* 1. Master Suite & Powder South Wall (Z = 5.0, X: -14.5 to -3.5) */}
      <WallSegment position={[-9.0, halfCeiling, 5.0]} size={[11.0, ceilingH, wallThick]} />

      {/* 2. Entrance Foyer South Wall with Door Opening (Z = 6.5, X: -3.5 to 2.5) */}
      {/* Door at X: -0.5, W: 1.4m. Left segment: X: -3.5 to -1.2 (W: 2.3). Center: -2.35 */}
      <WallSegment position={[-2.35, halfCeiling, 6.5]} size={[2.3, ceilingH, wallThick]} />
      {/* Right segment: X: 0.2 to 2.5 (W: 2.3). Center: 1.35 */}
      <WallSegment position={[1.35, halfCeiling, 6.5]} size={[2.3, ceilingH, wallThick]} />
      {/* Header above entrance door (X: -1.2 to 0.2, Y: 2.4 to 3.4) */}
      <WallSegment position={[-0.5, 2.9, 6.5]} size={[1.4, 1.0, wallThick]} hasBaseboard={false} />

      {/* 3. Guest Bedroom South Wall (Z = 6.5, X: 2.5 to 9.5) */}
      <WallSegment position={[6.0, halfCeiling, 6.5]} size={[7.0, ceilingH, wallThick]} />

      {/* West Perimeter Wall (X = -14.5, Z: -6.0 to 5.0) */}
      <WallSegment position={[-14.5, halfCeiling, -0.5]} size={[wallThick, ceilingH, 11.0]} />

      {/* East Perimeter Wall */}
      {/* Kitchen & Dining East Wall (X = 14.0, Z: -6.0 to 2.0) */}
      <WallSegment position={[14.0, halfCeiling, -2.0]} size={[wallThick, ceilingH, 8.0]} />
      {/* Step wall connecting Dining to Guest Bedroom (Z = 2.0, X: 9.5 to 14.0) */}
      <WallSegment position={[11.75, halfCeiling, 2.0]} size={[4.5, ceilingH, wallThick]} />
      {/* Guest Bedroom East Wall (X = 9.5, Z: 2.0 to 6.5) */}
      <WallSegment position={[9.5, halfCeiling, 4.25]} size={[wallThick, ceilingH, 4.5]} />

      {/* -------------------- 4. INTERIOR DIVIDING WALLS & REAL DOORWAYS -------------------- */}

      {/* A. Wall dividing Master Suite from Hallway (X = -6.5, Z: -6.0 to 0.0) */}
      {/* Door at Z: -3.0, W: 1.1m (Z: -3.55 to -2.45) */}
      {/* North segment: Z: -6.0 to -3.55 (D: 2.45m). Center Z = -4.775 */}
      <WallSegment position={[-6.5, halfCeiling, -4.775]} size={[wallThick, ceilingH, 2.45]} />
      {/* South segment: Z: -2.45 to 0.0 (D: 2.45m). Center Z = -1.225 */}
      <WallSegment position={[-6.5, halfCeiling, -1.225]} size={[wallThick, ceilingH, 2.45]} />
      {/* Header lintel above door: Y: 2.4 to 3.4 */}
      <WallSegment position={[-6.5, 2.9, -3.0]} size={[wallThick, 1.0, 1.1]} hasBaseboard={false} />

      {/* B. Wall dividing Master Bedroom from Wardrobe & Bathroom (Z = 0.0, X: -14.5 to -6.5) */}
      {/* Door to Wardrobe at X: -12.5, W: 1.1m (X: -13.05 to -11.95) */}
      {/* West segment: X: -14.5 to -13.05 (W: 1.45m). Center X = -13.775 */}
      <WallSegment position={[-13.775, halfCeiling, 0.0]} size={[1.45, ceilingH, wallThick]} />
      {/* East segment: X: -11.95 to -6.5 (W: 5.45m). Center X = -9.225 */}
      <WallSegment position={[-9.225, halfCeiling, 0.0]} size={[5.45, ceilingH, wallThick]} />
      {/* Header lintel above door */}
      <WallSegment position={[-12.5, 2.9, 0.0]} size={[1.1, 1.0, wallThick]} hasBaseboard={false} />

      {/* C. Wall dividing Wardrobe from Master Bathroom (X = -10.5, Z: 0.0 to 5.0) */}
      {/* Sliding Door at Z: 2.5, W: 1.1m (Z: 1.95 to 3.05) */}
      {/* North segment: Z: 0.0 to 1.95 (D: 1.95m). Center Z = 0.975 */}
      <WallSegment position={[-10.5, halfCeiling, 0.975]} size={[wallThick, ceilingH, 1.95]} />
      {/* South segment: Z: 3.05 to 5.0 (D: 1.95m). Center Z = 4.025 */}
      <WallSegment position={[-10.5, halfCeiling, 4.025]} size={[wallThick, ceilingH, 1.95]} />
      {/* Header lintel above door */}
      <WallSegment position={[-10.5, 2.9, 2.5]} size={[wallThick, 1.0, 1.1]} hasBaseboard={false} />

      {/* D. Wall dividing Master Bathroom from Powder Room (X = -6.5, Z: 0.0 to 5.0) */}
      <WallSegment position={[-6.5, halfCeiling, 2.5]} size={[wallThick, ceilingH, 5.0]} />

      {/* E. Wall dividing Powder Room from Hallway/Foyer (X = -3.5, Z: 2.0 to 5.0) */}
      {/* Door to Powder Room at Z: 3.5, W: 1.0m (Z: 3.0 to 4.0) */}
      {/* North segment: Z: 2.0 to 3.0 (D: 1.0m). Center Z = 2.5 */}
      <WallSegment position={[-3.5, halfCeiling, 2.5]} size={[wallThick, ceilingH, 1.0]} />
      {/* South segment: Z: 4.0 to 5.0 (D: 1.0m). Center Z = 4.5 */}
      <WallSegment position={[-3.5, halfCeiling, 4.5]} size={[wallThick, ceilingH, 1.0]} />
      {/* Header lintel above door */}
      <WallSegment position={[-3.5, 2.9, 3.5]} size={[wallThick, 1.0, 1.0]} hasBaseboard={false} />

      {/* F. Wall dividing Foyer from Guest Bedroom (X = 2.5, Z: 2.0 to 6.5) */}
      {/* Door to Guest Bed at Z: 4.25, W: 1.1m (Z: 3.7 to 4.8) */}
      {/* North segment: Z: 2.0 to 3.7 (D: 1.7m). Center Z = 2.85 */}
      <WallSegment position={[2.5, halfCeiling, 2.85]} size={[wallThick, ceilingH, 1.7]} />
      {/* South segment: Z: 4.8 to 6.5 (D: 1.7m). Center Z = 5.65 */}
      <WallSegment position={[2.5, halfCeiling, 5.65]} size={[wallThick, ceilingH, 1.7]} />
      {/* Header lintel above door */}
      <WallSegment position={[2.5, 2.9, 4.25]} size={[wallThick, 1.0, 1.1]} hasBaseboard={false} />

      {/* G. Wall dividing Living Room from Guest Bedroom (Z = 2.0, X: 2.5 to 7.5) */}
      <WallSegment position={[5.0, halfCeiling, 2.0]} size={[5.0, ceilingH, wallThick]} />

      {/* H. Wall dividing Hallway from Living Room (X = -3.5, Z: -6.0 to 2.0) */}
      {/* Grand open architectural portal / archway connecting Hallway & Living Room (Z: -2.0 to 1.0, W: 3.0m, H: 3.0m) */}
      {/* North wall segment: Z: -6.0 to -2.0 (D: 4.0m). Center Z = -4.0 */}
      <WallSegment position={[-3.5, halfCeiling, -4.0]} size={[wallThick, ceilingH, 4.0]} />
      {/* South wall segment: Z: 1.0 to 2.0 (D: 1.0m). Center Z = 1.5 */}
      <WallSegment position={[-3.5, halfCeiling, 1.5]} size={[wallThick, ceilingH, 1.0]} />
      {/* Header beam above portal (Y: 3.0 to 3.4) */}
      <WallSegment position={[-3.5, 3.2, -0.5]} size={[wallThick, 0.4, 3.0]} hasBaseboard={false} />

      {/* -------------------- 5. ALL 7 DOORS MOUNTED IN REAL DOORWAYS -------------------- */}
      {ARCHITECTURE_CONFIG.doors.map((doorConfig) => (
        <Door key={doorConfig.id} config={doorConfig} />
      ))}

      {/* -------------------- 5B. PUBLIC AREA LUXURY FURNITURE -------------------- */}
      <FoyerFurniture />
      <LivingFurniture />
      <KitchenDiningFurniture />

      {/* -------------------- 5C. PRIVATE SUITES & TERRACE FURNITURE -------------------- */}
      <MasterBedroomFurniture />
      <WardrobeFurniture />
      <MasterBathroomFurniture />
      <GuestBedroomFurniture />
      <PowderRoomFurniture />
      <TerraceFurniture />

      {/* -------------------- 6. PRIVATE SKY TERRACE & JACUZZI BASIN -------------------- */}
      {/* Glass Railing (Height 1.2m) around Terrace perimeter */}
      {/* North Railing (X: -3.5 to 14.0, Z = -12.0) */}
      <group position={[5.25, 0.6, -12.0]}>
        <mesh>
          <planeGeometry args={[17.5, 1.2]} />
          <meshPhysicalMaterial
            color={colors.railingGlass}
            roughness={0.05}
            transmission={0.92}
            thickness={0.05}
            transparent
            opacity={0.4}
          />
        </mesh>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[8.75, 0.6, 0.05]} />
        </RigidBody>
        {/* Top Handrail */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[17.5, 0.05, 0.08]} />
          <meshStandardMaterial color={colors.brassTrim} roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

      {/* West Terrace Railing (X = -3.5, Z: -12.0 to -6.0) */}
      <group position={[-3.5, 0.6, -9.0]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[6.0, 1.2]} />
          <meshPhysicalMaterial
            color={colors.railingGlass}
            roughness={0.05}
            transmission={0.92}
            thickness={0.05}
            transparent
            opacity={0.4}
          />
        </mesh>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.05, 0.6, 3.0]} />
        </RigidBody>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.08, 0.05, 6.0]} />
          <meshStandardMaterial color={colors.brassTrim} roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

      {/* East Terrace Railing (X = 14.0, Z: -12.0 to -6.0) */}
      <group position={[14.0, 0.6, -9.0]}>
        <mesh rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[6.0, 1.2]} />
          <meshPhysicalMaterial
            color={colors.railingGlass}
            roughness={0.05}
            transmission={0.92}
            thickness={0.05}
            transparent
            opacity={0.4}
          />
        </mesh>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.05, 0.6, 3.0]} />
        </RigidBody>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.08, 0.05, 6.0]} />
          <meshStandardMaterial color={colors.brassTrim} roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

      {/* Sunken/Raised Luxury Jacuzzi / Pool Basin on the Terrace */}
      {/* Basin Center: [10.75, 0.4, -9.5], Width: 4.5, Depth: 4.0, Rim Height: 0.45 */}
      <group position={[10.75, 0.25, -9.5]}>
        {/* Basin Rim Coping (Travertine Slab) */}
        {/* North Rim */}
        <mesh position={[0, 0.15, -1.85]} receiveShadow>
          <boxGeometry args={[4.5, 0.5, 0.4]} />
          <meshStandardMaterial color={colors.floorTravertine} roughness={0.4} />
        </mesh>
        {/* South Rim */}
        <mesh position={[0, 0.15, 1.85]} receiveShadow>
          <boxGeometry args={[4.5, 0.5, 0.4]} />
          <meshStandardMaterial color={colors.floorTravertine} roughness={0.4} />
        </mesh>
        {/* West Rim */}
        <mesh position={[-2.1, 0.15, 0]} receiveShadow>
          <boxGeometry args={[0.4, 0.5, 3.3]} />
          <meshStandardMaterial color={colors.floorTravertine} roughness={0.4} />
        </mesh>
        {/* East Rim */}
        <mesh position={[2.1, 0.15, 0]} receiveShadow>
          <boxGeometry args={[0.4, 0.5, 3.3]} />
          <meshStandardMaterial color={colors.floorTravertine} roughness={0.4} />
        </mesh>

        {/* Jacuzzi Rim Physical Colliders */}
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[2.25, 0.25, 0.2]} position={[0, 0.15, -1.85]} />
          <CuboidCollider args={[2.25, 0.25, 0.2]} position={[0, 0.15, 1.85]} />
          <CuboidCollider args={[0.2, 0.25, 1.65]} position={[-2.1, 0.15, 0]} />
          <CuboidCollider args={[0.2, 0.25, 1.65]} position={[2.1, 0.15, 0]} />
        </RigidBody>

        {/* Interior Sunken Basin Floor (Empty for now) */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[3.8, 0.1, 3.3]} />
          <meshStandardMaterial color="#DDD3C3" roughness={0.5} />
        </mesh>

        {/* Access Step on West side */}
        <mesh position={[-2.45, 0.05, 0]}>
          <boxGeometry args={[0.35, 0.2, 1.6]} />
          <meshStandardMaterial color={colors.floorTravertine} roughness={0.4} />
        </mesh>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.175, 0.1, 0.8]} position={[-2.45, 0.05, 0]} />
        </RigidBody>
      </group>

      {/* -------------------- 7. PROCEDURAL CITY SKYLINE & METROPOLIS -------------------- */}
      <CitySkyline />
    </group>
  );
};
