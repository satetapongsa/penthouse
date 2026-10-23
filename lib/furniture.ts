/**
 * THE SKYLINE PENTHOUSE - 3D Furniture & Decor Layout Data
 *
 * Single source of truth for 3D model placements, rotations, scales,
 * and simplified bounding box physics colliders.
 * Every walkway maintains >= 0.9m clearance with zero door or wall overlap.
 */

export interface ModelPlacement {
  id: string;
  modelId: string;
  room: string;
  position: [number, number, number];
  rotation: [number, number, number]; // Radians [x, y, z]
  scale: [number, number, number] | number;
  collider?: {
    type: 'cuboid';
    args: [number, number, number]; // half-extents [hx, hy, hz] for Rapier CuboidCollider
    offset?: [number, number, number];
  };
}

export const FURNITURE_MODELS: ModelPlacement[] = [
  // GRAND LIVING GALLERY (Room: 'living')
  {
    id: 'living-armchair-west',
    modelId: 'modern_arm_chair_01',
    room: 'living',
    position: [-0.6, 0.0, -1.2],
    rotation: [0, Math.PI / 4, 0],
    scale: 0.95,
    collider: { type: 'cuboid', args: [0.44, 0.38, 0.44], offset: [0, 0.38, 0] },
  },
  {
    id: 'living-armchair-east',
    modelId: 'modern_arm_chair_01',
    room: 'living',
    position: [4.3, 0.0, -1.2],
    rotation: [0, -Math.PI / 4, 0],
    scale: 0.95,
    collider: { type: 'cuboid', args: [0.44, 0.38, 0.44], offset: [0, 0.38, 0] },
  },
  {
    id: 'living-coffee-table',
    modelId: 'modern_coffee_table_01',
    room: 'living',
    position: [1.9, 0.0, -1.4],
    rotation: [0, 0, 0],
    scale: 1.05,
    collider: { type: 'cuboid', args: [0.72, 0.2, 0.44], offset: [0, 0.2, 0] },
  },
  {
    id: 'living-side-table-west',
    modelId: 'side_table_01',
    room: 'living',
    position: [-2.6, 0.0, 0.2],
    rotation: [0, Math.PI / 6, 0],
    scale: 0.9,
    collider: { type: 'cuboid', args: [0.25, 0.28, 0.25], offset: [0, 0.28, 0] },
  },
  {
    id: 'living-potted-tree-window',
    modelId: 'potted_plant_01',
    room: 'living',
    position: [6.6, 0.0, -5.2],
    rotation: [0, 0.8, 0],
    scale: 1.05,
    collider: { type: 'cuboid', args: [0.35, 0.75, 0.35], offset: [0, 0.75, 0] },
  },
  {
    id: 'living-marble-bust',
    modelId: 'marble_bust_01',
    room: 'living',
    position: [6.2, 0.9, 0.8],
    rotation: [0, -Math.PI / 3, 0],
    scale: 0.85,
  },
  {
    id: 'living-table-books',
    modelId: 'book_encyclopedia_set_01',
    room: 'living',
    position: [1.55, 0.38, -1.4],
    rotation: [0, 0.1, 0],
    scale: 0.65,
  },
  {
    id: 'living-table-succulent',
    modelId: 'potted_plant_04',
    room: 'living',
    position: [2.25, 0.38, -1.4],
    rotation: [0, 1.2, 0],
    scale: 0.7,
  },
  {
    id: 'living-side-table-brass-vase',
    modelId: 'brass_vase_01',
    room: 'living',
    position: [-2.6, 0.56, 0.2],
    rotation: [0, 0.4, 0],
    scale: 0.75,
  },

  // KITCHEN & DINING PAVILION (Room: 'kitchen_dining')
  {
    id: 'dining-ceiling-lamp',
    modelId: 'modern_ceiling_lamp_01',
    room: 'kitchen_dining',
    position: [10.75, 2.1, -4.2],
    rotation: [0, 0, 0],
    scale: 0.9,
  },
  {
    id: 'dining-chair-n1',
    modelId: 'dining_chair_02',
    room: 'kitchen_dining',
    position: [9.6, 0.0, -4.92],
    rotation: [0, 0, 0],
    scale: 0.92,
    collider: { type: 'cuboid', args: [0.24, 0.45, 0.24], offset: [0, 0.45, 0] },
  },
  {
    id: 'dining-chair-n2',
    modelId: 'dining_chair_02',
    room: 'kitchen_dining',
    position: [10.75, 0.0, -4.92],
    rotation: [0, 0, 0],
    scale: 0.92,
    collider: { type: 'cuboid', args: [0.24, 0.45, 0.24], offset: [0, 0.45, 0] },
  },
  {
    id: 'dining-chair-n3',
    modelId: 'dining_chair_02',
    room: 'kitchen_dining',
    position: [11.9, 0.0, -4.92],
    rotation: [0, 0, 0],
    scale: 0.92,
    collider: { type: 'cuboid', args: [0.24, 0.45, 0.24], offset: [0, 0.45, 0] },
  },
  {
    id: 'dining-chair-s1',
    modelId: 'dining_chair_02',
    room: 'kitchen_dining',
    position: [9.6, 0.0, -3.48],
    rotation: [0, Math.PI, 0],
    scale: 0.92,
    collider: { type: 'cuboid', args: [0.24, 0.45, 0.24], offset: [0, 0.45, 0] },
  },
  {
    id: 'dining-chair-s2',
    modelId: 'dining_chair_02',
    room: 'kitchen_dining',
    position: [10.75, 0.0, -3.48],
    rotation: [0, Math.PI, 0],
    scale: 0.92,
    collider: { type: 'cuboid', args: [0.24, 0.45, 0.24], offset: [0, 0.45, 0] },
  },
  {
    id: 'dining-chair-s3',
    modelId: 'dining_chair_02',
    room: 'kitchen_dining',
    position: [11.9, 0.0, -3.48],
    rotation: [0, Math.PI, 0],
    scale: 0.92,
    collider: { type: 'cuboid', args: [0.24, 0.45, 0.24], offset: [0, 0.45, 0] },
  },
  {
    id: 'dining-ceramic-vase',
    modelId: 'ceramic_vase_01',
    room: 'kitchen_dining',
    position: [10.75, 0.75, -4.2],
    rotation: [0, 0.5, 0],
    scale: 0.8,
  },
  {
    id: 'dining-brass-candleholders',
    modelId: 'brass_candleholders',
    room: 'kitchen_dining',
    position: [10.15, 0.75, -4.2],
    rotation: [0, -0.2, 0],
    scale: 0.7,
  },
  {
    id: 'dining-asian-pears',
    modelId: 'food_pears_asian_01',
    room: 'kitchen_dining',
    position: [11.35, 0.75, -4.2],
    rotation: [0, 1.1, 0],
    scale: 0.8,
  },
  {
    id: 'island-bar-stool-1',
    modelId: 'bar_chair_round_01',
    room: 'kitchen_dining',
    position: [9.55, 0.0, -1.78],
    rotation: [0, Math.PI, 0],
    scale: 0.92,
    collider: { type: 'cuboid', args: [0.22, 0.45, 0.22], offset: [0, 0.45, 0] },
  },
  {
    id: 'island-bar-stool-2',
    modelId: 'bar_chair_round_01',
    room: 'kitchen_dining',
    position: [10.35, 0.0, -1.78],
    rotation: [0, Math.PI, 0],
    scale: 0.92,
    collider: { type: 'cuboid', args: [0.22, 0.45, 0.22], offset: [0, 0.45, 0] },
  },
  {
    id: 'island-bar-stool-3',
    modelId: 'bar_chair_round_01',
    room: 'kitchen_dining',
    position: [11.15, 0.0, -1.78],
    rotation: [0, Math.PI, 0],
    scale: 0.92,
    collider: { type: 'cuboid', args: [0.22, 0.45, 0.22], offset: [0, 0.45, 0] },
  },
  {
    id: 'island-bar-stool-4',
    modelId: 'bar_chair_round_01',
    room: 'kitchen_dining',
    position: [11.95, 0.0, -1.78],
    rotation: [0, Math.PI, 0],
    scale: 0.92,
    collider: { type: 'cuboid', args: [0.22, 0.45, 0.22], offset: [0, 0.45, 0] },
  },
  {
    id: 'kitchen-island-apples',
    modelId: 'food_apple_01',
    room: 'kitchen_dining',
    position: [9.8, 0.9, -1.0],
    rotation: [0, 0.3, 0],
    scale: 0.8,
  },
  {
    id: 'kitchen-island-wine-bottles',
    modelId: 'wine_bottles_01',
    room: 'kitchen_dining',
    position: [11.8, 0.9, -1.0],
    rotation: [0, -0.5, 0],
    scale: 0.85,
  },

  // GRAND ENTRANCE FOYER (Room: 'foyer')
  {
    id: 'foyer-ornate-mirror',
    modelId: 'ornate_mirror_01',
    room: 'foyer',
    position: [-0.5, 1.8, 6.35],
    rotation: [0, Math.PI, 0],
    scale: 0.9,
  },
  {
    id: 'foyer-brass-vase',
    modelId: 'brass_vase_01',
    room: 'foyer',
    position: [-0.9, 0.92, 5.9],
    rotation: [0, 0.7, 0],
    scale: 0.8,
  },
  {
    id: 'foyer-plant',
    modelId: 'potted_plant_01',
    room: 'foyer',
    position: [1.8, 0.0, 5.2],
    rotation: [0, -0.4, 0],
    scale: 0.95,
    collider: { type: 'cuboid', args: [0.3, 0.75, 0.3], offset: [0, 0.75, 0] },
  },

  // MASTER BEDROOM SUITE (Room: 'master_bedroom')
  {
    id: 'master-armchair',
    modelId: 'modern_arm_chair_01',
    room: 'master_bedroom',
    position: [-7.8, 0.0, -4.5],
    rotation: [0, -Math.PI / 3, 0],
    scale: 0.95,
    collider: { type: 'cuboid', args: [0.44, 0.38, 0.44], offset: [0, 0.38, 0] },
  },
  {
    id: 'master-nightstand-table',
    modelId: 'side_table_01',
    room: 'master_bedroom',
    position: [-7.2, 0.0, -4.0],
    rotation: [0, 0, 0],
    scale: 0.85,
    collider: { type: 'cuboid', args: [0.24, 0.26, 0.24], offset: [0, 0.26, 0] },
  },
  {
    id: 'master-table-books',
    modelId: 'book_encyclopedia_set_01',
    room: 'master_bedroom',
    position: [-7.2, 0.52, -4.0],
    rotation: [0, 0.3, 0],
    scale: 0.65,
  },

  // PRIVATE SKY TERRACE (Room: 'terrace')
  {
    id: 'terrace-brass-lantern-1',
    modelId: 'brass_diya_lantern',
    room: 'terrace',
    position: [4.2, 0.35, -8.2],
    rotation: [0, 0.4, 0],
    scale: 0.8,
  },
  {
    id: 'terrace-brass-lantern-2',
    modelId: 'brass_diya_lantern',
    room: 'terrace',
    position: [6.8, 0.35, -8.2],
    rotation: [0, -0.6, 0],
    scale: 0.8,
  },
  {
    id: 'terrace-candleholders',
    modelId: 'brass_candleholders',
    room: 'terrace',
    position: [5.5, 0.35, -8.2],
    rotation: [0, 0.2, 0],
    scale: 0.7,
  },

  // MASTER BATHROOM & SPA (Room: 'master_bathroom')
  {
    id: 'bath-vanity-succulent',
    modelId: 'potted_plant_04',
    room: 'master_bathroom',
    position: [-7.5, 0.92, 1.8],
    rotation: [0, 0.8, 0],
    scale: 0.7,
  },
  {
    id: 'bath-tub-candleholders',
    modelId: 'brass_candleholders',
    room: 'master_bathroom',
    position: [-9.8, 0.65, 4.2],
    rotation: [0, 0.4, 0],
    scale: 0.7,
  },
];
