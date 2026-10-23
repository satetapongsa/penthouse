'use client';

import React, { useMemo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useGameStore } from '@/store/useGameStore';
import { FURNITURE_MODELS } from '@/lib/furniture';
import { ModelProp } from './ModelProp';

/**
 * Adjacency graph connecting penthouse zones.
 * Models are lazy-loaded when player is within current room or one room away.
 */
export const ROOM_ADJACENCY: Record<string, string[]> = {
  living: ['kitchen_dining', 'terrace', 'hallway', 'foyer'],
  kitchen_dining: ['living', 'terrace'],
  terrace: ['living', 'kitchen_dining'],
  hallway: ['living', 'master_bedroom', 'foyer'],
  foyer: ['living', 'hallway', 'guest_bedroom', 'powder_room'],
  master_bedroom: ['hallway', 'wardrobe'],
  wardrobe: ['master_bedroom', 'master_bathroom'],
  master_bathroom: ['wardrobe'],
  guest_bedroom: ['foyer'],
  powder_room: ['foyer'],
};

// Initial starting room (living room) models preloaded before player enters
const STARTING_ROOM_MODELS = [
  'modern_arm_chair_01',
  'modern_coffee_table_01',
  'side_table_01',
  'potted_plant_01',
  'marble_bust_01',
  'book_encyclopedia_set_01',
  'potted_plant_04',
  'brass_vase_01',
];

// Preload living room models on module load
if (typeof window !== 'undefined') {
  STARTING_ROOM_MODELS.forEach((id) => {
    try {
      useGLTF.preload(`/models/${id}.glb`, false, true);
    } catch {
      // Graceful catch during SSR or early initialization
    }
  });
}

export const PenthouseModelsManager: React.FC = () => {
  const currentRoomId = useGameStore((s) => s.currentRoomId);

  // Preload starting models on mount
  useEffect(() => {
    STARTING_ROOM_MODELS.forEach((id) => {
      useGLTF.preload(`/models/${id}.glb`, false, true);
    });
  }, []);

  // Compute set of currently active rooms (current room + 1 room away)
  const activeRooms = useMemo(() => {
    const adjacent = ROOM_ADJACENCY[currentRoomId] || [];
    return new Set<string>([currentRoomId, ...adjacent]);
  }, [currentRoomId]);

  // Lazy-load models for active rooms; dispose/unmount models when far away
  const visiblePlacements = useMemo(() => {
    return FURNITURE_MODELS.filter((placement) => activeRooms.has(placement.room));
  }, [activeRooms]);

  return (
    <group name="penthouse-3d-models-root">
      {visiblePlacements.map((placement) => (
        <ModelProp key={placement.id} placement={placement} />
      ))}
    </group>
  );
};
