// Tactical War Room Epic Music Synthesizer & Sound Effects Engine
// Uses Web Audio API for 100% reliable, zero-latency, cross-browser cinematic battle audio

let sharedCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  try {
    if (!sharedCtx || sharedCtx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        sharedCtx = new AudioCtx();
      }
    }
    if (sharedCtx && sharedCtx.state === 'suspended') {
      sharedCtx.resume().catch(() => {});
    }
    return sharedCtx;
  } catch {
    return null;
  }
}

// Tactical UI Sound Effects
export function playTacticalSound(type: 'click' | 'like' | 'comment' | 'correct' | 'wrong' | 'timer' | 'win') {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  try {
    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);

    } else if (type === 'like') {
      // Warm bubbling pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);

    } else if (type === 'comment') {
      // Pleasant radio transmission ping
      const freqs = [659.25, 880, 1174.66];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.05);
        gain.gain.setValueAtTime(0.12, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.16);
      });

    } else if (type === 'correct' || type === 'win') {
      // Victorious major chime
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.18, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.36);
      });

    } else if (type === 'wrong') {
      // Low tactical rejection buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.setValueAtTime(110, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);

    } else if (type === 'timer') {
      // Clock tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1000, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    }
  } catch (e) {
    console.debug('Audio error:', e);
  }
}

// =========================================================================
// EPIC CINEMATIC WAR ROOM MULTI-TRACK MUSIC SYNTHESIZER
// =========================================================================

export type TrackId = 'epic_march' | 'cyber_mission' | 'triumph_anthem' | 'strategic_zen';

export interface TrackInfo {
  id: TrackId;
  title: string;
  subtitle: string;
  tempo: number;
  tag: string;
  color: string;
}

export const TRACK_LIST: TrackInfo[] = [
  {
    id: 'epic_march',
    title: 'مارش حماسی اتاق جنگ',
    subtitle: 'طبل‌های حماسی، شیپور و ملودی دلاورانه',
    tempo: 120,
    tag: 'حماسی / عملیاتی',
    color: 'from-amber-500 to-yellow-400'
  },
  {
    id: 'cyber_mission',
    title: 'سایبر مأموریت شبانه',
    subtitle: 'آرپژهای الکترونیک و ریتم تپنده مدرن',
    tempo: 128,
    tag: 'سایبر / راداری',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'triumph_anthem',
    title: 'سرود پیروزی و افتخار',
    subtitle: 'هارمونی ماژور، زنگ‌های زرین و سرود فتح',
    tempo: 112,
    tag: 'پیروزی / افتخار',
    color: 'from-emerald-500 to-teal-400'
  },
  {
    id: 'strategic_zen',
    title: 'تمرکز و تحلیل راهبردی',
    subtitle: 'فضای آرامش‌بخش، هارمونی‌های عمیق و تفکر',
    tempo: 90,
    tag: 'آرامش / تمرکز',
    color: 'from-purple-500 to-indigo-400'
  }
];

class MultiTrackSynthesizer {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private masterGain: GainNode | null = null;
  private timerId: number | null = null;
  private currentStep: number = 0;
  private volume: number = 0.35;
  private currentTrack: TrackId = 'epic_march';

  // 1. Epic March (D Minor)
  private marchChords = [
    { root: 146.83, notes: [293.66, 349.23, 440.0, 587.33] }, // Dm
    { root: 116.54, notes: [233.08, 293.66, 349.23, 466.16] }, // Bb
    { root: 174.61, notes: [349.23, 440.0, 523.25, 698.46] },  // F
    { root: 130.81, notes: [261.63, 329.63, 392.0, 523.25] },  // C
  ];
  private marchMelody = [
    587.33, 0, 587.33, 659.25, 698.46, 0, 587.33, 0, 880.0, 0, 783.99, 0, 698.46, 659.25, 587.33, 0,
    466.16, 0, 466.16, 587.33, 698.46, 0, 880.0, 0, 932.33, 0, 880.0, 0, 698.46, 0, 587.33, 0,
    523.25, 0, 659.25, 0, 698.46, 0, 783.99, 0, 880.0, 0, 1046.5, 0, 880.0, 0, 698.46, 0,
    523.25, 0, 659.25, 0, 783.99, 0, 880.0, 0, 659.25, 0, 587.33, 0, 523.25, 440.0, 587.33, 0
  ];

