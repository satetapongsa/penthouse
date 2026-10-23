'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import {
  getCalacattaMarbleTexture,
  getPaleOakTexture,
  getBoucleFabricTexture,
  getBookSpineTexture,
  LUXURY_PALETTE,
} from '@/lib/materials';
import { useGameStore } from '@/store/useGameStore';

export const LivingFurniture: React.FC = () => {
  const marbleTex = useMemo(() => getCalacattaMarbleTexture(), []);
  const oakTex = useMemo(() => getPaleOakTexture(), []);
  const boucleTex = useMemo(() => getBoucleFabricTexture(), []);
  const bookTex = useMemo(() => getBookSpineTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  // Zustand Store Interactions
  const tvOn = useGameStore((s) => s.tvOn);
  const toggleTv = useGameStore((s) => s.toggleTv);
  const fireplaceOn = useGameStore((s) => s.fireplaceOn);
  const toggleFireplace = useGameStore((s) => s.toggleFireplace);
  const enterSitting = useGameStore((s) => s.enterSitting);
  const isLivingLightOn = useGameStore((s) => s.lightingStates.living ?? true);
  const toggleLivingLight = useGameStore((s) => s.toggleRoomLight);
  const isWindowOpen = useGameStore((s) => s.windowStates.living ?? false);
  const toggleWindow = useGameStore((s) => s.toggleWindow);
  const areCurtainsClosed = useGameStore((s) => s.curtainStates.living ?? false);
  const toggleCurtains = useGameStore((s) => s.toggleCurtains);

  // References for Real-Time Animations
  const flameLightRef = useRef<THREE.PointLight>(null);
  const flameGroupRef = useRef<THREE.Group>(null);
  const plantGroupRef = useRef<THREE.Group>(null);
  const clockSecondHandRef = useRef<THREE.Group>(null);
  const clockMinuteHandRef = useRef<THREE.Group>(null);
  const clockHourHandRef = useRef<THREE.Group>(null);
  const windowSlideRef = useRef<THREE.Group>(null);
  const curtainsLeftRef = useRef<THREE.Group>(null);
  const curtainsRightRef = useRef<THREE.Group>(null);

  // Procedural Animated TV Canvas
  const tvCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const tvTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const tvTimeRef = useRef(0);

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

    // 1. Animated Generative TV Visuals
    if (tvOn && tvCanvasRef.current && tvTextureRef.current) {
      tvTimeRef.current += delta;
      const t = tvTimeRef.current;
      const ctx = tvCanvasRef.current.getContext('2d');
      if (ctx) {
        // Gradient background
        const grad = ctx.createLinearGradient(0, 0, 512, 288);
        const hue1 = (t * 20) % 360;
        const hue2 = (hue1 + 60) % 360;
        grad.addColorStop(0, `hsl(${hue1}, 65%, 20%)`);
        grad.addColorStop(0.5, `hsl(${hue2}, 70%, 35%)`);
        grad.addColorStop(1, `hsl(${hue1 + 120}, 60%, 15%)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 288);

        // Dynamic digital wave lines
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

        // Floating ambient glowing particles
        for (let p = 0; p < 8; p++) {
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

    // 2. Fireplace Flame Animation & Flicker
    if (fireplaceOn) {
      if (flameLightRef.current) {
        flameLightRef.current.intensity = 1.6 + Math.sin(time * 18) * 0.4 + (Math.random() - 0.5) * 0.25;
      }
      if (flameGroupRef.current) {
        flameGroupRef.current.children.forEach((flame, idx) => {
          const scaleY = 0.8 + Math.sin(time * 12 + idx * 1.5) * 0.35 + Math.cos(time * 24 + idx) * 0.15;
          flame.scale.set(1, scaleY, 1);
        });
      }
    }

    // 3. Wall Clock Hands Tracking Real Time
    const date = new Date();
    const sec = date.getSeconds() + date.getMilliseconds() / 1000;
    const min = date.getMinutes() + sec / 60;
    const hr = (date.getHours() % 12) + min / 60;

    if (clockSecondHandRef.current) {
      clockSecondHandRef.current.rotation.z = -((sec / 60) * Math.PI * 2);
    }
    if (clockMinuteHandRef.current) {
      clockMinuteHandRef.current.rotation.z = -((min / 60) * Math.PI * 2);
    }
    if (clockHourHandRef.current) {
      clockHourHandRef.current.rotation.z = -((hr / 12) * Math.PI * 2);
    }

    // 4. Plant Swaying Gently in Air Currents
    if (plantGroupRef.current) {
      const windSpeed = isWindowOpen ? 3.5 : 1.2;
      const windAmp = isWindowOpen ? 0.05 : 0.015;
      plantGroupRef.current.rotation.z = Math.sin(time * windSpeed) * windAmp;
      plantGroupRef.current.rotation.x = Math.cos(time * windSpeed * 0.8) * windAmp;
    }

    // 5. Sliding Window Animation
    if (windowSlideRef.current) {
      const targetX = isWindowOpen ? 1.4 : 0;
      windowSlideRef.current.position.x = THREE.MathUtils.damp(
        windowSlideRef.current.position.x,
        targetX,
        4.5,
        delta
      );
    }

    // 6. Curtains Animation & Breeze Flutter
    const breeze = isWindowOpen ? Math.sin(time * 4) * 0.06 : 0;
    if (curtainsLeftRef.current) {
      const targetScaleX = areCurtainsClosed ? 2.6 : 0.85;
      curtainsLeftRef.current.scale.x = THREE.MathUtils.damp(curtainsLeftRef.current.scale.x, targetScaleX, 3.5, delta);
      curtainsLeftRef.current.rotation.z = breeze;
    }
    if (curtainsRightRef.current) {
      const targetScaleX = areCurtainsClosed ? 2.6 : 0.85;
      curtainsRightRef.current.scale.x = THREE.MathUtils.damp(curtainsRightRef.current.scale.x, targetScaleX, 3.5, delta);
      curtainsRightRef.current.rotation.z = -breeze;
    }
  });

  return (
    <group>
      {/* -------------------- 1. PLUSH WOVEN AREA RUG -------------------- */}
      <mesh position={[1.9, 0.006, -1.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5.6, 4.0]} />
        <meshStandardMaterial
          color="#EDE7DA"
          map={boucleTex}
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* -------------------- 2. BOUCLÉ SECTIONAL SOFA (INTERACTIVE SIT) -------------------- */}
      <group
        position={[1.8, 0, -1.0]}
        userData={{
          interactable: true,
          interactableId: 'living-sofa',
          label: 'Sit on Sofa',
          onInteract: () => {
            enterSitting({
              position: [1.8, 0, 0.4],
              eyeHeight: 0.98,
              pitch: -0.05,
              yaw: 0,
              returnPosition: [1.8, 1.8, -1.2],
              returnYaw: 0,
            });
          },
        }}
      >
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[2.4, 0.45, 0.52]} position={[0, 0.45, 1.2]} />
          <CuboidCollider args={[0.55, 0.45, 1.2]} position={[-1.85, 0.45, -0.1]} />
        </RigidBody>

        {/* Main Seat Cushions */}
        <mesh position={[0, 0.24, 1.2]} castShadow receiveShadow>
          <boxGeometry args={[4.8, 0.46, 1.05]} />
          <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.85} />
        </mesh>

        {/* Main Backrest Cushions */}
        <mesh position={[0, 0.65, 1.62]} castShadow receiveShadow>
          <boxGeometry args={[4.8, 0.42, 0.28]} />
          <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.85} />
        </mesh>

        {/* Left Chaise Cushion */}
        <mesh position={[-1.88, 0.24, -0.05]} castShadow receiveShadow>
          <boxGeometry args={[1.04, 0.46, 2.3]} />
          <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.85} />
        </mesh>

        {/* Right Armrest Block */}
        <mesh position={[2.46, 0.42, 1.2]} castShadow receiveShadow>
          <boxGeometry args={[0.26, 0.52, 1.05]} />
          <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.85} />
        </mesh>

        {/* Recessed Brushed Brass Sofa Plinth */}
        <mesh position={[0.2, 0.02, 0.6]}>
          <boxGeometry args={[4.7, 0.04, 2.8]} />
          <meshStandardMaterial color={colors.brass} metalness={0.85} roughness={0.3} />
        </mesh>

        {/* Scatter Pillows */}
        {[
          { pos: [-1.4, 0.56, 1.45], rot: [0.1, 0.2, -0.1], col: colors.pillowTerracotta },
          { pos: [-0.6, 0.56, 1.45], rot: [-0.05, -0.15, 0.1], col: colors.pillowGold },
          { pos: [0.4, 0.56, 1.45], rot: [0.15, 0.05, 0], col: colors.cream },
          { pos: [1.3, 0.56, 1.45], rot: [-0.1, 0.25, 0.05], col: colors.pillowSage },
          { pos: [2.1, 0.56, 1.45], rot: [0.05, -0.2, -0.05], col: colors.pillowGold },
          { pos: [-1.88, 0.56, 0.7], rot: [0.2, 0.1, 0], col: colors.pillowSage },
        ].map((pill, idx) => (
          <mesh key={`pillow-${idx}`} position={pill.pos as [number, number, number]} rotation={pill.rot as [number, number, number]} castShadow>
            <boxGeometry args={[0.42, 0.38, 0.16]} />
            <meshStandardMaterial color={pill.col} roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* -------------------- 3. NESTED TRAVERTINE & BRASS COFFEE TABLE -------------------- */}
      <group position={[1.9, 0, -1.4]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.7, 0.2, 0.42]} position={[0, 0.2, 0]} />
        </RigidBody>
        <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.36, 0.36, 0.8]} />
          <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.15} clearcoat={0.9} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[1.28, 0.04, 0.72]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.22} />
        </mesh>
      </group>

      {/* -------------------- 4. ENTERTAINMENT & FIREPLACE WALL -------------------- */}
      <group position={[1.8, 0, 1.88]}>
        {/* Travertine Feature Wall Slab */}
        <mesh position={[0, 1.7, 0]} receiveShadow>
          <boxGeometry args={[4.2, 3.4, 0.14]} />
          <meshStandardMaterial color={colors.travertine} map={marbleTex} roughness={0.4} />
        </mesh>

        {/* Floating Low Media Console */}
        <mesh position={[0, 0.32, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.42, 0.48]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </mesh>

        {/* -------------------- 85" OLED TV (INTERACTIVE) -------------------- */}
        <group
          position={[0, 1.85, 0.08]}
          userData={{
            interactable: true,
            interactableId: 'living-tv',
            label: tvOn ? 'Turn Off TV' : 'Turn On TV',
            onInteract: toggleTv,
          }}
        >
          {/* Bezel */}
          <mesh castShadow>
            <boxGeometry args={[2.0, 1.15, 0.03]} />
            <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Screen Display */}
          <mesh position={[0, 0, 0.016]}>
            <planeGeometry args={[1.96, 1.11]} />
            {tvOn && tvTextureRef.current ? (
              <meshBasicMaterial map={tvTextureRef.current} />
            ) : (
              <meshPhysicalMaterial color="#0A0A0A" roughness={0.05} clearcoat={1.0} reflectivity={0.95} />
            )}
          </mesh>
          {/* Dynamic Light Cast from TV onto Room */}
          {tvOn && (
            <pointLight position={[0, 0, 0.5]} color="#C2E2FF" intensity={1.8} distance={6} decay={2} />
          )}
        </group>

        {/* -------------------- REAL-TIME MOVING WALL CLOCK -------------------- */}
        <group position={[1.65, 2.65, 0.08]}>
          {/* Brass Bezel Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.03, 32]} />
            <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.2} />
          </mesh>
          {/* White Marble Face */}
          <mesh position={[0, 0, 0.018]}>
            <circleGeometry args={[0.2, 32]} />
            <meshStandardMaterial color="#FAF8F5" roughness={0.3} />
          </mesh>
          {/* Hour Markers */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h) => {
            const rad = (h / 12) * Math.PI * 2;
            return (
              <mesh key={`tick-${h}`} position={[Math.sin(rad) * 0.17, Math.cos(rad) * 0.17, 0.02]} rotation={[0, 0, -rad]}>
                <boxGeometry args={[0.008, 0.024, 0.004]} />
                <meshBasicMaterial color={colors.brass} />
              </mesh>
            );
          })}
          {/* Moving Hands */}
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

        {/* -------------------- LINEAR FIREPLACE (INTERACTIVE) -------------------- */}
        <group
          position={[0, 0.85, 0.08]}
          userData={{
            interactable: true,
            interactableId: 'living-fireplace',
            label: fireplaceOn ? 'Extinguish Fireplace' : 'Light Fireplace',
            onInteract: toggleFireplace,
          }}
        >
          {/* Hearth Box */}
          <mesh>
            <boxGeometry args={[1.8, 0.32, 0.16]} />
            <meshStandardMaterial color="#1A1817" roughness={0.8} />
          </mesh>
          {/* Glass Guard */}
          <mesh position={[0, 0, 0.08]}>
            <planeGeometry args={[1.76, 0.28]} />
            <meshPhysicalMaterial color="#E8F1F5" roughness={0.05} transmission={0.92} transparent opacity={0.3} />
          </mesh>

          {fireplaceOn && (
            <>
              {/* Glowing Ember Bed */}
              <mesh position={[0, -0.1, 0.02]}>
                <boxGeometry args={[1.6, 0.04, 0.1]} />
                <meshBasicMaterial color="#FF9020" />
              </mesh>
              {/* Animated Flame Geometry Group */}
              <group ref={flameGroupRef} position={[0, -0.06, 0.04]}>
                {[-0.6, -0.35, -0.15, 0.05, 0.25, 0.45, 0.65].map((fx, fidx) => (
                  <mesh key={`flame-${fidx}`} position={[fx, 0.08, 0]}>
                    <coneGeometry args={[0.07, 0.22, 8]} />
                    <meshBasicMaterial color={fidx % 2 === 0 ? '#FFA834' : '#FFD266'} transparent opacity={0.9} />
                  </mesh>
                ))}
              </group>
              {/* Warm Flickering Point Light */}
              <pointLight ref={flameLightRef} color="#FFA834" intensity={1.8} distance={4.5} decay={2} />
            </>
          )}
        </group>
      </group>

      {/* -------------------- 5. OPENABLE SLIDING WINDOW & CURTAINS -------------------- */}
      {/* Positioned on North window facade (Z = -5.92, X: -2.8 to 0.0) */}
      <group position={[-1.4, 0, -5.92]}>
        {/* Brass Curtain Track & Sheer Drapes */}
        <mesh position={[0, 3.32, 0.15]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 3.2, 16]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Curtains Toggle Zone */}
        <group
          position={[0, 1.7, 0.16]}
          userData={{
            interactable: true,
            interactableId: 'living-curtains',
            label: areCurtainsClosed ? 'Draw Open Curtains' : 'Pull Closed Curtains',
            onInteract: toggleCurtains,
          }}
        >
          {/* Left Sheer Curtain Panel */}
          <group ref={curtainsLeftRef} position={[-1.2, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.6, 3.2, 0.06]} />
              <meshStandardMaterial color="#FAF8F3" roughness={0.9} transparent opacity={0.7} />
            </mesh>
          </group>
          {/* Right Sheer Curtain Panel */}
          <group ref={curtainsRightRef} position={[1.2, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.6, 3.2, 0.06]} />
              <meshStandardMaterial color="#FAF8F3" roughness={0.9} transparent opacity={0.7} />
            </mesh>
          </group>
        </group>

        {/* Sliding Window Sash (Interactive Toggle) */}
        <group
          ref={windowSlideRef}
          position={[0, 1.7, 0]}
          userData={{
            interactable: true,
            interactableId: 'living-window',
            label: isWindowOpen ? 'Close Panorama Window' : 'Open Panorama Window',
            onInteract: () => toggleWindow('living'),
          }}
        >
          {/* Brass Sash Frame */}
          <mesh>
            <boxGeometry args={[1.4, 3.3, 0.05]} />
            <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
          </mesh>
          {/* Glass Pane */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.28, 3.18, 0.02]} />
            <meshPhysicalMaterial color="#E8F1F5" roughness={0.05} transmission={0.94} transparent opacity={0.35} />
          </mesh>
          {/* Flush Window Handle */}
          <mesh position={[0.55, 0, 0.035]}>
            <boxGeometry args={[0.03, 0.35, 0.03]} />
            <meshStandardMaterial color={colors.brass} metalness={0.95} roughness={0.15} />
          </mesh>
        </group>
      </group>

      {/* -------------------- 6. WALL LIGHT SWITCH -------------------- */}
      {/* Positioned on West wall next to hallway opening (X = -3.38, Y = 1.35, Z = -1.2) */}
      <group
        position={[-3.38, 1.35, -1.2]}
        rotation={[0, Math.PI / 2, 0]}
        userData={{
          interactable: true,
          interactableId: 'living-light-switch',
          label: isLivingLightOn ? 'Turn Off Living Lights' : 'Turn On Living Lights',
          onInteract: () => toggleLivingLight('living'),
        }}
      >
        {/* Switch Faceplate (Brushed Brass) */}
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.12, 0.015]} />
          <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Rocker Switch */}
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[0.025, 0.045, 0.01]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        {/* Tiny Status LED */}
        <mesh position={[0, 0.035, 0.01]}>
          <circleGeometry args={[0.004, 16]} />
          <meshBasicMaterial color={isLivingLightOn ? '#4ADE80' : '#E5E7EB'} />
        </mesh>
      </group>

      {/* -------------------- 7. SWAYING POTTED INDOOR TREE -------------------- */}
      <group position={[6.8, 0, -5.0]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.32, 0.9, 32]} />
          <meshStandardMaterial color={colors.travertine} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.88, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.38, 32]} />
          <meshStandardMaterial color="#362E25" roughness={0.9} />
        </mesh>
        {/* Swaying Foliage Group */}
        <group ref={plantGroupRef} position={[0, 0.9, 0]}>
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.07, 1.8, 12]} />
            <meshStandardMaterial color="#5C4D3C" roughness={0.8} />
          </mesh>
          {[
            { pos: [0, 1.8, 0], scale: [0.75, 0.65, 0.75] },
            { pos: [-0.25, 1.45, 0.15], scale: [0.55, 0.5, 0.55] },
            { pos: [0.25, 1.55, -0.15], scale: [0.58, 0.52, 0.58] },
          ].map((canopy, cidx) => (
            <mesh key={`canopy-${cidx}`} position={canopy.pos as [number, number, number]} castShadow>
              <sphereGeometry args={[0.65, 16, 16]} />
              <meshStandardMaterial color={colors.pillowSage} roughness={0.7} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};
