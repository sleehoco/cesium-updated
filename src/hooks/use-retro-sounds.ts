import { useCallback, useEffect, useRef } from 'react';

type SoundType = 'typing' | 'message' | 'alert' | 'error' | 'success' | 'keypress';

export function useRetroSounds(enabled: boolean = true) {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (enabled && !audioContextRef.current && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }
  }, [enabled]);

  const speak = useCallback((text: string) => {
    if (!enabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // Cancel any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a robotic/old school voice
    const voices = window.speechSynthesis.getVoices();
    // Prefer Google US English or similar standard voices, lower pitch/rate for WOPR feel
    const robotVoice = voices.find(v => v.name.includes('Google US English')) || voices[0];
    
    if (robotVoice) utterance.voice = robotVoice;
    utterance.pitch = 0.8; // Lower pitch
    utterance.rate = 0.9;  // Slightly slower
    utterance.volume = 0.8;

    window.speechSynthesis.speak(utterance);
  }, [enabled]);

  const playSound = useCallback((type: SoundType) => {
    if (!enabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'typing':
        // High pitched short blip for AI text
        osc.type = 'square';
        osc.frequency.setValueAtTime(800 + Math.random() * 200, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;

      case 'keypress':
        // Mechanical key click simulation
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;

      case 'message':
        // Dual tone incoming data sound
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;

      case 'alert':
        // Low alarming buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;

      case 'error':
        // Discordant low tone
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
        
      case 'success':
        // Rising chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
    }
  }, [enabled]);

  return { playSound, speak };
}
