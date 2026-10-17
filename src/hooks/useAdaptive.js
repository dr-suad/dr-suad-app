import { useState, useCallback } from 'react';

const LEVELS = ['سهل', 'متوسط', 'صعب'];
const LEVEL_KEYS = ['easy', 'medium', 'hard'];

function load() {
  try {
    return JSON.parse(localStorage.getItem('suad:adaptive')) || { level: 0, streak: 0 };
  } catch {
    return { level: 0, streak: 0 };
  }
}

function save(data) {
  try { localStorage.setItem('suad:adaptive', JSON.stringify(data)); } catch {}
}

export function useAdaptive() {
  const [state, setState] = useState(load);

  const recordAnswer = useCallback((isCorrect) => {
    setState((prev) => {
      let { level, streak } = prev;
      if (isCorrect) {
        streak += 1;
        if (streak >= 3 && level < LEVELS.length - 1) {
          level += 1;
          streak = 0;
        }
      } else {
        streak = 0;
        level = Math.max(0, level - 1);
      }
      const next = { level, streak };
      save(next);
      return next;
    });
  }, []);

  return {
    level: LEVELS[state.level],
    levelKey: LEVEL_KEYS[state.level],
    streak: state.streak,
    recordAnswer,
  };
}
