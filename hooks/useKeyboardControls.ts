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
  const toggleMute = useGameStore((s) => s.toggleMute);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture inputs if user is typing in an input/textarea
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Handle pause toggling on Escape
      if (e.code === 'Escape') {
        e.preventDefault();
        if (isStarted) {
          if (isPaused) {
            resumeGame();
          } else {
            pauseGame();
          }
        }
        return;
      }

      // 'M' key toggles mute
      if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
        return;
      }

      // If game is paused or not started, ignore movement keys
      if (!isStarted || isPaused) return;

      const controlKey = KEY_MAPPINGS[e.code];
      if (controlKey) {
        // Prevent browser default scrolling for Space / Arrow keys
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
      // Release all controls when window loses focus
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
  }, [isStarted, isPaused, setControl, pauseGame, resumeGame, toggleMute]);
}
