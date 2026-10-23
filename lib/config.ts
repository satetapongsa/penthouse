/**
 * THE SKYLINE PENTHOUSE - Architectural & Physics Configuration
 * Single source of truth for room dimensions, doors, materials, and physics.
 */

export interface RoomConfig {
  id: string;
  name: string;
  width: number;  // X axis dimension in meters
  depth: number;  // Z axis dimension in meters
  height: number; // Y axis dimension (Ceiling height: 3.4m)
  position: [number, number, number]; // Center position [x, y, z]
  wallThickness: number;
  hasWindowWall: boolean;
  windowWallSide: 'north' | 'south' | 'east' | 'west';
  doors: DoorConfig[];
}

export interface DoorConfig {
  id: string;
  connectsTo: string;
  position: [number, number, number];
  width: number;
  height: number;
}

export const ARCHITECTURE_CONFIG = {
  // Global ceiling height across the penthouse
  ceilingHeight: 3.4,
  wallThickness: 0.25,
  baseboardHeight: 0.12,
  doorHeight: 2.4,
  doorWidth: 1.2,
  windowFrameThickness: 0.08,

  // Total floor area (~280 m²)
  totalAreaM2: 280,

  // Primary Phase 1 Test Room (Spacious Grand Living Gallery prototype)
  // 12m wide x 10m deep = 120m² open gallery area with 3.4m ceiling height
  rooms: {
    gallery: {
      id: 'gallery',
      name: 'Grand Horizon Gallery',
      width: 14.0,
      depth: 10.0,
      height: 3.4,
      position: [0, 1.7, 0] as [number, number, number],
      wallThickness: 0.25,
      hasWindowWall: true,
      windowWallSide: 'north' as const, // -Z direction faces floor-to-ceiling glass wall
      doors: [
        {
          id: 'door-east-suite',
          connectsTo: 'master-suite',
          position: [6.875, 1.2, 0] as [number, number, number],
          width: 1.4,
          height: 2.4,
        },
      ],
    },
  },

  // Color Palette & Material Standards (Bright, airy white & cream luxury theme)
  colors: {
    floor: '#F3EFE6',         // Pale ivory travertine / limestone
    floorGrout: '#E2DCD1',
    wallPlaster: '#FAF8F3',   // Warm ivory microcement plaster
    wallAccent: '#F4EFE6',    // Soft warm beige
    ceiling: '#FCFBF9',       // Bright airy pure off-white
    brassTrim: '#C5A059',     // Brushed champagne brass
    paleOak: '#CBBBA8',       // Pale Scandinavian white oak
    glassTint: '#E8F1F5',     // High-transparency architectural glass
    glassReflect: '#FFFFFF',
    ambientLight: '#FFFBF2',  // Warm sun-kissed ambient
    sunLight: '#FFF8E7',      // Morning champagne sunlight
    skyHorizon: '#D6E5EE',    // Pale metropolitan daytime skyline
    skyZenith: '#96BBD9',
  },
} as const;

export const PLAYER_CONFIG = {
  // Camera & Anatomy dimensions (body is strictly invisible)
  standingEyeHeight: 1.65, // Comfortable adult eye level
  crouchEyeHeight: 1.0,    // Lowered eye level when crouched
  capsuleRadius: 0.38,     // Capsule collider radius
  capsuleHeight: 1.0,      // Capsule cylinder height (total height = 1.0 + 2*0.38 = 1.76m)
  spawnPosition: [0, 1.8, 2] as [number, number, number], // Initial spawn inside the room

  // Movement Physics
  walkSpeed: 4.2,          // Normal walking speed in m/s
  sprintSpeed: 7.2,        // Elegant sprint in m/s
  crouchSpeed: 2.2,        // Slow stealth crouch in m/s
  jumpImpulse: 4.8,        // Crisp vertical jump impulse
  acceleration: 14.0,      // Smooth acceleration factor
  deceleration: 12.0,      // Smooth friction deceleration
  gravityMultiplier: 1.8,  // Rapier gravity scale for solid ground feel

  // Camera Dynamics
  baseFov: 75,
  sprintFov: 82,
  fovTransitionSpeed: 6.0,
  mouseSensitivity: 0.0022,
  mobileLookSensitivity: 0.0035,
  pitchLimit: 1.48, // ~85 degrees up and down in radians

  // Head bobbing animation parameters
  headBobFrequency: 9.5,
  headBobWalkAmplitude: 0.035,
  headBobSprintAmplitude: 0.065,

  // Fall boundary safety
  fallResetY: -8.0,
} as const;
