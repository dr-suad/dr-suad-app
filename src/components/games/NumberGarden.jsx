import { motion } from 'framer-motion';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { useQuizGame } from './useQuizGame.js';
import s from './shared.module.css';

const QUESTIONS = [
  { emoji: '🌻', q: '٣ + ٢ = ؟ ازرع هذا العدد من الزهور', opts: ['٤', '٥', '٦', '٧'], a: '٥' },
  { emoji: '🌷', q: '٦ − ٢ = ؟ ازرع هذا العدد', opts: ['٣', '٤', '٥', '٦'], a: '٤' },
  { emoji: '🌼', q: '٢ × ٣ = ؟ ازرع هذا العدد', opts: ['٥', '٦', '٧', '٨'], a: '٦' },
  { emoji: '🌹', q: '١٠ − ٤ = ؟ ازرع هذا العدد', opts: ['٥', '٦', '٧', '٨'], a: '٦' },
  { emoji: '🌻', q: '٤ + ٤ = ؟ ازرع هذا العدد', opts: ['٧', '٨', '٩', '١٠'], a: '٨' },
];

export default function NumberGarden({ onClose }) {
  const g = useQuizGame(QUESTIONS, 'suad:game:garden');
  const q = QUESTIONS[g.idx];

  return (
    <GameShell title="حديقة الأرقام 🌻" value="قيمة: النظافة والبيئة" onClose={onClose}>
      {g.done ? (
        <div className={s.resultBox}>
          <motion.span className={s.resultEmoji} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            {g.score >= 4 ? '🌻' : '🌱'}
          </motion.span>
          <h3 className={s.resultTitle}>{g.score >= 4 ? 'حديقتك أجمل حديقة! 🌻' : 'واصل، ستتحسن! 🌱'}</h3>
          <p className={s.resultMsg}>زرعت {g.score} من {g.total} زهور بشكل صحيح</p>
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
                {opt} زهور 🌸
              </motion.button>
            ))}
          </div>
          <p className={`${s.feedback} ${g.selected === null ? '' : q.a === g.selected ? s.feedbackOk : s.feedbackNo}`}>
            {g.selected === null ? `السؤال ${g.idx + 1} من ${g.total}` : q.a === g.selected ? 'صحيح! 🌻' : 'الإجابة: ' + q.a}
          </p>
        </>
      )}
    </GameShell>
  );
}
