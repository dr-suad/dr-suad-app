import { useState, useEffect, useCallback } from 'react';
import { playSuccess, playError, playClick, playCelebration } from '../utils/sounds';

const SOUNDS = {
  success: playSuccess,
  error: playError,
  click: playClick,
  celebration: playCelebration,
};

export function useSound() {
  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem('suad:sound-muted') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('suad:sound-muted', String(muted));
    } catch {}
  }, [muted]);

  const play = useCallback((name) => {
    if (muted) return;
    const fn = SOUNDS[name];
    if (fn) fn();
  }, [muted]);

  const toggleMute = useCallback(() => {
    setMuted((prev) => !prev);
  }, []);

  return { play, muted, toggleMute };
}