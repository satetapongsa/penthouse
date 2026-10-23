/**
 * Continuous Web Audio Loops (Wind, Running Water, Fireplace, Breathing, Ambient Jazz)
 */

import {
  createNoiseBuffer,
  createPinkNoiseBuffer,
  createBrownianNoiseBuffer,
  JAZZ_CHORD_FREQUENCIES,
} from './audioSynthesis';

export class AudioLoopsManager {
  private ctx: AudioContext | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;

  private windNode: { gain: GainNode; filter: BiquadFilterNode; timer: number | null } | null = null;
  private showerNode: { gain: GainNode } | null = null;
  private faucetNode: { gain: GainNode } | null = null;
  private fireNode: { gain: GainNode; timer: number | null } | null = null;
  private breathingNode: { gain: GainNode; timer: number | null } | null = null;
  private poolNode: { gain: GainNode } | null = null;

  private musicInterval: number | null = null;
  private isMusicPlaying = false;

  public setNodes(ctx: AudioContext, sfxGain: GainNode, musicGain: GainNode): void {
    this.ctx = ctx;
    this.sfxGain = sfxGain;
    this.musicGain = musicGain;
  }

  public setWind(active: boolean): void {
    if (!this.ctx || !this.sfxGain) return;
    if (active) {
      if (this.windNode) return;
      const buffer = createPinkNoiseBuffer(this.ctx, 4.0);
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(380, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 1.2);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      source.start();

      const timer = window.setInterval(() => {
        if (!this.windNode || !this.ctx) return;
        this.windNode.filter.frequency.setTargetAtTime(280 + Math.random() * 320, this.ctx.currentTime, 1.4);
      }, 2000);

      this.windNode = { gain, filter, timer };
    } else if (this.windNode) {
      if (this.windNode.timer) clearInterval(this.windNode.timer);
      this.windNode.gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
      setTimeout(() => { this.windNode = null; }, 900);
    }
  }

  public setFaucet(active: boolean): void {
    if (!this.ctx || !this.sfxGain) return;
    if (active) {
      if (this.faucetNode) return;
      const buffer = createNoiseBuffer(this.ctx, 2.0, 1.0);
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.3);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      source.start();

      this.faucetNode = { gain };
    } else if (this.faucetNode) {
      this.faucetNode.gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      setTimeout(() => { this.faucetNode = null; }, 350);
    }
  }

  public setShower(active: boolean): void {
    if (!this.ctx || !this.sfxGain) return;
    if (active) {
      if (this.showerNode) return;
      const buffer = createNoiseBuffer(this.ctx, 3.0, 1.0);
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.28, this.ctx.currentTime + 0.5);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      source.start();

      this.showerNode = { gain };
    } else if (this.showerNode) {
      this.showerNode.gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      setTimeout(() => { this.showerNode = null; }, 450);
    }
  }

  public setFireplace(active: boolean, isMuted = false): void {
    if (!this.ctx || !this.sfxGain) return;
    if (active) {
      if (this.fireNode) return;
      const buffer = createBrownianNoiseBuffer(this.ctx, 3.0);
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.22, this.ctx.currentTime + 0.5);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      source.start();

      const timer = window.setInterval(() => {
        if (!this.fireNode || !this.ctx || isMuted) return;
        if (Math.random() > 0.4) {
          const now = this.ctx.currentTime;
          const popOsc = this.ctx.createOscillator();
          const popGain = this.ctx.createGain();
          popOsc.type = 'triangle';
          popOsc.frequency.setValueAtTime(800 + Math.random() * 900, now);
          popOsc.frequency.exponentialRampToValueAtTime(100, now + 0.015);
          popGain.gain.setValueAtTime(0.12 + Math.random() * 0.12, now);
          popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
          popOsc.connect(popGain);
          popGain.connect(this.sfxGain!);
          popOsc.start(now);
          popOsc.stop(now + 0.025);
        }
      }, 350);

      this.fireNode = { gain, timer };
    } else if (this.fireNode) {
      if (this.fireNode.timer) clearInterval(this.fireNode.timer);
      this.fireNode.gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
      setTimeout(() => { this.fireNode = null; }, 550);
    }
  }

  public setPoolNear(active: boolean): void {
    if (!this.ctx || !this.sfxGain) return;
    if (active) {
      if (this.poolNode) return;
      const buffer = createNoiseBuffer(this.ctx, 4.0, 1.0);
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(750, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.16, this.ctx.currentTime + 0.8);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      source.start();

      this.poolNode = { gain };
    } else if (this.poolNode) {
      this.poolNode.gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
      setTimeout(() => { this.poolNode = null; }, 650);
    }
  }

  public setBreathing(active: boolean): void {
    if (!this.ctx || !this.sfxGain) return;
    if (active) {
      if (this.breathingNode) return;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 1.0);
      gain.connect(this.sfxGain);

      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, this.ctx.currentTime);

      const swellGain = this.ctx.createGain();
      swellGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      osc.connect(swellGain);
      swellGain.connect(gain);
      osc.start();

      let phase = 0;
      const timer = window.setInterval(() => {
        if (!this.ctx || !this.breathingNode) return;
        phase += 0.5;
        const breathIntensity = 0.03 + Math.sin(phase) * 0.025;
        swellGain.gain.setTargetAtTime(breathIntensity, this.ctx.currentTime, 0.4);
      }, 500);

      this.breathingNode = { gain, timer };
    } else if (this.breathingNode) {
      if (this.breathingNode.timer) clearInterval(this.breathingNode.timer);
      this.breathingNode.gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
      setTimeout(() => { this.breathingNode = null; }, 850);
    }
  }

  public startAmbientMusic(isMuted = false): void {
    if (this.isMusicPlaying || !this.ctx || !this.musicGain) return;
    this.isMusicPlaying = true;
    let chordIndex = 0;

    const playChord = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain || isMuted) return;
      const now = this.ctx.currentTime;
      const chord = JAZZ_CHORD_FREQUENCIES[chordIndex];
      chordIndex = (chordIndex + 1) % JAZZ_CHORD_FREQUENCIES.length;
      const chordDuration = 5.8;

      chord.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        const noteFilter = this.ctx!.createBiquadFilter();

        osc.type = i === 0 ? 'sine' : i % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);
        noteFilter.type = 'lowpass';
        noteFilter.frequency.setValueAtTime(550 + i * 80, now);

        const peakGain = (0.045 / Math.sqrt(chord.length)) * (i === 0 ? 1.3 : 1.0);
        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.linearRampToValueAtTime(peakGain, now + 1.2 + i * 0.1);
        noteGain.gain.exponentialRampToValueAtTime(peakGain * 0.7, now + 3.5);
        noteGain.gain.linearRampToValueAtTime(0.0001, now + chordDuration);

        osc.connect(noteFilter);
        noteFilter.connect(noteGain);
        noteGain.connect(this.musicGain!);

        osc.start(now);
        osc.stop(now + chordDuration + 0.1);
      });
    };

    playChord();
    this.musicInterval = window.setInterval(playChord, 5200);
  }

  public stopAmbientMusic(): void {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}
