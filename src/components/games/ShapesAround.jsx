import { useState } from 'react';
import { motion } from 'framer-motion';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { useQuizGame } from './useQuizGame.js';
import s from './shared.module.css';

const SHAPES = [
  { emoji: '🔺', name: 'مثلث' },
  { emoji: '🟦', name: 'مربع' },
  { emoji: '🔵', name: 'دائرة' },
  { emoji: '⭐', name: 'نجمة' },
  { emoji: '🟨', name: 'مستطيل' },
  { emoji: '💠', name: 'معين' },
];

const QUESTIONS = [
  { emoji: '🔺', opts: ['1','2','3','4'], a: 'مثلث' },
  { emoji: '🟦', opts: ['2','5','6','7'], a: 'مربع' },
  { emoji: '🔵', opts: ['3','5','6','7'], a: 'دائرة' },
  { emoji: '⭐', opts: ['1','5','6','8'], a: 'نجمة' },
  { emoji: '🟨', opts: ['4','5','7','8'], a: 'مستطيل' },
  { emoji: '💠', opts: ['2','5','6','9'], a: 'معين' },
];

export default function ShapesAround({ onClose }) {
  const g = useQuizGame(QUESTIONS, 'suad:game:shapes');
  const q = QUESTIONS[g.idx];

  return (
    <GameShell title="الأشكال حولنا 🔺" value="قيمة: المعرفة الهندسية" onClose={onClose}>
      {g.done ? (
        <div className={s.resultBox}>
          <motion.span className={s.resultEmoji} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            {g.score >= 4 ? '🔺' : '💪'}
          </motion.span>
          <h3 className={s.resultTitle}>{g.score >= 4 ? 'مبدع في الأشكال! 🔺' : 'انظر حولك وشاهد الأشكال! 💪'}</h3>
          <p className={s.resultMsg}>تعرفت على {g.score} من {g.total} شكلاً</p>
          <div className={s.scoreRow}><span className={s.scorePill}>أفضل نتيجة: {Math.max(g.best, g.score)}</span></div>
          <GlowButton variant="coral" onClick={g.restart}>العب مرة أخرى</GlowButton>
        </div>
      ) : (
        <>
          <div className={s.sceneEmoji}>{q.emoji}</div>
          <p className={s.questionText}>ما اسم هذا الشكل؟</p>
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
