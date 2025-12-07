import { useCallback, useRef, useEffect } from 'react';

interface SoundFeedbackOptions {
  enabled: boolean;
  volume: number; // 0-1
  buttonSound: 'click' | 'beep' | 'pop';
  stickSound: boolean;
}

const defaultOptions: SoundFeedbackOptions = {
  enabled: false,
  volume: 0.3,
  buttonSound: 'click',
  stickSound: false,
};

export const useSoundFeedback = (options: Partial<SoundFeedbackOptions> = {}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const optionsRef = useRef<SoundFeedbackOptions>({ ...defaultOptions, ...options });

  // Update options ref when options change
  useEffect(() => {
    optionsRef.current = { ...defaultOptions, ...options };
  }, [options]);

  // Initialize AudioContext lazily
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Play a click sound
  const playClick = useCallback(() => {
    if (!optionsRef.current.enabled) return;
    
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(optionsRef.current.volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  }, [getAudioContext]);

  // Play a beep sound
  const playBeep = useCallback(() => {
    if (!optionsRef.current.enabled) return;
    
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(optionsRef.current.volume * 0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.08);
  }, [getAudioContext]);

  // Play a pop sound
  const playPop = useCallback(() => {
    if (!optionsRef.current.enabled) return;
    
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.03);
    
    gainNode.gain.setValueAtTime(optionsRef.current.volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.03);
  }, [getAudioContext]);

  // Play a stick movement sound (subtle)
  const playStickMove = useCallback(() => {
    if (!optionsRef.current.enabled || !optionsRef.current.stickSound) return;
    
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(optionsRef.current.volume * 0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.02);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.02);
  }, [getAudioContext]);

  // Play button sound based on current setting
  const playButtonSound = useCallback(() => {
    if (!optionsRef.current.enabled) return;
    
    switch (optionsRef.current.buttonSound) {
      case 'click':
        playClick();
        break;
      case 'beep':
        playBeep();
        break;
      case 'pop':
        playPop();
        break;
    }
  }, [playClick, playBeep, playPop]);

  // Play trigger sound (pressure-based)
  const playTriggerSound = useCallback((pressure: number) => {
    if (!optionsRef.current.enabled) return;
    
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(200 + pressure * 400, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(optionsRef.current.volume * 0.2 * pressure, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  }, [getAudioContext]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    playButtonSound,
    playClick,
    playBeep,
    playPop,
    playStickMove,
    playTriggerSound,
  };
};

export default useSoundFeedback;
