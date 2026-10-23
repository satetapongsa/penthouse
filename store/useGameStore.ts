import { create } from 'zustand';
import { audioEngine } from '@/lib/audio';
import {
  TimeOfDay,
  GameStore,
  INITIAL_CONTROLS,
  INITIAL_SETTINGS,
  INITIAL_DOOR_STATES,
  INITIAL_WINDOW_STATES,
  INITIAL_CURTAIN_STATES,
  INITIAL_LIGHTING_STATES,
} from './gameStoreTypes';

export * from './gameStoreTypes';

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: 'intro',
  isStarted: false,
  isPaused: false,
  isMobile: false,
  webGlSupported: true,

  timeOfDay: 'day',
  quality: 'medium',
  isPhotoMode: false,
  screenshotTrigger: 0,
  showPerf: false,

  controls: { ...INITIAL_CONTROLS },
  joystickVector: { x: 0, y: 0 },
  lookDelta: { x: 0, y: 0 },

  currentRoomId: 'living',
  playerPosition: { x: 2.0, z: -3.0, yaw: 0 },
  isTeleporting: false,
  teleportTarget: null,

  posture: 'standing',
  postureTarget: null,

  activeInteractable: null,
  doorStates: { ...INITIAL_DOOR_STATES },
  windowStates: { ...INITIAL_WINDOW_STATES },
  curtainStates: { ...INITIAL_CURTAIN_STATES },
  lightingStates: { ...INITIAL_LIGHTING_STATES },
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

  settings: { ...INITIAL_SETTINGS },

  setGameState: (gameState) => set({ gameState }),

  startGame: () => {
    audioEngine.init();
    audioEngine.startAmbientMusic();
    audioEngine.setFireplace(get().fireplaceOn);
    set({ gameState: 'playing', isStarted: true, isPaused: false });
  },

  pauseGame: () => {
    set({
      gameState: 'paused',
      isPaused: true,
      controls: { ...INITIAL_CONTROLS },
      joystickVector: { x: 0, y: 0 },
      lookDelta: { x: 0, y: 0 },
    });
  },

  resumeGame: () => {
    set({
      gameState: 'playing',
      isPaused: false,
      controls: { ...INITIAL_CONTROLS },
      joystickVector: { x: 0, y: 0 },
      lookDelta: { x: 0, y: 0 },
    });
  },

  exitToIntro: () => {
    audioEngine.stopAmbientMusic();
    audioEngine.setWind(false);
    audioEngine.setFaucet(false);
    audioEngine.setShower(false);
    audioEngine.setFireplace(false);
    audioEngine.setPoolNear(false);
    audioEngine.setBreathing(false);
    set({
      gameState: 'intro',
      isStarted: false,
      isPaused: false,
      posture: 'standing',
      postureTarget: null,
      controls: { ...INITIAL_CONTROLS },
      joystickVector: { x: 0, y: 0 },
      lookDelta: { x: 0, y: 0 },
    });
  },

  setIsMobile: (isMobile) => set({ isMobile }),
  setWebGlSupported: (webGlSupported) => set({ webGlSupported }),

  setTimeOfDay: (timeOfDay) => {
    set({ timeOfDay });
    if (timeOfDay === 'night' || timeOfDay === 'sunset') {
      const lights = { ...get().lightingStates };
      Object.keys(lights).forEach((k) => { lights[k] = true; });
      set({ lightingStates: lights });
    }
  },

  cycleTimeOfDay: () => {
    const order: TimeOfDay[] = ['day', 'sunset', 'night'];
    const next = order[(order.indexOf(get().timeOfDay) + 1) % order.length];
    get().setTimeOfDay(next);
  },

  setQuality: (quality) => set({ quality }),
  setPhotoMode: (isPhotoMode) => set({ isPhotoMode }),
  triggerScreenshot: () => set((state) => ({ screenshotTrigger: state.screenshotTrigger + 1 })),
  togglePerf: () => set((state) => ({ showPerf: !state.showPerf })),
  setShowPerf: (showPerf) => set({ showPerf }),

  setControl: (key, active) => {
    set((state) => ({
      controls: { ...state.controls, [key]: active },
    }));
  },

  setJoystickVector: (joystickVector) => set({ joystickVector }),

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
      isPaused: false,
    });
  },

  completeTeleport: () => {
    set({ isTeleporting: false, teleportTarget: null });
  },

  enterSitting: (target) => {
    audioEngine.playSit();
    set({ posture: 'sitting', postureTarget: target, controls: { ...INITIAL_CONTROLS } });
  },

  exitSitting: () => {
    audioEngine.playSit();
    set({ posture: 'standing', postureTarget: null });
  },

  enterLying: (target) => {
    audioEngine.playSit();
    audioEngine.setBreathing(true);
    set({ posture: 'lying', postureTarget: target, controls: { ...INITIAL_CONTROLS } });
  },

  exitLying: () => {
    audioEngine.playSit();
    audioEngine.setBreathing(false);
    set({ posture: 'standing', postureTarget: null });
  },

  setActiveInteractable: (activeInteractable) => set({ activeInteractable }),

  toggleDoor: (doorId) => {
    const current = !!get().doorStates[doorId];
    const next = !current;
    const isSliding = doorId.includes('terrace') || doorId.includes('bath');
    audioEngine.playDoor(next, isSliding ? 'sliding' : 'hinged');
    set((state) => ({
      doorStates: { ...state.doorStates, [doorId]: next },
    }));
  },

  setDoorState: (doorId, open) => {
    set((state) => ({
      doorStates: { ...state.doorStates, [doorId]: open },
    }));
  },

  toggleWindow: (windowId) => {
    const next = !get().windowStates[windowId];
    audioEngine.playDoor(next, 'sliding');
    const newWindows = { ...get().windowStates, [windowId]: next };
    audioEngine.setWind(Object.values(newWindows).some(Boolean));
    set({ windowStates: newWindows });
  },

  toggleCurtains: (curtainId) => {
    audioEngine.playSit();
    set((state) => ({
      curtainStates: { ...state.curtainStates, [curtainId]: !state.curtainStates[curtainId] },
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
    const updated: Record<string, boolean> = {};
    Object.keys(get().lightingStates).forEach((k) => { updated[k] = on; });
    set({ lightingStates: updated });
  },

  toggleFireplace: () => {
    const next = !get().fireplaceOn;
    audioEngine.playSwitch();
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
    const next = !get().faucetRunning;
    audioEngine.playSwitch();
    audioEngine.setFaucet(next);
    set({ faucetRunning: next });
  },

  toggleShower: () => {
    const next = !get().showerRunning;
    audioEngine.playSwitch();
    audioEngine.setShower(next);
    set({ showerRunning: next });
  },

  toggleToiletLid: () => {
    audioEngine.playDoor(!get().toiletLidOpen, 'hinged');
    set((state) => ({ toiletLidOpen: !state.toiletLidOpen }));
  },

  toggleJacuzziJets: () => {
    audioEngine.playSwitch();
    set((state) => ({ jacuzziJetsOn: !state.jacuzziJetsOn }));
  },

  setIsNearJacuzzi: (isNearJacuzzi) => {
    if (get().isNearJacuzzi !== isNearJacuzzi) {
      set({ isNearJacuzzi });
      audioEngine.setPoolNear(isNearJacuzzi);
    }
  },

  updateSettings: (partial) => {
    set((state) => {
      const updated = { ...state.settings, ...partial };
      if (typeof partial.volume === 'number') audioEngine.setVolume(partial.volume);
      if (typeof partial.isMuted === 'boolean') audioEngine.setMuted(partial.isMuted);
      if (partial.quality) state.setQuality(partial.quality);
      return { settings: updated };
    });
  },

  resetSettings: () => {
    set({ settings: { ...INITIAL_SETTINGS } });
  },
}));
