import { useState } from 'react';
import { motion } from 'framer-motion';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { useQuizGame } from './useQuizGame.js';
import s from './shared.module.css';

const QUESTIONS = [
  { emoji: '📏', item: 'ممحاة', length: 5, q: 'كم طول الممحاة؟', opts: ['3 سم', '5 سم', '7 سم', '9 سم'], a: '5 سم' },
  { emoji: '📏', item: 'قلم', length: 12, q: 'كم طول القلم؟', opts: ['9 سم', '10 سم', '12 سم', '15 سم'], a: '12 سم' },
  { emoji: '📏', item: 'دفتر', length: 20, q: 'كم طول الدفتر؟', opts: ['15 سم', '18 سم', '20 سم', '24 سم'], a: '20 سم' },
  { emoji: '📏', item: 'ممحاة', length: 8, q: 'كم طول الممحاة؟', opts: ['5 سم', '6 سم', '8 سم', '10 سم'], a: '8 سم' },
  { emoji: '📏', item: 'مقص', length: 15, q: 'كم طول المقص؟', opts: ['10 سم', '12 سم', '14 سم', '15 سم'], a: '15 سم' },
];

export default function MeasureRuler({ onClose }) {
  const g = useQuizGame(QUESTIONS, 'suad:game:measureruler');
  const q = QUESTIONS[g.idx];

  return (
    <GameShell title="مسطرة القياس 📏" value="قيمة: القياس" onClose={onClose}>
      {g.done ? (
        <div className={s.resultBox}>
          <motion.span className={s.resultEmoji} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            {g.score >= 4 ? '📏' : '💪'}
          </motion.span>
          <h3 className={s.resultTitle}>{g.score >= 4 ? 'قائم بالقياس! 📏' : 'تدرب على القياس! 💪'}</h3>
          <p className={s.resultMsg}>قِس {g.score} من {g.total} أطوال بشكل صحيح</p>
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
