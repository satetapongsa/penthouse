'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import {
  getCalacattaMarbleTexture,
  getPaleOakTexture,
  getBookSpineTexture,
  LUXURY_PALETTE,
} from '@/lib/materials';
import { useGameStore } from '@/store/useGameStore';
import { GrandPianoSet } from './GrandPianoSet';
import { ModernWallSconce } from '../decor/LightingFixtures';

export const LivingEntertainment: React.FC = () => {
  const marbleTex = useMemo(() => getCalacattaMarbleTexture(), []);
  const oakTex = useMemo(() => getPaleOakTexture(), []);
  const bookTex = useMemo(() => getBookSpineTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  const tvOn = useGameStore((s) => s.tvOn);
  const toggleTv = useGameStore((s) => s.toggleTv);
  const fireplaceOn = useGameStore((s) => s.fireplaceOn);
  const toggleFireplace = useGameStore((s) => s.toggleFireplace);
  const isWindowOpen = useGameStore((s) => s.windowStates.living ?? false);
  const toggleWindow = useGameStore((s) => s.toggleWindow);
  const areCurtainsClosed = useGameStore((s) => s.curtainStates.living ?? false);
  const toggleCurtains = useGameStore((s) => s.toggleCurtains);

  const flameLightRef = useRef<THREE.PointLight>(null);
  const flameGroupRef = useRef<THREE.Group>(null);
  const clockSecondHandRef = useRef<THREE.Group>(null);
  const clockMinuteHandRef = useRef<THREE.Group>(null);
  const clockHourHandRef = useRef<THREE.Group>(null);
  const windowSlideRef = useRef<THREE.Group>(null);
  const curtainsLeftRef = useRef<THREE.Group>(null);
  const curtainsRightRef = useRef<THREE.Group>(null);
  const recordPlatterRef = useRef<THREE.Group>(null);

  const tvCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const tvTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const tvTimeRef = useRef(0);
  const lastTvRenderTime = useRef(0);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 288;
    tvCanvasRef.current = canvas;
    const tex = new THREE.CanvasTexture(canvas);
    tvTextureRef.current = tex;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Throttled Generative TV Visuals (24 FPS)
    if (tvOn && tvCanvasRef.current && tvTextureRef.current) {
      tvTimeRef.current += delta;
      if (time - lastTvRenderTime.current > 0.04) {
        lastTvRenderTime.current = time;
        const t = tvTimeRef.current;
        const ctx = tvCanvasRef.current.getContext('2d');
        if (ctx) {
          const grad = ctx.createLinearGradient(0, 0, 512, 288);
          const hue1 = (t * 20) % 360;
          const hue2 = (hue1 + 60) % 360;
          grad.addColorStop(0, `hsl(${hue1}, 65%, 20%)`);
          grad.addColorStop(0.5, `hsl(${hue2}, 70%, 35%)`);
          grad.addColorStop(1, `hsl(${hue1 + 120}, 60%, 15%)`);
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 512, 288);

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.lineWidth = 3;
          for (let j = 0; j < 3; j++) {
            ctx.beginPath();
            for (let x = 0; x <= 512; x += 16) {
              const y = 144 + Math.sin(x * 0.02 + t * 3 + j) * 45 + Math.cos(x * 0.01 - t * 2) * 25;
              if (x === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
          }

          for (let p = 0; p < 6; p++) {
            const px = (Math.sin(t * 0.5 + p * 1.2) * 0.5 + 0.5) * 512;
            const py = (Math.cos(t * 0.7 + p * 0.9) * 0.5 + 0.5) * 288;
            ctx.fillStyle = 'rgba(255, 235, 180, 0.7)';
            ctx.beginPath();
            ctx.arc(px, py, 4 + Math.sin(t * 2 + p) * 2, 0, Math.PI * 2);
            ctx.fill();
          }
          tvTextureRef.current.needsUpdate = true;
        }
      }
    }

    // 2. Vinyl Record Player Platter Rotation
    if (recordPlatterRef.current) {
      recordPlatterRef.current.rotation.y += delta * 1.8;
    }

    // 3. Fireplace Flame Flickering
    if (fireplaceOn && flameLightRef.current && flameGroupRef.current) {
      flameLightRef.current.intensity = 1.4 + Math.sin(time * 16) * 0.4 + (Math.random() - 0.5) * 0.25;
      flameGroupRef.current.children.forEach((child, idx) => {
        child.scale.y = 0.8 + Math.sin(time * 18 + idx) * 0.35 + Math.cos(time * 24 + idx * 2) * 0.2;
      });
    }

    // 4. Real-Time Clock Hands
    const d = new Date();
    const secs = d.getSeconds() + d.getMilliseconds() / 1000;
    const mins = d.getMinutes() + secs / 60;
    const hrs = (d.getHours() % 12) + mins / 60;

    if (clockSecondHandRef.current) clockSecondHandRef.current.rotation.z = -(secs / 60) * Math.PI * 2;
    if (clockMinuteHandRef.current) clockMinuteHandRef.current.rotation.z = -(mins / 60) * Math.PI * 2;
    if (clockHourHandRef.current) clockHourHandRef.current.rotation.z = -(hrs / 12) * Math.PI * 2;

    // 5. Smooth Window Slide
    if (windowSlideRef.current) {
      const targetX = isWindowOpen ? 1.6 : 0;
      windowSlideRef.current.position.x = THREE.MathUtils.damp(windowSlideRef.current.position.x, targetX, 5.0, delta);
    }

    // 6. Curtains Animation
    if (curtainsLeftRef.current && curtainsRightRef.current) {
      const leftTargetScale = areCurtainsClosed ? 1.0 : 0.25;
      const rightTargetScale = areCurtainsClosed ? 1.0 : 0.25;
      curtainsLeftRef.current.scale.x = THREE.MathUtils.damp(curtainsLeftRef.current.scale.x, leftTargetScale, 5.0, delta);
      curtainsRightRef.current.scale.x = THREE.MathUtils.damp(curtainsRightRef.current.scale.x, rightTargetScale, 5.0, delta);
    }
  });

  return (
    <group>
      {/* 1. ENTERTAINMENT & FIREPLACE FEATURE WALL */}
      <group position={[1.8, 0, 1.88]}>
        {/* Light Honed Roman Travertine Feature Wall Slab */}
        <mesh position={[0, 1.7, 0]} receiveShadow>
          <boxGeometry args={[4.2, 3.4, 0.14]} />
          <meshStandardMaterial color={colors.travertine} map={marbleTex} roughness={0.38} />
        </mesh>

        {/* Fluted Pale Oak Low-Profile TV Credenza */}
        <group position={[0, 0.24, 0.22]}>
          <RoundedBox args={[3.5, 0.46, 0.48]} radius={0.03} smoothness={3} castShadow receiveShadow>
            <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
          </RoundedBox>
          {/* Calacatta Marble Top Inlay */}
          <mesh position={[0, 0.24, 0]} castShadow>
            <boxGeometry args={[3.52, 0.02, 0.5]} />
            <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.15} clearcoat={0.9} />
          </mesh>
          {/* Recessed Brass Finger Pull Handles */}
          {[-1.2, -0.4, 0.4, 1.2].map((hx, idx) => (
            <mesh key={`credenza-handle-${idx}`} position={[hx, 0.1, 0.245]}>
              <boxGeometry args={[0.08, 0.015, 0.01]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
        </group>

        {/* Vintage Turntable / Vinyl Record Player on Credenza Top */}
        <group position={[-1.2, 0.52, 0.22]}>
          <RoundedBox args={[0.42, 0.06, 0.36]} radius={0.01} smoothness={2} position={[0, 0.03, 0]} castShadow>
            <meshStandardMaterial color="#4A3B32" roughness={0.4} />
          </RoundedBox>
          {/* Rotating Aluminum Platter */}
          <group ref={recordPlatterRef} position={[-0.04, 0.065, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.13, 0.13, 0.01, 24]} />
              <meshStandardMaterial color="#22201D" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.006, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.002, 16]} />
              <meshBasicMaterial color="#C5A059" />
            </mesh>
          </group>
          {/* Tonearm */}
          <group position={[0.14, 0.08, -0.06]} rotation={[0, 0.25, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.003, 0.003, 0.18, 8]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        </group>

        {/* Abstract Sculptural Bronze Rings on Credenza Top */}
        <group position={[1.2, 0.52, 0.22]}>
          <mesh position={[0, 0.03, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.08, 0.06, 16]} />
            <meshStandardMaterial color={colors.travertine} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.18, 0]} rotation={[0.4, 0.2, 0]} castShadow>
            <torusGeometry args={[0.12, 0.018, 12, 32]} />
            <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
          </mesh>
        </group>

        {/* 85" Ultra-Slim OLED TV (INTERACTIVE) */}
        <group
          position={[0, 1.85, 0.08]}
          userData={{
            interactable: true,
            interactableId: 'living-tv',
            label: tvOn ? 'Turn Off TV' : 'Turn On TV',
            onInteract: toggleTv,
          }}
        >
          <mesh castShadow>
            <boxGeometry args={[2.0, 1.15, 0.03]} />
            <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.016]}>
            <planeGeometry args={[1.96, 1.11]} />
            {tvOn && tvTextureRef.current ? (
              <meshBasicMaterial map={tvTextureRef.current} />
            ) : (
              <meshPhysicalMaterial color="#0A0A0A" roughness={0.05} clearcoat={1.0} reflectivity={0.95} />
            )}
          </mesh>
          {tvOn && (
            <pointLight position={[0, 0, 0.5]} color="#C2E2FF" intensity={1.8} distance={6} decay={2} />
          )}
        </group>

        {/* REAL-TIME WALL CLOCK */}
        <group position={[1.65, 2.65, 0.08]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.03, 24]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.018]}>
            <circleGeometry args={[0.2, 24]} />
            <meshStandardMaterial color="#FAF8F5" roughness={0.3} />
          </mesh>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h) => {
            const rad = (h / 12) * Math.PI * 2;
            return (
              <mesh key={`tick-${h}`} position={[Math.sin(rad) * 0.17, Math.cos(rad) * 0.17, 0.02]} rotation={[0, 0, -rad]}>
                <boxGeometry args={[0.008, 0.024, 0.004]} />
                <meshBasicMaterial color={colors.brass} />
              </mesh>
            );
          })}
          <group ref={clockHourHandRef} position={[0, 0, 0.022]}>
            <mesh position={[0, 0.04, 0]}>
              <boxGeometry args={[0.012, 0.1, 0.002]} />
              <meshBasicMaterial color="#1E1B15" />
            </mesh>
          </group>
          <group ref={clockMinuteHandRef} position={[0, 0, 0.024]}>
            <mesh position={[0, 0.06, 0]}>
              <boxGeometry args={[0.008, 0.14, 0.002]} />
              <meshBasicMaterial color="#1E1B15" />
            </mesh>
          </group>
          <group ref={clockSecondHandRef} position={[0, 0, 0.026]}>
            <mesh position={[0, 0.07, 0]}>
              <boxGeometry args={[0.004, 0.16, 0.002]} />
              <meshBasicMaterial color="#B23A3A" />
            </mesh>
          </group>
        </group>

        {/* LINEAR FIREPLACE (INTERACTIVE) */}
        <group
          position={[0, 0.85, 0.08]}
          userData={{
            interactable: true,
            interactableId: 'living-fireplace',
            label: fireplaceOn ? 'Extinguish Fireplace' : 'Light Fireplace',
            onInteract: toggleFireplace,
          }}
        >
          <mesh>
            <boxGeometry args={[1.8, 0.32, 0.16]} />
            <meshStandardMaterial color="#1A1817" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <planeGeometry args={[1.76, 0.28]} />
            <meshPhysicalMaterial color="#E8F1F5" roughness={0.05} transmission={0.92} transparent opacity={0.3} />
          </mesh>

          {fireplaceOn && (
            <>
              <mesh position={[0, -0.1, 0.02]}>
                <boxGeometry args={[1.6, 0.04, 0.1]} />
                <meshBasicMaterial color="#FF9020" />
              </mesh>
              <group ref={flameGroupRef} position={[0, -0.06, 0.04]}>
                {[-0.6, -0.35, -0.15, 0.05, 0.25, 0.45, 0.65].map((fx, fidx) => (
                  <mesh key={`flame-${fidx}`} position={[fx, 0.08, 0]}>
                    <coneGeometry args={[0.07, 0.22, 6]} />
                    <meshBasicMaterial color={fidx % 2 === 0 ? '#FFA834' : '#FFD266'} transparent opacity={0.9} />
                  </mesh>
                ))}
              </group>
              <pointLight ref={flameLightRef} color="#FFA834" intensity={1.8} distance={4.5} decay={2} />
            </>
          )}
        </group>
      </group>

      {/* 2. GRAND PIANO & BENCH */}
      <GrandPianoSet />

      {/* 3. WALL SCONCES */}
      <ModernWallSconce position={[-0.8, 2.0, 1.86]} />
      <ModernWallSconce position={[4.4, 2.0, 1.86]} />

      {/* 4. OPENABLE SLIDING WINDOW & CURTAINS */}
      <group position={[-1.4, 1.7, -5.92]}>
        <group
          ref={windowSlideRef}
          userData={{
            interactable: true,
            interactableId: 'living-window',
            label: isWindowOpen ? 'Close Window' : 'Open Window',
            onInteract: () => toggleWindow('living'),
          }}
        >
          <mesh>
            <planeGeometry args={[1.8, 3.3]} />
            <meshPhysicalMaterial color="#E8F1F5" roughness={0.05} transmission={0.92} transparent opacity={0.35} />
          </mesh>
          <mesh position={[0.85, 0, 0.02]}>
            <boxGeometry args={[0.03, 0.28, 0.04]} />
            <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
          </mesh>
        </group>

        {/* Curtains (Interactive) */}
        <group
          userData={{
            interactable: true,
            interactableId: 'living-curtains',
            label: areCurtainsClosed ? 'Draw Curtains Open' : 'Close Curtains',
            onInteract: () => toggleCurtains('living'),
          }}
        >
          <group ref={curtainsLeftRef} position={[-1.1, 0, 0.12]}>
            <mesh position={[0.45, 0, 0]}>
              <planeGeometry args={[0.9, 3.35]} />
              <meshStandardMaterial color="#FAF7EE" roughness={0.8} transparent opacity={0.65} side={THREE.DoubleSide} />
            </mesh>
          </group>
          <group ref={curtainsRightRef} position={[1.1, 0, 0.12]}>
            <mesh position={[-0.45, 0, 0]}>
              <planeGeometry args={[0.9, 3.35]} />
              <meshStandardMaterial color="#FAF7EE" roughness={0.8} transparent opacity={0.65} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