  // 2. Cyber Mission (F# Minor / Synthwave)
  private cyberChords = [
    { root: 92.50, notes: [185.00, 220.00, 277.18, 370.00] }, // F#m
    { root: 110.00, notes: [220.00, 277.18, 329.63, 440.00] }, // A
    { root: 98.00, notes: [196.00, 246.94, 293.66, 392.00] }, // G
    { root: 82.41, notes: [164.81, 207.65, 246.94, 329.63] }, // E
  ];
  private cyberArpNotes = [
    370.00, 440.00, 554.37, 740.00, 554.37, 440.00, 370.00, 440.00,
    440.00, 554.37, 659.25, 880.00, 659.25, 554.37, 440.00, 554.37,
    392.00, 493.88, 587.33, 783.99, 587.33, 493.88, 392.00, 493.88,
    329.63, 415.30, 493.88, 659.25, 493.88, 415.30, 329.63, 415.30
  ];

  // 3. Triumph Anthem (G Major)
  private triumphChords = [
    { root: 98.00, notes: [196.00, 246.94, 293.66, 392.00] },  // G
    { root: 82.41, notes: [164.81, 196.00, 246.94, 329.63] },  // Em
    { root: 130.81, notes: [261.63, 329.63, 392.00, 523.25] }, // C
    { root: 146.83, notes: [293.66, 369.99, 440.00, 587.33] }  // D
  ];
  private triumphMelody = [
    392.00, 0, 493.88, 0, 587.33, 0, 783.99, 0, 783.99, 0, 880.00, 0, 783.99, 587.33, 493.88, 0,
    329.63, 0, 392.00, 0, 493.88, 0, 659.25, 0, 587.33, 0, 493.88, 0, 392.00, 0, 493.88, 0,
    523.25, 0, 659.25, 0, 783.99, 0, 1046.5, 0, 880.00, 0, 783.99, 0, 659.25, 0, 587.33, 0,
    587.33, 0, 739.99, 0, 880.00, 0, 1174.66, 0, 987.77, 0, 880.00, 0, 783.99, 0, 587.33, 0
  ];

  // 4. Strategic Zen & Deep Focus (A Minor / Meditative Ambient)
  private zenChords = [
    { root: 110.00, notes: [220.00, 261.63, 329.63, 440.00] }, // Am
    { root: 87.31, notes: [174.61, 220.00, 261.63, 349.23] },  // F
    { root: 130.81, notes: [261.63, 329.63, 392.00, 523.25] }, // C
    { root: 98.00, notes: [196.00, 246.94, 293.66, 392.00] }   // G
  ];
  private zenChimes = [
    440.00, 0, 0, 0, 659.25, 0, 0, 0, 523.25, 0, 0, 0, 880.00, 0, 0, 0,
    349.23, 0, 0, 0, 523.25, 0, 0, 0, 440.00, 0, 0, 0, 698.46, 0, 0, 0,
    523.25, 0, 0, 0, 659.25, 0, 0, 0, 783.99, 0, 0, 0, 1046.5, 0, 0, 0,
    392.00, 0, 0, 0, 587.33, 0, 0, 0, 493.88, 0, 0, 0, 783.99, 0, 0, 0
  ];

  public getTrack(): TrackId {
    return this.currentTrack;
  }

  public setTrack(trackId: TrackId) {
    this.currentTrack = trackId;
    try {
      localStorage.setItem('warroom_selected_track', trackId);
    } catch {}

    if (this.isRunning) {
      // Re-initialize tempo interval
      this.restartTimer();
    }
  }

