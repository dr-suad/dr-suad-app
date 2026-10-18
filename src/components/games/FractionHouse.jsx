import { useState } from 'react';
import { motion } from 'framer-motion';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { useQuizGame } from './useQuizGame.js';
import s from './shared.module.css';

const QUESTIONS = [
  { emoji: '🏠', total: 2, shaded: 1, q: 'ما الكسر المظلل؟', opts: ['1/2', '1/3', '1/4', '1/5'], a: '1/2' },
  { emoji: '🏠', total: 4, shaded: 1, q: 'ما الكسر المظلل؟', opts: ['1/4', '2/4', '1/2', '3/4'], a: '1/4' },
  { emoji: '🏠', total: 4, shaded: 3, q: 'ما الكسر المظلل؟', opts: ['1/4', '2/4', '3/4', '4/4'], a: '3/4' },
  { emoji: '🏠', total: 3, shaded: 2, q: 'ما الكسر المظلل؟', opts: ['1/3', '2/3', '2/4', '3/3'], a: '2/3' },
  { emoji: '🏠', total: 8, shaded: 3, q: 'ما الكسر المظلل؟', opts: ['3/8', '2/8', '4/8', '5/8'], a: '3/8' },
];

export default function FractionHouse({ onClose }) {
  const g = useQuizGame(QUESTIONS, 'suad:game:fractionhouse');
  const q = QUESTIONS[g.idx];

  return (
    <GameShell title="بيت الكسور 🏠" value="قيمة: الكسور" onClose={onClose}>
      {g.done ? (
        <div className={s.resultBox}>
          <motion.span className={s.resultEmoji} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            {g.score >= 4 ? '🏠' : '💪'}
          </motion.span>
          <h3 className={s.resultTitle}>{g.score >= 4 ? 'كاتب كسور موهوب! 🏠' : 'تدرب مجدداً! 💪'}</h3>
          <p className={s.resultMsg}>وازع {g.score} من {g.total} كسر بشكل صحيح</p>
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
