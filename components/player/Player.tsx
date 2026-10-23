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
  const pauseGame = useGameStore((s) => s.pauseGame);
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

  // Orientation State
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

  // Setup Pointer Lock & Mouse Look for Desktop
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== gl.domElement) return;
      if (!isStarted || isPaused) return;

      const sensitivity = settings.mouseSensitivity;
      yaw.current -= e.movementX * sensitivity;
      pitch.current -= e.movementY * sensitivity;

      const maxPitch = posture === 'lying' ? 1.55 : PLAYER_CONFIG.pitchLimit;
      const minPitch = posture === 'lying' ? -1.55 : -PLAYER_CONFIG.pitchLimit;

      pitch.current = Math.max(minPitch, Math.min(maxPitch, pitch.current));
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
  }, [gl.domElement, isMobile, isStarted, isPaused, pauseGame, settings.mouseSensitivity, posture]);

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

    // 3. Room Detection, Proximity to Jacuzzi & Minimap Sync
    const now = performance.now();
    if (now - lastPosSync.current > 60) {
      lastPosSync.current = now;
      setPlayerPosition({ x: pos.x, z: pos.z, yaw: yaw.current });

      // Jacuzzi distance check (Center: [10.75, 0.4, -9.5])
      const distToJacuzzi = Math.hypot(pos.x - 10.75, pos.z - (-9.5));
      setIsNearJacuzzi(distToJacuzzi < 4.2);
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
        const maxPitch = posture === 'lying' ? 1.55 : PLAYER_CONFIG.pitchLimit;
        const minPitch = posture === 'lying' ? -1.55 : -PLAYER_CONFIG.pitchLimit;
        pitch.current = Math.max(minPitch, Math.min(maxPitch, pitch.current));
      }
    }

    // -------------------- POSTURE: SITTING OR LYING DOWN --------------------
    if (posture !== 'standing' && postureTarget) {
      body.setLinvel(new THREE.Vector3(0, 0, 0), true);

      // Smooth camera transition to seated/lying target
      const targetPos = new THREE.Vector3(
        postureTarget.position[0],
        postureTarget.position[1] + postureTarget.eyeHeight,
        postureTarget.position[2]
      );
      camera.position.lerp(targetPos, delta * 6);
      camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ');

      // Check exit inputs (debounce 400ms after entering)
      if (now - enterPostureTime.current > 400) {
        if (
          controls.interact ||
          controls.jump ||
          controls.forward ||
          controls.backward ||
          controls.left ||
          controls.right
        ) {
          if (posture === 'sitting') {
            exitSitting();
          } else {
            exitLying();
          }
        }
      }
      return;
    }

    // -------------------- STANDING & WALKING POSTURE --------------------
    // Ground Detection via Rapier Raycast
    const rayOrigin = { x: pos.x, y: pos.y + 0.1, z: pos.z };
    const rayDir = { x: 0, y: -1, z: 0 };
    const maxToi = 0.45;
    const ray = new rapier.Ray(rayOrigin, rayDir);
    const hit = world.castRay(ray, maxToi, true);
    isGrounded.current = hit !== null || Math.abs(linvel.y) < 0.05;

    // Calculate Movement Direction & Speed
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

    // Dynamic Eye Height
    const targetEyeHeight = isCrouching
      ? PLAYER_CONFIG.crouchEyeHeight
      : PLAYER_CONFIG.standingEyeHeight;
    currentEyeHeight.current = THREE.MathUtils.lerp(
      currentEyeHeight.current,
      targetEyeHeight,
      delta * 10
    );

    // Footstep Sound Synthesis & Head Bobbing
    const horizontalSpeed = Math.hypot(linvel.x, linvel.z);
    let bobOffset = 0;
    if (isGrounded.current && horizontalSpeed > 0.4) {
      const bobFreq = isSprinting
        ? PLAYER_CONFIG.headBobFrequency * 1.3
        : PLAYER_CONFIG.headBobFrequency;
      const bobAmp = isSprinting
        ? PLAYER_CONFIG.headBobSprintAmplitude
        : PLAYER_CONFIG.headBobWalkAmplitude;

      headBobTimer.current += delta * bobFreq;
      bobOffset = Math.sin(headBobTimer.current) * bobAmp;

      // Surface-sensitive footsteps
      stepDistanceAccum.current += horizontalSpeed * delta;
      const stepInterval = isSprinting ? 0.45 : 0.58;
      if (stepDistanceAccum.current >= stepInterval) {
        stepDistanceAccum.current = 0;

        // Detect surface type based on position
        let surface: 'stone' | 'wood' | 'carpet' = 'stone';
        // Living room rug: X: 1.9 +- 2.8, Z: -1.2 +- 2.0
        if (Math.abs(pos.x - 1.9) < 2.8 && Math.abs(pos.z - (-1.2)) < 2.0) {
          surface = 'carpet';
        }
        // Master bedroom rug: X: -10.5 +- 2.5, Z: -3.0 +- 2.2
        else if (Math.abs(pos.x - (-10.5)) < 2.5 && Math.abs(pos.z - (-3.0)) < 2.2) {
          surface = 'carpet';
        }
        // Guest bedroom: X: 2.5 to 9.5, Z: 2.0 to 6.5
        else if (pos.x > 2.5 && pos.x < 9.5 && pos.z > 2.0 && pos.z < 6.5) {
          surface = 'wood';
        }
        // Master suite wood areas: X: -14.5 to -6.5, Z: -6.0 to 0.0
        else if (pos.x > -14.5 && pos.x < -6.5 && pos.z > -6.0 && pos.z < 0.0) {
          surface = 'wood';
        }

        audioEngine.playFootstep(surface);
      }
    } else {
      bobOffset = THREE.MathUtils.lerp(0, 0, delta * 8);
    }

    // Sync Camera
    const cameraY = pos.y + currentEyeHeight.current + bobOffset;
    camera.position.set(pos.x, cameraY, pos.z);
    camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ');

    // Sprint FOV Kick
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
