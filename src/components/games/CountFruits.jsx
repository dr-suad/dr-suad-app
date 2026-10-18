import { useState } from 'react';
import { motion } from 'framer-motion';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { useQuizGame } from './useQuizGame.js';
import s from './shared.module.css';

const FRUITS = ['🍎', '🍌', '🍊', '🍇', '🍓', '🍉', '🍒', '🍍', '🥝', '🥥'];

const COUNT_QUESTIONS = [
  { emoji: '🍎', count: 3, text: 'كم عدد التفاح؟', options: ['1','2','3','4'], a: '3' },
  { emoji: '🍌', count: 5, text: 'كم عدد الموز؟', options: ['3','4','5','6'], a: '5' },
  { emoji: '🍊', count: 7, text: 'كم عدد البرتقال؟', options: ['5','6','7','8'], a: '7' },
  { emoji: '🍇', count: 9, text: 'كم عدد العنب؟', options: ['7','8','9','10'], a: '9' },
  { emoji: '🍓', count: 4, text: 'كم عدد الفراولة؟', options: ['3','4','5','6'], a: '4' },
  { emoji: '🍉', count: 6, text: 'كم عدد البطيخ؟', options: ['4','5','6','7'], a: '6' },
  { emoji: '🍒', count: 2, text: 'كم عدد الكرز؟', options: ['1','2','3','4'], a: '2' },
  { emoji: '🥥', count: 8, text: 'كم عدد الأناناس؟', options: ['6','7','8','9'], a: '8' },
  { emoji: '🥝', count: 1, text: 'كم عدد الكيووي؟', options: ['0','1','2','3'], a: '1' },
  { emoji: '🌴', count: 10, text: 'كم عدد جوز الهند؟', options: ['8','9','10','11'], a: '10' },
];

export default function CountFruits({ onClose }) {
  const g = useQuizGame(COUNT_QUESTIONS, 'suad:game:countfruits');
  const q = COUNT_QUESTIONS[g.idx];

  return (
    <GameShell title="عد الفواكه 🍎" value="قيمة: العد والمفاهيم العددية" onClose={onClose}>
      {g.done ? (
        <div className={s.resultBox}>
          <motion.span className={s.resultEmoji} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            {g.score >= 4 ? '🍎' : '💪'}
          </motion.span>
          <h3 className={s.resultTitle}>{g.score >= 4 ? 'عالم الأعداد! 🍎' : 'انظر حولك وعد! 💪'}</h3>
          <p className={s.resultMsg}>عددت {g.score} من {g.total} بشكل صحيح</p>
          <div className={s.scoreRow}><span className={s.scorePill}>أفضل نتيجة: {Math.max(g.best, g.score)}</span></div>
          <GlowButton variant="coral" onClick={g.restart}>العب مرة أخرى</GlowButton>
        </div>
      ) : (
        <>
          <div className={s.sceneEmoji}>{q.emoji.repeat(q.count)}</div>
          <p className={s.questionText}>{q.text}</p>
          <div className={s.optionsGrid}>
            {q.options.map((opt) => (
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
