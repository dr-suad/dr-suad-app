import { motion } from 'framer-motion';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { useQuizGame } from './useQuizGame.js';
import s from './shared.module.css';

const ORDER = ['أسود', 'أبيض', 'أخضر', 'أحمر'];

const QUESTIONS = [
  { emoji: '🇵🇸', q: 'ما أول لون في العلم الفلسطيني؟', opts: [...ORDER].reverse(), a: 'أسود' },
  { emoji: '🇵🇸', q: 'ما اللون الثاني في العلم؟', opts: [...ORDER].reverse(), a: 'أبيض' },
  { emoji: '🇵🇸', q: 'ما اللون الثالث في العلم؟', opts: [...ORDER].reverse(), a: 'أخضر' },
  { emoji: '🇵🇸', q: 'ما آخر لون في العلم؟', opts: [...ORDER].reverse(), a: 'أحمر' },
  { emoji: '🏳️', q: 'كم لوناً في العلم الفلسطيني؟', opts: ['3', '4', '5', '6'], a: '4' },
];

export default function PalestineColors({ onClose }) {
  const g = useQuizGame(QUESTIONS, 'suad:game:colors');
  const q = QUESTIONS[g.idx];

  return (
    <GameShell title="علّم الألوان 🇵🇸" value="قيمة: الانتماء الوطني" onClose={onClose}>
      {g.done ? (
        <div className={s.resultBox}>
          <motion.span className={s.resultEmoji} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            {g.score >= 4 ? '🇵🇸' : '💪'}
          </motion.span>
          <h3 className={s.resultTitle}>{g.score >= 4 ? 'أنت تعرف علم بلدك! 🇵🇸' : 'واصل التعلم! 💪'}</h3>
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
            {g.selected === null ? `السؤال ${g.idx + 1} من ${g.total}` : q.a === g.selected ? 'صحيح! 🇵🇸' : 'الإجابة: ' + q.a}
          </p>
        </>
      )}
    </GameShell>
  );
}
