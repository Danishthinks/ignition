// Web Audio API synthesizer for instant zero-dependency audio feedback
class SoundFX {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Engine rev sound effect synthesized with oscillators and filtered noise
  playEngineRev() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Low rumble oscillator
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      // Throttle up pitch from 60Hz to 180Hz then fall back to 80Hz (idle to rev)
      osc.frequency.setValueAtTime(60, now);
      osc.frequency.exponentialRampToValueAtTime(190, now + 0.35);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.8);

      // Gain envelope
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      // Lowpass filter for deep exhaust rumble
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, now);
      filter.frequency.exponentialRampToValueAtTime(650, now + 0.35);
      filter.frequency.exponentialRampToValueAtTime(280, now + 0.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Crisp cash register / deposit chime
  playDepositChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } catch {
      // Fallback
    }
  }

  // Milestone unlocked victory fanfare
  playMilestoneUnlock() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const chords = [
        { freq: 440, time: 0 },
        { freq: 554.37, time: 0.1 },
        { freq: 659.25, time: 0.2 },
        { freq: 880, time: 0.35 },
      ];

      chords.forEach(({ freq, time }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.01, now + time);
        gain.gain.linearRampToValueAtTime(0.2, now + time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + 0.65);
      });
    } catch {
      // Fallback
    }
  }
}

export const soundFx = new SoundFX();
