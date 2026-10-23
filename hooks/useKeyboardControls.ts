import { useEffect } from 'react';
import { useGameStore, ControlState } from '@/store/useGameStore';

const KEY_MAPPINGS: Record<string, keyof ControlState> = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
  Space: 'jump',
  ShiftLeft: 'sprint',
  ShiftRight: 'sprint',
  KeyC: 'crouch',
  KeyE: 'interact',
};

export function useKeyboardControls() {
  const isStarted = useGameStore((s) => s.isStarted);
  const isPaused = useGameStore((s) => s.isPaused);
  const setControl = useGameStore((s) => s.setControl);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const resumeGame = useGameStore((s) => s.resumeGame);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture inputs if user is typing in an input, textarea or contentEditable
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      // 'M' key toggles audio mute (ignores key repeat, works in photo mode, pointer lock and menus)
      if (e.code === 'KeyM') {
        if (e.repeat) return;
        e.preventDefault();
        useGameStore.getState().toggleMute();
        return;
      }

      // Handle pause toggling or Photo Mode exit on Escape
      if (e.code === 'Escape') {
        e.preventDefault();
        const isPhotoMode = useGameStore.getState().isPhotoMode;
        if (isPhotoMode) {
          useGameStore.getState().setPhotoMode(false);
          return;
        }
        if (isStarted) {
          if (isPaused) {
            resumeGame();
          } else {
            pauseGame();
          }
        }
        return;
      }

      // 'F3' or 'O' key toggles performance diagnostics overlay
      if (e.code === 'F3' || e.code === 'KeyO') {
        e.preventDefault();
        useGameStore.getState().togglePerf();
        return;
      }

      // 'P' key toggles photo mode
      if (e.code === 'KeyP') {
        e.preventDefault();
        const photo = useGameStore.getState().isPhotoMode;
        useGameStore.getState().setPhotoMode(!photo);
        return;
      }

      // If game is paused or not started, ignore movement keys
      if (!isStarted || isPaused) return;

      const controlKey = KEY_MAPPINGS[e.code];
      if (controlKey) {
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
          e.preventDefault();
        }
        setControl(controlKey, true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const controlKey = KEY_MAPPINGS[e.code];
      if (controlKey) {
        setControl(controlKey, false);
      }
    };

    const handleBlur = () => {
      Object.values(KEY_MAPPINGS).forEach((key) => {
        setControl(key, false);
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isStarted, isPaused, setControl, pauseGame, resumeGame]);
}
