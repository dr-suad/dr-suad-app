import { motion } from 'framer-motion';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { useQuizGame } from './useQuizGame.js';
import s from './shared.module.css';

const QUESTIONS = [
  { emoji: '🗑️', item: 4, hint: 'العدد 4', bin: 'زوجي', bins: ['زوجي', 'فردي'] },
  { emoji: '🗑️', item: 7, hint: 'العدد 7', bin: 'فردي', bins: ['زوجي', 'فردي'] },
  { emoji: '🗑️', item: 10, hint: 'العدد 10', bin: 'زوجي', bins: ['زوجي', 'فردي'] },
  { emoji: '🗑️', item: 3, hint: 'العدد 3', bin: 'فردي', bins: ['زوجي', 'فردي'] },
  { emoji: '🗑️', item: 8, hint: 'العدد 8', bin: 'زوجي', bins: ['زوجي', 'فردي'] },
];

export default function CleanNeighborhood({ onClose }) {
  const g = useQuizGame(QUESTIONS, 'suad:game:clean');
  const q = QUESTIONS[g.idx];

  return (
    <GameShell title="نظّف حيّك 🗑️" value="قيمة: نظافة المكان" onClose={onClose}>
      {g.done ? (
        <div className={s.resultBox}>
          <motion.span className={s.resultEmoji} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            {g.score >= 4 ? '🏆' : '💪'}
          </motion.span>
          <h3 className={s.resultTitle}>{g.score >= 4 ? 'أنت بطل النظافة! 🏆' : 'واصل، ستتحسن! 💪'}</h3>
          <p className={s.resultMsg}>فرزت {g.score} من {g.total} نفايات بشكل صحيح</p>
          <div className={s.scoreRow}>
            <span className={s.scorePill}>أفضل نتيجة: {Math.max(g.best, g.score)}</span>
          </div>
          <GlowButton variant="coral" onClick={g.restart}>العب مرة أخرى</GlowButton>
        </div>
      ) : (
        <>
          <div className={s.sceneEmoji}>🏠 {q.emoji}</div>
          <p className={s.questionText}>{q.hint} — في أي سلة نضعه؟</p>
          <div className={s.optionsGrid}>
            {q.bins.map((bin) => (
              <motion.button
                key={bin}
                className={`${s.optBtn} ${g.selected === bin ? (bin === q.bin ? s.correct : s.wrong) : ''}`}
                onClick={() => g.answer(bin, q.bin)}
                disabled={g.selected !== null}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                سلة {bin}
              </motion.button>
            ))}
          </div>
          <p className={`${s.feedback} ${g.selected === null ? '' : q.bin === g.selected ? s.feedbackOk : s.feedbackNo}`}>
            {g.selected === null ? `السؤال ${g.idx + 1} من ${g.total}` : q.bin === g.selected ? 'صحيح! 🌟' : 'الإجابة: ' + q.bin}
          </p>
        </>
      )}
    </GameShell>
  );
}
