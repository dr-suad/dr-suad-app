import { useState } from 'react';
import { motion } from 'framer-motion';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { useQuizGame } from './useQuizGame.js';
import s from './shared.module.css';

const QUESTIONS = [
  { emoji: '🧊', r: 2, c: 3, q: '2 صفوف × 3 أعمدة = كم مكعباً؟', opts: ['4', '5', '6', '7'], a: '6' },
  { emoji: '🧊', r: 3, c: 4, q: '3 صفوف × 4 أعمدة = كم مكعباً؟', opts: ['9', '10', '11', '12'], a: '12' },
  { emoji: '🧊', r: 2, c: 5, q: '2 صفوف × 5 أعمدة = كم مكعباً؟', opts: ['8', '9', '10', '11'], a: '10' },
  { emoji: '🧊', r: 4, c: 2, q: '4 صفوف × 2 أعمدة = كم مكعباً؟', opts: ['6', '7', '8', '9'], a: '8' },
  { emoji: '🧊', r: 5, c: 3, q: '5 صفوف × 3 أعمدة = كم مكعباً؟', opts: ['12', '13', '14', '15'], a: '15' },
];

export default function MultiplyBlocks({ onClose }) {
  const g = useQuizGame(QUESTIONS, 'suad:game:multiplyblocks');
  const q = QUESTIONS[g.idx];

  const renderRow = (cols) => {
    const row = [];
    for (let i = 0; i < cols; i++) {
      row.push(<span key={i}>■</span>);
    }
    return row;
  };

  return (
    <GameShell title="ضرب المكعبات 🧊" value="قيمة: الضرب" onClose={onClose}>
      {g.done ? (
        <div className={s.resultBox}>
          <motion.span className={s.resultEmoji} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            {g.score >= 4 ? '🧊' : '💪'}
          </motion.span>
          <h3 className={s.resultTitle}>{g.score >= 4 ? 'ضرب مكنون! 🧊' : 'تدرب مجدداً! 💪'}</h3>
          <p className={s.resultMsg}>ضربت {g.score} من {g.total} بشكل صحيح</p>
          <div className={s.scoreRow}><span className={s.scorePill}>أفضل نتيجة: {Math.max(g.best, g.score)}</span></div>
          <GlowButton variant="coral" onClick={g.restart}>العب مرة أخرى</GlowButton>
        </div>
      ) : (
        <>
          <div className={s.sceneEmoji}>{q.emoji}</div>
          <p className={s.questionText}>{q.q}</p>
          <div className={s.optionsGrid}>
            {Array.from({ length: q.r }).map((_, rIdx) => (
              <div key={rIdx} className={s.blockRow}>
                {renderRow(q.c)}
              </div>
            ))}
          </div>
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
