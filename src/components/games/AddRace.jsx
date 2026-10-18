import { useState } from 'react';
import { motion } from 'framer-motion';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { playSuccess, playError } from '../../utils/sounds.js';
import s from './shared.module.css';

const QUESTIONS = [
  { a: 12, b: 3, answer: 15, opts: ['10','15','18','20'], a: '15' },
  { a: 7, b: 8, answer: 15, opts: ['10','15','18','20'], a: '15' },
  { a: 14, b: 6, answer: 20, opts: ['10','15','18','20'], a: '20' },
  { a: 9, b: 9, answer: 18, opts: ['10','15','18','20'], a: '18' },
  { a: 11, b: 7, answer: 18, opts: ['10','15','18','20'], a: '18' },
  { a: 13, b: 4, answer: 17, opts: ['10','15','17','20'], a: '17' },
  { a: 8, b: 6, answer: 14, opts: ['10','14','15','18'], a: '14' },
  { a: 11, b: 11, answer: 22, opts: ['15','18','20','22'], a: '22' },
  { a: 15, b: 5, answer: 20, opts: ['10','15','18','20'], a: '20' },
  { a: 9, b: 7, answer: 16, opts: ['10','15','16','18'], a: '16' },
];

export default function AddRace({ onClose }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [shown, setShown] = useState(false);
  const [done, setDone] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const best = Number(localStorage.getItem('suad:game:addrace') || 0);

  const q = QUESTIONS[idx];

  const answer = (opt) => {
    if (selected !== null || done) return;
    setSelected(opt);
    setShown(true);
    const ok = opt === q.answer;
    if (ok) { setScore((s) => s + 1); playSuccess(); } else { playError(); }
  };

  const next = () => {
    if (idx < QUESTIONS.length - 1) {
      setIdx((i) => i + 1);
      setSelected(null);
      setShown(false);
    } else {
      setDone(true);
    }
  };

  const restart = () => {
    setIdx(0); setSelected(null); setScore(0); setDone(false); setShown(false);
  };

  if (done) {
    const final = score;
    if (score > best) { try { localStorage.setItem('suad:game:addrace', String(score)); } catch {} }
    return (
      <GameShell title="سباق الجمع 🏃" value="قيمة: الجمع السريع" onClose={onClose}>
        <div className={s.resultBox}>
          <motion.span className={s.resultEmoji} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            {score >= 5 ? '🏃' : '💪'}
          </motion.span>
          <h3 className={s.resultTitle}>{score >= 5 ? 'عداء سريع! 🏃' : 'واصل الجري! 💪'}</h3>
          <p className={s.resultMsg}>أجبت على {score} من {QUESTIONS.length} بشكل صحيح</p>
          <div className={s.scoreRow}><span className={s.scorePill}>أفضل نتيجة: {Math.max(best, score)}</span></div>
          <GlowButton variant="coral" onClick={restart}>العب مرة أخرى</GlowButton>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell title="سباق الجمع 🏃" value="قيمة: السرعة والتركيز" onClose={onClose}>
      <div className="questionText">{q.a} + ${q.b} = ؟</div>
      <div className={s.optionsGrid}>
        {q.opts.map((opt) => (
          <motion.button
            key={opt}
            className={`${s.optBtn} ${selected === opt ? (opt === q.answer ? s.correct : s.wrong) : ''}`}
            onClick={() => answer(opt)}
            disabled={selected !== null}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {opt}
          </motion.button>
        ))}
      </div>
      {showAnswer && (
        <p className={`${s.feedback} ${selected === q.answer ? s.feedbackOk : s.feedbackNo}`}>
          {selected === q.answer ? 'صحيح! 🌟' : 'الإجابة: ' + q.answer}
        </p>
      )}
      {showAnswer && !done && (
        <GlowButton variant="coral" onClick={next} style={{ marginTop: '12px' }}>{idx === QUESTIONS.length - 1 ? 'إنهاء' : 'السؤال التالي'}</GlowButton>
      )}
    </GameShell>
  );
}
