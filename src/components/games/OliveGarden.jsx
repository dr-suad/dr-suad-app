import { motion } from 'framer-motion';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { useQuizGame } from './useQuizGame.js';
import s from './shared.module.css';

const QUESTIONS = [
  { emoji: '🫒', q: ' زرعت ٣ أشجار زيتون، كل شجرة أعطت ٥ زيتونات. كم زيتونة؟', opts: ['١٠', '١٥', '٢٠', '٢٥'], a: '١٥' },
  { emoji: '🫒', q: 'قطفت ٨ زيتونات، أعطيت ٣ لجارك. كم بقيت؟', opts: ['٤', '٥', '٦', '٧'], a: '٥' },
  { emoji: '🫒', q: 'في البستان ١٢ شجرة، قطفت من ٥ أشجار. كم شجرة بقيت؟', opts: ['٦', '٧', '٨', '٩'], a: '٧' },
  { emoji: '🫒', q: 'Cada شجرة give ٤ زيتونات، لديك ٣ أشجار. المجموع؟', opts: ['٧', '٨', '٩', '١٢'], a: '١٢' },
  { emoji: '🫒', q: 'قطفت ٢٠ زيتونة، بيعت ٧. كم بقيت؟', opts: ['١٢', '١٣', '١٤', '١٥'], a: '١٣' },
];

export default function OliveGarden({ onClose }) {
  const g = useQuizGame(QUESTIONS, 'suad:game:olive');
  const q = QUESTIONS[g.idx];

  return (
    <GameShell title="بستان الزيتون 🫒" value="قيمة: حب الأرض" onClose={onClose}>
      {g.done ? (
        <div className={s.resultBox}>
          <motion.span className={s.resultEmoji} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            {g.score >= 4 ? '🫒' : '🌿'}
          </motion.span>
          <h3 className={s.resultTitle}>{g.score >= 4 ? 'بستانك مزدهر! 🫒' : 'واصل العناية بالأرض! 🌿'}</h3>
          <p className={s.resultMsg}>جمعت {g.score} من {g.total} زيتونات بشكل صحيح</p>
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
            {g.selected === null ? `السؤال ${g.idx + 1} من ${g.total}` : q.a === g.selected ? 'صحيح! 🫒' : 'الإجابة: ' + q.a}
          </p>
        </>
      )}
    </GameShell>
  );
}
