'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, RapierRigidBody, useRapier } from '@react-three/rapier';
import { useGameStore } from '@/store/useGameStore';
import { PLAYER_CONFIG, ARCHITECTURE_CONFIG } from '@/lib/config';
import { audioEngine } from '@/lib/audio';

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
  const settings = useGameStore((s) => s.settings);

  // Posture System
  const posture = useGameStore((s) => s.posture);
  const postureTarget = useGameStore((s) => s.postureTarget);
  const exitSitting = useGameStore((s) => s.exitSitting);
  const exitLying = useGameStore((s) => s.exitLying);

  // Teleport & Room Tracking
  const teleportTarget = useGameStore((s) => s.teleportTarget);
  const completeTeleport = useGameStore((s) => s.completeTeleport);
  const setCurrentRoomId = useGameStore((s) => s.setCurrentRoomId);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const setIsNearJacuzzi = useGameStore((s) => s.setIsNearJacuzzi);

  // Orientation State (never reset by model loading)
  const yaw = useRef<number>(0);
  const pitch = useRef<number>(0);

  // Dynamic Eye Height & Head Bob
  const currentEyeHeight = useRef<number>(PLAYER_CONFIG.standingEyeHeight);
  const headBobTimer = useRef<number>(0);
  const isGrounded = useRef<boolean>(true);
  const stepDistanceAccum = useRef<number>(0);

  // Last room check and minimap sync timestamps
  const lastRoomCheck = useRef<number>(0);
  const lastPosSync = useRef<number>(0);

  // Exit debounce when seated/lying
  const enterPostureTime = useRef<number>(0);

  useEffect(() => {
    if (posture !== 'standing') {
      enterPostureTime.current = performance.now();
      if (postureTarget) {
        yaw.current = postureTarget.yaw;
        pitch.current = postureTarget.pitch;
      }
    }
  }, [posture, postureTarget]);

  // Unified Mouse Look for Desktop: reads movementX/movementY while pointer is locked
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== gl.domElement) return;
      if (!isStarted || isPaused) return;

      const sensitivity = settings.mouseSensitivity;
      yaw.current -= e.movementX * sensitivity;
      pitch.current -= e.movementY * sensitivity;

      // Pitch clamp to ±85° (1.48 rad)
      const pitchLimit = posture === 'lying' ? 1.55 : PLAYER_CONFIG.pitchLimit;
      pitch.current = Math.max(-pitchLimit, Math.min(pitchLimit, pitch.current));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gl.domElement, isMobile, isStarted, isPaused, settings.mouseSensitivity, posture]);

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

    // 3. Apply Look Rotation for Mobile Touch Look
    if (isMobile) {
      const deltaLook = consumeLookDelta();
      const mobileSens = settings.mobileSensitivity;
      yaw.current -= deltaLook.x * mobileSens;
      pitch.current -= deltaLook.y * mobileSens;
      const pitchLimit = posture === 'lying' ? 1.55 : PLAYER_CONFIG.pitchLimit;
      pitch.current = Math.max(-pitchLimit, Math.min(pitchLimit, pitch.current));
    }

    // 4. Ground Check via Raycast
    const rayOrigin = { x: pos.x, y: pos.y + 0.1, z: pos.z };
    const rayDir = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(rayOrigin, rayDir);
    const hit = world.castRay(ray, 0.45, true);
    isGrounded.current = hit !== null;

    // 5. Posture System (Sitting / Lying)
    if (posture !== 'standing') {
      const now = performance.now();
      const hasMovementInput =
        controls.forward ||
        controls.backward ||
        controls.left ||
        controls.right ||
        controls.jump ||
        Math.hypot(joystickVector.x, joystickVector.y) > 0.3;

      if (hasMovementInput && now - enterPostureTime.current > 400 && postureTarget) {
        body.setTranslation(
          new THREE.Vector3(
            postureTarget.returnPosition[0],
            postureTarget.returnPosition[1],
            postureTarget.returnPosition[2]
          ),
          true
        );
        yaw.current = postureTarget.returnYaw;
        if (posture === 'sitting') exitSitting();
        else exitLying();
        return;
      }

      body.setLinvel(new THREE.Vector3(0, 0, 0), true);
      if (postureTarget) {
        currentEyeHeight.current = THREE.MathUtils.lerp(
          currentEyeHeight.current,
          postureTarget.eyeHeight,
          delta * 6
        );
        const cameraY = pos.y + currentEyeHeight.current;
        camera.position.set(pos.x, cameraY, pos.z);
        camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ');
      }
      return;
    }

    // 6. Eye Height Transition (Crouching vs Standing)
    const targetEyeHeight = controls.crouch
      ? PLAYER_CONFIG.crouchEyeHeight
      : PLAYER_CONFIG.standingEyeHeight;
    currentEyeHeight.current = THREE.MathUtils.lerp(
      currentEyeHeight.current,
      targetEyeHeight,
      delta * 10
    );

    // 7. Calculate Movement Direction
    let moveX = 0;
    let moveZ = 0;

    if (isMobile) {
      moveX = joystickVector.x;
      moveZ = -joystickVector.y;
    } else {
      if (controls.forward) moveZ -= 1;
      if (controls.backward) moveZ += 1;
      if (controls.left) moveX -= 1;
      if (controls.right) moveX += 1;
    }

    const inputLen = Math.hypot(moveX, moveZ);
    if (inputLen > 1) {
      moveX /= inputLen;
      moveZ /= inputLen;
    }

    // Transform local movement vector by camera yaw
    const forwardVec = new THREE.Vector3(0, 0, -1).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      yaw.current
    );
    const rightVec = new THREE.Vector3(1, 0, 0).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      yaw.current
    );

    const worldMoveDir = new THREE.Vector3()
      .addScaledVector(rightVec, moveX)
      .addScaledVector(forwardVec, -moveZ);

    const isSprinting = controls.sprint && !controls.crouch && inputLen > 0.1;
    const targetSpeed = controls.crouch
      ? PLAYER_CONFIG.crouchSpeed
      : isSprinting
      ? PLAYER_CONFIG.sprintSpeed
      : PLAYER_CONFIG.walkSpeed;

    const targetVelX = worldMoveDir.x * targetSpeed;
    const targetVelZ = worldMoveDir.z * targetSpeed;

    const accel = inputLen > 0.05 ? PLAYER_CONFIG.acceleration : PLAYER_CONFIG.deceleration;
    const newVelX = THREE.MathUtils.lerp(linvel.x, targetVelX, delta * accel);
    const newVelZ = THREE.MathUtils.lerp(linvel.z, targetVelZ, delta * accel);

    // Handle Jump
    let newVelY = linvel.y;
    if (controls.jump && isGrounded.current && !controls.crouch) {
      newVelY = PLAYER_CONFIG.jumpImpulse;
      audioEngine.playSit();
    }

    body.setLinvel(new THREE.Vector3(newVelX, newVelY, newVelZ), true);

    // 8. Head Bob & Footstep Audio Synthesis
    const horizontalSpeed = Math.hypot(newVelX, newVelZ);
    let bobOffset = 0;

    if (horizontalSpeed > 0.4 && isGrounded.current) {
      if (settings.headBobEnabled) {
        const bobFreq = isSprinting
          ? PLAYER_CONFIG.headBobFrequency * 1.3
          : PLAYER_CONFIG.headBobFrequency;
        const bobAmp = isSprinting
          ? PLAYER_CONFIG.headBobSprintAmplitude
          : PLAYER_CONFIG.headBobWalkAmplitude;

        headBobTimer.current += delta * bobFreq;
        bobOffset = Math.sin(headBobTimer.current) * bobAmp;
      }

      stepDistanceAccum.current += horizontalSpeed * delta;
      const stepInterval = isSprinting ? 0.45 : 0.58;
      if (stepDistanceAccum.current >= stepInterval) {
        stepDistanceAccum.current = 0;

        let surface: 'stone' | 'wood' | 'carpet' = 'stone';
        if (Math.abs(pos.x - 1.9) < 2.8 && Math.abs(pos.z - (-1.2)) < 2.0) {
          surface = 'carpet';
        } else if (Math.abs(pos.x - (-10.5)) < 2.5 && Math.abs(pos.z - (-3.0)) < 2.2) {
          surface = 'carpet';
        } else if (pos.x > 2.5 && pos.x < 9.5 && pos.z > 2.0 && pos.z < 6.5) {
          surface = 'wood';
        } else if (pos.x > -14.5 && pos.x < -6.5 && pos.z > -6.0 && pos.z < 0.0) {
          surface = 'wood';
        }

        audioEngine.playFootstep(surface);
      }
    } else {
      bobOffset = THREE.MathUtils.lerp(0, 0, delta * 8);
    }

    // 9. Sync Camera Position & Orientation
    const cameraY = pos.y + currentEyeHeight.current + bobOffset;
    camera.position.set(pos.x, cameraY, pos.z);
    camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ');

    // 10. Sprint FOV Kick
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = isSprinting ? PLAYER_CONFIG.sprintFov : settings.fov;
      if (Math.abs(camera.fov - targetFov) > 0.05) {
        camera.fov = THREE.MathUtils.lerp(
          camera.fov,
          targetFov,
          delta * PLAYER_CONFIG.fovTransitionSpeed
        );
        camera.updateProjectionMatrix();
      }
    }

    // 11. Throttled Room Determination and Minimap Position Sync
    const nowMs = performance.now();
    if (nowMs - lastRoomCheck.current > 400) {
      lastRoomCheck.current = nowMs;

      // Identify active room based on coordinates
      const rooms = ARCHITECTURE_CONFIG.rooms;
      for (const room of Object.values(rooms)) {
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

      // Proximity check for terrace jacuzzi
      const jb = ARCHITECTURE_CONFIG.jacuzzi.bounds;
      const nearJacuzzi =
        pos.x >= jb.minX - 1.5 &&
        pos.x <= jb.maxX + 1.5 &&
        pos.z >= jb.minZ - 1.5 &&
        pos.z <= jb.maxZ + 1.5;
      setIsNearJacuzzi(nearJacuzzi);
    }

    if (nowMs - lastPosSync.current > 100) {
      lastPosSync.current = nowMs;
      setPlayerPosition({ x: pos.x, z: pos.z, yaw: yaw.current });
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
