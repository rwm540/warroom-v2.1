import React, { useEffect, useRef } from 'react';
import { 
  battleMusicSynth, 
  getAudioContext,
  DEFAULT_SOUNDTRACKS 
} from '../utils/epicBgmEngine';
import { SoundtrackItem } from '../types';

/**
 * BackgroundMusic Component
 * 
 * Runs 100% autonomously in the background across all pages:
 * - Completely invisible: No buttons, toggles, floating pills, or UI elements on screen.
 * - Auto-runs audio and automatically shuffles/plays tracks in random rotation.
 * - Unlocks and plays immediately upon the first user interaction (click, touch, key, scroll).
 * - Admin Panel retains playlist management capabilities while regular UI stays pristine and uncluttered.
 */
export default function BackgroundMusic() {
  const hasStartedRef = useRef<boolean>(false);

  useEffect(() => {
    // 1. Force enable background audio by default
    localStorage.setItem('warroom_music_enabled', 'true');

    // 2. Set default playback mode to 'random' if not already configured
    const currentMode = battleMusicSynth.getPlaybackMode();
    if (!currentMode || currentMode !== 'random') {
      battleMusicSynth.setPlaybackMode('random');
    }

    // 3. Set a comfortable ambient volume (35%)
    battleMusicSynth.setVolume(0.35);

    // 4. Function to start audio smoothly
    const startAutonomousAudio = () => {
      if (hasStartedRef.current && battleMusicSynth.getIsRunning()) return;

      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      if (!battleMusicSynth.getIsRunning()) {
        battleMusicSynth.start();
        hasStartedRef.current = true;
      }
    };

    // 5. Try to auto-start immediately
    startAutonomousAudio();

    // 6. Global interaction listeners to instantly unlock browser autoplay policies on any touch/click/scroll/keypress
    const handleUserGesture = () => {
      startAutonomousAudio();
    };

    window.addEventListener('pointerdown', handleUserGesture, { passive: true });
    window.addEventListener('touchstart', handleUserGesture, { passive: true });
    window.addEventListener('click', handleUserGesture, { passive: true });
    window.addEventListener('keydown', handleUserGesture, { passive: true });
    window.addEventListener('scroll', handleUserGesture, { passive: true });

    // 7. Listen for Admin updates in the background
    const handleTracksUpdated = (e: CustomEvent<SoundtrackItem[]>) => {
      if (e.detail && e.detail.length > 0 && !battleMusicSynth.getIsRunning()) {
        startAutonomousAudio();
      }
    };

    window.addEventListener('warroom_soundtracks_updated' as any, handleTracksUpdated);

    return () => {
      window.removeEventListener('pointerdown', handleUserGesture);
      window.removeEventListener('touchstart', handleUserGesture);
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('keydown', handleUserGesture);
      window.removeEventListener('scroll', handleUserGesture);
      window.removeEventListener('warroom_soundtracks_updated' as any, handleTracksUpdated);
    };
  }, []);

  // Return null: Zero visible UI, 100% autonomous background audio execution
  return null;
}
