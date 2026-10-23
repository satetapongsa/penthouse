import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';

export function useDeviceDetect() {
  const setIsMobile = useGameStore((s) => s.setIsMobile);

  useEffect(() => {
    const checkMobile = () => {
      const hasTouch =
        typeof window !== 'undefined' &&
        ('ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          // @ts-expect-error msMaxTouchPoints is vendor-prefixed
          navigator.msMaxTouchPoints > 0);

      const isMobileWidth = window.innerWidth <= 1024;
      const isMobileDevice = Boolean(hasTouch && isMobileWidth);
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);
}
