import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const toggleMusic = () => {
    if (!isPlaying) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
        
        // Create an epic ambient chord drone or marching melody using Web Audio API
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, ctx.currentTime); // A2 note epic drone

        gain.gain.setValueAtTime(0.03, ctx.currentTime);

        // Low pass filter for cinematic warmth
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        oscillatorRef.current = osc;
        gainNodeRef.current = gain;

        setIsPlaying(true);
      } catch (e) {
        console.error('AudioContext error:', e);
      }
    } else {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch (e) {}
        oscillatorRef.current = null;
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
        audioCtxRef.current = null;
      }
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try { oscillatorRef.current.stop(); } catch (e) {}
      }
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch (e) {}
      }
    };
  }, []);

  return (
    <div className="fixed bottom-16 left-4 z-40 hidden sm:block">
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
