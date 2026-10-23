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

const AUDIO_STORAGE_KEY = 'penthouse_audio_settings';

const readSavedAudio = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUDIO_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        volume: typeof parsed.volume === 'number' ? parsed.volume : 0.7,
        muted: typeof parsed.muted === 'boolean' ? parsed.muted : !!parsed.isMuted,
      };
    }
  } catch {}
  return null;
};

const saveAudioSettings = (volume: number, muted: boolean) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify({ volume, muted, isMuted: muted }));
  } catch {}
};

let toastTimeout: ReturnType<typeof setTimeout> | null = null;

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: 'intro',
  isStarted: false,
  isPaused: false,
  isPointerLocked: false,
  isMobile: false,
  webGlSupported: true,

  timeOfDay: 'day',
  quality: 'medium',
  isPhotoMode: false,
  screenshotTrigger: 0,
  showPerf: false,
  muteToast: null,

  muted: false,
  volume: 0.7,

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

  settings: { ...INITIAL_SETTINGS, volume: 0.7, isMuted: false },

  setGameState: (gameState) => set({ gameState }),

  hydrateAudioSettings: () => {
    const saved = readSavedAudio();
    if (saved) {
      set((state) => ({
        volume: saved.volume,
        muted: saved.muted,
        settings: { ...state.settings, volume: saved.volume, isMuted: saved.muted },
      }));
      audioEngine.setVolume(saved.volume);
      audioEngine.setMuted(saved.muted);
    }
  },

  startGame: () => {
    const vol = get().volume;
    const mut = get().muted;
    audioEngine.init(vol, mut);
    audioEngine.resumeContext();
    audioEngine.startAmbientMusic(mut);
    audioEngine.setFireplace(get().fireplaceOn, mut);
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
    audioEngine.resumeContext();
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
      isPointerLocked: false,
      posture: 'standing',
      postureTarget: null,
      controls: { ...INITIAL_CONTROLS },
      joystickVector: { x: 0, y: 0 },
      lookDelta: { x: 0, y: 0 },
    });
  },

  setPointerLocked: (isPointerLocked) => set({ isPointerLocked }),
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

  setControl: (key, active) => set((s) => ({ controls: { ...s.controls, [key]: active } })),
  setJoystickVector: (joystickVector) => set({ joystickVector }),

  addLookDelta: (delta) => set((s) => ({
    lookDelta: { x: s.lookDelta.x + delta.x, y: s.lookDelta.y + delta.y },
  })),

  consumeLookDelta: () => {
    const current = get().lookDelta;
    if (current.x !== 0 || current.y !== 0) set({ lookDelta: { x: 0, y: 0 } });
    return current;
  },

  setCurrentRoomId: (currentRoomId) => {
    if (get().currentRoomId !== currentRoomId) set({ currentRoomId });
  },

  setPlayerPosition: (playerPosition) => set({ playerPosition }),
  triggerTeleport: (position, yaw) => set({ isTeleporting: true, teleportTarget: { position, yaw }, isPaused: false }),
  completeTeleport: () => set({ isTeleporting: false, teleportTarget: null }),

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
    const current = !get().doorStates[doorId];
    const isSliding = doorId.includes('terrace') || doorId.includes('bath');
    audioEngine.playDoor(current, isSliding ? 'sliding' : 'hinged');
    set((s) => ({ doorStates: { ...s.doorStates, [doorId]: current } }));
  },

  setDoorState: (doorId, open) => set((s) => ({ doorStates: { ...s.doorStates, [doorId]: open } })),

  toggleWindow: (windowId) => {
    const next = !get().windowStates[windowId];
    audioEngine.playDoor(next, 'sliding');
    const newWindows = { ...get().windowStates, [windowId]: next };
    audioEngine.setWind(Object.values(newWindows).some(Boolean));
    set({ windowStates: newWindows });
  },

  toggleCurtains: (curtainId) => {
    audioEngine.playSit();
    set((s) => ({ curtainStates: { ...s.curtainStates, [curtainId]: !s.curtainStates[curtainId] } }));
  },

  toggleRoomLight: (roomId) => {
    audioEngine.playSwitch();
    set((s) => ({ lightingStates: { ...s.lightingStates, [roomId]: !s.lightingStates[roomId] } }));
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
    audioEngine.setFireplace(next, get().muted);
    set({ fireplaceOn: next });
  },

  toggleTv: () => { audioEngine.playSwitch(); set((s) => ({ tvOn: !s.tvOn })); },
  toggleCooktop: () => { audioEngine.playSwitch(); set((s) => ({ cooktopOn: !s.cooktopOn })); },
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
    set((s) => ({ toiletLidOpen: !s.toiletLidOpen }));
  },
  toggleJacuzziJets: () => {
    audioEngine.playSwitch();
    set((s) => ({ jacuzziJetsOn: !s.jacuzziJetsOn }));
  },
  setIsNearJacuzzi: (isNearJacuzzi) => {
    if (get().isNearJacuzzi !== isNearJacuzzi) {
      set({ isNearJacuzzi });
      audioEngine.setPoolNear(isNearJacuzzi);
    }
  },

  setVolume: (volume: number) => {
    const clamped = Math.max(0, Math.min(1, volume));
    if (clamped === 0) {
      set((s) => ({ volume: 0, muted: true, settings: { ...s.settings, volume: 0, isMuted: true } }));
      audioEngine.setVolume(0);
      audioEngine.setMuted(true);
      saveAudioSettings(0, true);
    } else {
      const wasMuted = get().muted;
      set((s) => ({ volume: clamped, muted: false, settings: { ...s.settings, volume: clamped, isMuted: false } }));
      audioEngine.setVolume(clamped);
      if (wasMuted) audioEngine.setMuted(false);
      saveAudioSettings(clamped, false);
    }
  },

  setMute: (muted: boolean) => {
    set((s) => ({ muted, settings: { ...s.settings, isMuted: muted } }));
    audioEngine.setMuted(muted);
    saveAudioSettings(get().volume, muted);
  },

  toggleMute: () => {
    const nextMuted = !get().muted;
    set((s) => ({ muted: nextMuted, settings: { ...s.settings, isMuted: nextMuted } }));
    audioEngine.setMuted(nextMuted);
    saveAudioSettings(get().volume, nextMuted);

    const toast = nextMuted ? 'Sound off' : 'Sound on';
    set({ muteToast: toast });
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { set({ muteToast: null }); }, 1000);
  },

  updateSettings: (partial) => {
    set((state) => {
      const updated = { ...state.settings, ...partial };
      const nextVolume = typeof partial.volume === 'number' ? partial.volume : state.volume;
      const nextMuted = typeof partial.isMuted === 'boolean' ? partial.isMuted : state.muted;
      if (typeof partial.volume === 'number') get().setVolume(partial.volume);
      if (typeof partial.isMuted === 'boolean') get().setMute(partial.isMuted);
      if (partial.quality) state.setQuality(partial.quality);
      return { settings: updated, volume: nextVolume, muted: nextMuted };
    });
  },

  resetSettings: () => {
    set((s) => ({ settings: { ...INITIAL_SETTINGS }, volume: INITIAL_SETTINGS.volume, muted: INITIAL_SETTINGS.isMuted }));
    audioEngine.setVolume(INITIAL_SETTINGS.volume);
    audioEngine.setMuted(INITIAL_SETTINGS.isMuted);
    saveAudioSettings(INITIAL_SETTINGS.volume, INITIAL_SETTINGS.isMuted);
  },

  setMuteToast: (muteToast) => set({ muteToast }),
}));
