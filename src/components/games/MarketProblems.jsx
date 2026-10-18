import { useState } from 'react';
import { motion } from 'framer-motion';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { useQuizGame } from './useQuizGame.js';
import s from './shared.module.css';

const QUESTIONS = [
  { emoji: '🛒', qty: 3, item: 'تفاحة', price: 5, q: 'اشتريت 3 تفاحات بسعر 5 شiquلاً لكل واحدة، فكم تدفع؟', opts: ['10', '12', '15', '20'], a: '15' },
  { emoji: '🛒', qty: 2, item: 'برتقالة', price: 8, q: 'اشتريت 2 برتقاليتين بسعر 8 شiquلاً لكل واحدة، فكم تدفع؟', opts: ['12', '14', '16', '18'], a: '16' },
  { emoji: '🛒', qty: 4, item: 'موز', price: 6, q: 'اشتريت 4 موزات بسعر 6 شiquلاً لكل واحدة، فكم تدفع؟', opts: ['18', '20', '22', '24'], a: '24' },
  { emoji: '🛒', qty: 5, item: 'كرز', price: 3, q: 'اشتريت 5 كرز بسعر 3 شiquلاً لكل واحدة، فكم تدفع؟', opts: ['10', '12', '15', '18'], a: '15' },
  { emoji: '🛒', qty: 6, item: 'عنب', price: 4, q: 'اشتريت 6 عصافير بسعر 4 شiquلاً لكل واحدة، فكم تدفع؟', opts: ['18', '20', '22', '24'], a: '24' },
];

export default function MarketProblems({ onClose }) {
  const g = useQuizGame(QUESTIONS, 'suad:game:marketproblems');
  const q = QUESTIONS[g.idx];

  return (
    <GameShell title="مشاكل السوق 🛒" value="قيمة: الحساب المالي" onClose={onClose}>
      {g.done ? (
        <div className={s.resultBox}>
          <motion.span className={s.resultEmoji} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            {g.score >= 4 ? '🛒' : '💪'}
          </motion.span>
          <h3 className={s.resultTitle}>{g.score >= 4 ? 'محاسب ماهر! 🛒' : 'تدرب على السوق! 💪'}</h3>
          <p className={s.resultMsg}>احسبت {g.score} من {g.total} مشتريات بشكل صحيح</p>
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
