import { useState } from 'react';
import { motion } from 'framer-motion';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { useQuizGame } from './useQuizGame.js';
import s from './shared.module.css';

const QUESTIONS = [
  { emoji: '3', q: 'أي عدد أكبر: 3 أم 7؟', opts: ['3', '7'], a: '7' },
  { emoji: '5', q: 'أي عدد أصغر: 5 أم 2؟', opts: ['5', '2'], a: '2' },
  { emoji: '8', q: 'أي عدد أكبر: 8 أم 4؟', opts: ['8', '4'], a: '8' },
  { emoji: '1', q: 'أي عدد أصغر: 1 أم 9؟', opts: ['1', '9'], a: '1' },
  { emoji: '6', q: 'أي عدد أكبر: 6 أم 3؟', opts: ['6', '3'], a: '6' },
  { emoji: '4', q: 'أي عدد أصغر: 4 أم 8؟', opts: ['4', '8'], a: '4' },
  { emoji: '7', q: 'أي عدد أكبر: 7 أم 2؟', opts: ['7', '2'], a: '7' },
  { emoji: '1', q: 'أي عدد أصغر: 1 أم 5؟', opts: ['1', '5'], a: '1' },
];

export default function BiggerSmaller({ onClose }) {
  const g = useQuizGame(QUESTIONS, 'suad:game:biggersmaller');
  const q = QUESTIONS[g.idx];

  return (
    <GameShell title="من الأكبر؟ ⚖️" value="قيمة: المقارنة" onClose={onClose}>
      {g.done ? (
        <div className={s.resultBox}>
          <motion.span className={s.resultEmoji} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            {g.score >= 4 ? '⚖️' : '💪'}
          </motion.span>
          <h3 className={s.resultTitle}>{g.score >= 4 ? 'مقارن ماهر! ⚖️' : 'لا تخاف، جرّب مرة أخرى! 💪'}</h3>
          <p className={s.resultMsg}>أجبت على {g.score} من {g.total} بشكل صحيح</p>
          <div className={s.scoreRow}><span className={s.scorePill}>أفضل نتيجة: {Math.max(g.best, g.score)}</span></div>
          <GlowButton variant="coral" onClick={g.restart}>العب مرة أخرى</GlowButton>
        </div>
      ) : (
        <>
          <div className={s.sceneEmoji}>{q.emoji}</div>
          <p className={s.questionText}>{q.q}</p>
          <div className={s.optionsGrid}>
            {q.opts.map((opt) => (
              <motion.button
                key={opt}
                className={`${s.optBtn} ${g.selected === opt ? (opt === q.a ? s.correct : s.wrong) : ''}`}
                onClick={() => g.answer(opt, q.a)}
                disabled={g.selected !== null}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {opt}
              </motion.button>
            ))}
          </div>
          <p className={`${s.feedback} ${g.selected === null ? '' : q.a === g.selected ? s.feedbackOk : s.feedbackNo}`}>
            {g.selected === null ? `السؤال ${g.idx + 1} من ${g.total}` : q.a === g.selected ? 'صحيح! 🌟' : 'الإجابة: ' + q.a}
          </p>
        </>
      )}
    </GameShell>
  );
}
