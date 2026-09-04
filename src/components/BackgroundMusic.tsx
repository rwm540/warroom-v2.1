import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Sliders, 
  Disc, 
  SkipForward, 
  SkipBack, 
  Play, 
  Pause, 
  Check, 
  Sparkles,
  Layers,
  ChevronUp
} from 'lucide-react';
import { 
  battleMusicSynth, 
  playTacticalSound, 
  getAudioContext, 
  TRACK_LIST, 
  TrackId 
} from '../utils/epicBgmEngine';

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('warroom_music_enabled');
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });

  const [currentTrackId, setCurrentTrackId] = useState<TrackId>(() => {
    try {
      const saved = localStorage.getItem('warroom_selected_track') as TrackId;
      if (saved && ['epic_march', 'cyber_mission', 'triumph_anthem', 'strategic_zen'].includes(saved)) {
        return saved;
      }
    } catch {}
    return 'epic_march';
  });

  const [volume, setVolume] = useState<number>(35);
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Initialize track on mount
  useEffect(() => {
    battleMusicSynth.setTrack(currentTrackId);
    battleMusicSynth.setVolume(volume / 100);
  }, []);

  // Global listener: Auto-play on user's first interaction anywhere on any page if music is enabled
  useEffect(() => {
    const handleFirstUserGesture = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        getAudioContext();
        
        // If music was enabled by default, start playing smoothly
        const isMusicEnabled = localStorage.getItem('warroom_music_enabled') !== 'false';
        if (isMusicEnabled && !battleMusicSynth.getIsRunning()) {
          battleMusicSynth.setVolume(volume / 100);
          battleMusicSynth.start();
          setIsPlaying(true);
        }
      }
    };

    window.addEventListener('pointerdown', handleFirstUserGesture, { once: false });
    window.addEventListener('keydown', handleFirstUserGesture, { once: false });
    window.addEventListener('touchstart', handleFirstUserGesture, { once: false });

    return () => {
      window.removeEventListener('pointerdown', handleFirstUserGesture);
      window.removeEventListener('keydown', handleFirstUserGesture);
      window.removeEventListener('touchstart', handleFirstUserGesture);
    };
  }, [hasInteracted, volume]);

  // Click outside to close track panel
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowPanel(false);
      }
    };
    if (showPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPanel]);

  const toggleMusic = () => {
    getAudioContext();
    playTacticalSound('click');

    if (!isPlaying) {
      battleMusicSynth.setVolume(volume / 100);
      battleMusicSynth.start();
      setIsPlaying(true);
      try {
        localStorage.setItem('warroom_music_enabled', 'true');
      } catch {}
    } else {
      battleMusicSynth.stop();
      setIsPlaying(false);
      try {
        localStorage.setItem('warroom_music_enabled', 'false');
      } catch {}
    }
  };

  const selectTrack = (trackId: TrackId) => {
    playTacticalSound('click');
    setCurrentTrackId(trackId);
    battleMusicSynth.setTrack(trackId);
    if (!isPlaying) {
      battleMusicSynth.setVolume(volume / 100);
      battleMusicSynth.start();
      setIsPlaying(true);
      try {
        localStorage.setItem('warroom_music_enabled', 'true');
      } catch {}
    }
  };

  const handleNextTrack = () => {
    playTacticalSound('click');
    const currentIndex = TRACK_LIST.findIndex(t => t.id === currentTrackId);
    const nextIndex = (currentIndex + 1) % TRACK_LIST.length;
    const nextTrack = TRACK_LIST[nextIndex];
    selectTrack(nextTrack.id);
  };

  const handlePrevTrack = () => {
    playTacticalSound('click');
    const currentIndex = TRACK_LIST.findIndex(t => t.id === currentTrackId);
    const prevIndex = (currentIndex - 1 + TRACK_LIST.length) % TRACK_LIST.length;
    const prevTrack = TRACK_LIST[prevIndex];
    selectTrack(prevTrack.id);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    battleMusicSynth.setVolume(newVol / 100);
  };

  const currentTrack = TRACK_LIST.find(t => t.id === currentTrackId) || TRACK_LIST[0];

  return (
    <div ref={panelRef} className="fixed bottom-20 left-3 sm:bottom-16 sm:left-4 z-40 flex flex-col items-start gap-2">
      {/* Track & Audio Control Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-72 sm:w-80 bg-[#080d21]/95 border border-cyan-500/40 p-3.5 rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl text-right dir-rtl space-y-3 font-sans"
            style={{ direction: 'rtl' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${currentTrack.color} flex items-center justify-center shadow-lg text-slate-950 font-black`}>
                  <Disc size={16} className={isPlaying ? 'animate-spin' : ''} style={{ animationDuration: '3s' }} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">سامانه صوت و موسیقی میدانی</h4>
                  <span className="text-[10px] text-cyan-400 font-medium">۴ سبک حماسی و تاکتیکی</span>
                </div>
              </div>
              <button
                onClick={() => setShowPanel(false)}
                className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded-lg bg-slate-800/70 cursor-pointer"
              >
                بستن
              </button>
            </div>

            {/* Track Selector List */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold block px-1">انتخاب آهنگ و سبک عملیاتی:</span>
              {TRACK_LIST.map((track) => {
                const isSelected = track.id === currentTrackId;
                return (
                  <button
                    key={track.id}
                    onClick={() => selectTrack(track.id)}
                    className={`w-full p-2.5 rounded-2xl text-right transition flex items-center justify-between gap-2 border cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'bg-slate-950/60 border-slate-800/70 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                        isSelected 
                          ? `bg-gradient-to-tr ${track.color} text-slate-950 font-black shadow-md` 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isSelected && isPlaying ? (
                          <div className="flex items-end gap-0.5 h-2.5">
                            <span className="w-0.5 bg-slate-950 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-full" />
                            <span className="w-0.5 bg-slate-950 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-2" />
                            <span className="w-0.5 bg-slate-950 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-1.5" />
                          </div>
                        ) : (
                          <Music size={12} />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-black truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {track.title}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{track.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/50">
                        {track.tag}
                      </span>
                      {isSelected && (
                        <Check size={14} className="text-cyan-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Track & Volume Controls */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
              {/* Prev / Play / Next */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevTrack}
                  className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition cursor-pointer"
                  title="آهنگ قبلی"
                >
                  <SkipForward size={13} />
                </button>

                <button
                  onClick={toggleMusic}
                  className={`p-2 rounded-xl transition flex items-center justify-center cursor-pointer ${
                    isPlaying
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md font-bold'
                      : 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                  }`}
                  title={isPlaying ? 'توقف پخش' : 'شروع پخش'}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>

                <button
                  onClick={handleNextTrack}
                  className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition cursor-pointer"
                  title="آهنگ بعدی"
                >
                  <SkipBack size={13} />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5 bg-slate-950/80 px-2 py-1.5 rounded-xl border border-slate-800 flex-1">
                <Volume2 size={13} className="text-slate-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  title="بلندی صدا"
                />
                <span className="text-[10px] font-mono text-cyan-400 w-6 text-left">
                  {volume}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill Trigger */}
      <div className="flex items-center gap-1 bg-[#080d21]/95 p-1 rounded-full border border-cyan-500/40 shadow-2xl backdrop-blur-md">
        {/* Play/Pause Main Button */}
        <button
          onClick={toggleMusic}
          title={isPlaying ? 'توقف موسیقی حماسی' : 'پخش خودکار موسیقی حماسی و تاکتیکی'}
          className={`px-3 py-1.5 rounded-full transition flex items-center gap-2 cursor-pointer ${
            isPlaying 
              ? `bg-gradient-to-r ${currentTrack.color} text-slate-950 font-black shadow-[0_0_20px_rgba(6,182,212,0.4)]` 
              : 'text-cyan-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          {isPlaying ? (
            <Disc size={16} className="animate-spin" style={{ animationDuration: '3s' }} />
          ) : (
            <VolumeX size={15} />
          )}
          
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-3 px-0.5">
              <span className="w-0.5 bg-slate-950 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-full" />
              <span className="w-0.5 bg-slate-950 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-2" />
              <span className="w-0.5 bg-slate-950 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-2.5" />
            </div>
          )}

          <span className="text-[11px] font-black tracking-tight max-w-[120px] sm:max-w-[150px] truncate">
            {isPlaying ? currentTrack.title : 'موسیقی زمینه (خاموش)'}
          </span>
        </button>

        {/* Next Track Quick Button */}
        {isPlaying && (
          <button
            onClick={handleNextTrack}
            className="p-1.5 text-cyan-400 hover:text-white rounded-full transition cursor-pointer hover:bg-slate-800/80"
            title="تغییر به آهنگ بعدی"
          >
            <SkipBack size={13} />
          </button>
        )}

        {/* Open Tracks Panel Button */}
        <button
          onClick={() => {
            playTacticalSound('click');
            setShowPanel(!showPanel);
          }}
          className={`p-1.5 rounded-full transition cursor-pointer ${
            showPanel 
              ? 'bg-cyan-500 text-slate-950 font-bold' 
              : 'text-cyan-400 hover:text-white hover:bg-slate-800/80'
          }`}
          title="لیست آهنگ‌ها و تنظیمات صدا"
        >
          <Sliders size={14} />
        </button>
      </div>
    </div>
  );
}
