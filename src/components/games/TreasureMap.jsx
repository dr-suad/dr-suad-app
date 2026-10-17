import { motion } from 'framer-motion';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { useQuizGame } from './useQuizGame.js';
import s from './shared.module.css';

const QUESTIONS = [
  { emoji: '🗺️', q: 'القدس + غزة = كم مدينة في الخريطة؟', opts: ['١', '٢', '٣', '٤'], a: '٢' },
  { emoji: '🏰', q: 'حيفا + يافا = كم مدينة ساحلية؟', opts: ['١', '٢', '٣', '٤'], a: '٢' },
  { emoji: '🗺️', q: 'إذا زرنا ٣ مدن من ٤، كم تبقى؟', opts: ['١', '٢', '٣', '٤'], a: '١' },
  { emoji: '🏰', q: 'القدس لها ٤ أبواب، زرنا ٢. كم باب بقي؟', opts: ['١', '٢', '٣', '٤'], a: '٢' },
  { emoji: '🗺️', q: 'مجموع المدن الفلسطينية في الخريطة: ٤', opts: ['٣', '٤', '٥', '٦'], a: '٤' },
];

export default function TreasureMap({ onClose }) {
  const g = useQuizGame(QUESTIONS, 'suad:game:treasure');
  const q = QUESTIONS[g.idx];

  return (
    <GameShell title="خرائط الكنوز الفلسطينية 🗺️" value="قيمة: الانتماء الوطني" onClose={onClose}>
      {g.done ? (
        <div className={s.resultBox}>
          <motion.span className={s.resultEmoji} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            {g.score >= 4 ? '🗺️' : '💪'}
          </motion.span>
          <h3 className={s.resultTitle}>{g.score >= 4 ? 'اكتشفت الكنز الفلسطيني! 🗺️' : 'واصل الاستكشاف! 💪'}</h3>
          <p className={s.resultMsg}>حللت {g.score} من {g.total} مسارًا صحيحًا</p>
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
            {g.selected === null ? `السؤال ${g.idx + 1} من ${g.total}` : q.a === g.selected ? 'صحيح! 🗺️' : 'الإجابة: ' + q.a}
          </p>
        </>
      )}
    </GameShell>
  );
}
