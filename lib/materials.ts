import * as THREE from 'three';
import { ARCHITECTURE_CONFIG } from './config';

/**
 * Cache for procedural canvas textures to prevent re-generating canvas bitmaps
 */
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Generates an ultra-luxury Calacatta Gold marble texture with warm champagne veins
 */
export function getCalacattaMarbleTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new OffscreenCanvas(1, 1) as unknown as HTMLCanvasElement);
  if (textureCache.has('calacatta')) return textureCache.get('calacatta')!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base warm ivory stone tone
  ctx.fillStyle = '#FAF7F0';
  ctx.fillRect(0, 0, 1024, 1024);

  // Soft atmospheric marble clouding
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = Math.random() * 220 + 80;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(235, 226, 212, 0.45)');
    grad.addColorStop(1, 'rgba(250, 247, 240, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Golden Champagne & Soft Amber Veins
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(197, 160, 89, 0.42)';
  for (let v = 0; v < 6; v++) {
    ctx.beginPath();
    let cx = Math.random() * 300;
    let cy = Math.random() * 1024;
    ctx.moveTo(cx, cy);
    for (let step = 0; step < 7; step++) {
      cx += Math.random() * 150 + 60;
      cy += (Math.random() - 0.5) * 180;
      ctx.quadraticCurveTo(cx - 40, cy + (Math.random() - 0.5) * 80, cx, cy);
    }
    ctx.stroke();
  }

  // Delicate Secondary Gray Veins
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = 'rgba(170, 162, 148, 0.35)';
  for (let v = 0; v < 8; v++) {
    ctx.beginPath();
    let cx = Math.random() * 1024;
    let cy = Math.random() * 200;
    ctx.moveTo(cx, cy);
    for (let step = 0; step < 6; step++) {
      cx += (Math.random() - 0.5) * 160;
      cy += Math.random() * 180 + 50;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set('calacatta', texture);
  return texture;
}

/**
 * Generates a fine-grain pale Scandinavian white oak texture
 */
export function getPaleOakTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new OffscreenCanvas(1, 1) as unknown as HTMLCanvasElement);
  if (textureCache.has('pale_oak')) return textureCache.get('pale_oak')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Pale oak honey beige tone
  ctx.fillStyle = '#D3C3B0';
  ctx.fillRect(0, 0, 512, 512);

  // Wood grain linear striations
  ctx.fillStyle = 'rgba(182, 166, 149, 0.45)';
  for (let i = 0; i < 180; i++) {
    const y = Math.random() * 512;
    const h = Math.random() * 3 + 1;
    ctx.fillRect(0, y, 512, h);
  }

  // Subtle wood pores
  ctx.fillStyle = 'rgba(150, 134, 118, 0.25)';
  for (let p = 0; p < 80; p++) {
    const px = Math.random() * 512;
    const py = Math.random() * 512;
    ctx.fillRect(px, py, Math.random() * 12 + 4, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set('pale_oak', texture);
  return texture;
}

/**
 * Generates an ultra-luxury textured cream bouclé fabric weave
 */
export function getBoucleFabricTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new OffscreenCanvas(1, 1) as unknown as HTMLCanvasElement);
  if (textureCache.has('boucle')) return textureCache.get('boucle')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Warm ivory background
  ctx.fillStyle = '#F5F2EB';
  ctx.fillRect(0, 0, 512, 512);

  // Nubby tactile loops
  ctx.fillStyle = '#EDE8DE';
  for (let x = 0; x < 512; x += 8) {
    for (let y = 0; y < 512; y += 8) {
      if (Math.random() > 0.4) {
        ctx.beginPath();
        ctx.arc(x + Math.random() * 3, y + Math.random() * 3, Math.random() * 2.5 + 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Subtle thread micro-shadows
  ctx.fillStyle = 'rgba(215, 207, 195, 0.35)';
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillRect(x, y, 2.5, 2.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  textureCache.set('boucle', texture);
  return texture;
}

/**
 * Generates colorful luxury linen & leather book spines with gold debossing
 */
export function getBookSpineTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new OffscreenCanvas(1, 1) as unknown as HTMLCanvasElement);
  if (textureCache.has('books')) return textureCache.get('books')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const colors = ['#EAE4D9', '#C5A059', '#3D3833', '#8C9A86', '#D6C8B5', '#8C7443', '#5E6B5D'];
  const numBooks = 16;
  const bookWidth = 512 / numBooks;

  for (let i = 0; i < numBooks; i++) {
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(i * bookWidth, 0, bookWidth - 1, 256);

    // Spine border / indent
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(i * bookWidth + bookWidth - 2, 0, 1.5, 256);

    // Gold foil lines & title strip
    ctx.fillStyle = 'rgba(212, 175, 55, 0.85)';
    ctx.fillRect(i * bookWidth + 4, 30, bookWidth - 9, 2);
    ctx.fillRect(i * bookWidth + 4, 36, bookWidth - 9, 1.5);
    ctx.fillRect(i * bookWidth + 6, 70, bookWidth - 13, 20);
    ctx.fillRect(i * bookWidth + 4, 220, bookWidth - 9, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('books', texture);
  return texture;
}

/**
 * Standard Luxury Architectural Material Palette
 */
export const LUXURY_PALETTE = {
  colors: {
    ivory: '#FFFDF9',
    cream: '#F6F3EB',
    linen: '#ECE7DC',
    travertine: '#E3DACD',
    calacatta: '#FAF7F0',
    paleOak: '#D2C4B2',
    darkOak: '#42372F',
    brass: '#C5A059',
    gold: '#D4AF37',
    bronze: '#7F6744',
    sage: '#8A9A86',
    charcoal: '#1F1E1D',
    pureWhite: '#FFFFFF',
    pillowTerracotta: '#C98C70',
    pillowSage: '#92A08E',
    pillowGold: '#D6B462',
  },
} as const;
