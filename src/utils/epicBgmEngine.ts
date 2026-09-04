// Tactical War Room Epic Music Synthesizer & Universal Audio Stream Engine
// Supports both dynamic Web Audio API Synthesis AND Direct Audio Link Streams (MP3/WAV/OGG)
// with Auto-Random/Shuffle on end, Custom Admin Playlists, and Persistent Global Control.

import { SoundtrackItem, AudioPlaybackMode, AudioSettings } from '../types';

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
export function playTacticalSound(type: 'click' | 'like' | 'comment' | 'correct' | 'wrong' | 'timer' | 'win' | 'switch') {
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

    } else if (type === 'switch') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);

    } else if (type === 'like') {
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
      const notes = [523.25, 659.25, 783.99, 1046.5];
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

export type SynthTrackId = 'epic_march' | 'cyber_mission' | 'triumph_anthem' | 'strategic_zen';

// Default soundtrack presets (includes both synthesizers and high quality audio links)
export const DEFAULT_SOUNDTRACKS: SoundtrackItem[] = [
  {
    id: 'track-synth-march',
    title: 'مارش حماسی اتاق جنگ',
    subtitle: 'طبل‌های حماسی، شیپور و ملودی دلاورانه',
    tag: 'حماسی / سینماتیک',
    color: 'from-amber-500 to-yellow-400',
    sourceType: 'synth',
    synthTrackId: 'epic_march',
    tempo: 120,
    durationSeconds: 90,
    is_active: true,
    order: 1
  },
  {
    id: 'track-url-epic-orchestra',
    title: 'نوای فتح و افق افتخار',
    subtitle: 'موسیقی ارکسترال حماسی با ضرب‌آهنگ پیروزی',
    tag: 'ارکسترال / لینک صوتی',
    color: 'from-orange-500 to-amber-400',
    sourceType: 'url',
    url: 'https://cdn.freesound.org/previews/563/563842_11861866-lq.mp3',
    durationSeconds: 110,
    is_active: true,
    order: 2
  },
  {
    id: 'track-synth-cyber',
    title: 'سایبر مأموریت و رادار شبانه',
    subtitle: 'آرپژهای الکترونیک و ریتم تپنده راداری مدرن',
    tag: 'سایبر / الکترونیک',
    color: 'from-cyan-500 to-blue-500',
    sourceType: 'synth',
    synthTrackId: 'cyber_mission',
    tempo: 128,
    durationSeconds: 90,
    is_active: true,
    order: 3
  },
  {
    id: 'track-url-tactical-drums',
    title: 'طبل‌های حماسی فتح خرمشهر',
    subtitle: 'ریتم پرکاشن حماسی و رزمی میدانی',
    tag: 'رزمی / لینک صوتی',
    color: 'from-red-500 to-rose-400',
    sourceType: 'url',
    url: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
    durationSeconds: 95,
    is_active: true,
    order: 4
  },
  {
    id: 'track-synth-triumph',
    title: 'سرود پیروزی و افتخار جوخه',
    subtitle: 'هارمونی ماژور، زنگ‌های زرین و سرود فتح',
    tag: 'افتخار / امیدبخش',
    color: 'from-emerald-500 to-teal-400',
    sourceType: 'synth',
    synthTrackId: 'triumph_anthem',
    tempo: 112,
    durationSeconds: 90,
    is_active: true,
    order: 5
  },
  {
    id: 'track-synth-zen',
    title: 'تمرکز و تحلیل راهبردی',
    subtitle: 'فضای آرامش‌بخش، هارمونی‌های عمیق و تفکر',
    tag: 'آرامش / تمرکز',
    color: 'from-purple-500 to-indigo-400',
    sourceType: 'synth',
    synthTrackId: 'strategic_zen',
    tempo: 90,
    durationSeconds: 120,
    is_active: true,
    order: 6
  }
];

export const TRACK_LIST = DEFAULT_SOUNDTRACKS; // backward compat

class UniversalAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private masterGain: GainNode | null = null;
  private timerId: number | null = null;
  private synthStep: number = 0;
  private synthCycleSeconds: number = 0;
  private volume: number = 0.35;
  
  // HTML5 Audio Element for URL-based tracks
  private audioElement: HTMLAudioElement | null = null;
  private isUsingUrlAudio: boolean = false;

  // Playlist & Settings
  private playlist: SoundtrackItem[] = [];
  private currentTrack: SoundtrackItem | null = null;
  private playbackMode: AudioPlaybackMode = 'random';
  private autoAdvanceTimerId: number | null = null;

  // Synthesis data
  private marchChords = [
    { root: 146.83, notes: [293.66, 349.23, 440.0, 587.33] },
    { root: 116.54, notes: [233.08, 293.66, 349.23, 466.16] },
    { root: 174.61, notes: [349.23, 440.0, 523.25, 698.46] },
    { root: 130.81, notes: [261.63, 329.63, 392.0, 523.25] },
  ];
  private marchMelody = [
    587.33, 0, 587.33, 659.25, 698.46, 0, 587.33, 0, 880.0, 0, 783.99, 0, 698.46, 659.25, 587.33, 0,
    466.16, 0, 466.16, 587.33, 698.46, 0, 880.0, 0, 932.33, 0, 880.0, 0, 698.46, 0, 587.33, 0,
    523.25, 0, 659.25, 0, 698.46, 0, 783.99, 0, 880.0, 0, 1046.5, 0, 880.0, 0, 698.46, 0,
    523.25, 0, 659.25, 0, 783.99, 0, 880.0, 0, 659.25, 0, 587.33, 0, 523.25, 440.0, 587.33, 0
  ];

  private cyberChords = [
    { root: 92.50, notes: [185.00, 220.00, 277.18, 370.00] },
    { root: 110.00, notes: [220.00, 277.18, 329.63, 440.00] },
    { root: 98.00, notes: [196.00, 246.94, 293.66, 392.00] },
    { root: 82.41, notes: [164.81, 207.65, 246.94, 329.63] },
  ];
  private cyberArpNotes = [
    370.00, 440.00, 554.37, 740.00, 554.37, 440.00, 370.00, 440.00,
    440.00, 554.37, 659.25, 880.00, 659.25, 554.37, 440.00, 554.37,
    392.00, 493.88, 587.33, 783.99, 587.33, 493.88, 392.00, 493.88,
    329.63, 415.30, 493.88, 659.25, 493.88, 415.30, 329.63, 415.30
  ];

  private triumphChords = [
    { root: 98.00, notes: [196.00, 246.94, 293.66, 392.00] },
    { root: 82.41, notes: [164.81, 196.00, 246.94, 329.63] },
    { root: 130.81, notes: [261.63, 329.63, 392.00, 523.25] },
    { root: 146.83, notes: [293.66, 369.99, 440.00, 587.33] }
  ];
  private triumphMelody = [
    392.00, 0, 493.88, 0, 587.33, 0, 783.99, 0, 783.99, 0, 880.00, 0, 783.99, 587.33, 493.88, 0,
    329.63, 0, 392.00, 0, 493.88, 0, 659.25, 0, 587.33, 0, 493.88, 0, 392.00, 0, 493.88, 0,
    523.25, 0, 659.25, 0, 783.99, 0, 1046.5, 0, 880.00, 0, 783.99, 0, 659.25, 0, 587.33, 0,
    587.33, 0, 739.99, 0, 880.00, 0, 1174.66, 0, 987.77, 0, 880.00, 0, 783.99, 0, 587.33, 0
  ];

  private zenChords = [
    { root: 110.00, notes: [220.00, 261.63, 329.63, 440.00] },
    { root: 87.31, notes: [174.61, 220.00, 261.63, 349.23] },
    { root: 130.81, notes: [261.63, 329.63, 392.00, 523.25] },
    { root: 98.00, notes: [196.00, 246.94, 293.66, 392.00] }
  ];
  private zenChimes = [
    440.00, 0, 0, 0, 659.25, 0, 0, 0, 523.25, 0, 0, 0, 880.00, 0, 0, 0,
    349.23, 0, 0, 0, 523.25, 0, 0, 0, 440.00, 0, 0, 0, 698.46, 0, 0, 0,
    523.25, 0, 0, 0, 659.25, 0, 0, 0, 783.99, 0, 0, 0, 1046.5, 0, 0, 0,
    392.00, 0, 0, 0, 587.33, 0, 0, 0, 493.88, 0, 0, 0, 783.99, 0, 0, 0
  ];

  constructor() {
    this.initPlaylist();
    this.setupAudioElement();
  }

  private initPlaylist() {
    try {
      const savedList = localStorage.getItem('warroom_soundtracks');
      if (savedList) {
        this.playlist = JSON.parse(savedList);
      } else {
        this.playlist = [...DEFAULT_SOUNDTRACKS];
        localStorage.setItem('warroom_soundtracks', JSON.stringify(this.playlist));
      }

      const savedSettings = localStorage.getItem('warroom_audio_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.playbackMode) this.playbackMode = parsed.playbackMode;
        if (parsed.defaultVolume !== undefined) this.volume = parsed.defaultVolume / 100;
        if (parsed.activeTrackId) {
          const found = this.playlist.find(t => t.id === parsed.activeTrackId);
          if (found) this.currentTrack = found;
        }
      }

      if (!this.currentTrack && this.playlist.length > 0) {
        this.currentTrack = this.playlist.find(t => t.is_active) || this.playlist[0];
      }
    } catch {
      this.playlist = [...DEFAULT_SOUNDTRACKS];
      this.currentTrack = this.playlist[0];
    }
  }

  private setupAudioElement() {
    if (typeof window === 'undefined') return;
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = 'anonymous';
    this.audioElement.loop = false; // We handle loop via playlist mode
    this.audioElement.volume = this.volume;

    // When URL track ends, automatically advance according to playback mode!
    this.audioElement.addEventListener('ended', () => {
      console.log('Track ended naturally, auto-advancing according to mode:', this.playbackMode);
      this.handleTrackEnded();
    });

    // Error fallback: if URL fails to load, gracefully fallback to synthesizer
    this.audioElement.addEventListener('error', (e) => {
      console.warn('Audio link load failed, switching to backup synth:', e);
      if (this.isRunning && this.currentTrack?.sourceType === 'url') {
        // Play synth fallback
        this.playSynthMode('epic_march');
      }
    });
  }

  // Handle when current track finishes
  private handleTrackEnded() {
    if (!this.isRunning) return;

    if (this.playbackMode === 'repeat_one') {
      // Replay the same track
      if (this.currentTrack) {
        this.playTrack(this.currentTrack);
      }
    } else if (this.playbackMode === 'random') {
      // Pick a random track from active playlist
      this.nextRandomTrack();
    } else {
      // Sequential next
      this.nextSequentialTrack();
    }
  }

  public getPlaylist(): SoundtrackItem[] {
    return this.playlist;
  }

  public setPlaylist(newPlaylist: SoundtrackItem[]) {
    this.playlist = newPlaylist;
    try {
      localStorage.setItem('warroom_soundtracks', JSON.stringify(newPlaylist));
      window.dispatchEvent(new CustomEvent('warroom_soundtracks_updated', { detail: newPlaylist }));
    } catch {}

    // Check if current track was removed or deactivated
    if (this.currentTrack && !this.playlist.some(t => t.id === this.currentTrack?.id && t.is_active)) {
      const firstActive = this.playlist.find(t => t.is_active);
      if (firstActive) {
        this.playTrack(firstActive);
      }
    }
  }

  public getPlaybackMode(): AudioPlaybackMode {
    return this.playbackMode;
  }

  public setPlaybackMode(mode: AudioPlaybackMode) {
    this.playbackMode = mode;
    try {
      const savedSettings = JSON.parse(localStorage.getItem('warroom_audio_settings') || '{}');
      savedSettings.playbackMode = mode;
      localStorage.setItem('warroom_audio_settings', JSON.stringify(savedSettings));
      window.dispatchEvent(new CustomEvent('warroom_audio_settings_updated', { detail: savedSettings }));
    } catch {}
  }

  public getCurrentTrack(): SoundtrackItem | null {
    if (!this.currentTrack && this.playlist.length > 0) {
      this.currentTrack = this.playlist.find(t => t.is_active) || this.playlist[0];
    }
    return this.currentTrack;
  }

  public setTrack(trackIdOrObj: string | SoundtrackItem) {
    let track: SoundtrackItem | undefined;
    if (typeof trackIdOrObj === 'string') {
      track = this.playlist.find(t => t.id === trackIdOrObj || (t.synthTrackId && t.synthTrackId === trackIdOrObj));
    } else {
      track = trackIdOrObj;
    }

    if (!track) return;
    this.currentTrack = track;

    try {
      const savedSettings = JSON.parse(localStorage.getItem('warroom_audio_settings') || '{}');
      savedSettings.activeTrackId = track.id;
      localStorage.setItem('warroom_audio_settings', JSON.stringify(savedSettings));
      localStorage.setItem('warroom_selected_track', track.id);
      window.dispatchEvent(new CustomEvent('warroom_track_changed', { detail: track }));
    } catch {}

    if (this.isRunning) {
      this.playTrack(track);
    }
  }

  public nextRandomTrack() {
    const activeTracks = this.playlist.filter(t => t.is_active);
    if (activeTracks.length === 0) return;
    if (activeTracks.length === 1) {
      this.playTrack(activeTracks[0]);
      return;
    }

    // Pick random different track
    const otherTracks = activeTracks.filter(t => t.id !== this.currentTrack?.id);
    const pool = otherTracks.length > 0 ? otherTracks : activeTracks;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selected = pool[randomIndex];
    this.setTrack(selected);
  }

  public nextSequentialTrack() {
    const activeTracks = this.playlist.filter(t => t.is_active);
    if (activeTracks.length === 0) return;

    const currentIndex = activeTracks.findIndex(t => t.id === this.currentTrack?.id);
    const nextIndex = (currentIndex + 1) % activeTracks.length;
    this.setTrack(activeTracks[nextIndex]);
  }

  public nextTrack() {
    if (this.playbackMode === 'random') {
      this.nextRandomTrack();
    } else {
      this.nextSequentialTrack();
    }
  }

  public prevTrack() {
    const activeTracks = this.playlist.filter(t => t.is_active);
    if (activeTracks.length === 0) return;

    const currentIndex = activeTracks.findIndex(t => t.id === this.currentTrack?.id);
    const prevIndex = (currentIndex - 1 + activeTracks.length) % activeTracks.length;
    this.setTrack(activeTracks[prevIndex]);
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      localStorage.setItem('warroom_music_enabled', 'true');
    } catch {}

    const track = this.getCurrentTrack();
    if (track) {
      this.playTrack(track);
    } else if (this.playlist.length > 0) {
      this.playTrack(this.playlist[0]);
    }
  }

  public playTrack(track: SoundtrackItem) {
    this.currentTrack = track;
    this.isRunning = true;

    // Clear any previous synth or auto-advance timers
    this.stopSynth();
    if (this.autoAdvanceTimerId !== null) {
      window.clearTimeout(this.autoAdvanceTimerId);
      this.autoAdvanceTimerId = null;
    }

    // Save current active track
    try {
      const savedSettings = JSON.parse(localStorage.getItem('warroom_audio_settings') || '{}');
      savedSettings.activeTrackId = track.id;
      localStorage.setItem('warroom_audio_settings', JSON.stringify(savedSettings));
      window.dispatchEvent(new CustomEvent('warroom_track_changed', { detail: track }));
    } catch {}

    if (track.sourceType === 'url' && track.url) {
      // 1. URL Audio Playback
      this.playUrlAudio(track.url);
    } else {
      // 2. Synthesizer Playback
      const synthId = track.synthTrackId || 'epic_march';
      this.playSynthMode(synthId);

      // In synth mode, since synthesis is infinite, auto-advance after the track's durationSeconds (or default 90s)
      const duration = (track.durationSeconds || 90) * 1000;
      this.autoAdvanceTimerId = window.setTimeout(() => {
        if (this.isRunning) {
          console.log('Synth cycle completed, auto-advancing...');
          this.handleTrackEnded();
        }
      }, duration);
    }
  }

  private playUrlAudio(url: string) {
    this.isUsingUrlAudio = true;
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.src = url;
        this.audioElement.volume = this.volume;
        this.audioElement.currentTime = 0;
        const playPromise = this.audioElement.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('URL Audio play blocked or failed:', err);
            // Fallback to synth if URL is blocked
            this.playSynthMode('epic_march');
          });
        }
      } catch (e) {
        console.warn('Audio URL error:', e);
        this.playSynthMode('epic_march');
      }
    }
  }

  private playSynthMode(synthId: SynthTrackId) {
    this.isUsingUrlAudio = false;
    if (this.audioElement) {
      this.audioElement.pause();
    }

    this.ctx = getAudioContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    this.synthStep = 0;
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 1.2);
    this.masterGain.connect(this.ctx.destination);

    let stepDuration = 125;
    if (synthId === 'cyber_mission') stepDuration = 117;
    else if (synthId === 'triumph_anthem') stepDuration = 134;
    else if (synthId === 'strategic_zen') stepDuration = 166;

    this.timerId = window.setInterval(() => {
      this.tickSynth(synthId);
    }, stepDuration);
  }

  private stopSynth() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.masterGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.linearRampToValueAtTime(0.001, now + 0.4);
        setTimeout(() => {
          this.masterGain?.disconnect();
          this.masterGain = null;
        }, 450);
      } catch {
        this.masterGain.disconnect();
        this.masterGain = null;
      }
    }
  }

  public stop() {
    this.isRunning = false;
    try {
      localStorage.setItem('warroom_music_enabled', 'false');
    } catch {}

    if (this.autoAdvanceTimerId !== null) {
      window.clearTimeout(this.autoAdvanceTimerId);
      this.autoAdvanceTimerId = null;
    }

    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopSynth();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
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

  // Synthesizer step tick
  private tickSynth(synthId: SynthTrackId) {
    if (!this.isRunning || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const step = this.synthStep;

    switch (synthId) {
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

    this.synthStep = (this.synthStep + 1) % 64;
  }

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

  private tickCyber(now: number, step: number) {
    const barIdx = Math.floor(step / 16) % 4;
    const chord = this.cyberChords[barIdx];
    const beatInBar = step % 16;

    if (beatInBar % 4 === 0) {
      this.playCyberKick(now, 0.32);
    }
    if (beatInBar % 2 === 1) {
      this.playHiHat(now, 0.06);
    }
    if (beatInBar === 4 || beatInBar === 12) {
      this.playCyberClap(now, 0.18);
    }
    const bassOct = beatInBar % 2 === 0 ? chord.root : chord.root * 1.5;
    this.playCyberBass(now, bassOct, 0.18, 0.12);

    const arpFreq = this.cyberArpNotes[step % 32];
    if (arpFreq) {
      this.playCyberArp(now, arpFreq, 0.09, 0.12);
    }
  }

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

  private tickZen(now: number, step: number) {
    const barIdx = Math.floor(step / 16) % 4;
    const chord = this.zenChords[barIdx];
    const beatInBar = step % 16;

    if (beatInBar === 0) {
      this.playSubPulse(now, chord.root * 0.5, 0.20, 1.8);
      chord.notes.forEach((freq) => {
        this.playPadNote(now, freq, 0.06, 2.8);
      });
    }
    const chimeFreq = this.zenChimes[step % 64];
    if (chimeFreq > 0) {
      this.playChime(now, chimeFreq, 0.11, 0.9);
    }
  }

  // --- Audio Synthesis Generator primitives ---
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

export const battleMusicSynth = new UniversalAudioEngine();
