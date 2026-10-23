/**
 * THE SKYLINE PENTHOUSE - Unified Pointer Lock Controller
 * Robust handling of browser pointer lock API, gestures, cooldowns, and retries.
 */

let lockCooldownTimer: ReturnType<typeof setTimeout> | null = null;

export function requestCanvasPointerLock(canvasEl?: HTMLCanvasElement | null): boolean {
  if (typeof window === 'undefined') return false;

  const canvas = canvasEl || (document.querySelector('canvas') as HTMLCanvasElement | null);
  if (!canvas) return false;

  if (document.pointerLockElement === canvas) {
    return true;
  }

  try {
    const lockResult = canvas.requestPointerLock() as unknown;
    if (lockResult && typeof (lockResult as Promise<void>).catch === 'function') {
      (lockResult as Promise<void>).catch((err: unknown) => {
        // Cooldown error from rapid Escape or tab switches
        if (lockCooldownTimer) {
          clearTimeout(lockCooldownTimer);
        }
        // Graceful retry attempt if game is still active
        lockCooldownTimer = setTimeout(() => {
          const currentCanvas = document.querySelector('canvas');
          if (
            currentCanvas &&
            !document.pointerLockElement &&
            typeof window !== 'undefined'
          ) {
            try {
              currentCanvas.requestPointerLock?.();
            } catch {
              // Browser may require user gesture on retry; handled smoothly
            }
          }
        }, 1100);
      });
    }
    return true;
  } catch (err) {
    // Fail silently without crashing
    return false;
  }
}

export function exitPointerLock(): void {
  if (typeof document === 'undefined') return;
  if (document.pointerLockElement) {
    try {
      document.exitPointerLock();
    } catch {
      // Ignore
    }
  }
}

export function isCanvasPointerLocked(): boolean {
  if (typeof document === 'undefined') return false;
  const canvas = document.querySelector('canvas');
  return !!canvas && document.pointerLockElement === canvas;
}
