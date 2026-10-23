/**
 * Procedural Audio Synthesis Buffers & Generative Jazz Harmonics
 */

export function createNoiseBuffer(ctx: AudioContext, duration: number, decayExponent = 0.3): AudioBuffer {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * decayExponent));
  }
  return buffer;
}

export function createPinkNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    last = last * 0.94 + white * 0.06;
    data[i] = last * 3.5;
  }
  return buffer;
}

export function createBrownianNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let brown = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    brown = brown * 0.98 + white * 0.02;
    data[i] = brown * 4;
  }
  return buffer;
}

export const JAZZ_CHORD_FREQUENCIES: number[][] = [
  [155.56, 196.0, 233.08, 293.66, 349.23], // Ebmaj9
  [130.81, 196.0, 233.08, 261.63, 311.13], // Cm9
  [174.61, 220.0, 261.63, 329.63, 392.0],  // Fm9
  [116.54, 174.61, 233.08, 293.66, 369.99], // Bb13
  [196.0, 246.94, 293.66, 349.23, 440.0],  // Gm7
  [207.65, 261.63, 311.13, 392.0, 466.16],  // Abmaj9
];
