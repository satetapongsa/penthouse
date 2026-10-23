'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { ArrowUp, ChevronDown, Flame, Pause, Sparkles, Volume2, VolumeX } from 'lucide-react';

export const MobileControls: React.FC = () => {
  const isStarted = useGameStore((s) => s.isStarted);
  const isPaused = useGameStore((s) => s.isPaused);
  const isMobile = useGameStore((s) => s.isMobile);

  const setJoystickVector = useGameStore((s) => s.setJoystickVector);
  const addLookDelta = useGameStore((s) => s.addLookDelta);
  const setControl = useGameStore((s) => s.setControl);
  const pauseGame = useGameStore((s) => s.pauseGame);

  const muted = useGameStore((s) => s.muted);
  const toggleMute = useGameStore((s) => s.toggleMute);

  const controls = useGameStore((s) => s.controls);

  // Joystick state
  const joystickAreaRef = useRef<HTMLDivElement>(null);
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickOrigin, setJoystickOrigin] = useState({ x: 0, y: 0 });
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const joystickTouchId = useRef<number | null>(null);

  // Touch look state
  const lookAreaRef = useRef<HTMLDivElement>(null);
  const lookTouchId = useRef<number | null>(null);
  const lastLookPos = useRef<{ x: number; y: number } | null>(null);

  const JOYSTICK_MAX_RADIUS = 46;

  // 1. Handle Joystick Touch
  const handleJoystickTouchStart = (e: React.TouchEvent) => {
    if (joystickTouchId.current !== null) return;
    const touch = e.changedTouches[0];
    joystickTouchId.current = touch.identifier;

    const rect = joystickAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    setJoystickOrigin({ x: touchX, y: touchY });
    setKnobPos({ x: 0, y: 0 });
    setJoystickActive(true);
  };

  const handleJoystickTouchMove = useCallback(
    (e: TouchEvent) => {
      if (joystickTouchId.current === null) return;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === joystickTouchId.current) {
          const rect = joystickAreaRef.current?.getBoundingClientRect();
          if (!rect) return;

          const currentX = touch.clientX - rect.left;
          const currentY = touch.clientY - rect.top;

          const dx = currentX - joystickOrigin.x;
          const dy = currentY - joystickOrigin.y;
          const distance = Math.hypot(dx, dy);

          let clampedDx = dx;
          let clampedDy = dy;

          if (distance > JOYSTICK_MAX_RADIUS) {
            clampedDx = (dx / distance) * JOYSTICK_MAX_RADIUS;
            clampedDy = (dy / distance) * JOYSTICK_MAX_RADIUS;
          }

          setKnobPos({ x: clampedDx, y: clampedDy });

          // Normalize vector (-1 to 1); Dragging up is forward (+y)
          const normX = clampedDx / JOYSTICK_MAX_RADIUS;
          const normY = -clampedDy / JOYSTICK_MAX_RADIUS;

          setJoystickVector({ x: normX, y: normY });
          break;
        }
      }
    },
    [joystickOrigin, setJoystickVector]
  );

  const handleJoystickTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (joystickTouchId.current === null) return;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === joystickTouchId.current) {
          joystickTouchId.current = null;
          setJoystickActive(false);
          setKnobPos({ x: 0, y: 0 });
          setJoystickVector({ x: 0, y: 0 });
          break;
        }
      }
    },
    [setJoystickVector]
  );

  // 2. Handle Touch-Drag Look
  const handleLookTouchStart = (e: React.TouchEvent) => {
    if (lookTouchId.current !== null) return;
    const touch = e.changedTouches[0];
    lookTouchId.current = touch.identifier;
    lastLookPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleLookTouchMove = useCallback(
    (e: TouchEvent) => {
      if (lookTouchId.current === null || !lastLookPos.current) return;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === lookTouchId.current) {
          const dx = touch.clientX - lastLookPos.current.x;
          const dy = touch.clientY - lastLookPos.current.y;

          lastLookPos.current = { x: touch.clientX, y: touch.clientY };
          addLookDelta({ x: dx, y: dy });
          break;
        }
      }
    },
    [addLookDelta]
  );

  const handleLookTouchEnd = useCallback((e: TouchEvent) => {
    if (lookTouchId.current === null) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === lookTouchId.current) {
        lookTouchId.current = null;
        lastLookPos.current = null;
        break;
      }
    }
  }, []);

  // Global listeners for touch move and touch end so drags don't cancel when fingers slip out of bounds
  useEffect(() => {
    window.addEventListener('touchmove', handleJoystickTouchMove, { passive: false });
    window.addEventListener('touchend', handleJoystickTouchEnd);
    window.addEventListener('touchcancel', handleJoystickTouchEnd);

    window.addEventListener('touchmove', handleLookTouchMove, { passive: false });
    window.addEventListener('touchend', handleLookTouchEnd);
    window.addEventListener('touchcancel', handleLookTouchEnd);

    return () => {
      window.removeEventListener('touchmove', handleJoystickTouchMove);
      window.removeEventListener('touchend', handleJoystickTouchEnd);
      window.removeEventListener('touchcancel', handleJoystickTouchEnd);

      window.removeEventListener('touchmove', handleLookTouchMove);
      window.removeEventListener('touchend', handleLookTouchEnd);
      window.removeEventListener('touchcancel', handleLookTouchEnd);
    };
  }, [
    handleJoystickTouchMove,
    handleJoystickTouchEnd,
    handleLookTouchMove,
    handleLookTouchEnd,
  ]);

  if (!isMobile || !isStarted || isPaused) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 pointer-events-none select-none touch-none">
      {/* Top Bar for Mobile Pause & Mute (at least 44px buttons, away from joystick & action pads) */}
      <div className="absolute top-4 right-4 pointer-events-auto flex items-center gap-2">
        <button
          onClick={toggleMute}
          className={`w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center active:scale-95 shadow-md cursor-pointer ${
            muted
              ? 'bg-[#2E1A1A]/90 border-red-400/60 text-red-400'
              : 'bg-[#FFFDF9]/85 border-[#C5A059]/40 text-[#4A453B]'
          }`}
          aria-label={muted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {muted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-[#8C7443]" />}
        </button>

        <button
          onClick={pauseGame}
          className="w-11 h-11 rounded-full bg-[#FFFDF9]/85 backdrop-blur-md border border-[#C5A059]/40 flex items-center justify-center text-[#4A453B] active:scale-95 shadow-md cursor-pointer"
          aria-label="Pause Walkthrough"
        >
          <Pause className="w-5 h-5 text-[#8C7443]" />
        </button>
      </div>

      {/* Left Screen: Virtual Joystick Area */}
      <div
        ref={joystickAreaRef}
        onTouchStart={handleJoystickTouchStart}
        className="absolute bottom-0 left-0 w-1/2 h-[75vh] pointer-events-auto"
      >
        {/* Render Joystick Ring & Knob when touched */}
        {joystickActive && (
          <div
            className="absolute rounded-full border border-[#C5A059]/50 bg-[#FAF8F3]/60 backdrop-blur-md shadow-lg pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
            style={{
              left: `${joystickOrigin.x}px`,
              top: `${joystickOrigin.y}px`,
              width: `${JOYSTICK_MAX_RADIUS * 2}px`,
              height: `${JOYSTICK_MAX_RADIUS * 2}px`,
            }}
          >
            {/* Inner knob */}
            <div
              className="absolute w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C7443] shadow-md -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `calc(50% + ${knobPos.x}px)`,
                top: `calc(50% + ${knobPos.y}px)`,
              }}
            />
          </div>
        )}

        {!joystickActive && (
          <div className="absolute bottom-10 left-10 flex flex-col items-center gap-1 opacity-50 pointer-events-none">
            <div className="w-16 h-16 rounded-full border border-dashed border-[#C5A059] flex items-center justify-center">
              <span className="text-[10px] tracking-wider font-semibold text-[#8C7443] uppercase">
                Move
              </span>
            </div>
            <span className="text-[10px] text-neutral-500 font-sans">Touch to Walk</span>
          </div>
        )}
      </div>

      {/* Right Screen: Touch-Drag Look Area & Action Buttons */}
      <div
        ref={lookAreaRef}
        onTouchStart={handleLookTouchStart}
        className="absolute bottom-0 right-0 w-1/2 h-full pointer-events-auto flex items-end justify-end p-6"
      >
        {/* Floating Action Buttons */}
        <div className="flex flex-col items-end gap-3 pointer-events-auto">
          {/* Sprint Toggle */}
          <button
            onTouchStart={() => setControl('sprint', true)}
            onTouchEnd={() => setControl('sprint', false)}
            className={`w-12 h-12 rounded-full backdrop-blur-md border flex items-center justify-center transition-transform active:scale-90 shadow-md ${
              controls.sprint
                ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8963D] text-[#1F1E1B] border-[#D4AF37]'
                : 'bg-[#FFFDF9]/80 text-[#5C564B] border-[#C5A059]/40'
            }`}
            aria-label="Sprint"
          >
            <Flame className="w-5 h-5" />
          </button>

          {/* Crouch Toggle */}
          <button
            onTouchStart={() => setControl('crouch', !controls.crouch)}
            className={`w-12 h-12 rounded-full backdrop-blur-md border flex items-center justify-center transition-transform active:scale-90 shadow-md ${
              controls.crouch
                ? 'bg-[#C5A059] text-white border-[#B8963D]'
                : 'bg-[#FFFDF9]/80 text-[#5C564B] border-[#C5A059]/40'
            }`}
            aria-label="Crouch"
          >
            <ChevronDown className="w-5 h-5" />
          </button>

          {/* Jump Button */}
          <button
            onTouchStart={() => setControl('jump', true)}
            onTouchEnd={() => setControl('jump', false)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFFDF9]/90 to-[#EFECE1]/90 backdrop-blur-md border-2 border-[#D4AF37] flex items-center justify-center text-[#3D382E] active:scale-90 shadow-lg"
            aria-label="Jump"
          >
            <ArrowUp className="w-6 h-6 text-[#8C7443]" />
          </button>

          {/* Interact Button */}
          <button
            onTouchStart={() => setControl('interact', true)}
            onTouchEnd={() => setControl('interact', false)}
            className="w-12 h-12 rounded-full bg-[#FFFDF9]/80 backdrop-blur-md border border-[#C5A059]/40 flex items-center justify-center text-[#5C564B] active:scale-90 shadow-md"
            aria-label="Interact"
          >
            <Sparkles className="w-5 h-5 text-[#8C7443]" />
          </button>
        </div>
      </div>
    </div>
  );
};
