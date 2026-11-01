/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// A high-performance, interactive, client-side soundscape synthesizer using Web Audio API
export class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  
  // Drone Layer
  private droneOscillators: OscillatorNode[] = [];
  private droneGain: GainNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  
  // Nature Layer (Ocean waves / Wind)
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private waveLFO: OscillatorNode | null = null;
  private waveLFOGain: GainNode | null = null;
  
  // Bowl Trigger Layer
  private bowlGain: GainNode | null = null;
  
  // Analysis
  private analyser: AnalyserNode | null = null;
  
  // Scheduler for random wind chimes
  private chimeTimer: number | null = null;
  
  // State variables
  private isPlaying = false;
  private activePresetId = 'deep_peace';
  private masterVolume = 0.5;
  private droneVolume = 0.6;
  private bowlsVolume = 0.5;
  private natureVolume = 0.4;
  
  // Preset definitions
  private presets: Record<string, {
    baseFreq: number;
    intervals: number[]; // relative to baseFreq
    noiseType: 'ocean' | 'forest' | 'rain' | 'none';
    filterCutoff: number;
  }> = {
    deep_peace: {
      baseFreq: 110, // A2
      intervals: [1, 1.5, 2, 2.5, 3], // A2, E3, A3, C#4, E4
      noiseType: 'ocean',
      filterCutoff: 320
    },
    ethereal_flow: {
      baseFreq: 130.81, // C3
      intervals: [1, 1.2, 1.5, 1.8, 2], // C3, Eb3, G3, Bb3, C4 (Minor 7th vibe)
      noiseType: 'forest',
      filterCutoff: 400
    },
    cosmic_dawn: {
      baseFreq: 146.83, // D3
      intervals: [1, 1.5, 1.875, 2.25, 3], // D3, A3, C#4, E4, A4 (Major 9th vibe)
      noiseType: 'rain',
      filterCutoff: 380
    }
  };

  constructor() {
    // Audio Context is deferred until first user interaction
  }

  // Initialize Audio Context and Nodes
  public async start(): Promise<boolean> {
    if (this.isPlaying) return true;

    try {
      // Create context
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      // 1. Create Master Output Chain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // 2. Setup Drone Nodes
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(this.droneVolume, this.ctx.currentTime);
      
      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);
      
      this.droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      // 3. Setup Nature (Noise) Nodes
      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(this.natureVolume, this.ctx.currentTime);
      
      this.noiseFilter = this.ctx.createBiquadFilter();
      this.noiseFilter.type = 'bandpass';
      this.noiseFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);
      
      this.noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);

      // 4. Setup Bowl Gain Node
      this.bowlGain = this.ctx.createGain();
      this.bowlGain.gain.setValueAtTime(this.bowlsVolume, this.ctx.currentTime);
      this.bowlGain.connect(this.masterGain);

      // 5. Start synthesis processes
      this.startDrone();
      this.startNoise();
      this.startChimeScheduler();

      this.isPlaying = true;
      return true;
    } catch (err) {
      console.error('Failed to initialize Web Audio API Synth:', err);
      return false;
    }
  }

  public stop(): void {
    if (!this.isPlaying) return;

    this.stopDrone();
    this.stopNoise();
    this.stopChimeScheduler();

    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    
    this.isPlaying = false;
  }

  // Generate Warm Pad Drone Chords
  private startDrone(): void {
    if (!this.ctx || !this.droneFilter) return;

    const preset = this.presets[this.activePresetId];
    const now = this.ctx.currentTime;
    
    // Set base filter parameters
    this.droneFilter.frequency.setValueAtTime(preset.filterCutoff, now);

    this.droneOscillators = preset.intervals.map((ratio, index) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      // Determine frequency with a slight detuning for richness
      const freq = preset.baseFreq * ratio;
      const detune = (index % 2 === 0 ? 1 : -1) * (5 + index * 2); // detune cents
      
      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(detune, now);
      
      // Volume balances (higher harmonics are softer)
      const baseVol = 0.15 / (index + 1);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(baseVol, now + 3); // soft fade in

      osc.connect(gain);
      gain.connect(this.droneFilter!);
      osc.start();

      return osc;
    });
  }

  private stopDrone(): void {
    this.droneOscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {}
    });
    this.droneOscillators = [];
  }

  // Synthesize White Noise (for ocean/wind waves)
  private createNoiseBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error('No context');
    
    const bufferSize = this.ctx.sampleRate * 4; // 4 seconds of noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    return buffer;
  }

  private startNoise(): void {
    if (!this.ctx || !this.noiseFilter || !this.noiseGain) return;

    const now = this.ctx.currentTime;
    const preset = this.presets[this.activePresetId];

    if (preset.noiseType === 'none') {
      this.noiseGain.gain.setTargetAtTime(0, now, 0.5);
      return;
    }

    try {
      const buffer = this.createNoiseBuffer();
      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = buffer;
      this.noiseNode.loop = true;

      // Filter settings depending on noise theme
      if (preset.noiseType === 'ocean') {
        this.noiseFilter.Q.setValueAtTime(1.0, now);
        this.noiseFilter.type = 'bandpass';
      } else if (preset.noiseType === 'forest') {
        this.noiseFilter.Q.setValueAtTime(0.5, now);
        this.noiseFilter.type = 'lowpass';
      } else { // rain
        this.noiseFilter.Q.setValueAtTime(0.4, now);
        this.noiseFilter.type = 'peaking';
      }

      this.noiseNode.connect(this.noiseFilter);
      this.noiseNode.start();

      // Configure a slow, sweeping LFO to model ocean swells or rustling wind
      this.waveLFO = this.ctx.createOscillator();
      this.waveLFOGain = this.ctx.createGain();
      
      this.waveLFO.type = 'sine';
      // Sweeps at 0.08 Hz (once every 12 seconds)
      this.waveLFO.frequency.setValueAtTime(0.08, now);
      
      // Wave depth: modulates the cutoff frequency of filter
      const sweepRange = preset.noiseType === 'ocean' ? 250 : 150;
      this.waveLFOGain.gain.setValueAtTime(sweepRange, now);
      
      this.waveLFO.connect(this.waveLFOGain);
      
      // Anchor cutoff center
      const centerCutoff = preset.noiseType === 'ocean' ? 350 : 600;
      this.noiseFilter.frequency.setValueAtTime(centerCutoff, now);
      this.waveLFOGain.connect(this.noiseFilter.frequency);
      
      this.waveLFO.start();

      // Soft fade in of nature sound
      this.noiseGain.gain.setValueAtTime(0, now);
      this.noiseGain.gain.linearRampToValueAtTime(this.natureVolume, now + 4);
    } catch (e) {
      console.warn('Could not launch noise generator:', e);
    }
  }

  private stopNoise(): void {
    if (this.noiseNode) {
      try { this.noiseNode.stop(); } catch (e) {}
      this.noiseNode = null;
    }
    if (this.waveLFO) {
      try { this.waveLFO.stop(); } catch (e) {}
      this.waveLFO = null;
    }
  }

  // Synthesize Tibetan Bowls / Metallic Wind Chimes
  public triggerSingingBowl(freq: number, strikeForce = 1.0): void {
    if (!this.ctx || !this.bowlGain) return;

    const now = this.ctx.currentTime;
    
    // An authentic metal singing bowl has a fundamental frequency and key inharmonic partials
    const partials = [1.0, 2.76, 5.4, 8.1, 11.2]; // natural inharmonic metallic ratios
    const partialDecays = [12.0, 6.0, 3.0, 1.5, 0.8]; // higher frequencies decay much faster
    const partialAmps = [0.4, 0.25, 0.15, 0.08, 0.04]; // higher frequencies are softer

    partials.forEach((ratio, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * ratio, now);
      
      // Apply a tiny pitch bend downwards on strike to mimic physical impact stiffness
      osc.frequency.exponentialRampToValueAtTime(freq * ratio * 0.998, now + 0.1);

      // Amplitude Envelope
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(partialAmps[i] * strikeForce, now + 0.02); // rapid click-free attack
      // Slow exponential decay
      gain.gain.exponentialRampToValueAtTime(0.0001, now + partialDecays[i] * strikeForce);

      osc.connect(gain);
      gain.connect(this.bowlGain!);
      
      osc.start();
      osc.stop(now + partialDecays[i] * strikeForce + 0.5);
    });
  }

  // Automatic slow wind chimes triggering scheduler
  private startChimeScheduler(): void {
    const triggerChimeRandomly = () => {
      if (!this.isPlaying || !this.ctx) return;
      
      const preset = this.presets[this.activePresetId];
      // Pick a random frequency from the active chord intervals
      const randomIndex = Math.floor(Math.random() * preset.intervals.length);
      const noteFreq = preset.baseFreq * preset.intervals[randomIndex] * 4; // Higher octave for chimes (pitch x 4)
      
      const strikeForce = 0.3 + Math.random() * 0.5;
      this.triggerSingingBowl(noteFreq, strikeForce);

      // Schedule next chime in 5 to 12 seconds
      const nextDelay = 5000 + Math.random() * 7000;
      this.chimeTimer = window.setTimeout(triggerChimeRandomly, nextDelay);
    };

    // First trigger after 4 seconds
    this.chimeTimer = window.setTimeout(triggerChimeRandomly, 4000);
  }

  private stopChimeScheduler(): void {
    if (this.chimeTimer) {
      clearTimeout(this.chimeTimer);
      this.chimeTimer = null;
    }
  }

  // Interactive Cursor Parallax Effects: Adjust filter cutoffs and speed of wave LFO
  public updateInteractiveFX(xPercent: number, yPercent: number): void {
    if (!this.ctx || !this.droneFilter || !this.waveLFO || !this.noiseFilter) return;

    const now = this.ctx.currentTime;
    const preset = this.presets[this.activePresetId];

    // Mouse X moves drone filter cutoff to make it brighter/warmer
    const minCutoff = preset.filterCutoff * 0.8;
    const maxCutoff = preset.filterCutoff * 1.8;
    const currentCutoff = minCutoff + xPercent * (maxCutoff - minCutoff);
    this.droneFilter.frequency.setTargetAtTime(currentCutoff, now, 0.1);

    // Mouse Y increases the speed of the ambient wind/ocean swells (LFO rate)
    // Range: 0.04 Hz to 0.16 Hz
    const lfoRate = 0.04 + yPercent * 0.12;
    this.waveLFO.frequency.setTargetAtTime(lfoRate, now, 0.2);
  }

  // Modulate sound envelope during breathing guide
  // Inhale: filter opens, volume swells slightly
  // Exhale: filter closes gently, deep settling
  public updateBreathingState(state: 'inhale' | 'exhale' | 'hold'): void {
    if (!this.ctx || !this.droneFilter || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const preset = this.presets[this.activePresetId];

    if (state === 'inhale') {
      // Swell drone cutoff frequency
      this.droneFilter.frequency.setTargetAtTime(preset.filterCutoff * 1.5, now, 2.0);
      // Swell master volume slightly
      this.masterGain.gain.setTargetAtTime(this.masterVolume * 1.15, now, 2.0);
    } else if (state === 'exhale') {
      // Darken tone for deeply grounding release
      this.droneFilter.frequency.setTargetAtTime(preset.filterCutoff * 0.75, now, 2.0);
      // Return master volume
      this.masterGain.gain.setTargetAtTime(this.masterVolume * 0.85, now, 2.0);
    } else { // hold
      // Stabilize
      this.droneFilter.frequency.setTargetAtTime(preset.filterCutoff * 1.1, now, 1.0);
      this.masterGain.gain.setTargetAtTime(this.masterVolume * 1.0, now, 1.0);
    }
  }

  // Change preset dynamically
  public changePreset(presetId: string): void {
    if (!this.presets[presetId]) return;
    this.activePresetId = presetId;

    if (this.isPlaying) {
      const now = this.ctx ? this.ctx.currentTime : 0;
      
      // Crossfade smoothly
      this.stopDrone();
      this.stopNoise();
      
      this.startDrone();
      this.startNoise();
    }
  }

  // Live Sound Visualizer helper (returns array of bytes)
  public getAnalyserData(): Uint8Array | null {
    if (!this.analyser) return null;
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  // Level adjustments
  public setMasterVolume(v: number): void {
    this.masterVolume = Math.max(0, Math.min(1, v));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.1);
    }
  }

  public setDroneVolume(v: number): void {
    this.droneVolume = Math.max(0, Math.min(1, v));
    if (this.droneGain && this.ctx) {
      this.droneGain.gain.setTargetAtTime(this.droneVolume, this.ctx.currentTime, 0.1);
    }
  }

  public setBowlsVolume(v: number): void {
    this.bowlsVolume = Math.max(0, Math.min(1, v));
    if (this.bowlGain && this.ctx) {
      this.bowlGain.gain.setTargetAtTime(this.bowlsVolume, this.ctx.currentTime, 0.1);
    }
  }

  public setNatureVolume(v: number): void {
    this.natureVolume = Math.max(0, Math.min(1, v));
    if (this.noiseGain && this.ctx) {
      this.noiseGain.gain.setTargetAtTime(this.natureVolume, this.ctx.currentTime, 0.1);
    }
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      activePresetId: this.activePresetId,
      masterVolume: this.masterVolume,
      droneVolume: this.droneVolume,
      bowlsVolume: this.bowlsVolume,
      natureVolume: this.natureVolume
    };
  }
}

// Single instance to prevent multiple audio contexts running in parallel
export const globalSoundscape = new SoundscapeEngine();
