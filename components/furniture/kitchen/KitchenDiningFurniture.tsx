'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import {
  getCalacattaMarbleTexture,
  getPaleOakTexture,
  getBoucleFabricTexture,
  LUXURY_PALETTE,
} from '@/lib/materials';

export const KitchenDiningFurniture: React.FC = () => {
  const marbleTex = useMemo(() => getCalacattaMarbleTexture(), []);
  const oakTex = useMemo(() => getPaleOakTexture(), []);
  const boucleTex = useMemo(() => getBoucleFabricTexture(), []);
  const colors = LUXURY_PALETTE.colors;

  return (
    <group>
      {/* -------------------- 1. WATERFALL CALACATTA MARBLE ISLAND -------------------- */}
      {/* Center: X = 10.75, Z = -1.0, Width: 3.6m, Depth: 1.2m, Counter Height: 0.92m */}
      <group position={[10.75, 0, -1.0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.8, 0.46, 0.6]} position={[0, 0.46, 0]} />
        </RigidBody>

        {/* Countertop Slab */}
        <mesh position={[0, 0.89, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.6, 0.06, 1.2]} />
          <meshPhysicalMaterial
            color={colors.calacatta}
            map={marbleTex}
            roughness={0.12}
            clearcoat={0.9}
          />
        </mesh>

        {/* Left Waterfall Marble Edge (drops to floor) */}
        <mesh position={[-1.77, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.06, 0.88, 1.2]} />
          <meshPhysicalMaterial
            color={colors.calacatta}
            map={marbleTex}
            roughness={0.12}
            clearcoat={0.9}
          />
        </mesh>

        {/* Right Waterfall Marble Edge (drops to floor) */}
        <mesh position={[1.77, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.06, 0.88, 1.2]} />
          <meshPhysicalMaterial
            color={colors.calacatta}
            map={marbleTex}
            roughness={0.12}
            clearcoat={0.9}
          />
        </mesh>

        {/* Fluted Pale Oak Island Under-Cabinetry (recessed for bar stool knee clearance) */}
        <mesh position={[0, 0.44, 0.12]} castShadow receiveShadow>
          <boxGeometry args={[3.42, 0.84, 0.92]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </mesh>

        {/* Brushed Brass Recessed Toe Kick */}
        <mesh position={[0, 0.04, 0.12]}>
          <boxGeometry args={[3.44, 0.08, 0.88]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
        </mesh>

        {/* Undermount Prep Sink */}
        <group position={[-0.8, 0.92, 0.05]}>
          {/* Sink Basin */}
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[0.55, 0.2, 0.42]} />
            <meshStandardMaterial color="#2B2824" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Gooseneck Brushed Brass Mixer Faucet */}
          <group position={[0, 0.1, -0.18]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.015, 0.02, 0.26, 16]} />
              <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
            </mesh>
            <mesh position={[0, 0.16, 0.08]} rotation={[Math.PI / 2.5, 0, 0]} castShadow>
              <cylinderGeometry args={[0.012, 0.015, 0.2, 16]} />
              <meshStandardMaterial color={colors.brass} metalness={0.92} roughness={0.18} />
            </mesh>
          </group>
        </group>

        {/* Flush Black Induction Cooktop */}
        <group position={[0.7, 0.925, 0.05]}>
          <mesh>
            <boxGeometry args={[0.85, 0.01, 0.52]} />
            <meshPhysicalMaterial
              color="#111111"
              roughness={0.05}
              clearcoat={1.0}
              reflectivity={0.9}
            />
          </mesh>
          {/* 4 Subtle Induction Cooking Rings */}
          {[-0.22, 0.22].map((cx) =>
            [-0.12, 0.12].map((cz) => (
              <mesh key={`ring-${cx}-${cz}`} position={[cx, 0.006, cz]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.07, 0.075, 32]} />
                <meshBasicMaterial color="rgba(255, 255, 255, 0.35)" />
              </mesh>
            ))
          )}
        </group>

        {/* -------------------- 4 BAR STOOLS -------------------- */}
        {[-1.2, -0.4, 0.4, 1.2].map((bx, idx) => (
          <group key={`stool-${idx}`} position={[bx, 0, -0.68]}>
            {/* Brass Stool Legs & Footrest */}
            <mesh position={[0, 0.32, 0]} castShadow>
              <cylinderGeometry args={[0.018, 0.025, 0.64, 16]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.22, 0]}>
              <torusGeometry args={[0.16, 0.012, 12, 24]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Upholstered Ivory Bouclé Seat */}
            <mesh position={[0, 0.66, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.18, 0.08, 24]} />
              <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.8} />
            </mesh>
            {/* Low-profile Curved Backrest */}
            <mesh position={[0, 0.8, -0.16]} castShadow>
              <boxGeometry args={[0.34, 0.18, 0.04]} />
              <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.8} />
            </mesh>
          </group>
        ))}

        {/* -------------------- BRASS PENDANT LIGHTS OVER ISLAND -------------------- */}
        {[-1.0, 0, 1.0].map((px, pidx) => (
          <group key={`pendant-${pidx}`} position={[px, 2.3, 0]}>
            {/* Suspension Rod from 3.4m ceiling */}
            <mesh position={[0, 0.55, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 1.1, 8]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Sculptural Brushed Brass Canopy */}
            <mesh position={[0, 0, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.14, 0.18, 24]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.22} />
            </mesh>
            {/* Frosted Opal Diffuser Globe */}
            <mesh position={[0, -0.1, 0]}>
              <sphereGeometry args={[0.11, 24, 24]} />
              <meshBasicMaterial color="#FFF9E6" />
            </mesh>
            {/* Warm Downward Light */}
            <pointLight position={[0, -0.18, 0]} color="#FFF3DD" intensity={0.9} distance={4} />
          </group>
        ))}
      </group>

      {/* -------------------- 2. FULL-HEIGHT BACK KITCHEN CABINETRY BANK -------------------- */}
      {/* Positioned along the South wall of Kitchen (Z = 1.86, X: 8.5 to 13.5) */}
      <group position={[11.0, 0, 1.86]} rotation={[0, Math.PI, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[2.5, 1.7, 0.32]} position={[0, 1.7, 0]} />
        </RigidBody>

        {/* Full-Height Pale Oak & Ivory Cabinet Wall (Height 3.4m) */}
        <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.9, 3.4, 0.62]} />
          <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
        </mesh>

        {/* Recessed Marble Appliance Niche */}
        <group position={[0, 1.35, 0.28]}>
          <mesh>
            <boxGeometry args={[2.6, 0.9, 0.1]} />
            <meshPhysicalMaterial color={colors.calacatta} map={marbleTex} roughness={0.15} />
          </mesh>
          {/* Under-cabinet Backlight */}
          <pointLight position={[0, 0.4, 0.1]} color="#FFF0D4" intensity={1.1} distance={3} />
        </group>

        {/* Integrated Built-in Wall Oven Tower */}
        <group position={[-1.75, 1.4, 0.32]}>
          <mesh castShadow>
            <boxGeometry args={[0.72, 1.1, 0.04]} />
            <meshStandardMaterial color="#1E1B18" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Oven Tinted Glass Window */}
          <mesh position={[0, 0.05, 0.025]}>
            <planeGeometry args={[0.62, 0.52]} />
            <meshPhysicalMaterial color="#111111" roughness={0.1} clearcoat={1.0} />
          </mesh>
          {/* Horizontal Brass Handle */}
          <mesh position={[0, 0.36, 0.04]}>
            <boxGeometry args={[0.54, 0.02, 0.03]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* Flush Seamless Integrated Refrigerator Columns */}
        <group position={[1.75, 1.7, 0.32]}>
          <mesh castShadow>
            <boxGeometry args={[0.9, 3.3, 0.02]} />
            <meshStandardMaterial color="#EDE7DD" roughness={0.4} />
          </mesh>
          {/* Vertical Architectural Brass Pulls */}
          <mesh position={[-0.4, 0, 0.03]}>
            <boxGeometry args={[0.025, 1.4, 0.03]} />
            <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* -------------------- 3. GRAND DINING TABLE WITH 8 CHAIRS & SET TABLEWARE -------------------- */}
      {/* Positioned on the North side facing panoramic windows: X = 10.75, Z = -4.2 */}
      <group position={[10.75, 0, -4.2]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.75, 0.38, 0.65]} position={[0, 0.38, 0]} />
        </RigidBody>

        {/* Grand 3.4m x 1.2m Honed Travertine & Pale Oak Tabletop (Height 0.76m) */}
        <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.06, 1.25]} />
          <meshStandardMaterial color={colors.travertine} roughness={0.4} />
        </mesh>
        {/* Brass Under-table Perimeter Inlay */}
        <mesh position={[0, 0.705, 0]}>
          <boxGeometry args={[3.32, 0.015, 1.18]} />
          <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
        </mesh>

        {/* Dual Fluted Sculptural Pedestal Bases */}
        {[-0.95, 0.95].map((bx) => (
          <group key={`table-base-${bx}`} position={[bx, 0.34, 0]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.26, 0.3, 0.68, 32]} />
              <meshStandardMaterial color={colors.paleOak} map={oakTex} roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.32, 0]}>
              <cylinderGeometry args={[0.34, 0.34, 0.04, 32]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* -------------------- 8 UPHOLSTERED DINING CHAIRS -------------------- */}
        {/* North Row (4 chairs facing South): Z = -0.72 */}
        {[-1.25, -0.42, 0.42, 1.25].map((cx, idx) => (
          <group key={`chair-north-${idx}`} position={[cx, 0, -0.72]}>
            {/* Tapered Brass Legs */}
            <mesh position={[0, 0.22, 0]} castShadow>
              <cylinderGeometry args={[0.015, 0.022, 0.44, 12]} />
              <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
            </mesh>
            {/* Ivory Bouclé Cushion */}
            <mesh position={[0, 0.46, 0]} castShadow>
              <boxGeometry args={[0.48, 0.08, 0.46]} />
              <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.8} />
            </mesh>
            {/* Curved Backrest */}
            <mesh position={[0, 0.72, -0.2]} castShadow>
              <boxGeometry args={[0.48, 0.44, 0.08]} />
              <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.8} />
            </mesh>
          </group>
        ))}

        {/* South Row (4 chairs facing North): Z = 0.72 */}
        {[-1.25, -0.42, 0.42, 1.25].map((cx, idx) => (
          <group key={`chair-south-${idx}`} position={[cx, 0, 0.72]} rotation={[0, Math.PI, 0]}>
            <mesh position={[0, 0.22, 0]} castShadow>
              <cylinderGeometry args={[0.015, 0.022, 0.44, 12]} />
              <meshStandardMaterial color={colors.brass} metalness={0.88} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.46, 0]} castShadow>
              <boxGeometry args={[0.48, 0.08, 0.46]} />
              <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.72, -0.2]} castShadow>
              <boxGeometry args={[0.48, 0.44, 0.08]} />
              <meshStandardMaterial color={colors.ivory} map={boucleTex} roughness={0.8} />
            </mesh>
          </group>
        ))}

        {/* -------------------- SET TABLEWARE FOR 8 GUESTS -------------------- */}
        {[-1.25, -0.42, 0.42, 1.25].map((tx) =>
          [-0.38, 0.38].map((tz) => (
            <group key={`place-setting-${tx}-${tz}`} position={[tx, 0.77, tz]}>
              {/* Gold Charger Plate */}
              <mesh position={[0, 0.005, 0]}>
                <cylinderGeometry args={[0.16, 0.16, 0.01, 24]} />
                <meshStandardMaterial color={colors.gold} metalness={0.85} roughness={0.25} />
              </mesh>
              {/* Fine Porcelain Dinner Plate */}
              <mesh position={[0, 0.012, 0]}>
                <cylinderGeometry args={[0.13, 0.13, 0.008, 24]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
              </mesh>
              {/* Folded Ivory Linen Napkin */}
              <mesh position={[0, 0.02, 0]}>
                <boxGeometry args={[0.08, 0.015, 0.18]} />
                <meshStandardMaterial color={colors.linen} roughness={0.85} />
              </mesh>
              {/* Crystal Wine Glass */}
              <mesh position={[0.14, 0.06, tz > 0 ? -0.1 : 0.1]}>
                <cylinderGeometry args={[0.035, 0.01, 0.12, 16]} />
                <meshPhysicalMaterial
                  color="#FFFFFF"
                  roughness={0.05}
                  transmission={0.92}
                  transparent
                  opacity={0.4}
                />
              </mesh>
              {/* Polished Cutlery (Fork & Knife) */}
              <mesh position={[-0.18, 0.006, 0]}>
                <boxGeometry args={[0.015, 0.005, 0.2]} />
                <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0.18, 0.006, 0]}>
                <boxGeometry args={[0.015, 0.005, 0.2]} />
                <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          ))
        )}

        {/* Centerpiece Sculptural Fruit Bowl */}
        <group position={[0, 0.77, 0]}>
          {/* Ceramic Shallow Center Bowl */}
          <mesh castShadow>
            <cylinderGeometry args={[0.24, 0.14, 0.08, 32]} />
            <meshStandardMaterial color="#FAF8F3" roughness={0.4} />
          </mesh>
          {/* Fresh Pears & Green Citrus Figs */}
          {[
            { pos: [-0.06, 0.06, 0.02], col: '#B5C478' },
            { pos: [0.07, 0.06, -0.04], col: '#9FB569' },
            { pos: [0, 0.08, 0.06], col: '#C8D685' },
          ].map((fruit, idx) => (
            <mesh key={`fruit-${idx}`} position={fruit.pos as [number, number, number]} castShadow>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshStandardMaterial color={fruit.col} roughness={0.65} />
            </mesh>
          ))}
        </group>
      </group>

      {/* -------------------- 4. WINE DISPLAY WALL WITH GLASSES -------------------- */}
      {/* Positioned along the East wall of Kitchen (X = 13.84, Z = -2.5, facing West) */}
      <group position={[13.84, 0, -2.5]} rotation={[0, -Math.PI / 2, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.2, 1.4, 0.22]} position={[0, 1.4, 0]} />
        </RigidBody>

        {/* Brushed Brass Framed Glass Enclosure (Height 2.8m, Width 2.4m) */}
        <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 2.8, 0.44]} />
          <meshStandardMaterial color="#2B2520" roughness={0.6} />
        </mesh>

        {/* Backlit Champagne Warm Wall Niche */}
        <mesh position={[0, 1.4, 0.05]}>
          <planeGeometry args={[2.28, 2.68]} />
          <meshBasicMaterial color="#EFE2CD" />
        </mesh>
        <pointLight position={[0, 1.6, 0.2]} color="#FFE6B8" intensity={1.3} distance={3.5} />

        {/* 4 Backlit Horizontal Glass & Brass Shelves with Wine Bottles */}
        {[0.5, 1.1, 1.7, 2.3].map((wy, widx) => (
          <group key={`wine-shelf-${widx}`} position={[0, wy, 0.12]}>
            {/* Shelf */}
            <mesh>
              <boxGeometry args={[2.24, 0.03, 0.28]} />
              <meshStandardMaterial color={colors.brass} metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Rows of Wine Bottles (Dark glass + gold seal) */}
            {[-0.8, -0.4, 0, 0.4, 0.8].map((bx, bidx) => (
              <group key={`bottle-${bx}-${bidx}`} position={[bx, 0.16, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.038, 0.038, 0.28, 16]} />
                  <meshPhysicalMaterial
                    color="#141E15"
                    roughness={0.1}
                    transmission={0.4}
                    transparent
                    opacity={0.8}
                  />
                </mesh>
                {/* Gold Foil Neck */}
                <mesh position={[0, 0.16, 0]}>
                  <cylinderGeometry args={[0.014, 0.016, 0.08, 16]} />
                  <meshStandardMaterial color={colors.gold} metalness={0.9} roughness={0.2} />
                </mesh>
              </group>
            ))}
          </group>
        ))}

        {/* Outer Frameless Architectural Glass Front Doors */}
        <mesh position={[0, 1.4, 0.23]}>
          <planeGeometry args={[2.36, 2.76]} />
          <meshPhysicalMaterial
            color="#E8F2F7"
            roughness={0.05}
            transmission={0.92}
            transparent
            opacity={0.35}
          />
        </mesh>
      </group>
    </group>
  );
};
