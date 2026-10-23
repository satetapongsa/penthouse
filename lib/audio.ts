/**
 * THE SKYLINE PENTHOUSE - Web Audio API Synthesis Engine
 * 100% procedural sound synthesis. No external audio files or samples.
 * Single master GainNode routing for all music, footsteps, doors, windows, wind, water, and fire.
 */

import { createNoiseBuffer } from './audioSynthesis';
import { AudioLoopsManager } from './audioLoops';

class PenthouseAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isInitialized = false;
  private isMuted = false;
  private currentVolume = 0.7;

  private loops = new AudioLoopsManager();

  public getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // 1. Single Master GainNode that ALL audio routes through
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(
          this.isMuted ? 0 : this.currentVolume,
          this.ctx.currentTime
        );
        this.masterGain.connect(this.ctx.destination);

        // 2. Sub-Gain Nodes connecting to master
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.22, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.55, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        this.loops.setNodes(this.ctx, this.sfxGain, this.musicGain);
        this.loops.setMuted(this.isMuted);
        this.isInitialized = true;
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public resumeContext(): void {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public init(initialVolume?: number, initialMuted?: boolean): void {
    if (typeof initialVolume === 'number') {
      this.currentVolume = Math.max(0, Math.min(1, initialVolume));
    }
    if (typeof initialMuted === 'boolean') {
      this.isMuted = initialMuted;
    }
    const ctx = this.getContext();
    if (ctx && this.masterGain) {
      const target = this.isMuted ? 0 : this.currentVolume;
      this.masterGain.gain.setValueAtTime(target, ctx.currentTime);
      this.loops.setMuted(this.isMuted);
    }
  }

  public setVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : this.currentVolume;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const target = muted ? 0 : this.currentVolume;
      // Smooth ramp over ~50ms (0.05s time constant) to prevent clicks
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
    this.loops.setMuted(muted);
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.currentVolume;
  }

  // 1. Footstep Sound Synthesis
  public playFootstep(surface: 'stone' | 'wood' | 'carpet'): void {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain || this.isMuted) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const noiseBuffer = createNoiseBuffer(ctx, 0.08, 0.3);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    if (surface === 'wood') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.06);
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(650, t);
      filter.Q.setValueAtTime(2.5, t);
      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    } else if (surface === 'carpet') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.07);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, t);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(55, t + 0.05);
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, t);
      filter.Q.setValueAtTime(1.8, t);
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    }

    noiseSource.connect(filter);
    filter.connect(gain);
    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    noiseSource.start(t);
    osc.stop(t + 0.08);
    noiseSource.stop(t + 0.08);
  }

  // 2. Switch Click
  public playSwitch(): void {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain || this.isMuted) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2400, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.02);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.03);
  }

  // 3. Door Sounds
  public playDoor(isOpen: boolean, type: 'hinged' | 'sliding'): void {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain || this.isMuted) return;

    const t = ctx.currentTime;
    if (type === 'sliding') {
      const duration = 0.55;
      const buffer = createNoiseBuffer(ctx, duration, 0.5);
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, t);
      filter.frequency.exponentialRampToValueAtTime(isOpen ? 650 : 380, t + duration);
      filter.Q.setValueAtTime(2.0, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.22, t);
      gain.gain.linearRampToValueAtTime(0.01, t + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      source.start(t);
      source.stop(t + duration);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isOpen ? 120 : 180, t);
      osc.frequency.exponentialRampToValueAtTime(isOpen ? 75 : 60, t + 0.14);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.18);
    }
  }

  // 4. Sitting Sound
  public playSit(): void {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain || this.isMuted) return;

    const t = ctx.currentTime;
    const dur = 0.25;
    const buffer = createNoiseBuffer(ctx, dur, 0.4);
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.linearRampToValueAtTime(0.001, t + dur);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    source.start(t);
    source.stop(t + dur);
  }

  // Continuous loop delegates
  public setWind(active: boolean): void {
    this.loops.setWind(active);
  }
  public setFaucet(active: boolean): void {
    this.loops.setFaucet(active);
  }
  public setShower(active: boolean): void {
    this.loops.setShower(active);
  }
  public setFireplace(active: boolean, isMuted?: boolean): void {
    this.loops.setFireplace(active, typeof isMuted === 'boolean' ? isMuted : this.isMuted);
  }
  public setPoolNear(active: boolean): void {
    this.loops.setPoolNear(active);
  }
  public setBreathing(active: boolean): void {
    this.loops.setBreathing(active);
  }
  public startAmbientMusic(isMuted?: boolean): void {
    this.loops.startAmbientMusic(typeof isMuted === 'boolean' ? isMuted : this.isMuted);
  }
  public stopAmbientMusic(): void {
    this.loops.stopAmbientMusic();
  }
}

export const audioEngine = new PenthouseAudioEngine();
