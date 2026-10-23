'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { ARCHITECTURE_CONFIG } from '@/lib/config';

export const TestRoom: React.FC = () => {
  const room = ARCHITECTURE_CONFIG.rooms.gallery;
  const { width, depth, height, wallThickness } = room;
  const colors = ARCHITECTURE_CONFIG.colors;

  // Procedural Travertine Tile Texture for the floor
  const floorTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Base ivory limestone tone
    ctx.fillStyle = colors.floor;
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle natural travertine marbling streaks
    ctx.fillStyle = 'rgba(235, 227, 213, 0.4)';
    for (let i = 0; i < 60; i++) {
      const y = Math.random() * 1024;
      const h = Math.random() * 8 + 2;
      ctx.fillRect(0, y, 1024, h);
    }

    // Grid joints for 1.2m x 1.2m luxury slabs
    ctx.strokeStyle = colors.floorGrout;
    ctx.lineWidth = 4;
    const gridSize = 256;
    for (let x = 0; x <= 1024; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      ctx.stroke();
    }
    for (let y = 0; y <= 1024; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(width / 2.4, depth / 2.4);
    return texture;
  }, [colors.floor, colors.floorGrout, width, depth]);

  // Window mullions division
  const windowPanels = 6;
  const panelWidth = width / windowPanels;

  return (
    <group>
      {/* -------------------- LIGHTING SYSTEM -------------------- */}
      {/* Ambient warm fill */}
      <ambientLight color={colors.ambientLight} intensity={0.9} />

      {/* Hemisphere Light for soft bounce between sky and travertine floor */}
      <hemisphereLight
        color={colors.skyZenith}
        groundColor={colors.floor}
        intensity={0.65}
      />

      {/* Sun Light streaming through the north window wall */}
      <directionalLight
        color={colors.sunLight}
        intensity={2.4}
        position={[8, 12, -14]}
        target-position={[0, 1, 0]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={45}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
      />

      {/* Recessed Architectural Warm Downlights */}
      <pointLight
        position={[-3.5, height - 0.2, 0]}
        color="#FFF0D4"
        intensity={1.2}
        distance={8}
        decay={2}
      />
      <pointLight
        position={[3.5, height - 0.2, 0]}
        color="#FFF0D4"
        intensity={1.2}
        distance={8}
        decay={2}
      />

      {/* -------------------- COLLIDERS & ROOM SHELL -------------------- */}
      <RigidBody type="fixed" colliders={false}>
        {/* Floor Collider */}
        <CuboidCollider args={[width / 2 + 1, 0.2, depth / 2 + 1]} position={[0, -0.2, 0]} />

        {/* Ceiling Collider (height = 3.4m) */}
        <CuboidCollider
          args={[width / 2 + 1, 0.2, depth / 2 + 1]}
          position={[0, height + 0.2, 0]}
        />

        {/* South Wall (Back) */}
        <CuboidCollider
          args={[width / 2, height / 2, wallThickness / 2]}
          position={[0, height / 2, depth / 2 + wallThickness / 2]}
        />

        {/* West Wall (Left) */}
        <CuboidCollider
          args={[wallThickness / 2, height / 2, depth / 2]}
          position={[-width / 2 - wallThickness / 2, height / 2, 0]}
        />

        {/* East Wall (Right) */}
        <CuboidCollider
          args={[wallThickness / 2, height / 2, depth / 2]}
          position={[width / 2 + wallThickness / 2, height / 2, 0]}
        />

        {/* North Window Wall Collider (Floor-to-ceiling glass barrier) */}
        <CuboidCollider
          args={[width / 2, height / 2, 0.1]}
          position={[0, height / 2, -depth / 2]}
        />
      </RigidBody>

      {/* -------------------- VISUAL MESHES -------------------- */}

      {/* 1. Floor Slab */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial
          color={colors.floor}
          map={floorTexture || undefined}
          roughness={0.45}
          metalness={0.05}
        />
      </mesh>

      {/* 2. Ceiling with Recessed Architectural Pockets */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, height, 0]}
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial
          color={colors.ceiling}
          roughness={0.85}
          metalness={0.0}
        />
      </mesh>

      {/* Recessed ceiling light trims */}
      {[-3.5, 3.5].map((x) => (
        <group key={`light-trim-${x}`} position={[x, height - 0.02, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.08, 0.12, 32]} />
            <meshStandardMaterial color={colors.brassTrim} metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.08, 32]} />
            <meshBasicMaterial color="#FFF9E6" />
          </mesh>
        </group>
      ))}

      {/* 3. South Solid Wall */}
      <mesh position={[0, height / 2, depth / 2]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color={colors.wallPlaster}
          roughness={0.7}
          metalness={0.02}
        />
      </mesh>

      {/* 4. West Solid Wall */}
      <mesh
        position={[-width / 2, height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial
          color={colors.wallPlaster}
          roughness={0.7}
          metalness={0.02}
        />
      </mesh>

      {/* 5. East Solid Wall */}
      <mesh
        position={[width / 2, height / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial
          color={colors.wallPlaster}
          roughness={0.7}
          metalness={0.02}
        />
      </mesh>

      {/* -------------------- ARCHITECTURAL BASEBOARDS (BRUSHED BRASS) -------------------- */}
      {/* South Wall Baseboard */}
      <mesh position={[0, 0.06, depth / 2 - 0.01]}>
        <boxGeometry args={[width, 0.12, 0.02]} />
        <meshStandardMaterial color={colors.brassTrim} roughness={0.35} metalness={0.75} />
      </mesh>

      {/* West Wall Baseboard */}
      <mesh position={[-width / 2 + 0.01, 0.06, 0]}>
        <boxGeometry args={[0.02, 0.12, depth]} />
        <meshStandardMaterial color={colors.brassTrim} roughness={0.35} metalness={0.75} />
      </mesh>

      {/* East Wall Baseboard */}
      <mesh position={[width / 2 - 0.01, 0.06, 0]}>
        <boxGeometry args={[0.02, 0.12, depth]} />
        <meshStandardMaterial color={colors.brassTrim} roughness={0.35} metalness={0.75} />
      </mesh>

      {/* -------------------- FLOOR-TO-CEILING WINDOW WALL -------------------- */}
      <group position={[0, 0, -depth / 2]}>
        {/* Top Header Mullion */}
        <mesh position={[0, height - 0.05, 0]}>
          <boxGeometry args={[width, 0.1, 0.12]} />
          <meshStandardMaterial color={colors.brassTrim} roughness={0.35} metalness={0.8} />
        </mesh>

        {/* Bottom Sill Mullion */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[width, 0.08, 0.12]} />
          <meshStandardMaterial color={colors.brassTrim} roughness={0.35} metalness={0.8} />
        </mesh>

        {/* Vertical Mullions */}
        {Array.from({ length: windowPanels + 1 }).map((_, i) => {
          const x = -width / 2 + i * panelWidth;
          return (
            <mesh key={`mullion-${i}`} position={[x, height / 2, 0]}>
              <boxGeometry args={[0.06, height, 0.12]} />
              <meshStandardMaterial color={colors.brassTrim} roughness={0.35} metalness={0.8} />
            </mesh>
          );
        })}

        {/* Architectural Glass Panes */}
        <mesh position={[0, height / 2, 0]}>
          <planeGeometry args={[width, height]} />
          <meshPhysicalMaterial
            color={colors.glassTint}
            roughness={0.05}
            transmission={0.92}
            thickness={0.1}
            ior={1.5}
            reflectivity={0.9}
            transparent
            opacity={0.35}
          />
        </mesh>
      </group>

      {/* -------------------- PROCEDURAL EXTERIOR SKYLINE PANORAMA -------------------- */}
      {/* Outside the floor-to-ceiling window wall */}
      <group position={[0, 0, -depth / 2 - 25]}>
        {/* Soft Sky Backdrop Plane */}
        <mesh position={[0, 15, -15]}>
          <planeGeometry args={[140, 60]} />
          <meshBasicMaterial color="#E0EDF5" />
        </mesh>

        {/* Distant Sun Glow */}
        <mesh position={[25, 22, -14]}>
          <circleGeometry args={[9, 32]} />
          <meshBasicMaterial color="#FFF9E0" transparent opacity={0.85} />
        </mesh>

        {/* Procedural High-Rise Metropolitan Skyline Silhouettes */}
        {useMemo(() => {
          const buildings = [
            { x: -35, w: 9, h: 28, z: -10, color: '#C6D7E4' },
            { x: -22, w: 12, h: 36, z: -8, color: '#BDCFDE' },
            { x: -10, w: 8, h: 22, z: -12, color: '#CAD9E5' },
            { x: 2, w: 14, h: 42, z: -7, color: '#B4C7D7' },
            { x: 16, w: 10, h: 31, z: -9, color: '#C0D2E1' },
            { x: 29, w: 11, h: 26, z: -11, color: '#C9D9E6' },
            { x: 42, w: 13, h: 38, z: -8, color: '#B6C9DA' },
          ];

          return buildings.map((b, idx) => (
            <mesh key={`building-${idx}`} position={[b.x, b.h / 2 - 6, b.z]}>
              <boxGeometry args={[b.w, b.h, 6]} />
              <meshBasicMaterial color={b.color} />
            </mesh>
          ));
        }, [])}
      </group>

      {/* -------------------- INTERIOR LUXURY ACCENT FURNISHINGS -------------------- */}
      {/* Low-profile floating credenza against South Wall (pale Scandinavian oak + travertine) */}
      <group position={[0, 0.45, depth / 2 - 0.5]}>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh castShadow receiveShadow>
            <boxGeometry args={[4.2, 0.5, 0.6]} />
            <meshStandardMaterial color={colors.paleOak} roughness={0.6} metalness={0.05} />
          </mesh>
        </RigidBody>
        {/* Polished brass credenza trim */}
        <mesh position={[0, 0.26, 0.0]}>
          <boxGeometry args={[4.24, 0.02, 0.64]} />
          <meshStandardMaterial color={colors.brassTrim} metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Sculptural Travertine Planter with Sage Green Foliage in Corner */}
      <group position={[-width / 2 + 1.2, 0, depth / 2 - 1.2]}>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.35, 0.28, 0.9, 24]} />
            <meshStandardMaterial color={colors.wallAccent} roughness={0.5} />
          </mesh>
        </RigidBody>
        {/* Soft Sage Plant Foliage */}
        <group position={[0, 0.95, 0]}>
          <mesh position={[0, 0.35, 0]} rotation={[0.2, 0.4, 0.1]} castShadow>
            <sphereGeometry args={[0.32, 16, 16]} />
            <meshStandardMaterial color="#8A9A86" roughness={0.8} />
          </mesh>
          <mesh position={[0.2, 0.45, 0.1]} rotation={[-0.3, 0.8, 0.2]} castShadow>
            <sphereGeometry args={[0.26, 16, 16]} />
            <meshStandardMaterial color="#97A693" roughness={0.8} />
          </mesh>
          <mesh position={[-0.15, 0.5, -0.1]} rotation={[0.4, -0.5, -0.2]} castShadow>
            <sphereGeometry args={[0.28, 16, 16]} />
            <meshStandardMaterial color="#7E8F7A" roughness={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
