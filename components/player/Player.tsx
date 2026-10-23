'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, RapierRigidBody, useRapier } from '@react-three/rapier';
import { useGameStore } from '@/store/useGameStore';
import { PLAYER_CONFIG, ARCHITECTURE_CONFIG } from '@/lib/config';

export const Player: React.FC = () => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const { rapier, world } = useRapier();
  const { camera, gl } = useThree();

  // Zustand Store
  const isStarted = useGameStore((s) => s.isStarted);
  const isPaused = useGameStore((s) => s.isPaused);
  const isMobile = useGameStore((s) => s.isMobile);
  const controls = useGameStore((s) => s.controls);
  const joystickVector = useGameStore((s) => s.joystickVector);
  const consumeLookDelta = useGameStore((s) => s.consumeLookDelta);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const settings = useGameStore((s) => s.settings);

  // Teleport & Room Tracking
  const teleportTarget = useGameStore((s) => s.teleportTarget);
  const completeTeleport = useGameStore((s) => s.completeTeleport);
  const setCurrentRoomId = useGameStore((s) => s.setCurrentRoomId);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);

  // Orientation State (Initial yaw = 0 facing North windows)
  const yaw = useRef<number>(0);
  const pitch = useRef<number>(0);

  // Dynamic Eye Height & Head Bob
  const currentEyeHeight = useRef<number>(PLAYER_CONFIG.standingEyeHeight);
  const headBobTimer = useRef<number>(0);
  const isGrounded = useRef<boolean>(true);

  // Last room check and minimap sync timestamps
  const lastRoomCheck = useRef<number>(0);
  const lastPosSync = useRef<number>(0);

  // Setup Pointer Lock & Mouse Look for Desktop
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== gl.domElement) return;
      if (!isStarted || isPaused) return;

      const sensitivity = settings.mouseSensitivity;
      yaw.current -= e.movementX * sensitivity;
      pitch.current -= e.movementY * sensitivity;

      pitch.current = Math.max(
        -PLAYER_CONFIG.pitchLimit,
        Math.min(PLAYER_CONFIG.pitchLimit, pitch.current)
      );
    };

    const handlePointerLockChange = () => {
      if (document.pointerLockElement !== gl.domElement) {
        if (isStarted && !isPaused) {
          pauseGame();
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, [gl.domElement, isMobile, isStarted, isPaused, pauseGame, settings.mouseSensitivity]);

  useFrame((state, delta) => {
    if (!rigidBodyRef.current) return;
    const body = rigidBodyRef.current;

    // 1. Handle Teleportation Target
    if (teleportTarget) {
      body.setTranslation(
        new THREE.Vector3(
          teleportTarget.position[0],
          teleportTarget.position[1],
          teleportTarget.position[2]
        ),
        true
      );
      body.setLinvel(new THREE.Vector3(0, 0, 0), true);
      if (typeof teleportTarget.yaw === 'number') {
        yaw.current = teleportTarget.yaw;
      }
      pitch.current = 0;
      completeTeleport();
      return;
    }

    const pos = body.translation();
    const linvel = body.linvel();

    // 2. Check Fall Safety Reset
    if (pos.y < PLAYER_CONFIG.fallResetY) {
      body.setTranslation(
        new THREE.Vector3(
          PLAYER_CONFIG.spawnPosition[0],
          PLAYER_CONFIG.spawnPosition[1],
          PLAYER_CONFIG.spawnPosition[2]
        ),
        true
      );
      body.setLinvel(new THREE.Vector3(0, 0, 0), true);
      return;
    }

    // 3. Room Detection & Minimap Position Check
    const now = performance.now();
    if (now - lastPosSync.current > 60) {
      lastPosSync.current = now;
      setPlayerPosition({ x: pos.x, z: pos.z, yaw: yaw.current });
    }

    if (now - lastRoomCheck.current > 150) {
      lastRoomCheck.current = now;
      const rooms = Object.values(ARCHITECTURE_CONFIG.rooms);
      for (const room of rooms) {
        if (
          pos.x >= room.bounds.minX &&
          pos.x <= room.bounds.maxX &&
          pos.z >= room.bounds.minZ &&
          pos.z <= room.bounds.maxZ
        ) {
          setCurrentRoomId(room.id);
          break;
        }
      }
    }

    // 4. Consume Mobile Touch Look Delta
    if (isStarted && !isPaused) {
      const mobileDelta = consumeLookDelta();
      if (mobileDelta.x !== 0 || mobileDelta.y !== 0) {
        yaw.current -= mobileDelta.x * settings.mobileSensitivity;
        pitch.current -= mobileDelta.y * settings.mobileSensitivity;
        pitch.current = Math.max(
          -PLAYER_CONFIG.pitchLimit,
          Math.min(PLAYER_CONFIG.pitchLimit, pitch.current)
        );
      }
    }

    // 5. Ground Detection via Rapier Raycast
    const rayOrigin = { x: pos.x, y: pos.y + 0.1, z: pos.z };
    const rayDir = { x: 0, y: -1, z: 0 };
    const maxToi = 0.45;
    const ray = new rapier.Ray(rayOrigin, rayDir);
    const hit = world.castRay(ray, maxToi, true);
    isGrounded.current = hit !== null || Math.abs(linvel.y) < 0.05;

    // 6. Calculate Movement Direction & Speed
    let targetSpeed = 0;
    const isCrouching = controls.crouch;
    const isSprinting = controls.sprint && !isCrouching && (controls.forward || joystickVector.y > 0.3);

    let inputForward = 0;
    let inputStrafe = 0;

    if (isStarted && !isPaused) {
      if (controls.forward) inputForward += 1;
      if (controls.backward) inputForward -= 1;
      if (controls.right) inputStrafe += 1;
      if (controls.left) inputStrafe -= 1;

      inputForward += joystickVector.y;
      inputStrafe += joystickVector.x;
    }

    const inputLength = Math.hypot(inputStrafe, inputForward);
    const hasMovement = inputLength > 0.05;

    if (hasMovement) {
      if (isCrouching) {
        targetSpeed = PLAYER_CONFIG.crouchSpeed;
      } else if (isSprinting) {
        targetSpeed = PLAYER_CONFIG.sprintSpeed;
      } else {
        targetSpeed = PLAYER_CONFIG.walkSpeed;
      }
    }

    const normX = hasMovement ? inputStrafe / Math.max(1, inputLength) : 0;
    const normZ = hasMovement ? inputForward / Math.max(1, inputLength) : 0;

    const forwardX = -Math.sin(yaw.current);
    const forwardZ = -Math.cos(yaw.current);
    const rightX = Math.cos(yaw.current);
    const rightZ = -Math.sin(yaw.current);

    const worldDirX = forwardX * normZ + rightX * normX;
    const worldDirZ = forwardZ * normZ + rightZ * normX;

    const targetVx = worldDirX * targetSpeed;
    const targetVz = worldDirZ * targetSpeed;

    const accelRate = hasMovement ? PLAYER_CONFIG.acceleration : PLAYER_CONFIG.deceleration;
    const smoothFactor = Math.min(1.0, delta * accelRate);
    const newVx = THREE.MathUtils.lerp(linvel.x, targetVx, smoothFactor);
    const newVz = THREE.MathUtils.lerp(linvel.z, targetVz, smoothFactor);

    // Jump handling
    let newVy = linvel.y;
    if (controls.jump && isGrounded.current && isStarted && !isPaused) {
      newVy = PLAYER_CONFIG.jumpImpulse;
      isGrounded.current = false;
    }

    body.setLinvel(new THREE.Vector3(newVx, newVy, newVz), true);

    // 7. Dynamic Eye Height (Standing vs Crouch)
    const targetEyeHeight = isCrouching
      ? PLAYER_CONFIG.crouchEyeHeight
      : PLAYER_CONFIG.standingEyeHeight;
    currentEyeHeight.current = THREE.MathUtils.lerp(
      currentEyeHeight.current,
      targetEyeHeight,
      delta * 10
    );

    // 8. Subtle Head Bobbing
    const horizontalSpeed = Math.hypot(linvel.x, linvel.z);
    let bobOffset = 0;
    if (isGrounded.current && horizontalSpeed > 0.5) {
      const bobFreq = isSprinting
        ? PLAYER_CONFIG.headBobFrequency * 1.3
        : PLAYER_CONFIG.headBobFrequency;
      const bobAmp = isSprinting
        ? PLAYER_CONFIG.headBobSprintAmplitude
        : PLAYER_CONFIG.headBobWalkAmplitude;

      headBobTimer.current += delta * bobFreq;
      bobOffset = Math.sin(headBobTimer.current) * bobAmp;
    } else {
      bobOffset = THREE.MathUtils.lerp(0, 0, delta * 8);
    }

    // 9. Sync Camera
    const cameraY = pos.y + currentEyeHeight.current + bobOffset;
    camera.position.set(pos.x, cameraY, pos.z);
    camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ');

    // 10. Sprint FOV Kick
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = isSprinting ? PLAYER_CONFIG.sprintFov : PLAYER_CONFIG.baseFov;
      if (Math.abs(camera.fov - targetFov) > 0.05) {
        camera.fov = THREE.MathUtils.lerp(
          camera.fov,
          targetFov,
          delta * PLAYER_CONFIG.fovTransitionSpeed
        );
        camera.updateProjectionMatrix();
      }
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={PLAYER_CONFIG.spawnPosition}
      type="dynamic"
      colliders={false}
      enabledRotations={[false, false, false]}
      friction={0.0}
      restitution={0.0}
      linearDamping={0.4}
      gravityScale={PLAYER_CONFIG.gravityMultiplier}
    >
      <CapsuleCollider
        args={[PLAYER_CONFIG.capsuleHeight / 2, PLAYER_CONFIG.capsuleRadius]}
        position={[0, PLAYER_CONFIG.capsuleHeight / 2 + PLAYER_CONFIG.capsuleRadius, 0]}
      />
    </RigidBody>
  );
};
