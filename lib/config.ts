/**
 * THE SKYLINE PENTHOUSE - Architectural & Physics Configuration
 * Single source of truth for all room dimensions, door openings, materials, and physics.
 */

export interface RoomBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface RoomConfig {
  id: string;
  name: string;
  subtitle: string;
  bounds: RoomBounds;
  width: number;
  depth: number;
  height: number;
  center: [number, number, number];
  spawnPosition: [number, number, number];
  spawnYaw: number;
  isOutdoor?: boolean;
  floorColor?: string;
  wallColor?: string;
}

export type DoorType = 'hinged' | 'sliding';

export interface DoorConfig {
  id: string;
  name: string;
  type: DoorType;
  position: [number, number, number]; // Center of doorway opening
  rotationY: number; // Y rotation in radians (0 = facing North/South, Math.PI/2 = facing East/West)
  width: number;
  height: number;
  connectsRooms: [string, string];
  hingeSide?: 'left' | 'right';
  slideDirection?: 'left' | 'right';
}

export const ARCHITECTURE_CONFIG = {
  // Global ceiling height across the entire interior
  ceilingHeight: 3.4,
  wallThickness: 0.22,
  baseboardHeight: 0.12,
  crownMoldingHeight: 0.14,
  doorHeight: 2.4,
  doorThickness: 0.05,
  windowFrameThickness: 0.08,
  glassRailingHeight: 1.2,

  // Net indoor living space ~280 m² + 105 m² private sky terrace
  totalLivingAreaM2: 280,
  terraceAreaM2: 105,

  // 10 Distinct Penthouse Zones
  rooms: {
    living: {
      id: 'living',
      name: 'Grand Living Gallery',
      subtitle: 'Metropolis Skyline Panorama · 3.4m Ceiling',
      bounds: { minX: -3.5, maxX: 7.5, minZ: -6.0, maxZ: 2.0 },
      width: 11.0,
      depth: 8.0,
      height: 3.4,
      center: [2.0, 1.7, -2.0] as [number, number, number],
      spawnPosition: [2.0, 1.8, -1.0] as [number, number, number], // Initial spawn in living room facing windows
      spawnYaw: 0, // Facing North (toward skyline windows and terrace)
    },
    kitchen_dining: {
      id: 'kitchen_dining',
      name: 'Kitchen & Dining Pavilion',
      subtitle: 'Calacatta Marble & Pale Oak Entertaining Zone',
      bounds: { minX: 7.5, maxX: 14.0, minZ: -6.0, maxZ: 2.0 },
      width: 6.5,
      depth: 8.0,
      height: 3.4,
      center: [10.75, 1.7, -2.0] as [number, number, number],
      spawnPosition: [10.5, 1.8, -2.0] as [number, number, number],
      spawnYaw: 0,
    },
    terrace: {
      id: 'terrace',
      name: 'Private Sky Terrace',
      subtitle: 'Open Sky Panorama · Jacuzzi Basin & Glass Railing',
      bounds: { minX: -3.5, maxX: 14.0, minZ: -12.0, maxZ: -6.0 },
      width: 17.5,
      depth: 6.0,
      height: 3.4,
      center: [5.25, 1.7, -9.0] as [number, number, number],
      spawnPosition: [4.0, 1.8, -8.5] as [number, number, number],
      spawnYaw: 0,
      isOutdoor: true,
    },
    hallway: {
      id: 'hallway',
      name: 'Gallery Hallway',
      subtitle: 'Private Wing Promenade · Recessed Brass Niches',
      bounds: { minX: -6.5, maxX: -3.5, minZ: -6.0, maxZ: 2.0 },
      width: 3.0,
      depth: 8.0,
      height: 3.4,
      center: [-5.0, 1.7, -2.0] as [number, number, number],
      spawnPosition: [-5.0, 1.8, -1.5] as [number, number, number],
      spawnYaw: -Math.PI / 2, // Facing west toward Master Suite
    },
    master_bedroom: {
      id: 'master_bedroom',
      name: 'Master Bedroom Suite',
      subtitle: 'King Suite · Horizon Windows & Silk Plaster',
      bounds: { minX: -14.5, maxX: -6.5, minZ: -6.0, maxZ: 0.0 },
      width: 8.0,
      depth: 6.0,
      height: 3.4,
      center: [-10.5, 1.7, -3.0] as [number, number, number],
      spawnPosition: [-10.5, 1.8, -2.5] as [number, number, number],
      spawnYaw: 0,
    },
    wardrobe: {
      id: 'wardrobe',
      name: 'Walk-in Dressing Wardrobe',
      subtitle: 'Bespoke Oak Cabinetry & Indirect Lighting',
      bounds: { minX: -14.5, maxX: -10.5, minZ: 0.0, maxZ: 5.0 },
      width: 4.0,
      depth: 5.0,
      height: 3.4,
      center: [-12.5, 1.7, 2.5] as [number, number, number],
      spawnPosition: [-12.5, 1.8, 2.0] as [number, number, number],
      spawnYaw: Math.PI / 2,
    },
    master_bathroom: {
      id: 'master_bathroom',
      name: 'Master Bath & Spa',
      subtitle: 'Honed Travertine Slab & Freestanding Tub Alcove',
      bounds: { minX: -10.5, maxX: -6.5, minZ: 0.0, maxZ: 5.0 },
      width: 4.0,
      depth: 5.0,
      height: 3.4,
      center: [-8.5, 1.7, 2.5] as [number, number, number],
      spawnPosition: [-8.5, 1.8, 2.5] as [number, number, number],
      spawnYaw: 0,
    },
    powder_room: {
      id: 'powder_room',
      name: 'Guest Powder Room',
      subtitle: 'Champagne Brass Accents & Fluted Stone Vanity',
      bounds: { minX: -6.5, maxX: -3.5, minZ: 2.0, maxZ: 5.0 },
      width: 3.0,
      depth: 3.0,
      height: 3.4,
      center: [-5.0, 1.7, 3.5] as [number, number, number],
      spawnPosition: [-5.0, 1.8, 3.5] as [number, number, number],
      spawnYaw: -Math.PI / 2,
    },
    foyer: {
      id: 'foyer',
      name: 'Grand Entrance Foyer',
      subtitle: 'Private High-Speed Elevator Vestibule',
      bounds: { minX: -3.5, maxX: 2.5, minZ: 2.0, maxZ: 6.5 },
      width: 6.0,
      depth: 4.5,
      height: 3.4,
      center: [-0.5, 1.7, 4.25] as [number, number, number],
      spawnPosition: [-0.5, 1.8, 4.0] as [number, number, number],
      spawnYaw: -Math.PI, // Facing north into the penthouse
    },
    guest_bedroom: {
      id: 'guest_bedroom',
      name: 'Guest Bedroom Suite',
      subtitle: 'Warm Linen & White Oak Guest Retreat',
      bounds: { minX: 2.5, maxX: 9.5, minZ: 2.0, maxZ: 6.5 },
      width: 7.0,
      depth: 4.5,
      height: 3.4,
      center: [6.0, 1.7, 4.25] as [number, number, number],
      spawnPosition: [6.0, 1.8, 4.25] as [number, number, number],
      spawnYaw: -Math.PI / 2,
    },
  } as Record<string, RoomConfig>,

  // Real Door Openings connecting rooms
  doors: [
    {
      id: 'door-entrance',
      name: 'Private Elevator Double Doors',
      type: 'hinged' as const,
      position: [-0.5, 1.2, 6.5] as [number, number, number],
      rotationY: 0,
      width: 1.4,
      height: 2.4,
      connectsRooms: ['foyer', 'vestibule'] as [string, string],
      hingeSide: 'left' as const,
    },
    {
      id: 'door-master-bed',
      name: 'Master Suite Door',
      type: 'hinged' as const,
      position: [-6.5, 1.2, -3.0] as [number, number, number],
      rotationY: Math.PI / 2,
      width: 1.1,
      height: 2.4,
      connectsRooms: ['hallway', 'master_bedroom'] as [string, string],
      hingeSide: 'left' as const,
    },
    {
      id: 'door-master-bath',
      name: 'Master Bath Door',
      type: 'sliding' as const,
      position: [-10.5, 1.2, 2.5] as [number, number, number],
      rotationY: Math.PI / 2,
      width: 1.1,
      height: 2.4,
      connectsRooms: ['wardrobe', 'master_bathroom'] as [string, string],
      slideDirection: 'right' as const,
    },
    {
      id: 'door-wardrobe',
      name: 'Walk-in Wardrobe Door',
      type: 'hinged' as const,
      position: [-12.5, 1.2, 0.0] as [number, number, number],
      rotationY: 0,
      width: 1.1,
      height: 2.4,
      connectsRooms: ['master_bedroom', 'wardrobe'] as [string, string],
      hingeSide: 'left' as const,
    },
    {
      id: 'door-guest-bed',
      name: 'Guest Bedroom Door',
      type: 'hinged' as const,
      position: [2.5, 1.2, 4.25] as [number, number, number],
      rotationY: Math.PI / 2,
      width: 1.1,
      height: 2.4,
      connectsRooms: ['foyer', 'guest_bedroom'] as [string, string],
      hingeSide: 'right' as const,
    },
    {
      id: 'door-powder',
      name: 'Powder Room Door',
      type: 'hinged' as const,
      position: [-3.5, 1.2, 3.5] as [number, number, number],
      rotationY: Math.PI / 2,
      width: 1.0,
      height: 2.4,
      connectsRooms: ['foyer', 'powder_room'] as [string, string],
      hingeSide: 'left' as const,
    },
    {
      id: 'door-terrace',
      name: 'Terrace Panoramic Sliding Door',
      type: 'sliding' as const,
      position: [2.0, 1.2, -6.0] as [number, number, number],
      rotationY: 0,
      width: 2.2, // Grand wide 2.2m double sliding glass door
      height: 2.6,
      connectsRooms: ['living', 'terrace'] as [string, string],
      slideDirection: 'left' as const,
    },
  ] as DoorConfig[],

  // Jacuzzi / Pool Basin Dimensions on the Sky Terrace
  jacuzzi: {
    bounds: { minX: 8.5, maxX: 13.0, minZ: -11.5, maxZ: -7.5 },
    width: 4.5,
    depth: 4.0,
    basinDepth: 0.85,
    center: [10.75, 0.4, -9.5] as [number, number, number],
    rimWidth: 0.35,
  },

  // Color Palette & Material Standards (Bright, airy white & cream luxury theme)
  colors: {
    floorTravertine: '#F3EFE6', // Light honed travertine
    floorGrout: '#E2DCD1',
    floorOak: '#D6C8B5',       // Pale Scandinavian oak planks
    floorTerrace: '#ECE6DA',   // Weathered exterior travertine
    wallPlaster: '#FAF8F3',     // Ivory microcement plaster
    wallAccent: '#F3EDE2',      // Warm beige architectural feature wall
    ceiling: '#FCFBF9',         // Pure airy off-white
    brassTrim: '#C5A059',       // Brushed champagne brass
    brassDoor: '#BFA05A',
    paleOak: '#CBBBA8',         // Pale oak door leaves & paneling
    glassTint: '#E8F1F5',       // Crystal clear architectural glass
    railingGlass: '#EDF5F7',
    ambientLight: '#FFFBF2',
    sunLight: '#FFF8E7',
    skyHorizon: '#D6E5EE',
    skyZenith: '#96BBD9',
  },
} as const;

export const PLAYER_CONFIG = {
  // Camera & Anatomy dimensions (body is strictly invisible)
  standingEyeHeight: 1.65,
  crouchEyeHeight: 1.0,
  capsuleRadius: 0.38,
  capsuleHeight: 1.0,
  spawnPosition: [2.0, 1.8, -1.0] as [number, number, number], // Spawn in living room facing windows

  // Movement Physics
  walkSpeed: 4.2,
  sprintSpeed: 7.2,
  crouchSpeed: 2.2,
  jumpImpulse: 4.8,
  acceleration: 14.0,
  deceleration: 12.0,
  gravityMultiplier: 1.8,

  // Camera Dynamics
  baseFov: 75,
  sprintFov: 82,
  fovTransitionSpeed: 6.0,
  mouseSensitivity: 0.0022,
  mobileLookSensitivity: 0.0035,
  pitchLimit: 1.48,

  // Head bobbing animation parameters
  headBobFrequency: 9.5,
  headBobWalkAmplitude: 0.035,
  headBobSprintAmplitude: 0.065,

  // Interaction distance
  maxInteractDistance: 2.4,

  // Fall boundary safety
  fallResetY: -8.0,
} as const;
