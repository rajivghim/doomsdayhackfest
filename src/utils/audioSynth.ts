// Web Audio API Starlight Ambient Drone & Cosmic Binaural Sound Generator

class CosmicAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggle(): boolean {
    this.init();
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public play() {
    if (!this.ctx) return;
    this.stop();

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 3);
    masterGain.connect(this.ctx.destination);
    this.gainNode = masterGain;

    // Frequencies for a soothing deep celestial chord (Root, Fifth, Octave, 9th)
    const baseFreqs = [55, 110, 164.81, 220, 329.63, 440];

    baseFreqs.forEach((freq, index) => {
      if (!this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      // Soft sine waves with subtle detune for celestial shimmer
      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, this.ctx.currentTime);

      // Low pass filter for warm cosmic sound
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600 + index * 100, this.ctx.currentTime);

      oscGain.gain.setValueAtTime(0.04 / (index + 1), this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.gainNode);

      osc.start();
      this.oscillators.push(osc);
    });

    // Soft celestial pink noise generator
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.04;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(450, this.ctx.currentTime);
      noiseFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.015, this.ctx.currentTime);

      noise.connect(noiseFilter);
      noiseFilter.connect(nGain);
      nGain.connect(this.gainNode);

      noise.start();
      this.noiseNode = noise;
      this.noiseGain = nGain;
    } catch {
      // Ignore if noise buffer isn't supported
    }

    this.isPlaying = true;
  }

  public stop() {
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
        setTimeout(() => {
          this.oscillators.forEach(osc => {
            try { osc.stop(); osc.disconnect(); } catch {}
          });
          this.oscillators = [];
          if (this.noiseNode) {
            try { this.noiseNode.stop(); this.noiseNode.disconnect(); } catch {}
            this.noiseNode = null;
          }
        }, 1200);
      } catch {}
    }
    this.isPlaying = false;
  }
}

export const cosmicAudio = new CosmicAudioEngine();
