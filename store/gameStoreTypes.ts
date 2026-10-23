export type GameState = 'intro' | 'loading' | 'playing' | 'paused';
export type PlayerPosture = 'standing' | 'sitting' | 'lying';
export type TimeOfDay = 'day' | 'sunset' | 'night';
export type QualityPreset = 'low' | 'medium' | 'high' | 'ultra';

export interface ControlState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  sprint: boolean;
  crouch: boolean;
  interact: boolean;
}

export interface SettingsState {
  mouseSensitivity: number;
  mobileSensitivity: number;
  fov: number;
  volume: number;
  isMuted: boolean;
  showFps: boolean;
  headBobEnabled: boolean;
  quality: QualityPreset;
}

export interface InteractableAction {
  id: string;
  label: string;
  action: () => void;
}

export interface PostureTarget {
  position: [number, number, number];
  eyeHeight: number;
  pitch: number;
  yaw: number;
  returnPosition: [number, number, number];
  returnYaw: number;
}

export const INITIAL_CONTROLS: ControlState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  sprint: false,
  crouch: false,
  interact: false,
};

export const INITIAL_SETTINGS: SettingsState = {
  mouseSensitivity: 0.0022,
  mobileSensitivity: 0.0035,
  fov: 75,
  volume: 0.7,
  isMuted: false,
  showFps: false,
  headBobEnabled: true,
  quality: 'medium',
};

export const INITIAL_DOOR_STATES: Record<string, boolean> = {
  'door-entrance': false,
  'door-master-bed': false,
  'door-master-bath': false,
  'door-wardrobe': false,
  'door-guest-bed': false,
  'door-powder': false,
  'door-terrace': false,
};

export const INITIAL_WINDOW_STATES: Record<string, boolean> = {
  living: false,
  master_bedroom: false,
  master_bathroom: false,
};

export const INITIAL_CURTAIN_STATES: Record<string, boolean> = {
  living: false,
  master_bedroom: false,
};

export const INITIAL_LIGHTING_STATES: Record<string, boolean> = {
  living: true,
  kitchen_dining: true,
  terrace: true,
  hallway: true,
  master_bedroom: true,
  wardrobe: true,
  master_bathroom: true,
  powder_room: true,
  foyer: true,
  guest_bedroom: true,
};

export interface GameStoreState {
  gameState: GameState;
  isStarted: boolean;
  isPaused: boolean;
  isMobile: boolean;
  webGlSupported: boolean;

  timeOfDay: TimeOfDay;
  quality: QualityPreset;
  isPhotoMode: boolean;
  screenshotTrigger: number;
  showPerf: boolean;

  controls: ControlState;
  joystickVector: { x: number; y: number };
  lookDelta: { x: number; y: number };

  currentRoomId: string;
  playerPosition: { x: number; z: number; yaw: number };
  isTeleporting: boolean;
  teleportTarget: { position: [number, number, number]; yaw?: number } | null;

  posture: PlayerPosture;
  postureTarget: PostureTarget | null;

  activeInteractable: InteractableAction | null;
  doorStates: Record<string, boolean>;
  windowStates: Record<string, boolean>;
  curtainStates: Record<string, boolean>;
  lightingStates: Record<string, boolean>;
  fireplaceOn: boolean;
  tvOn: boolean;
  cooktopOn: boolean;
  fridgeOpen: boolean;
  kitchenCabinetOpen: boolean;
  faucetRunning: boolean;
  showerRunning: boolean;
  toiletLidOpen: boolean;
  jacuzziJetsOn: boolean;
  isNearJacuzzi: boolean;

  settings: SettingsState;
}

export interface GameStoreActions {
  setGameState: (state: GameState) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  exitToIntro: () => void;
  setIsMobile: (isMobile: boolean) => void;
  setWebGlSupported: (supported: boolean) => void;

  setTimeOfDay: (timeOfDay: TimeOfDay) => void;
  cycleTimeOfDay: () => void;
  setQuality: (quality: QualityPreset) => void;
  setPhotoMode: (enabled: boolean) => void;
  triggerScreenshot: () => void;
  togglePerf: () => void;
  setShowPerf: (show: boolean) => void;

  setControl: (key: keyof ControlState, active: boolean) => void;
  setJoystickVector: (vector: { x: number; y: number }) => void;
  addLookDelta: (delta: { x: number; y: number }) => void;
  consumeLookDelta: () => { x: number; y: number };

  setCurrentRoomId: (roomId: string) => void;
  setPlayerPosition: (pos: { x: number; z: number; yaw: number }) => void;
  triggerTeleport: (position: [number, number, number], yaw?: number) => void;
  completeTeleport: () => void;

  enterSitting: (target: PostureTarget) => void;
  exitSitting: () => void;
  enterLying: (target: PostureTarget) => void;
  exitLying: () => void;

  setActiveInteractable: (interactable: InteractableAction | null) => void;
  toggleDoor: (doorId: string) => void;
  setDoorState: (doorId: string, open: boolean) => void;

  toggleWindow: (windowId: string) => void;
  toggleCurtains: (curtainId: string) => void;
  toggleRoomLight: (roomId: string) => void;
  setAllLights: (on: boolean) => void;
  toggleFireplace: () => void;
  toggleTv: () => void;
  toggleCooktop: () => void;
  toggleFridge: () => void;
  toggleKitchenCabinet: () => void;
  toggleFaucet: () => void;
  toggleShower: () => void;
  toggleToiletLid: () => void;
  toggleJacuzziJets: () => void;
  setIsNearJacuzzi: (near: boolean) => void;

  updateSettings: (partial: Partial<SettingsState>) => void;
  resetSettings: () => void;
}

export type GameStore = GameStoreState & GameStoreActions;
