import { create } from 'zustand';

export type GameState = 'intro' | 'loading' | 'playing' | 'paused';

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
  soundEnabled: boolean;
  showFps: boolean;
}

export interface InteractableAction {
  id: string;
  label: string;
  action: () => void;
}

interface GameStore {
  // Game Status
  gameState: GameState;
  isStarted: boolean;
  isPaused: boolean;
  isMobile: boolean;
  webGlSupported: boolean;

  // Active Control Inputs
  controls: ControlState;
  joystickVector: { x: number; y: number };
  lookDelta: { x: number; y: number };

  // Navigation & Room Awareness
  currentRoomId: string;
  playerPosition: { x: number; z: number; yaw: number };
  isTeleporting: boolean;
  teleportTarget: { position: [number, number, number]; yaw?: number } | null;

  // Interaction System
  activeInteractable: InteractableAction | null;
  doorStates: Record<string, boolean>; // doorId -> isOpen

  // Configuration & Settings
  settings: SettingsState;

  // Actions
  setGameState: (state: GameState) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  exitToIntro: () => void;
  setIsMobile: (isMobile: boolean) => void;
  setWebGlSupported: (supported: boolean) => void;

  setControl: (key: keyof ControlState, active: boolean) => void;
  setJoystickVector: (vector: { x: number; y: number }) => void;
  addLookDelta: (delta: { x: number; y: number }) => void;
  consumeLookDelta: () => { x: number; y: number };

  setCurrentRoomId: (roomId: string) => void;
  setPlayerPosition: (pos: { x: number; z: number; yaw: number }) => void;
  triggerTeleport: (position: [number, number, number], yaw?: number) => void;
  completeTeleport: () => void;

  setActiveInteractable: (interactable: InteractableAction | null) => void;
  toggleDoor: (doorId: string) => void;
  setDoorState: (doorId: string, open: boolean) => void;

  updateSettings: (partial: Partial<SettingsState>) => void;
}

const initialControls: ControlState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  sprint: false,
  crouch: false,
  interact: false,
};

const initialSettings: SettingsState = {
  mouseSensitivity: 0.0022,
  mobileSensitivity: 0.0035,
  fov: 75,
  soundEnabled: true,
  showFps: false,
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: 'intro',
  isStarted: false,
  isPaused: false,
  isMobile: false,
  webGlSupported: true,

  controls: { ...initialControls },
  joystickVector: { x: 0, y: 0 },
  lookDelta: { x: 0, y: 0 },

  currentRoomId: 'living',
  playerPosition: { x: 2.0, z: -3.0, yaw: 0 },
  isTeleporting: false,
  teleportTarget: null,

  activeInteractable: null,
  doorStates: {
    'door-entrance': false,
    'door-master-bed': false,
    'door-master-bath': false,
    'door-wardrobe': false,
    'door-guest-bed': false,
    'door-powder': false,
    'door-terrace': false,
  },

  settings: { ...initialSettings },

  setGameState: (gameState) => {
    set({
      gameState,
      isStarted: gameState === 'playing' || gameState === 'paused',
      isPaused: gameState === 'paused',
    });
  },

  startGame: () => {
    set({
      gameState: 'playing',
      isStarted: true,
      isPaused: false,
    });
  },

  pauseGame: () => {
    if (get().isStarted) {
      set({
        gameState: 'paused',
        isPaused: true,
        controls: { ...initialControls },
        joystickVector: { x: 0, y: 0 },
      });
    }
  },

  resumeGame: () => {
    if (get().isStarted) {
      set({
        gameState: 'playing',
        isPaused: false,
      });
    }
  },

  exitToIntro: () => {
    set({
      gameState: 'intro',
      isStarted: false,
      isPaused: false,
      controls: { ...initialControls },
      joystickVector: { x: 0, y: 0 },
      lookDelta: { x: 0, y: 0 },
      activeInteractable: null,
    });
  },

  setIsMobile: (isMobile) => set({ isMobile }),
  setWebGlSupported: (webGlSupported) => set({ webGlSupported }),

  setControl: (key, active) => {
    set((state) => ({
      controls: {
        ...state.controls,
        [key]: active,
      },
    }));
  },

  setJoystickVector: (joystickVector) => {
    set({ joystickVector });
  },

  addLookDelta: (delta) => {
    set((state) => ({
      lookDelta: {
        x: state.lookDelta.x + delta.x,
        y: state.lookDelta.y + delta.y,
      },
    }));
  },

  consumeLookDelta: () => {
    const current = get().lookDelta;
    if (current.x !== 0 || current.y !== 0) {
      set({ lookDelta: { x: 0, y: 0 } });
    }
    return current;
  },

  setCurrentRoomId: (currentRoomId) => {
    if (get().currentRoomId !== currentRoomId) {
      set({ currentRoomId });
    }
  },

  setPlayerPosition: (playerPosition) => {
    set({ playerPosition });
  },

  triggerTeleport: (position, yaw) => {
    set({
      isTeleporting: true,
      teleportTarget: { position, yaw },
      controls: { ...initialControls },
      joystickVector: { x: 0, y: 0 },
    });
  },

  completeTeleport: () => {
    set({
      isTeleporting: false,
      teleportTarget: null,
    });
  },

  setActiveInteractable: (activeInteractable) => {
    set({ activeInteractable });
  },

  toggleDoor: (doorId) => {
    set((state) => ({
      doorStates: {
        ...state.doorStates,
        [doorId]: !state.doorStates[doorId],
      },
    }));
  },

  setDoorState: (doorId, open) => {
    set((state) => ({
      doorStates: {
        ...state.doorStates,
        [doorId]: open,
      },
    }));
  },

  updateSettings: (partial) => {
    set((state) => ({
      settings: {
        ...state.settings,
        ...partial,
      },
    }));
  },
}));
