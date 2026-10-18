import { useState, useEffect, useCallback } from 'react';

const KEY = 'suad:weeklyChallenge';

function currentWeekId() {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${week}`;
}

function weekEndsIn() {
  const now = new Date();
  const end = new Date(now);
  const day = end.getDay() || 7;
  end.setDate(end.getDate() + (7 - day));
  end.setHours(23, 59, 59, 999);
  const diff = end.getTime() - now.getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `بقي ${days} ${days === 1 ? 'يوم' : 'أيام'}`;
  if (hours > 0) return `بقي ${hours} ساعة`;
  return 'ينتهي اليوم';
}

const CHALLENGE_LESSONS = 5;
const CHALLENGE_GAMES = 3;

export function useWeeklyChallenge() {
  const [done, setDone] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem(KEY));
      return data && data.week === currentWeekId()
        ? { lessons: data.lessons || 0, games: data.games || 0, claimed: !!data.claimed }
        : { lessons: 0, games: 0, claimed: false };
    } catch {
      return { lessons: 0, games: 0, claimed: false };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...done, week: currentWeekId() }));
    } catch {}
  }, [done]);

  const recordLesson = useCallback(() => {
    setDone((p) => ({ lessons: Math.min(CHALLENGE_LESSONS, p.lessons + 1), games: p.games, claimed: p.claimed }));
  }, []);

  const recordGame = useCallback(() => {
    setDone((p) => ({ lessons: p.lessons, games: Math.min(CHALLENGE_GAMES, p.games + 1), claimed: p.claimed }));
  }, []);

  const claim = useCallback(() => {
    setDone((p) => ({ ...p, claimed: true }));
  }, []);

  const complete = done.lessons >= CHALLENGE_LESSONS && done.games >= CHALLENGE_GAMES;

  return {
    done,
    complete,
    lessonsNeed: CHALLENGE_LESSONS,
    gamesNeed: CHALLENGE_GAMES,
    endsIn: weekEndsIn(),
    recordLesson,
    recordGame,
    claim,
  };
}
