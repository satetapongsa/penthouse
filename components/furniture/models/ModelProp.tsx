'use client';

import React, { useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { applyModelMaterialOverrides } from '@/lib/modelMaterials';
import { ModelPlacement } from '@/lib/furniture';
import { useGameStore } from '@/store/useGameStore';

interface ModelPropProps {
  placement: ModelPlacement;
}

/**
 * Inner component loaded under Suspense.
 * Uses drei useGLTF with MeshoptDecoder, isolates cloned scenes,
 * applies ivory/cream/brass material tuning, and checks 12m shadow distance budget.
 */
const ModelMesh: React.FC<ModelPropProps> = ({ placement }) => {
  const { modelId, position, rotation, scale, collider } = placement;
  const gltfPath = `/models/${modelId}.glb`;

  // Drei useGLTF with meshopt decoder enabled (local three-stdlib decoder)
  const gltf = useGLTF(gltfPath, false, true);

  // Measure distance to player to enforce 12m shadow budget
  const playerPos = useGameStore((s) => s.playerPosition);
  const dx = playerPos.x - position[0];
  const dz = playerPos.z - position[2];
  const distSq = dx * dx + dz * dz;
  const castShadows = distSq <= 144; // 12m squared

  // Clone scene so repeated models (chairs, stools, plants) share base buffers safely
  const scene = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    applyModelMaterialOverrides(cloned, modelId, castShadows);
    return cloned;
  }, [gltf.scene, modelId, castShadows]);

  const scaleArray: [number, number, number] =
    typeof scale === 'number' ? [scale, scale, scale] : scale;

  const content = (
    <primitive
      object={scene}
      position={position}
      rotation={rotation}
      scale={scaleArray}
    />
  );

  if (collider && collider.type === 'cuboid') {
    return (
      <group>
        <RigidBody type="fixed" colliders={false} position={position}>
          <CuboidCollider
            args={collider.args}
            position={collider.offset || [0, collider.args[1], 0]}
          />
        </RigidBody>
        {content}
      </group>
    );
  }

  return content;
};

// Subtle fallback that never blocks the whole app
const ModelFallback: React.FC = () => null;

export const ModelProp: React.FC<ModelPropProps> = (props) => {
  return (
    <Suspense fallback={<ModelFallback />}>
      <ModelMesh {...props} />
    </Suspense>
  );
};
