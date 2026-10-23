/**
 * THE SKYLINE PENTHOUSE - Web Audio API Synthesis Engine
 * 100% procedural sound synthesis. No external audio files or samples.
 */

class PenthouseAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isInitialized = false;
  private isMuted = false;
  private currentVolume = 0.7;

  // Active continuous loop nodes
  private windNode: { gain: GainNode; filter: BiquadFilterNode; timer: number | null } | null = null;
  private showerNode: { gain: GainNode; timer: number | null } | null = null;
  private faucetNode: { gain: GainNode; timer: number | null } | null = null;
  private fireNode: { gain: GainNode; timer: number | null } | null = null;
  private breathingNode: { gain: GainNode; timer: number | null } | null = null;
  private poolNode: { gain: GainNode; timer: number | null } | null = null;

  // Jazz ambient chord generator
  private musicInterval: number | null = null;
  private isMusicPlaying = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.currentVolume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.22, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.55, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        this.isInitialized = true;
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public init() {
    this.getContext();
  }

  public setVolume(volume: number) {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : this.currentVolume;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const target = muted ? 0 : this.currentVolume;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
  }

  // -------------------- 1. FOOTSTEPS --------------------
  public playFootstep(surface: 'stone' | 'wood' | 'carpet') {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain || this.isMuted) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.08), ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.3));
    }

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
      // 'stone' / travertine
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

  // -------------------- 2. SWITCH / TOGGLE CLICK --------------------
  public playSwitch() {
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

  // -------------------- 3. DOOR SOUNDS --------------------
  public playDoor(isOpen: boolean, type: 'hinged' | 'sliding') {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain || this.isMuted) return;

    const t = ctx.currentTime;

    if (type === 'sliding') {
      // Smooth roller friction swoosh
      const duration = 0.55;
      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / data.length) * Math.PI);
      }
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
      // Hinged door click + deep resonant wooden latch
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

  // -------------------- 4. SITTING & RUSTLE --------------------
  public playSit() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain || this.isMuted) return;

    const t = ctx.currentTime;
    const dur = 0.25;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.4));
    }
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

  // -------------------- 5. CONTINUOUS WIND BREEZE (WHEN WINDOWS OPEN) --------------------
  public setWind(active: boolean) {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    if (active) {
      if (this.windNode) return;

      const dur = 4.0;
      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      // Pink-ish noise
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        last = (last * 0.94) + (white * 0.06);
        data[i] = last * 3.5;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(380, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 1.2);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      source.start();

      // Gentle LFO modulating filter frequency for realistic gusting
      const interval = window.setInterval(() => {
        if (!this.windNode || !this.ctx) return;
        const now = this.ctx.currentTime;
        const targetFreq = 280 + Math.random() * 320;
        this.windNode.filter.frequency.setTargetAtTime(targetFreq, now, 1.4);
      }, 2000);

      this.windNode = { gain, filter, timer: interval };
    } else {
      if (!this.windNode) return;
      if (this.windNode.timer) clearInterval(this.windNode.timer);
      this.windNode.gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      setTimeout(() => {
        this.windNode = null;
      }, 900);
    }
  }

  // -------------------- 6. RUNNING WATER (FAUCET & SHOWER) --------------------
  public setFaucet(active: boolean) {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    if (active) {
      if (this.faucetNode) return;

      const dur = 2.0;
      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.3);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      source.start();

      this.faucetNode = { gain, timer: null };
    } else {
      if (!this.faucetNode) return;
      this.faucetNode.gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      setTimeout(() => {
        this.faucetNode = null;
      }, 350);
    }
  }

  public setShower(active: boolean) {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    if (active) {
      if (this.showerNode) return;

      const dur = 3.0;
      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.9;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.5);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      source.start();

      this.showerNode = { gain, timer: null };
    } else {
      if (!this.showerNode) return;
      this.showerNode.gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      setTimeout(() => {
        this.showerNode = null;
      }, 450);
    }
  }

  // -------------------- 7. FIREPLACE CRACKLE --------------------
  public setFireplace(active: boolean) {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    if (active) {
      if (this.fireNode) return;

      const dur = 3.0;
      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let brown = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        brown = (brown * 0.98) + (white * 0.02);
        data[i] = brown * 4;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.5);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      source.start();

      // Intermittent snap / pop sounds
      const timer = window.setInterval(() => {
        if (!this.fireNode || !this.ctx || this.isMuted) return;
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
    } else {
      if (!this.fireNode) return;
      if (this.fireNode.timer) clearInterval(this.fireNode.timer);
      this.fireNode.gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      setTimeout(() => {
        this.fireNode = null;
      }, 550);
    }
  }

  // -------------------- 8. TERRACE JACUZZI WATER RIPPLES / BUBBLES --------------------
  public setPoolNear(active: boolean) {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    if (active) {
      if (this.poolNode) return;

      const dur = 4.0;
      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(750, ctx.currentTime);
      filter.Q.setValueAtTime(1.8, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 0.8);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      source.start();

      this.poolNode = { gain, timer: null };
    } else {
      if (!this.poolNode) return;
      this.poolNode.gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      setTimeout(() => {
        this.poolNode = null;
      }, 650);
    }
  }

  // -------------------- 9. RELAXATION BREATHING TONE (LYING ON BED) --------------------
  public setBreathing(active: boolean) {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    if (active) {
      if (this.breathingNode) return;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 1.0);
      gain.connect(this.sfxGain);

      // Warm soothing sine wave swell (4-second inhale / exhale cycle)
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, ctx.currentTime); // Low A

      const swellGain = ctx.createGain();
      swellGain.gain.setValueAtTime(0.04, ctx.currentTime);

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
    } else {
      if (!this.breathingNode) return;
      if (this.breathingNode.timer) clearInterval(this.breathingNode.timer);
      this.breathingNode.gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      setTimeout(() => {
        this.breathingNode = null;
      }, 850);
    }
  }

  // -------------------- 10. GENERATIVE AMBIENT JAZZ CHORDS --------------------
  public startAmbientMusic() {
    if (this.isMusicPlaying) return;
    const ctx = this.getContext();
    if (!ctx || !this.musicGain) return;

    this.isMusicPlaying = true;

    // Smooth jazz chord progressions (Ebmaj9, Cm9, Fm9, Bb13, Gm7, Abmaj9)
    const jazzChords: number[][] = [
      [155.56, 196.00, 233.08, 293.66, 349.23], // Ebmaj9 (Eb3, G3, Bb3, D4, F4)
      [130.81, 196.00, 233.08, 261.63, 311.13], // Cm9 (C3, G3, Bb3, C4, Eb4)
      [174.61, 220.00, 261.63, 329.63, 392.00], // Fm9 (F3, A3, C4, E4, G4)
      [116.54, 174.61, 233.08, 293.66, 369.99], // Bb13 (Bb2, F3, Bb3, D4, F#4)
      [196.00, 246.94, 293.66, 349.23, 440.00], // Gm7 (G3, B3, D4, F4, A4)
      [207.65, 261.63, 311.13, 392.00, 466.16], // Abmaj9 (Ab3, C4, Eb4, G4, Bb4)
    ];

    let chordIndex = 0;

    const playChord = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain || this.isMuted) return;
      const now = this.ctx.currentTime;
      const chord = jazzChords[chordIndex];
      chordIndex = (chordIndex + 1) % jazzChords.length;

      const chordDuration = 5.8;

      chord.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        const noteFilter = this.ctx!.createBiquadFilter();

        // Warm electric Rhodes / muted organ blend
        osc.type = i === 0 ? 'sine' : (i % 2 === 0 ? 'triangle' : 'sine');
        osc.frequency.setValueAtTime(freq, now);

        // Gentle warm filtering
        noteFilter.type = 'lowpass';
        noteFilter.frequency.setValueAtTime(550 + i * 80, now);

        // Gentle envelope (slow swell, lush sustain, slow fade)
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

    // Play initial chord and setup interval
    playChord();
    this.musicInterval = window.setInterval(playChord, 5200);
  }

  public stopAmbientMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

// Global Singleton Export
export const audioEngine = new PenthouseAudioEngine();
