'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore, InteractableAction } from '@/store/useGameStore';
import { PLAYER_CONFIG } from '@/lib/config';

export const InteractionManager: React.FC = () => {
  const { camera, scene } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const screenCenter = useRef(new THREE.Vector2(0, 0));

  const isStarted = useGameStore((s) => s.isStarted);
  const isPaused = useGameStore((s) => s.isPaused);
  const controls = useGameStore((s) => s.controls);
  const setControl = useGameStore((s) => s.setControl);
  const setActiveInteractable = useGameStore((s) => s.setActiveInteractable);
  const activeInteractable = useGameStore((s) => s.activeInteractable);

  // Cached interactable objects list
  const interactablesRef = useRef<THREE.Object3D[]>([]);
  const lastScanTime = useRef(0);
  const lastRaycastTime = useRef(0);
  const lastInteractTime = useRef(0);

  // Helper to re-scan for interactable objects in the scene
  const scanInteractables = () => {
    const found: THREE.Object3D[] = [];
    scene.traverse((obj) => {
      if (obj.userData && obj.userData.interactable) {
        found.push(obj);
      }
    });
    interactablesRef.current = found;
  };

  useFrame(() => {
    if (!isStarted || isPaused) {
      if (activeInteractable) setActiveInteractable(null);
      return;
    }

    const now = performance.now();

    // 1. Periodically refresh interactables cache (every 1.5s)
    if (now - lastScanTime.current > 1500 || interactablesRef.current.length === 0) {
      lastScanTime.current = now;
      scanInteractables();
    }

    // 2. Throttled Raycast at 18 Hz (every 55ms) ONLY against interactable objects
    if (now - lastRaycastTime.current > 55) {
      lastRaycastTime.current = now;

      raycaster.current.setFromCamera(screenCenter.current, camera);
      raycaster.current.far = PLAYER_CONFIG.maxInteractDistance;

      let foundInteractable: InteractableAction | null = null;

      if (interactablesRef.current.length > 0) {
        const intersects = raycaster.current.intersectObjects(interactablesRef.current, true);

        for (let i = 0; i < intersects.length; i++) {
          let obj: THREE.Object3D | null = intersects[i].object;
          while (obj && obj !== scene) {
            if (obj.userData && obj.userData.interactable) {
              foundInteractable = {
                id: obj.userData.interactableId || obj.uuid,
                label: obj.userData.label || 'Interact',
                action: obj.userData.onInteract || (() => {}),
              };
              break;
            }
            obj = obj.parent;
          }
          if (foundInteractable) break;
        }
      }

      if (foundInteractable) {
        if (!activeInteractable || activeInteractable.id !== foundInteractable.id || activeInteractable.label !== foundInteractable.label) {
          setActiveInteractable(foundInteractable);
        }
      } else if (activeInteractable) {
        setActiveInteractable(null);
      }
    }

    // 3. Trigger Interaction on Key / Tap
    if (controls.interact) {
      if (now - lastInteractTime.current > 300) {
        lastInteractTime.current = now;
        if (activeInteractable) {
          activeInteractable.action();
        }
        setControl('interact', false);
      }
    }
  });

  // Global listener for click or tap interaction when looking at an interactable
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (document.pointerLockElement && e.button === 0) {
        const current = useGameStore.getState().activeInteractable;
        if (current) {
          const now = performance.now();
          if (now - lastInteractTime.current > 300) {
            lastInteractTime.current = now;
            current.action();
          }
        }
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, []);

  return null;
};
