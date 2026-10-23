'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { ARCHITECTURE_CONFIG } from '@/lib/config';
import { Map, ChevronDown, ChevronUp, Navigation } from 'lucide-react';

export const MiniMap: React.FC = () => {
  const isStarted = useGameStore((s) => s.isStarted);
  const isPaused = useGameStore((s) => s.isPaused);
  const currentRoomId = useGameStore((s) => s.currentRoomId);
  const playerPosition = useGameStore((s) => s.playerPosition);
  const triggerTeleport = useGameStore((s) => s.triggerTeleport);

  const [isExpanded, setIsExpanded] = useState(true);

  if (!isStarted || isPaused) {
    return null;
  }

  // World bounds for 280 m² penthouse floor plan
  const minX = -15.5;
  const spanX = 30.5;
  const minZ = -13.0;
  const spanZ = 20.5;

  const svgWidth = 240;
  const svgHeight = 165;
  const paddingX = 10;
  const paddingY = 10;
  const drawWidth = svgWidth - paddingX * 2;
  const drawHeight = svgHeight - paddingY * 2;

  const toSvgX = (x: number) => ((x - minX) / spanX) * drawWidth + paddingX;
  const toSvgZ = (z: number) => ((z - minZ) / spanZ) * drawHeight + paddingY;

  const playerSvgX = toSvgX(playerPosition.x);
  const playerSvgY = toSvgZ(playerPosition.z);

  // In 3D: forward is -Z (yaw = 0).
  // In SVG: down is +Y, up is -Y.
  // When yaw = 0, facing -Z (North), which is up in SVG (-Y).
  // Therefore, rotation angle around the player point is (yaw in degrees).
  const playerRotationDeg = (playerPosition.yaw * 180) / Math.PI;

  const rooms = Object.values(ARCHITECTURE_CONFIG.rooms);
  const doors = ARCHITECTURE_CONFIG.doors;
  const activeRoom = ARCHITECTURE_CONFIG.rooms[currentRoomId] || rooms[0];

  return (
    <div className="fixed bottom-5 left-5 z-40 select-none">
      <div className="rounded-2xl border border-[#C5A059]/40 bg-[#FFFDF9]/90 backdrop-blur-md shadow-xl overflow-hidden transition-all duration-300">
        {/* Header Bar */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between px-3.5 py-2 border-b border-[#E8DFD1] cursor-pointer hover:bg-[#F5EFE6]/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Map className="w-3.5 h-3.5 text-[#8C7443]" />
            <span className="text-[11px] font-medium tracking-[0.15em] text-[#4A453B] uppercase">
              Floor Plan
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-[#8C7443] truncate max-w-[110px]">
              {activeRoom.name}
            </span>
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
            )}
          </div>
        </div>

        {/* Map Body */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="p-2.5"
            >
              <svg
                width={svgWidth}
                height={svgHeight}
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto"
              >
                {/* Background Grid Accent */}
                <rect
                  x="0"
                  y="0"
                  width={svgWidth}
                  height={svgHeight}
                  fill="#FAF8F3"
                  rx="8"
                />

                {/* Rooms */}
                {rooms.map((room) => {
                  const rx = toSvgX(room.bounds.minX);
                  const ry = toSvgZ(room.bounds.minZ);
                  const rw = toSvgX(room.bounds.maxX) - rx;
                  const rh = toSvgZ(room.bounds.maxZ) - ry;
                  const isActive = room.id === currentRoomId;
                  const isOutdoor = room.isOutdoor;

                  return (
                    <g
                      key={room.id}
                      onClick={() => triggerTeleport(room.spawnPosition, room.spawnYaw)}
                      className="cursor-pointer group"
                    >
                      <rect
                        x={rx}
                        y={ry}
                        width={rw}
                        height={rh}
                        rx="3"
                        fill={
                          isActive
                            ? 'rgba(197, 160, 89, 0.32)'
                            : isOutdoor
                            ? 'rgba(236, 230, 218, 0.55)'
                            : 'rgba(255, 253, 249, 0.75)'
                        }
                        stroke={isActive ? '#B8963D' : isOutdoor ? '#A2B9C8' : '#D6CCB8'}
                        strokeWidth={isActive ? '1.75' : '1'}
                        className="transition-colors group-hover:fill-[#F3EFE6]"
                      />

                      {/* Room Abbreviation / Label */}
                      <text
                        x={rx + rw / 2}
                        y={ry + rh / 2 + 3}
                        textAnchor="middle"
                        fontSize={rw > 50 ? '7.5' : '6.5'}
                        fill={isActive ? '#6B5424' : '#8A8275'}
                        fontWeight={isActive ? '600' : '500'}
                        className="pointer-events-none uppercase tracking-tighter"
                      >
                        {room.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}

                {/* Door Openings */}
                {doors.map((door) => {
                  const dx = toSvgX(door.position[0]);
                  const dy = toSvgZ(door.position[2]);
                  const isHorizontal = Math.abs(door.rotationY) < 0.1;

                  return (
                    <line
                      key={door.id}
                      x1={isHorizontal ? dx - 5 : dx}
                      y1={isHorizontal ? dy : dy - 5}
                      x2={isHorizontal ? dx + 5 : dx}
                      y2={isHorizontal ? dy : dy + 5}
                      stroke="#C5A059"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  );
                })}

                {/* Player Indicator & Vision Cone */}
                <g transform={`translate(${playerSvgX}, ${playerSvgY}) rotate(${playerRotationDeg})`}>
                  {/* Subtle Forward Vision Cone */}
                  <path
                    d="M 0 0 L -14 -24 L 14 -24 Z"
                    fill="url(#visionGradient)"
                    opacity="0.6"
                    className="pointer-events-none"
                  />

                  {/* Pulsing Ripple */}
                  <circle
                    r="6.5"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="1"
                    opacity="0.8"
                    className="animate-ping"
                  />

                  {/* Player Dot */}
                  <circle
                    r="4"
                    fill="#C5A059"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />

                  {/* Direction Arrow Tip */}
                  <polygon
                    points="0,-7 -2.5,-3 2.5,-3"
                    fill="#8C7443"
                  />
                </g>

                {/* SVG Gradients */}
                <defs>
                  <linearGradient id="visionGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Quick instructions */}
              <div className="mt-1 flex items-center justify-between text-[9px] text-[#8C8477]">
                <span>Click room to teleport</span>
                <span className="flex items-center gap-0.5">
                  <Navigation className="w-2.5 h-2.5 text-[#C5A059]" /> 280 m² Penthouse
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
