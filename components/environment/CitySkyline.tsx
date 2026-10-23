'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/store/useGameStore';

export const CitySkyline: React.FC = () => {
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const quality = useGameStore((s) => s.quality);

  const cloudsRef = useRef<THREE.Group>(null);
  const beaconsRef = useRef<THREE.InstancedMesh>(null);
  const birdsRef = useRef<THREE.Group>(null);
  const buildingsMeshRef = useRef<THREE.InstancedMesh>(null);
  const buildingMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const riverRef = useRef<THREE.Mesh>(null);

  // Procedural Skyscraper Window Texture
  const windowTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Base skyscraper concrete facade
    ctx.fillStyle = '#222831';
    ctx.fillRect(0, 0, 512, 512);

    // Architectural window grid
    const cols = 16;
    const rows = 32;
    const cellW = 512 / cols;
    const cellH = 512 / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Pseudo-random lit vs unlit windows
        const rand = Math.sin(r * 99 + c * 33);
        const isLit = rand > -0.2;
        if (isLit) {
          const warm = rand > 0.4;
          ctx.fillStyle = warm ? '#FFE4A0' : '#E8F4FC';
          ctx.fillRect(c * cellW + 3, r * cellH + 2, cellW - 6, cellH - 4);
        } else {
          ctx.fillStyle = '#11151C';
          ctx.fillRect(c * cellW + 3, r * cellH + 2, cellW - 6, cellH - 4);
        }
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 8);
    return tex;
  }, []);

  // Pre-generate 180+ Instanced Building Transforms
  const buildingCount = quality === 'low' ? 70 : quality === 'medium' ? 140 : 210;

  const buildingData = useMemo(() => {
    const list: { pos: [number, number, number]; scale: [number, number, number]; spireHeight?: number }[] = [];

    // Deterministic pseudo-random seed
    let seed = 42;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // North Panorama Towers (Z: -32 to -130, X: -90 to 90)
    for (let i = 0; i < 120; i++) {
      const x = (random() - 0.5) * 170;
      const z = -32 - random() * 95;
      const w = 10 + random() * 16;
      const d = 10 + random() * 16;
      // Tall landmark towers in center horizon
      const distFromCenter = Math.abs(x);
      const isMegaTower = distFromCenter < 35 && random() > 0.75;
      const h = isMegaTower ? 65 + random() * 55 : 28 + random() * 45;
      const spire = isMegaTower && random() > 0.5 ? 12 + random() * 15 : undefined;
      list.push({ pos: [x, h / 2 - 4.5, z], scale: [w, h, d], spireHeight: spire });
    }

    // East Skyline Towers (X: 30 to 110, Z: -35 to 45)
    for (let i = 0; i < 50; i++) {
      const x = 32 + random() * 75;
      const z = (random() - 0.5) * 80;
      const w = 9 + random() * 14;
      const d = 9 + random() * 14;
      const h = 25 + random() * 50;
      list.push({ pos: [x, h / 2 - 4.5, z], scale: [w, h, d] });
    }

    // West Skyline Towers (X: -30 to -110, Z: -35 to 45)
    for (let i = 0; i < 50; i++) {
      const x = -32 - random() * 75;
      const z = (random() - 0.5) * 80;
      const w = 9 + random() * 14;
      const d = 9 + random() * 14;
      const h = 25 + random() * 50;
      list.push({ pos: [x, h / 2 - 4.5, z], scale: [w, h, d] });
    }

    return list.slice(0, 210);
  }, []);

  // Initialize Building Instanced Matrices
  useEffect(() => {
    if (!buildingsMeshRef.current) return;
    const mesh = buildingsMeshRef.current;
    const dummy = new THREE.Object3D();

    for (let i = 0; i < buildingCount; i++) {
      const b = buildingData[i];
      if (!b) break;
      dummy.position.set(b.pos[0], b.pos[1], b.pos[2]);
      dummy.scale.set(b.scale[0], b.scale[1], b.scale[2]);
      dummy.rotation.set(0, (i % 4) * 0.1, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [buildingCount, buildingData]);

  // Setup Aircraft Warning Beacons (Top 15 Tallest Towers)
  const beaconPositions = useMemo(() => {
    return buildingData
      .filter((b) => b.scale[1] > 60)
      .slice(0, 20)
      .map((b) => [b.pos[0], b.pos[1] + b.scale[1] / 2 + (b.spireHeight || 0.5), b.pos[2]] as [number, number, number]);
  }, [buildingData]);

  useEffect(() => {
    if (!beaconsRef.current) return;
    const mesh = beaconsRef.current;
    const dummy = new THREE.Object3D();

    beaconPositions.forEach((pos, i) => {
      dummy.position.set(pos[0], pos[1], pos[2]);
      dummy.scale.set(1.2, 1.2, 1.2);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [beaconPositions]);

  // Animation Loop: Clouds, Beacons, Window Emissive, Birds
  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();

    // 1. Moving Distant Clouds
    if (cloudsRef.current) {
      cloudsRef.current.position.x = (time * 1.2) % 240 - 120;
    }

    // 2. Blinking Aircraft Collision Lights
    if (beaconsRef.current) {
      const isBlinkOn = (Math.floor(time * 1.8) % 2) === 0;
      beaconsRef.current.visible = isBlinkOn && (timeOfDay === 'sunset' || timeOfDay === 'night');
    }

    // 3. Dynamic Building Window Emissive Intensity & Color
    if (buildingMaterialRef.current) {
      let targetEmissive = 0.05;
      let targetColor = new THREE.Color('#33281E');
      if (timeOfDay === 'sunset') {
        targetEmissive = 0.95;
        targetColor = new THREE.Color('#FFA844');
      } else if (timeOfDay === 'night') {
        targetEmissive = 2.4;
        targetColor = new THREE.Color('#FFE8A0');
      }

      buildingMaterialRef.current.emissive.lerp(targetColor, delta * 3);
      buildingMaterialRef.current.emissiveIntensity = THREE.MathUtils.damp(
        buildingMaterialRef.current.emissiveIntensity,
        targetEmissive,
        3.0,
        delta
      );
    }

    // 4. Distant Flock of Birds Flight Loop
    if (birdsRef.current) {
      const birdT = time * 0.18;
      birdsRef.current.position.x = Math.sin(birdT) * 75;
      birdsRef.current.position.z = -55 + Math.cos(birdT) * 25;
      birdsRef.current.position.y = 28 + Math.sin(birdT * 2) * 4;
      birdsRef.current.rotation.y = birdT + Math.PI / 2;
    }
  });

  return (
    <group>
      {/* -------------------- 1. INSTANCED HIGH-RISE METROPOLITAN TOWERS -------------------- */}
      <instancedMesh
        ref={buildingsMeshRef}
        args={[undefined, undefined, buildingCount]}
        receiveShadow
        castShadow={quality === 'high' || quality === 'ultra'}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          ref={buildingMaterialRef}
          color="#384353"
          map={windowTexture || undefined}
          roughness={0.4}
          metalness={0.4}
          emissive="#FFE8A0"
          emissiveIntensity={timeOfDay === 'night' ? 2.2 : timeOfDay === 'sunset' ? 0.9 : 0.05}
          emissiveMap={windowTexture || undefined}
        />
      </instancedMesh>

      {/* -------------------- 2. RED BLINKING AIRCRAFT BEACONS -------------------- */}
      <instancedMesh
        ref={beaconsRef}
        args={[undefined, undefined, beaconPositions.length]}
      >
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshBasicMaterial color="#FF2222" />
      </instancedMesh>

      {/* -------------------- 3. METROPOLITAN RIVER & PROMENADE -------------------- */}
      {/* Curved River channel flowing at Z = -35 to -24 */}
      <group position={[0, -2.4, -28]}>
        <mesh ref={riverRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[260, 22]} />
          <meshStandardMaterial
            color={timeOfDay === 'night' ? '#091522' : timeOfDay === 'sunset' ? '#5E3A2E' : '#225577'}
            roughness={0.12}
            metalness={0.85}
          />
        </mesh>
        {/* Riverbank Embankment & Parkland Strip */}
        <mesh position={[0, 0.1, 11.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[260, 4]} />
          <meshStandardMaterial
            color={timeOfDay === 'night' ? '#122018' : '#3E5C38'}
            roughness={0.8}
          />
        </mesh>
      </group>

      {/* -------------------- 4. DRIFTING PROCEDURAL CLOUDS -------------------- */}
      <group ref={cloudsRef} position={[0, 48, -75]}>
        {[-80, -40, 0, 40, 80].map((cx, idx) => (
          <group key={`cloud-${idx}`} position={[cx, (idx % 2) * 5, (idx % 3) * 6]}>
            <mesh>
              <sphereGeometry args={[16, 12, 12]} />
              <meshBasicMaterial
                color={timeOfDay === 'night' ? '#121D2C' : timeOfDay === 'sunset' ? '#F6A888' : '#FAF8F5'}
                transparent
                opacity={timeOfDay === 'night' ? 0.35 : 0.65}
              />
            </mesh>
            <mesh position={[12, 1, 0]}>
              <sphereGeometry args={[12, 10, 10]} />
              <meshBasicMaterial
                color={timeOfDay === 'night' ? '#121D2C' : timeOfDay === 'sunset' ? '#F6A888' : '#FAF8F5'}
                transparent
                opacity={timeOfDay === 'night' ? 0.3 : 0.55}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* -------------------- 5. DISTANT FLOCK OF BIRDS -------------------- */}
      <group ref={birdsRef} position={[0, 28, -55]}>
        {[
          [0, 0, 0],
          [-1.5, 0.3, -1.2],
          [1.8, -0.2, -1.5],
          [-3.0, 0.5, -2.4],
          [3.2, 0.2, -2.8],
        ].map((bpos, bidx) => (
          <mesh key={`bird-${bidx}`} position={bpos as [number, number, number]}>
            <coneGeometry args={[0.2, 0.8, 4]} />
            <meshBasicMaterial color={timeOfDay === 'night' ? '#111822' : '#4A4E58'} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
