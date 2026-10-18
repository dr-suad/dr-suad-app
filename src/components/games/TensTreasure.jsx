import { useState } from 'react';
import { motion } from 'framer-motion';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { useQuizGame } from './useQuizGame.js';
import s from './shared.module.css';

const QUESTIONS = [
  { emoji: '💰', q: 'في الرقم 47، كم عدد العشرات؟', opts: ['3', '4', '5', '6'], a: '4' },
  { emoji: '💰', q: 'في الرقم 23، كم عدد الآحاد؟', opts: ['2', '3', '4', '5'], a: '3' },
  { emoji: '💰', q: 'في الرقم 61، كم عدد العشرات؟', opts: ['6', '1', '7', '5'], a: '6' },
  { emoji: '💰', q: 'في الرقم 38، كم عدد الآحاد؟', opts: ['3', '8', '4', '2'], a: '8' },
  { emoji: '💰', q: 'في الرقم 56، كم عدد العشرات؟', opts: ['5', '6', '7', '4'], a: '5' },
];

export default function TensTreasure({ onClose }) {
  const g = useQuizGame(QUESTIONS, 'suad:game:treasure');
  const q = QUESTIONS[g.idx];

  return (
    <GameShell title="كنز العشرات 💰" value="قيمة: القيمة المنزلية" onClose={onClose}>
      {g.done ? (
        <div className={s.resultBox}>
          <motion.span className={s.resultEmoji} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            {g.score >= 4 ? '💰' : '💪'}
          </motion.span>
          <h3 className={s.resultTitle}>{g.score >= 4 ? 'مستكشف العدد! 💰' : 'استكشف الأعداد! 💪'}</h3>
          <p className={s.resultMsg}>وجدت {g.score} من {g.total} treasure</p>
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
