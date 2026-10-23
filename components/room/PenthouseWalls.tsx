'use client';

import React from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { ARCHITECTURE_CONFIG } from '@/lib/config';

interface WallSegmentProps {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  hasBaseboard?: boolean;
}

export const WallSegment: React.FC<WallSegmentProps> = ({
  position,
  size,
  color = ARCHITECTURE_CONFIG.colors.wallPlaster,
  hasBaseboard = true,
}) => {
  const [w, h, d] = size;
  const colors = ARCHITECTURE_CONFIG.colors;

  return (
    <group position={position}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[w / 2, h / 2, d / 2]} />
      </RigidBody>

      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.02} />
      </mesh>

      {hasBaseboard && h >= 2.0 && (
        <mesh position={[0, -h / 2 + 0.06, 0]}>
          <boxGeometry args={[w + 0.01, 0.12, d + 0.02]} />
          <meshStandardMaterial color={colors.brassTrim} roughness={0.35} metalness={0.75} />
        </mesh>
      )}

      {h >= 2.0 && (
        <mesh position={[0, h / 2 - 0.06, 0]}>
          <boxGeometry args={[w + 0.01, 0.12, d + 0.02]} />
          <meshStandardMaterial color={colors.ceiling} roughness={0.6} metalness={0.05} />
        </mesh>
      )}
    </group>
  );
};

export const PenthouseWalls: React.FC = () => {
  const colors = ARCHITECTURE_CONFIG.colors;
  const ceilingH = ARCHITECTURE_CONFIG.ceilingHeight; // 3.4m
  const halfCeiling = ceilingH / 2;
  const wallThick = ARCHITECTURE_CONFIG.wallThickness; // 0.22m

  return (
    <group>
      {/* 1. NORTH FACADES & WINDOW WALLS */}
      {/* North Living & Dining Floor-to-Ceiling Glass Wall (Z = -6.0) */}
      <group position={[0, 0, -6.0]}>
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

        <WallSegment position={[2.0, 3.0, 0]} size={[2.2, 0.8, wallThick]} hasBaseboard={false} />

        {[-3.5, -1.3, 0.9, 3.1, 5.5, 8.0, 11.0, 14.0].map((mx, idx) => (
          <mesh key={`north-mullion-${idx}`} position={[mx, halfCeiling, 0]}>
            <boxGeometry args={[0.08, ceilingH, 0.12]} />
            <meshStandardMaterial color={colors.brassTrim} roughness={0.35} metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* North Master Bedroom Panoramic Window Wall */}
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
        {[-4.0, -1.33, 1.33, 4.0].map((mx, idx) => (
          <mesh key={`master-mullion-${idx}`} position={[mx, 0, 0]}>
            <boxGeometry args={[0.08, ceilingH, 0.12]} />
            <meshStandardMaterial color={colors.brassTrim} roughness={0.35} metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* 2. PERIMETER ENVELOPE */}
      <WallSegment position={[-9.0, halfCeiling, 5.0]} size={[11.0, ceilingH, wallThick]} />
      <WallSegment position={[-2.35, halfCeiling, 6.5]} size={[2.3, ceilingH, wallThick]} />
      <WallSegment position={[1.35, halfCeiling, 6.5]} size={[2.3, ceilingH, wallThick]} />
      <WallSegment position={[-0.5, 2.9, 6.5]} size={[1.4, 1.0, wallThick]} hasBaseboard={false} />
      <WallSegment position={[6.0, halfCeiling, 6.5]} size={[7.0, ceilingH, wallThick]} />
      <WallSegment position={[-14.5, halfCeiling, -0.5]} size={[wallThick, ceilingH, 11.0]} />
      <WallSegment position={[14.0, halfCeiling, -2.0]} size={[wallThick, ceilingH, 8.0]} />
      <WallSegment position={[11.75, halfCeiling, 2.0]} size={[4.5, ceilingH, wallThick]} />
      <WallSegment position={[9.5, halfCeiling, 4.25]} size={[wallThick, ceilingH, 4.5]} />

      {/* 3. INTERIOR DIVIDING WALLS */}
      {/* Master Suite / Hallway */}
      <WallSegment position={[-6.5, halfCeiling, -4.775]} size={[wallThick, ceilingH, 2.45]} />
      <WallSegment position={[-6.5, halfCeiling, -1.225]} size={[wallThick, ceilingH, 2.45]} />
      <WallSegment position={[-6.5, 2.9, -3.0]} size={[wallThick, 1.0, 1.1]} hasBaseboard={false} />

      {/* Master Bed / Wardrobe */}
      <WallSegment position={[-13.775, halfCeiling, 0.0]} size={[1.45, ceilingH, wallThick]} />
      <WallSegment position={[-9.225, halfCeiling, 0.0]} size={[5.45, ceilingH, wallThick]} />
      <WallSegment position={[-12.5, 2.9, 0.0]} size={[1.1, 1.0, wallThick]} hasBaseboard={false} />

      {/* Wardrobe / Bath */}
      <WallSegment position={[-10.5, halfCeiling, 0.975]} size={[wallThick, ceilingH, 1.95]} />
      <WallSegment position={[-10.5, halfCeiling, 4.025]} size={[wallThick, ceilingH, 1.95]} />
      <WallSegment position={[-10.5, 2.9, 2.5]} size={[wallThick, 1.0, 1.1]} hasBaseboard={false} />

      {/* Master Bath / Powder */}
      <WallSegment position={[-6.5, halfCeiling, 2.5]} size={[wallThick, ceilingH, 5.0]} />

      {/* Powder / Foyer */}
      <WallSegment position={[-3.5, halfCeiling, 2.5]} size={[wallThick, ceilingH, 1.0]} />
      <WallSegment position={[-3.5, halfCeiling, 4.5]} size={[wallThick, ceilingH, 1.0]} />
      <WallSegment position={[-3.5, 2.9, 3.5]} size={[wallThick, 1.0, 1.0]} hasBaseboard={false} />

      {/* Foyer / Guest Bed */}
      <WallSegment position={[2.5, halfCeiling, 2.85]} size={[wallThick, ceilingH, 1.7]} />
      <WallSegment position={[2.5, halfCeiling, 5.65]} size={[wallThick, ceilingH, 1.7]} />
      <WallSegment position={[2.5, 2.9, 4.25]} size={[wallThick, 1.0, 1.1]} hasBaseboard={false} />

      {/* Living / Guest Bed */}
      <WallSegment position={[5.0, halfCeiling, 2.0]} size={[5.0, ceilingH, wallThick]} />

      {/* Hallway / Living Grand Archway */}
      <WallSegment position={[-3.5, halfCeiling, -4.0]} size={[wallThick, ceilingH, 4.0]} />
      <WallSegment position={[-3.5, halfCeiling, 1.5]} size={[wallThick, ceilingH, 1.0]} />
      <WallSegment position={[-3.5, 3.2, -0.5]} size={[wallThick, 0.4, 3.0]} hasBaseboard={false} />

      {/* 4. TERRACE GLASS RAILINGS */}
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
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[17.5, 0.05, 0.08]} />
          <meshStandardMaterial color={colors.brassTrim} roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

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
    </group>
  );
};
