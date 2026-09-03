import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (!isPlaying) {
      audioRef.current.volume = 0.25;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Audio playback was prevented by browser policy:', err);
          setIsPlaying(false);
        });
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed bottom-16 left-4 z-40 hidden sm:block">
      {/* Standard HTML5 audio element without any WebIDL constructors */}
      <audio
        ref={audioRef}
        loop
        preload="none"
        src="https://cdn.freesound.org/previews/573/573381_11861866-lq.mp3"
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />

      <button
        onClick={toggleMusic}
        title={isPlaying ? 'توقف موسیقی حماسی زمینه' : 'پخش موسیقی حماسی زمینه'}
        className={`p-3 rounded-full border shadow-lg backdrop-blur-md transition flex items-center gap-2 ${
          isPlaying 
            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse' 
            : 'bg-[#080d21]/90 text-cyan-400 border-cyan-500/40 hover:bg-slate-900'
        }`}
      >
        <Music size={18} className={isPlaying ? 'animate-bounce' : ''} />
        {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
        <span className="text-[10px] font-bold tracking-tight">
          {isPlaying ? 'موسیقی حماسی: فعال' : 'موسیقی حماسی'}
        </span>
      </button>
    </div>
  );
}
