import { motion } from 'framer-motion';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { useQuizGame } from './useQuizGame.js';
import s from './shared.module.css';

const QUESTIONS = [
  { emoji: '🍮', q: 'طبق الكنافة ٨ قطع، قسمت على ٤ أشخاص. كم لكل شخص؟', opts: ['١', '٢', '٣', '٤'], a: '٢' },
  { emoji: '🍮', q: '١٢ قطعة كنافة، قسمت على ٣ أفراد. كم لكل فرد؟', opts: ['٣', '٤', '٥', '٦'], a: '٤' },
  { emoji: '🍮', q: '١٥ قطعة، قسمت على ٥ أشخاص. كم لكل شخص؟', opts: ['٢', '٣', '٤', '٥'], a: '٣' },
  { emoji: '🍮', q: '٢٠ قطعة، قسمت على ٤ أفراد. كم لكل فرد؟', opts: ['٤', '٥', '٦', '٧'], a: '٥' },
  { emoji: '🍮', q: '١٨ قطعة، قسمت على ٦ أشخاص. كم لكل شخص؟', opts: ['٢', '٣', '٤', '٦'], a: '٣' },
];

export default function KunafaParty({ onClose }) {
  const g = useQuizGame(QUESTIONS, 'suad:game:kunafa');
  const q = QUESTIONS[g.idx];

  return (
    <GameShell title="طبق الكنافة 🍮" value="قيمة: الكرم والضيافة" onClose={onClose}>
      {g.done ? (
        <div className={s.resultBox}>
          <motion.span className={s.resultEmoji} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            {g.score >= 4 ? '🍮' : '💪'}
          </motion.span>
          <h3 className={s.resultTitle}>{g.score >= 4 ? 'أنت كريم ومضياف! 🍮' : 'واصل المشاركة! 💪'}</h3>
          <p className={s.resultMsg}>قسمت {g.score} من {g.total} أطباق بشكل عادل</p>
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
            {g.selected === null ? `السؤال ${g.idx + 1} من ${g.total}` : q.a === g.selected ? 'صحيح! 🍮' : 'الإجابة: ' + q.a}
          </p>
        </>
      )}
    </GameShell>
  );
}
