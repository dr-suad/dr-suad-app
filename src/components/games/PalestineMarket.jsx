import { motion } from 'framer-motion';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { useQuizGame } from './useQuizGame.js';
import s from './shared.module.css';

const QUESTIONS = [
  { emoji: '🫒', q: 'زيتون ٣ + خبز ٢ = ؟', opts: ['٤', '٥', '٦', '٧'], a: '٥' },
  { emoji: '🥖', q: 'خبز ٥ − ٢ = ؟', opts: ['٢', '٣', '٤', '٥'], a: '٣' },
  { emoji: '🌿', q: 'زعتر ٢ × ٣ = ؟', opts: ['٥', '٦', '٧', '٨'], a: '٦' },
  { emoji: '🫓', q: 'عجينة ٨ ÷ ٢ = ؟', opts: ['٣', '٤', '٥', '٦'], a: '٤' },
  { emoji: '🍯', q: 'عسل ٦ + زيت ٤ = ؟', opts: ['٩', '١٠', '١١', '١٢'], a: '١٠' },
];

export default function PalestineMarket({ onClose }) {
  const g = useQuizGame(QUESTIONS, 'suad:game:market');
  const q = QUESTIONS[g.idx];

  return (
    <GameShell title="سوق فلسطين 🛒" value="قيمة: الوطنية" onClose={onClose}>
      {g.done ? (
        <div className={s.resultBox}>
          <motion.span className={s.resultEmoji} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            {g.score >= 4 ? '🛒' : '💪'}
          </motion.span>
          <h3 className={s.resultTitle}>{g.score >= 4 ? 'أنت تاجر ذكي! 🛒' : 'واصل، ستتحسن! 💪'}</h3>
          <p className={s.resultMsg}>حسبت {g.score} من {g.total} حسابات بشكل صحيح</p>
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
            {g.selected === null ? `السؤال ${g.idx + 1} من ${g.total}` : q.a === g.selected ? 'صحيح! 🛒' : 'الإجابة: ' + q.a}
          </p>
        </>
      )}
    </GameShell>
  );
}
