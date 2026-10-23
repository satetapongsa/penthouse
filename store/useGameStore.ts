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

interface GameStore {
  // Game Status
  gameState: GameState;
  isStarted: boolean;
  isPaused: boolean;
  isMobile: boolean;
  webGlSupported: boolean;

  // Active Control Inputs (unified desktop keyboard + mobile virtual inputs)
  controls: ControlState;
  joystickVector: { x: number; y: number }; // normalized -1 to 1 (x: strafe, y: forward/back)
  lookDelta: { x: number; y: number };     // mobile touch look delta accumulator

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
        // Reset movement inputs on pause so player doesn't keep running
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

  updateSettings: (partial) => {
    set((state) => ({
      settings: {
        ...state.settings,
        ...partial,
      },
    }));
  },
}));
