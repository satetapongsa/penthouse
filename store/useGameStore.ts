import { create } from 'zustand';
import { audioEngine } from '@/lib/audio';

export type GameState = 'intro' | 'loading' | 'playing' | 'paused';
export type PlayerPosture = 'standing' | 'sitting' | 'lying';

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

  // Posture System (Sitting / Lying down)
  posture: PlayerPosture;
  postureTarget: PostureTarget | null;
  enterSitting: (target: PostureTarget) => void;
  exitSitting: () => void;
  enterLying: (target: PostureTarget) => void;
  exitLying: () => void;

  // Central Interaction System
  activeInteractable: InteractableAction | null;
  doorStates: Record<string, boolean>; // doorId -> isOpen

  // Architectural Appliances & Furniture Interactions
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

  // Interactive toggles
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

  // Audio Actions
  setVolume: (volume: number) => void;
  toggleMute: () => void;
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
  volume: 0.7,
  isMuted: false,
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

  posture: 'standing',
  postureTarget: null,

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

  windowStates: {
    living: false,
    master_bedroom: false,
    master_bathroom: false,
  },
  curtainStates: {
    living: false, // false = open drapes, true = pulled closed
    master_bedroom: false,
  },
  lightingStates: {
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
  },
  fireplaceOn: true,
  tvOn: false,
  cooktopOn: false,
  fridgeOpen: false,
  kitchenCabinetOpen: false,
  faucetRunning: false,
  showerRunning: false,
  toiletLidOpen: false,
  jacuzziJetsOn: false,
  isNearJacuzzi: false,

  settings: { ...initialSettings },

  setGameState: (gameState) => {
    set({
      gameState,
      isStarted: gameState === 'playing' || gameState === 'paused',
      isPaused: gameState === 'paused',
    });
  },

  startGame: () => {
    audioEngine.init();
    audioEngine.startAmbientMusic();
    if (get().fireplaceOn) {
      audioEngine.setFireplace(true);
    }
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
      audioEngine.init();
      set({
        gameState: 'playing',
        isPaused: false,
      });
    }
  },

  exitToIntro: () => {
    audioEngine.stopAmbientMusic();
    audioEngine.setWind(false);
    audioEngine.setFaucet(false);
    audioEngine.setShower(false);
    audioEngine.setFireplace(false);
    audioEngine.setBreathing(false);
    audioEngine.setPoolNear(false);

    set({
      gameState: 'intro',
      isStarted: false,
      isPaused: false,
      posture: 'standing',
      postureTarget: null,
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
    // If sitting or lying, exit first
    if (get().posture !== 'standing') {
      get().exitSitting();
    }
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

  // -------------------- POSTURE ACTIONS --------------------
  enterSitting: (target) => {
    audioEngine.playSit();
    set({
      posture: 'sitting',
      postureTarget: target,
      controls: { ...initialControls },
      joystickVector: { x: 0, y: 0 },
      activeInteractable: null,
    });
  },

  exitSitting: () => {
    const current = get().postureTarget;
    audioEngine.playSit();
    set({
      posture: 'standing',
      postureTarget: null,
    });
    if (current) {
      get().triggerTeleport(current.returnPosition, current.returnYaw);
    }
  },

  enterLying: (target) => {
    audioEngine.playSit();
    audioEngine.setBreathing(true);
    set({
      posture: 'lying',
      postureTarget: target,
      controls: { ...initialControls },
      joystickVector: { x: 0, y: 0 },
      activeInteractable: null,
    });
  },

  exitLying: () => {
    const current = get().postureTarget;
    audioEngine.setBreathing(false);
    audioEngine.playSit();
    set({
      posture: 'standing',
      postureTarget: null,
    });
    if (current) {
      get().triggerTeleport(current.returnPosition, current.returnYaw);
    }
  },

  // -------------------- INTERACTION SYSTEM --------------------
  setActiveInteractable: (activeInteractable) => {
    set({ activeInteractable });
  },

  toggleDoor: (doorId) => {
    const nextState = !get().doorStates[doorId];
    const isSliding = doorId === 'door-terrace' || doorId === 'door-master-bath';
    audioEngine.playDoor(nextState, isSliding ? 'sliding' : 'hinged');
    set((state) => ({
      doorStates: {
        ...state.doorStates,
        [doorId]: nextState,
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

  toggleWindow: (windowId) => {
    audioEngine.playDoor(!get().windowStates[windowId], 'sliding');
    set((state) => {
      const next = {
        ...state.windowStates,
        [windowId]: !state.windowStates[windowId],
      };
      const anyOpen = Object.values(next).some((val) => val);
      audioEngine.setWind(anyOpen);
      return { windowStates: next };
    });
  },

  toggleCurtains: (curtainId) => {
    audioEngine.playSit();
    set((state) => ({
      curtainStates: {
        ...state.curtainStates,
        [curtainId]: !state.curtainStates[curtainId],
      },
    }));
  },

  toggleRoomLight: (roomId) => {
    audioEngine.playSwitch();
    set((state) => ({
      lightingStates: {
        ...state.lightingStates,
        [roomId]: !state.lightingStates[roomId],
      },
    }));
  },

  setAllLights: (on) => {
    audioEngine.playSwitch();
    set((state) => {
      const updated: Record<string, boolean> = {};
      Object.keys(state.lightingStates).forEach((k) => {
        updated[k] = on;
      });
      return { lightingStates: updated };
    });
  },

  toggleFireplace: () => {
    audioEngine.playSwitch();
    const next = !get().fireplaceOn;
    audioEngine.setFireplace(next);
    set({ fireplaceOn: next });
  },

  toggleTv: () => {
    audioEngine.playSwitch();
    set((state) => ({ tvOn: !state.tvOn }));
  },

  toggleCooktop: () => {
    audioEngine.playSwitch();
    set((state) => ({ cooktopOn: !state.cooktopOn }));
  },

  toggleFridge: () => {
    const next = !get().fridgeOpen;
    audioEngine.playDoor(next, 'hinged');
    set({ fridgeOpen: next });
  },

  toggleKitchenCabinet: () => {
    const next = !get().kitchenCabinetOpen;
    audioEngine.playDoor(next, 'hinged');
    set({ kitchenCabinetOpen: next });
  },

  toggleFaucet: () => {
    audioEngine.playSwitch();
    const next = !get().faucetRunning;
    audioEngine.setFaucet(next);
    set({ faucetRunning: next });
  },

  toggleShower: () => {
    audioEngine.playSwitch();
    const next = !get().showerRunning;
    audioEngine.setShower(next);
    set({ showerRunning: next });
  },

  toggleToiletLid: () => {
    audioEngine.playDoor(!get().toiletLidOpen, 'hinged');
    set((state) => ({ toiletLidOpen: !state.toiletLidOpen }));
  },

  toggleJacuzziJets: () => {
    audioEngine.playSwitch();
    const next = !get().jacuzziJetsOn;
    audioEngine.setPoolNear(next || get().isNearJacuzzi);
    set({ jacuzziJetsOn: next });
  },

  setIsNearJacuzzi: (near) => {
    if (get().isNearJacuzzi !== near) {
      audioEngine.setPoolNear(near || get().jacuzziJetsOn);
      set({ isNearJacuzzi: near });
    }
  },

  // -------------------- AUDIO SETTINGS --------------------
  setVolume: (volume) => {
    audioEngine.setVolume(volume);
    set((state) => ({
      settings: {
        ...state.settings,
        volume,
      },
    }));
  },

  toggleMute: () => {
    const nextMuted = !get().settings.isMuted;
    audioEngine.setMuted(nextMuted);
    set((state) => ({
      settings: {
        ...state.settings,
        isMuted: nextMuted,
      },
    }));
  },

  updateSettings: (partial) => {
    if (typeof partial.volume === 'number') {
      audioEngine.setVolume(partial.volume);
    }
    if (typeof partial.isMuted === 'boolean') {
      audioEngine.setMuted(partial.isMuted);
    }
    set((state) => ({
      settings: {
        ...state.settings,
        ...partial,
      },
    }));
  },
}));
