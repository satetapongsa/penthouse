import * as THREE from 'three';
import { ARCHITECTURE_CONFIG } from './config';

/**
 * Cache for procedural canvas textures to prevent re-generating canvas bitmaps.
 * Mipmaps and anisotropy configured for high performance and zero aliasing.
 */
const textureCache = new Map<string, THREE.CanvasTexture>();

function configureTexture(texture: THREE.CanvasTexture, repeatX = 1, repeatY = 1): THREE.CanvasTexture {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 4;
  return texture;
}

/**
 * Procedural Travertine Tile Texture for indoor penthouse floors
 */
export function getTravertineFloorTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new OffscreenCanvas(1, 1) as unknown as HTMLCanvasElement);
  if (textureCache.has('travertine_floor')) return textureCache.get('travertine_floor')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const colors = ARCHITECTURE_CONFIG.colors;
  ctx.fillStyle = colors.floorTravertine;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle natural veins
  ctx.fillStyle = 'rgba(230, 222, 208, 0.45)';
  for (let i = 0; i < 25; i++) {
    const y = Math.random() * 512;
    ctx.fillRect(0, y, 512, Math.random() * 4 + 1.5);
  }

  // Grid lines for 1.2m x 1.2m tiles
  ctx.strokeStyle = colors.floorGrout;
  ctx.lineWidth = 2;
  for (let i = 0; i <= 512; i += 128) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  const texture = configureTexture(new THREE.CanvasTexture(canvas), 12, 10);
  textureCache.set('travertine_floor', texture);
  return texture;
}

/**
 * Procedural Outdoor Stone Tile Texture for Sky Terrace
 */
export function getTerraceStoneTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new OffscreenCanvas(1, 1) as unknown as HTMLCanvasElement);
  if (textureCache.has('terrace_stone')) return textureCache.get('terrace_stone')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = ARCHITECTURE_CONFIG.colors.floorTerrace;
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#D4CBBD';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 512; i += 128) {
    ctx.strokeRect(i, 0, 128, 512);
    ctx.strokeRect(0, i, 512, 128);
  }

  const texture = configureTexture(new THREE.CanvasTexture(canvas), 8, 4);
  textureCache.set('terrace_stone', texture);
  return texture;
}

/**
 * Ultra-luxury Calacatta Gold marble texture with warm champagne veins
 */
export function getCalacattaMarbleTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new OffscreenCanvas(1, 1) as unknown as HTMLCanvasElement);
  if (textureCache.has('calacatta')) return textureCache.get('calacatta')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base warm ivory stone tone
  ctx.fillStyle = '#FAF7F0';
  ctx.fillRect(0, 0, 512, 512);

  // Soft atmospheric marble clouding
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 140 + 50;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(235, 226, 212, 0.4)');
    grad.addColorStop(1, 'rgba(250, 247, 240, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Golden Champagne & Soft Amber Veins
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = 'rgba(197, 160, 89, 0.42)';
  for (let v = 0; v < 5; v++) {
    ctx.beginPath();
    let cx = Math.random() * 150;
    let cy = Math.random() * 512;
    ctx.moveTo(cx, cy);
    for (let step = 0; step < 5; step++) {
      cx += Math.random() * 90 + 40;
      cy += (Math.random() - 0.5) * 120;
      ctx.quadraticCurveTo(cx - 20, cy + (Math.random() - 0.5) * 50, cx, cy);
    }
    ctx.stroke();
  }

  const texture = configureTexture(new THREE.CanvasTexture(canvas), 1, 1);
  textureCache.set('calacatta', texture);
  return texture;
}

/**
 * Fine-grain pale Scandinavian white oak texture
 */
export function getPaleOakTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new OffscreenCanvas(1, 1) as unknown as HTMLCanvasElement);
  if (textureCache.has('pale_oak')) return textureCache.get('pale_oak')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#D3C3B0';
  ctx.fillRect(0, 0, 512, 512);

  // Wood grain linear striations
  ctx.fillStyle = 'rgba(182, 166, 149, 0.4)';
  for (let i = 0; i < 100; i++) {
    const y = Math.random() * 512;
    const h = Math.random() * 2.5 + 1;
    ctx.fillRect(0, y, 512, h);
  }

  const texture = configureTexture(new THREE.CanvasTexture(canvas), 1, 1);
  textureCache.set('pale_oak', texture);
  return texture;
}

/**
 * Ultra-luxury textured cream bouclé fabric weave
 */
export function getBoucleFabricTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new OffscreenCanvas(1, 1) as unknown as HTMLCanvasElement);
  if (textureCache.has('boucle')) return textureCache.get('boucle')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#F8F5EE';
  ctx.fillRect(0, 0, 512, 512);

  // Nubby tactile loops
  ctx.fillStyle = '#EDE7DC';
  for (let x = 0; x < 512; x += 10) {
    for (let y = 0; y < 512; y += 10) {
      if (Math.random() > 0.35) {
        ctx.beginPath();
        ctx.arc(x + Math.random() * 3, y + Math.random() * 3, Math.random() * 2.2 + 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  const texture = configureTexture(new THREE.CanvasTexture(canvas), 6, 6);
  textureCache.set('boucle', texture);
  return texture;
}

/**
 * Procedural Natural Woven Linen Texture with subtle cross-hatching
 */
export function getLinenTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new OffscreenCanvas(1, 1) as unknown as HTMLCanvasElement);
  if (textureCache.has('linen')) return textureCache.get('linen')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#F4EFE6';
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = 'rgba(215, 204, 188, 0.4)';
  for (let i = 0; i < 512; i += 4) {
    ctx.fillRect(i, 0, 1.5, 512);
    ctx.fillRect(0, i, 512, 1.5);
  }

  const texture = configureTexture(new THREE.CanvasTexture(canvas), 8, 8);
  textureCache.set('linen', texture);
  return texture;
}

/**
 * Procedural Brushed Brass Anisotropy & Micro-Scratch Texture
 */
export function getBrushedBrassTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new OffscreenCanvas(1, 1) as unknown as HTMLCanvasElement);
  if (textureCache.has('brushed_brass')) return textureCache.get('brushed_brass')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#C8A359';
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = 'rgba(235, 205, 135, 0.25)';
  for (let i = 0; i < 200; i++) {
    const y = Math.random() * 512;
    ctx.fillRect(0, y, 512, Math.random() * 1.5 + 0.5);
  }

  const texture = configureTexture(new THREE.CanvasTexture(canvas), 2, 2);
  textureCache.set('brushed_brass', texture);
  return texture;
}

/**
 * Colorful luxury linen & leather book spines with gold debossing
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

    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(i * bookWidth + bookWidth - 2, 0, 1.5, 256);

    ctx.fillStyle = 'rgba(212, 175, 55, 0.85)';
    ctx.fillRect(i * bookWidth + 4, 30, bookWidth - 9, 2);
    ctx.fillRect(i * bookWidth + 4, 36, bookWidth - 9, 1.5);
    ctx.fillRect(i * bookWidth + 6, 70, bookWidth - 13, 20);
    ctx.fillRect(i * bookWidth + 4, 220, bookWidth - 9, 2);
  }

  const texture = configureTexture(new THREE.CanvasTexture(canvas), 1, 1);
  textureCache.set('books', texture);
  return texture;
}

/**
 * Disposes all cached procedural textures to prevent memory leaks on unmount
 */
export function disposeMaterialTextures(): void {
  textureCache.forEach((tex) => tex.dispose());
  textureCache.clear();
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
