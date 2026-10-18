import { useState } from 'react';
import { motion } from 'framer-motion';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { useQuizGame } from './useQuizGame.js';
import s from './shared.module.css';

const QUESTIONS = [
  { emoji: '🍬', total: 12, kids: 3, q: 'توزيع 12 حلوى على 3 أطفال، فكم حلوى لكل طفل؟', opts: ['3', '4', '5', '6'], a: '4' },
  { emoji: '🍬', total: 15, kids: 5, q: 'توزيع 15 حلوى على 5 أطفال، فكم حلوى لكل طفل؟', opts: ['2', '3', '4', '5'], a: '3' },
  { emoji: '🍬', total: 20, kids: 4, q: 'توزيع 20 حلوى على 4 أطفال، فكم حلوى لكل طفل؟', opts: ['4', '5', '6', '8'], a: '5' },
  { emoji: '🍬', total: 9, kids: 3, q: 'توزيع 9 حلوى على 3 أطفال، فكم حلوى لكل طفل؟', opts: ['1', '2', '3', '4'], a: '3' },
  { emoji: '🍬', total: 10, kids: 2, q: 'توزيع 10 حلوى على 2 أطفال، فكم حلوى لكل طفل؟', opts: ['4', '5', '6', '8'], a: '5' },
];

export default function CandyShare({ onClose }) {
  const g = useQuizGame(QUESTIONS, 'suad:game:candyshare');
  const q = QUESTIONS[g.idx];

  return (
    <GameShell title="توزيع الحلوى 🍬" value="قيمة: التقدير والعد" onClose={onClose}>
      {g.done ? (
        <div className={s.resultBox}>
          <motion.span className={s.resultEmoji} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            {g.score >= 4 ? '🍬' : '💪'}
          </motion.span>
          <h3 className={s.resultTitle}>{g.score >= 4 ? 'موزع عادل! 🍬' : 'تعلم مع الحلوى! 💪'}</h3>
          <p className={s.resultMsg}>وزعت {g.score} من {g.total} كيفيات بشكل عادل</p>
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
