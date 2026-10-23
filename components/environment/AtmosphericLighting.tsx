'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { useGameStore, TimeOfDay } from '@/store/useGameStore';

export const AtmosphericLighting: React.FC = () => {
  const { scene } = useThree();
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const quality = useGameStore((s) => s.quality);

  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const dustMeshRef = useRef<THREE.InstancedMesh>(null);

  // Atmospheric Presets per Time of Day
  const atmospherePresets = useMemo(() => ({
    day: {
      sunColor: '#FFF8E7',
      sunIntensity: 2.4,
      sunPos: [14, 20, -18] as [number, number, number],
      hemiSky: '#96BBD9',
      hemiGround: '#F3EFE6',
      hemiIntensity: 0.65,
      ambientColor: '#FFFBF2',
      ambientIntensity: 0.85,
      bgColor: '#DEEAF3',
      fogColor: '#DEEAF3',
      fogNear: 35,
      fogFar: 180,
    },
    sunset: {
      sunColor: '#FF944D',
      sunIntensity: 2.8,
      sunPos: [24, 7, -22] as [number, number, number],
      hemiSky: '#E87D65',
      hemiGround: '#9A5B3D',
      hemiIntensity: 0.55,
      ambientColor: '#FFA56E',
      ambientIntensity: 0.7,
      bgColor: '#F59A6D',
      fogColor: '#F59A6D',
      fogNear: 28,
      fogFar: 160,
    },
    night: {
      sunColor: '#8EAAFF',
      sunIntensity: 0.45,
      sunPos: [-14, 16, -18] as [number, number, number],
      hemiSky: '#121828',
      hemiGround: '#0A0E18',
      hemiIntensity: 0.25,
      ambientColor: '#1A2238',
      ambientIntensity: 0.35,
      bgColor: '#0B111E',
      fogColor: '#0B111E',
      fogNear: 25,
      fogFar: 150,
    },
  }), []);

  // Set Background and Fog dynamically
  useEffect(() => {
    const config = atmospherePresets[timeOfDay];
    scene.background = new THREE.Color(config.bgColor);
    scene.fog = new THREE.Fog(config.fogColor, config.fogNear, config.fogFar);
  }, [scene, timeOfDay, atmospherePresets]);

  // Dust Particles Setup (80 particles drifting in sunbeams)
  const dustCount = quality === 'low' ? 0 : quality === 'medium' ? 50 : 90;
  const dustParticles = useMemo(() => {
    return Array.from({ length: 90 }, () => ({
      x: (Math.random() - 0.5) * 8 + 2.0, // living room zone
      y: Math.random() * 2.8 + 0.3,
      z: (Math.random() - 0.5) * 6 - 2.0,
      speedX: (Math.random() - 0.5) * 0.1,
      speedY: (Math.random() - 0.5) * 0.08,
      speedZ: (Math.random() - 0.5) * 0.1,
      size: 0.015 + Math.random() * 0.02,
    }));
  }, []);

  useFrame(({ clock }, delta) => {
    const config = atmospherePresets[timeOfDay];

    // Smooth lerp of Sun Directional Light
    if (sunLightRef.current) {
      sunLightRef.current.color.lerp(new THREE.Color(config.sunColor), delta * 3);
      sunLightRef.current.intensity = THREE.MathUtils.damp(
        sunLightRef.current.intensity,
        config.sunIntensity,
        3.5,
        delta
      );
      sunLightRef.current.position.lerp(new THREE.Vector3(...config.sunPos), delta * 2.5);
    }

    // Smooth lerp of Hemisphere & Ambient Light
    if (hemiLightRef.current) {
      hemiLightRef.current.color.lerp(new THREE.Color(config.hemiSky), delta * 3);
      hemiLightRef.current.groundColor.lerp(new THREE.Color(config.hemiGround), delta * 3);
      hemiLightRef.current.intensity = THREE.MathUtils.damp(
        hemiLightRef.current.intensity,
        config.hemiIntensity,
        3.5,
        delta
      );
    }

    if (ambientLightRef.current) {
      ambientLightRef.current.color.lerp(new THREE.Color(config.ambientColor), delta * 3);
      ambientLightRef.current.intensity = THREE.MathUtils.damp(
        ambientLightRef.current.intensity,
        config.ambientIntensity,
        3.5,
        delta
      );
    }

    // Dynamic Fog Color Transition
    if (scene.fog && scene.fog instanceof THREE.Fog) {
      scene.fog.color.lerp(new THREE.Color(config.fogColor), delta * 3);
      scene.fog.near = THREE.MathUtils.damp(scene.fog.near, config.fogNear, 2.5, delta);
      scene.fog.far = THREE.MathUtils.damp(scene.fog.far, config.fogFar, 2.5, delta);
    }
    if (scene.background && scene.background instanceof THREE.Color) {
      scene.background.lerp(new THREE.Color(config.bgColor), delta * 3);
    }

    // Dust Motes Brownian Motion
    if (dustMeshRef.current && dustCount > 0 && timeOfDay !== 'night') {
      const dummy = new THREE.Object3D();
      const time = clock.getElapsedTime();

      for (let i = 0; i < dustCount; i++) {
        const p = dustParticles[i];
        p.x += Math.sin(time * 0.5 + i) * delta * 0.15;
        p.y += Math.cos(time * 0.3 + i * 2) * delta * 0.08;
        p.z += Math.sin(time * 0.4 + i * 3) * delta * 0.12;

        dummy.position.set(p.x, p.y, p.z);
        dummy.scale.set(p.size, p.size, p.size);
        dummy.updateMatrix();
        dustMeshRef.current.setMatrixAt(i, dummy.matrix);
      }
      dustMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const shadowMapSize = quality === 'low' ? 512 : quality === 'medium' ? 1024 : 2048;

  return (
    <>
      {/* -------------------- 1. DYNAMIC SUN DIRECTIONAL LIGHT -------------------- */}
      <directionalLight
        ref={sunLightRef}
        position={[14, 20, -18]}
        castShadow={quality !== 'low'}
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-bias={-0.0001}
      />

      {/* -------------------- 2. HEMISPHERE & AMBIENT ILLUMINATION -------------------- */}
      <hemisphereLight ref={hemiLightRef} />
      <ambientLight ref={ambientLightRef} />

      {/* -------------------- 3. PROCEDURAL ENVIRONMENT & LIGHTFORMERS (ZERO EXTERNAL HDR) -------------------- */}
      <Environment resolution={128}>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          {/* Overhead warm ceiling softbox */}
          <Lightformer
            form="rect"
            intensity={timeOfDay === 'night' ? 0.4 : 1.5}
            color="#FFF8E7"
            scale={[18, 12, 1]}
            position={[0, 10, -5]}
            target={[0, 0, 0]}
          />
          {/* Horizon fill panel */}
          <Lightformer
            form="ring"
            intensity={timeOfDay === 'sunset' ? 2.5 : timeOfDay === 'night' ? 0.3 : 1.2}
            color={timeOfDay === 'sunset' ? '#FF9A4A' : '#E8F4FC'}
            scale={14}
            position={[15, 6, -15]}
          />
        </group>
      </Environment>

      {/* -------------------- 4. AIRBORNE DUST PARTICLES IN LIGHT BEAMS -------------------- */}
      {dustCount > 0 && timeOfDay !== 'night' && (
        <instancedMesh
          ref={dustMeshRef}
          args={[undefined, undefined, dustCount]}
        >
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial
            color="#FFF4D0"
            transparent
            opacity={timeOfDay === 'sunset' ? 0.55 : 0.35}
          />
        </instancedMesh>
      )}
    </>
  );
};
