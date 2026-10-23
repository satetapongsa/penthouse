/**
 * THE SKYLINE PENTHOUSE - 3D Model Materials Configuration & Overrides
 *
 * Ensures all Poly Haven CC0 3D models strictly adhere to the penthouse aesthetic:
 * Ultra-luxury bright ivory, warm cream, light travertine, pale natural oak,
 * and brushed champagne brass. Eliminates dark, rustic, or worn tones.
 */

import * as THREE from 'three';

export interface MaterialOverrideRule {
  /** Global tint applied by multiplying base color */
  tint?: string;
  /** Hard color override if model texture is dark/rustic */
  replaceColor?: string;
  /** Roughness override (0 = polished glossy, 1 = rough matte) */
  roughness?: number;
  /** Metalness override (0 = dielectric, 1 = metallic) */
  metalness?: number;
  /** Boost reflection from Environment lightformers */
  envMapIntensity?: number;
  /** Subtle warm emissive glow for lit fixtures */
  emissive?: string;
  emissiveIntensity?: number;
}

export interface ModelOverrideConfig {
  default?: MaterialOverrideRule;
  byMeshName?: Record<string, MaterialOverrideRule>;
  byMaterialName?: Record<string, MaterialOverrideRule>;
}

/**
 * Curated material tuning per Poly Haven model asset ID.
 * Keeps everything bright, luminous, and pristine.
 */
export const MODEL_MATERIAL_OVERRIDES: Record<string, ModelOverrideConfig> = {
  modern_arm_chair_01: {
    default: {
      tint: '#faf7f2', // Warm ivory tint
      roughness: 0.8,
      envMapIntensity: 1.4,
    },
  },

  modern_coffee_table_01: {
    default: {
      tint: '#f8f5ee', // Pale travertine & pale oak stone finish
      roughness: 0.35,
      envMapIntensity: 1.6,
    },
  },

  side_table_01: {
    default: {
      tint: '#fdfbf7', // Honed white marble/travertine
      roughness: 0.3,
      metalness: 0.1,
      envMapIntensity: 1.7,
    },
  },

  dining_chair_02: {
    default: {
      tint: '#f6f3eb', // Natural warm linen fabric & champagne accents
      roughness: 0.75,
      envMapIntensity: 1.3,
    },
  },

  bar_chair_round_01: {
    default: {
      tint: '#f9f7f2', // Ivory bouclé seat with warm undertones
      roughness: 0.65,
      envMapIntensity: 1.5,
    },
  },

  modern_ceiling_lamp_01: {
    default: {
      tint: '#f4e8cc', // Brushed brass canopy & warm glass
      roughness: 0.2,
      metalness: 0.8,
      envMapIntensity: 2.0,
      emissive: '#fff2db',
      emissiveIntensity: 0.4,
    },
  },

  potted_plant_01: {
    default: {
      tint: '#f7f6f0', // Bright clean ceramic pot & vibrant foliage
      roughness: 0.5,
      envMapIntensity: 1.2,
    },
  },

  potted_plant_04: {
    default: {
      tint: '#fbfaf7', // Crisp porcelain pot
      roughness: 0.4,
      envMapIntensity: 1.2,
    },
  },

  ceramic_vase_01: {
    default: {
      tint: '#fbf8f0', // Glazed creamy ceramic
      roughness: 0.22,
      metalness: 0.05,
      envMapIntensity: 1.8,
    },
  },

  brass_vase_01: {
    default: {
      tint: '#eed19a', // Polished champagne brass
      roughness: 0.25,
      metalness: 0.9,
      envMapIntensity: 2.2,
    },
  },

  marble_bust_01: {
    default: {
      tint: '#faf9f6', // Pristine Carrara white marble
      roughness: 0.32,
      metalness: 0.05,
      envMapIntensity: 1.6,
    },
  },

  book_encyclopedia_set_01: {
    default: {
      tint: '#f5f0e6', // Bright linen & cream covers with gold accents
      roughness: 0.6,
      envMapIntensity: 1.2,
    },
  },

  food_apple_01: {
    default: {
      tint: '#ffffff',
      roughness: 0.28,
      envMapIntensity: 1.4,
    },
  },

  food_pears_asian_01: {
    default: {
      tint: '#ffffff',
      roughness: 0.35,
      envMapIntensity: 1.3,
    },
  },

  wine_bottles_01: {
    default: {
      tint: '#ffffff',
      roughness: 0.1,
      metalness: 0.1,
      envMapIntensity: 2.2,
    },
  },

  brass_candleholders: {
    default: {
      tint: '#eec780', // Polished brushed brass
      roughness: 0.22,
      metalness: 0.92,
      envMapIntensity: 2.4,
    },
  },

  ornate_mirror_01: {
    default: {
      tint: '#f0d38e', // Gilded champagne gold frame
      roughness: 0.3,
      metalness: 0.85,
      envMapIntensity: 2.0,
    },
  },

  brass_diya_lantern: {
    default: {
      tint: '#e4b868', // Warm terrace brass lantern
      roughness: 0.3,
      metalness: 0.88,
      envMapIntensity: 2.0,
      emissive: '#ff9933',
      emissiveIntensity: 0.3,
    },
  },
};

/**
 * Traverses a cloned GLTF scene and applies the penthouse theme material overrides.
 * Ensures cast and receive shadows within 12m budget and optimal visual quality.
 */
export function applyModelMaterialOverrides(
  scene: THREE.Object3D,
  modelId: string,
  castShadows = true
): void {
  const overrides = MODEL_MATERIAL_OVERRIDES[modelId];

  scene.traverse((node) => {
    if ((node as THREE.Mesh).isMesh) {
      const mesh = node as THREE.Mesh;
      mesh.castShadow = castShadows;
      mesh.receiveShadow = castShadows;

      if (!mesh.material) return;

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const newMaterials: THREE.Material[] = [];

      for (const mat of materials) {
        if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
          const stdMat = (mat as THREE.MeshStandardMaterial).clone();

          // Check for mesh/material specific rule or fallback to default
          const rule =
            (overrides?.byMeshName && overrides.byMeshName[mesh.name]) ||
            (overrides?.byMaterialName && overrides.byMaterialName[mat.name]) ||
            overrides?.default;

          if (rule) {
            if (rule.replaceColor) {
              stdMat.color.set(rule.replaceColor);
            } else if (rule.tint) {
              stdMat.color.multiply(new THREE.Color(rule.tint));
            }

            if (rule.roughness !== undefined) {
              stdMat.roughness = rule.roughness;
            }
            if (rule.metalness !== undefined) {
              stdMat.metalness = rule.metalness;
            }
            if (rule.envMapIntensity !== undefined) {
              stdMat.envMapIntensity = rule.envMapIntensity;
            }
            if (rule.emissive) {
              stdMat.emissive.set(rule.emissive);
              stdMat.emissiveIntensity = rule.emissiveIntensity ?? 0.5;
            }
          }

          newMaterials.push(stdMat);
        } else {
          newMaterials.push(mat);
        }
      }

      mesh.material = Array.isArray(mesh.material) ? newMaterials : newMaterials[0];
    }
  });
}
