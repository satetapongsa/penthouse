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

  // Debounce interaction key trigger
  const lastInteractTime = useRef(0);

  useFrame(() => {
    if (!isStarted || isPaused) {
      if (activeInteractable) setActiveInteractable(null);
      return;
    }

    // Raycast from camera center into scene
    raycaster.current.setFromCamera(screenCenter.current, camera);
    raycaster.current.far = PLAYER_CONFIG.maxInteractDistance;

    const intersects = raycaster.current.intersectObjects(scene.children, true);

    let foundInteractable: InteractableAction | null = null;

    for (let i = 0; i < intersects.length; i++) {
      const hit = intersects[i];
      // Traverse up parent chain to find interactable marker
      let obj: THREE.Object3D | null = hit.object;
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

    if (foundInteractable) {
      if (!activeInteractable || activeInteractable.id !== foundInteractable.id || activeInteractable.label !== foundInteractable.label) {
        setActiveInteractable(foundInteractable);
      }
    } else if (activeInteractable) {
      setActiveInteractable(null);
    }

    // Check keyboard or mobile interact action
    if (controls.interact) {
      const now = performance.now();
      if (now - lastInteractTime.current > 350) {
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
      // If pointer is locked and active interactable exists, left click can trigger interaction
      if (document.pointerLockElement && e.button === 0) {
        const current = useGameStore.getState().activeInteractable;
        if (current) {
          const now = performance.now();
          if (now - lastInteractTime.current > 350) {
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
