import { useState, useEffect, useCallback } from 'react';

const XP_KEY = 'suad:xp';

function loadXP() {
  try {
    return Number(localStorage.getItem(XP_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function levelFromXP(xp) {
  return Math.floor(xp / 100) + 1;
}

export function progressInLevel(xp) {
  const cur = xp % 100;
  return { current: cur, total: 100, percent: Math.round((cur / 100) * 100) };
}

export function useXP() {
  const [xp, setXP] = useState(loadXP);
  const [lastLevel, setLastLevel] = useState(() => levelFromXP(loadXP()));
  const [leveledUp, setLeveledUp] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(XP_KEY, String(xp));
    } catch {}
    const lvl = levelFromXP(xp);
    if (lvl > lastLevel) {
      setLastLevel(lvl);
      setLeveledUp(true);
    }
  }, [xp, lastLevel]);

  const addXP = useCallback((amount) => {
    setXP((prev) => Math.max(0, prev + amount));
  }, []);

  const clearLevelUp = useCallback(() => {
    setLeveledUp(false);
  }, []);

  const level = levelFromXP(xp);
  const progress = progressInLevel(xp);

  return { xp, level, addXP, progress, leveledUp, clearLevelUp };
}