  private getStepDuration(): number {
    switch (this.currentTrack) {
      case 'cyber_mission': return 117; // ~128 BPM
      case 'triumph_anthem': return 134; // ~112 BPM
      case 'strategic_zen': return 166; // ~90 BPM
      case 'epic_march':
      default:
        return 125; // 120 BPM
    }
  }

  private restartTimer() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    const stepDuration = this.getStepDuration();
    this.timerId = window.setInterval(() => {
      this.tick();
    }, stepDuration);
  }

  public start() {
    if (this.isRunning) return;
    this.ctx = getAudioContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    this.isRunning = true;
    this.currentStep = 0;

    // Load saved track preference if available
    try {
      const saved = localStorage.getItem('warroom_selected_track') as TrackId;
      if (saved && ['epic_march', 'cyber_mission', 'triumph_anthem', 'strategic_zen'].includes(saved)) {
        this.currentTrack = saved;
      }
    } catch {}

    // Master Gain with smooth fade in
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 1.2);
    this.masterGain.connect(this.ctx.destination);

    this.restartTimer();
  }

  public stop() {
    this.isRunning = false;
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }

    if (this.masterGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.linearRampToValueAtTime(0.001, now + 0.5);
        setTimeout(() => {
          this.masterGain?.disconnect();
          this.masterGain = null;
        }, 550);
      } catch {
        this.masterGain.disconnect();
        this.masterGain = null;
      }
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  private tick() {
    if (!this.isRunning || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const step = this.currentStep;

    switch (this.currentTrack) {
      case 'cyber_mission':
        this.tickCyber(now, step);
        break;
      case 'triumph_anthem':
        this.tickTriumph(now, step);
        break;
      case 'strategic_zen':
        this.tickZen(now, step);
        break;
      case 'epic_march':
      default:
        this.tickMarch(now, step);
        break;
    }

    this.currentStep = (this.currentStep + 1) % 64;
  }

  // --- Track 1: Epic March ---
  private tickMarch(now: number, step: number) {
    const barIdx = Math.floor(step / 16) % 4;
    const chord = this.marchChords[barIdx];
    const beatInBar = step % 16;

    if (beatInBar === 0 || beatInBar === 6 || beatInBar === 8 || beatInBar === 12 || beatInBar === 14) {
      this.playWarDrum(now, beatInBar === 0 ? 0.35 : 0.22);
    }
    if (beatInBar === 4 || beatInBar === 12) {
      this.playSnare(now, 0.16);
    }
    if (beatInBar === 0 || beatInBar === 8) {
      this.playBassDrone(now, chord.root, 0.25, 0.9);
    }
    if (beatInBar === 0) {
      chord.notes.forEach((freq) => {
        this.playBrassNote(now, freq, 0.08, 1.8);
      });
    }
    const melodyFreq = this.marchMelody[step % 64];
    if (melodyFreq > 0) {
      this.playLeadNote(now, melodyFreq, 0.12, 0.28);
    }
  }

  // --- Track 2: Cyber Mission (Synthwave / Electro) ---
  private tickCyber(now: number, step: number) {
    const barIdx = Math.floor(step / 16) % 4;
    const chord = this.cyberChords[barIdx];
    const beatInBar = step % 16;

    // Four-on-the-floor kick
    if (beatInBar % 4 === 0) {
      this.playCyberKick(now, 0.32);
    }
    // Cyber Hi-hat on every off-beat 16th
    if (beatInBar % 2 === 1) {
      this.playHiHat(now, 0.06);
    }
    // Snare / Clap on 4 and 12
    if (beatInBar === 4 || beatInBar === 12) {
      this.playCyberClap(now, 0.18);
    }
    // Rolling 16th Bass
    const bassOct = beatInBar % 2 === 0 ? chord.root : chord.root * 1.5;
    this.playCyberBass(now, bassOct, 0.18, 0.12);

    // Cyber Arpeggio
    const arpFreq = this.cyberArpNotes[step % 32];
    if (arpFreq) {
      this.playCyberArp(now, arpFreq, 0.09, 0.12);
    }
  }

  // --- Track 3: Triumph Anthem (Major Fanfare) ---
  private tickTriumph(now: number, step: number) {
    const barIdx = Math.floor(step / 16) % 4;
    const chord = this.triumphChords[barIdx];
    const beatInBar = step % 16;

    if (beatInBar === 0 || beatInBar === 8 || beatInBar === 10) {
      this.playWarDrum(now, beatInBar === 0 ? 0.30 : 0.18);
    }
    if (beatInBar === 4 || beatInBar === 12) {
      this.playSnare(now, 0.14);
    }
    if (beatInBar === 0) {
      chord.notes.forEach((freq) => {
        this.playBrassNote(now, freq, 0.09, 2.0);
      });
      // Victorious Bell Chime
      this.playChime(now, chord.notes[2] * 2, 0.15, 1.2);
    }
    if (beatInBar === 0 || beatInBar === 8) {
      this.playBassDrone(now, chord.root, 0.22, 1.0);
    }
    const melodyFreq = this.triumphMelody[step % 64];
    if (melodyFreq > 0) {
      this.playLeadNote(now, melodyFreq, 0.14, 0.32);
    }
  }

  // --- Track 4: Strategic Zen (Deep Ambient Focus) ---
  private tickZen(now: number, step: number) {
    const barIdx = Math.floor(step / 16) % 4;
    const chord = this.zenChords[barIdx];
    const beatInBar = step % 16;

    // Gentle deep sub heart-pulse on beat 0
    if (beatInBar === 0) {
      this.playSubPulse(now, chord.root * 0.5, 0.20, 1.8);
      // Soft ambient chord wash
      chord.notes.forEach((freq) => {
        this.playPadNote(now, freq, 0.06, 2.8);
      });
    }

    // Melodic crystal chimes
    const chimeFreq = this.zenChimes[step % 64];
    if (chimeFreq > 0) {
      this.playChime(now, chimeFreq, 0.11, 0.9);
    }
  }

  // --- Sound Generators ---

  private playWarDrum(time: number, gainLevel: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.15);
    gain.gain.setValueAtTime(gainLevel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.26);
  }

  private playCyberKick(time: number, gainLevel: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.09);
    gain.gain.setValueAtTime(gainLevel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.2);
  }

  private playSnare(time: number, gainLevel: number) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(800, time);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainLevel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(time);
    noise.stop(time + 0.13);
  }

  private playCyberClap(time: number, gainLevel: number) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, time);
    filter.Q.setValueAtTime(3, time);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainLevel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.11);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(time);
    noise.stop(time + 0.12);
  }

  private playHiHat(time: number, gainLevel: number) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(5000, time);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainLevel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(time);
    noise.stop(time + 0.05);
  }

  private playBassDrone(time: number, freq: number, gainLevel: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, time);
    filter.frequency.exponentialRampToValueAtTime(160, time + duration);
    gain.gain.setValueAtTime(gainLevel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  private playCyberBass(time: number, freq: number, gainLevel: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, time);
    filter.frequency.exponentialRampToValueAtTime(200, time + duration);
    gain.gain.setValueAtTime(gainLevel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + duration + 0.02);
  }

  private playSubPulse(time: number, freq: number, gainLevel: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(gainLevel, time + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  private playBrassNote(time: number, freq: number, gainLevel: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, time);
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(gainLevel, time + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  private playPadNote(time: number, freq: number, gainLevel: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, time);
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(gainLevel, time + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + duration + 0.1);
  }

  private playLeadNote(time: number, freq: number, gainLevel: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(gainLevel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  private playCyberArp(time: number, freq: number, gainLevel: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, time);
    filter.frequency.exponentialRampToValueAtTime(600, time + duration);
    gain.gain.setValueAtTime(gainLevel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + duration + 0.02);
  }

  private playChime(time: number, freq: number, gainLevel: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(gainLevel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + duration + 0.05);
  }
}

export const battleMusicSynth = new MultiTrackSynthesizer();
