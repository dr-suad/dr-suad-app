import { useState } from 'react';
import { playSuccess, playError } from '../../utils/sounds.js';

export function useQuizGame(questions, storageKey) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const best = Number(localStorage.getItem(storageKey) || 0);

  const answer = (opt, correctVal) => {
    if (selected !== null) return;
    setSelected(opt);
    const ok = opt === correctVal;
    if (ok) { setScore((s) => s + 1); playSuccess(); }
    else { playError(); }
    setTimeout(() => {
      if (idx < questions.length - 1) {
        setIdx((i) => i + 1);
        setSelected(null);
      } else {
        const finalScore = score + (ok ? 1 : 0);
        setDone(true);
        if (finalScore > best) localStorage.setItem(storageKey, String(finalScore));
      }
    }, 750);
  };

  const restart = () => {
    setIdx(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  return { idx, selected, score, done, best, answer, restart, total: questions.length };
}
