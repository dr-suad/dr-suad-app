import { useState } from 'react';
import { motion } from 'framer-motion';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { useQuizGame } from './useQuizGame.js';
import s from './shared.module.css';

function makeQ() {
  const nums = [1,2,3,4,5,6,7,8,9];
  const picked = [];
  for (let i = 0; i < 4; i++) {
    const idx = Math.floor(Math.random() * nums.length);
    picked.push(nums[idx]);
    nums.splice(idx, 1);
  }
  const sorted = [...picked].sort((a, b) => a - b);
  return {
    nums: picked,
    opts: [picked.join(','), sorted.join(',')],
    a: sorted.join(','),
  };
}

const QUESTIONS = Array.from({ length: 10 }, () => makeQ());

export default function OrderNumbers({ onClose }) {
  const g = useQuizGame(QUESTIONS, 'suad:game:ordernums');
  const q = QUESTIONS[g.idx];

  return (
    <GameShell title="رتب الأرقام 🔢" value="قيمة: التفكير المنطقي" onClose={onClose}>
      {g.done ? (
        <div className={s.resultBox}>
          <motion.span className={s.resultEmoji} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            {g.score >= 4 ? '🔢' : '💪'}
          </motion.span>
          <h3 className={s.resultTitle}>{g.score >= 4 ? 'متمكن من الترتيب! 🔢' : 'لا تخاف، جرّب مرة أخرى! 💪'}</h3>
          <p className={s.resultMsg}>رتبت {g.score} من {g.total} بشكل صحيح</p>
          <div className={s.scoreRow}><span className={s.scorePill}>أفضل نتيجة: {Math.max(g.best, g.score)}</span></div>
          <GlowButton variant="coral" onClick={g.restart}>العب مرة أخرى</GlowButton>
        </div>
      ) : (
        <>
          <div className={s.sceneEmoji}>🔢</div>
          <p className={s.questionText}>رتب الأرقام من الأصغر للأكبر:</p>
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
