import { motion } from 'framer-motion';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { useQuizGame } from './useQuizGame.js';
import s from './shared.module.css';

const QUESTIONS = [
  { emoji: '🍎', q: 'عند الجد 3 تفاحات، أعطاك واحدة. كم تفاحة بقيت معه؟', opts: ['1', '2', '3', '4'], a: '2' },
  { emoji: '📚', q: 'الجد يقرأ 4 كتب. أضاف 2 كتب أخرى. كم كتاباً أصبح؟', opts: ['5', '6', '7', '8'], a: '6' },
  { emoji: '🌸', q: 'الجد زرع 5 أزهار، منها واحدة ذابلت. كم بقيت؟', opts: ['3', '4', '5', '6'], a: '4' },
  { emoji: '🍬', q: 'الجد أعطاك 6 حلوى، أخذت 1. كم أخذت؟', opts: ['1', '2', '5', '6'], a: '1' },
  { emoji: '👴', q: 'عند الجد 8 عملات، أعطاك 3. كم بقيت معه؟', opts: ['4', '5', '6', '7'], a: '5' },
];

export default function RespectElderly({ onClose }) {
  const g = useQuizGame(QUESTIONS, 'suad:game:elderly');
  const q = QUESTIONS[g.idx];

  return (
    <GameShell title="احترم الكبير 👴" value="قيمة: احترام الكبير" onClose={onClose}>
      {g.done ? (
        <div className={s.resultBox}>
          <motion.span className={s.resultEmoji} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            {g.score >= 4 ? '👴❤️' : '💪'}
          </motion.span>
          <h3 className={s.resultTitle}>{g.score >= 4 ? 'الجد سعيد بك! 👴❤️' : 'واصل، ستتحسن! 💪'}</h3>
          <p className={s.resultMsg}>أجبت {g.score} من {g.total} إجابات صحيحة</p>
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
            {g.selected === null ? `السؤال ${g.idx + 1} من ${g.total}` : q.a === g.selected ? 'صحيح! 👴' : 'الإجابة: ' + q.a}
          </p>
        </>
      )}
    </GameShell>
  );
}
