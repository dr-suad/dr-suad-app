import { useState } from 'react';
import { motion } from 'framer-motion';
import GlowButton from './GlowButton.jsx';
import styles from './RecoveryPath.module.css';
import { playSuccess, playError } from '../utils/sounds.js';

const QUESTIONS = {
  1: [
    { q: 'كم هو ٢ + ١؟', opts: ['٢', '٣', '٤', '٥'], a: '٣' },
    { q: 'كم هو ٥ − ٢؟', opts: ['٢', '٣', '٤', '٦'], a: '٣' },
    { q: 'أي عدد أكبر: ٤ أم ٧؟', opts: ['٤', '٧', 'متساويان', 'لا شيء'], a: '٧' },
    { q: 'كم تفاحة إذا أخذت واحدة من ٣؟', opts: ['١', '٢', '٣', '٤'], a: '٢' },
    { q: 'كم هو ١ + ١ + ١؟', opts: ['١', '٢', '٣', '٤'], a: '٣' },
  ],
  2: [
    { q: 'كم هو ٦ + ٣؟', opts: ['٨', '٩', '١٠', '١١'], a: '٩' },
    { q: 'كم هو ١٠ − ٤؟', opts: ['٥', '٦', '٧', '٨'], a: '٦' },
    { q: 'كم هو ٢ × ٣؟', opts: ['٥', '٦', '٧', '٨'], a: '٦' },
    { q: 'كم هو ١٥ − ٧؟', opts: ['٧', '٨', '٩', '١٠'], a: '٨' },
    { q: 'كم هو ٤ + ٤ + ٤؟', opts: ['٨', '١٠', '١٢', '١٤'], a: '١٢' },
  ],
  3: [
    { q: 'كم هو ١٢ ÷ ٣؟', opts: ['٣', '٤', '٥', '٦'], a: '٤' },
    { q: 'كم هو ٧ × ٣؟', opts: ['١٨', '٢١', '٢٤', '٢٨'], a: '٢١' },
    { q: 'كم هو ٢٥ − ١٣؟', opts: ['١١', '١٢', '١٣', '١٤'], a: '١٢' },
    { q: 'كم هو نصف ١٨؟', opts: ['٦', '٨', '٩', '١٢'], a: '٩' },
    { q: 'كم هو ٦ × ٤؟', opts: ['٢٠', '٢٤', '٢٨', '٣٠'], a: '٢٤' },
  ],
  4: [
    { q: 'محيط مربع طول ضلعه ٣ سم؟', opts: ['٦ سم', '٩ سم', '١٢ سم', '١٦ سم'], a: '١٢ سم' },
    { q: 'كم هو ١٥ × ٢؟', opts: ['٢٥', '٣٠', '٣٥', '٤٠'], a: '٣٠' },
    { q: 'كم هو ١٤٤ ÷ ١٢؟', opts: ['١٠', '١١', '١٢', '١٣'], a: '١٢' },
    { q: 'كم تربيع العدد ٥؟', opts: ['١٠', '٢٠', '٢٥', '٣٠'], a: '٢٥' },
    { q: 'مساحة مستطيل طوله ٦ وعرضه ٣؟', opts: ['٩', '١٨', '٢٤', '٣٦'], a: '١٨' },
  ],
};

const CLASS_NAMES = ['الأول', 'الثاني', 'الثالث', 'الرابع'];
const VARIANTS = ['coral', 'sky', 'lavender', 'mint'];

export default function RecoveryPath({ showToast }) {
  const [active, setActive] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const openQuiz = (classId) => {
    setActive(classId);
    setQIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  const closeQuiz = () => setActive(null);

  const answer = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    const isCorrect = opt === QUESTIONS[active][qIndex].a;
    if (isCorrect) { setScore((s) => s + 1); playSuccess(); }
    else { playError(); }
    setTimeout(() => {
      if (qIndex < QUESTIONS[active].length - 1) {
        setQIndex((i) => i + 1);
        setSelected(null);
      } else {
        setDone(true);
        if (showToast) {
          showToast(`أنهيت التعويض بنتيجة ${score + (isCorrect ? 1 : 0)} من 5! 🎯`, 'success');
        }
      }
    }, 700);
  };

  if (active) {
    const quiz = QUESTIONS[active];
    return (
      <div className={styles.overlay}>
        <motion.div
          className={styles.modal}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.modalHeader}>
            <h3>تعويض الصف {CLASS_NAMES[active - 1]} 🎯</h3>
            <button className={styles.closeBtn} onClick={closeQuiz} aria-label="إغلاق">✕</button>
          </div>
          {done ? (
            <div className={styles.result}>
              <span className={styles.resultEmoji}>{score >= 4 ? '🎉' : score >= 2 ? '💪' : '📚'}</span>
              <p className={styles.resultScore}>{score} / 5</p>
              <p className={styles.resultMsg}>
                {score >= 4 ? 'ممتاز! أنت جاهز' : score >= 2 ? 'جيد! تابع التدريب' : 'لا بأس، سنعيد المحاولة'}
              </p>
              <GlowButton variant="mint" onClick={closeQuiz}>العودة</GlowButton>
            </div>
          ) : (
            <>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${((qIndex + 1) / quiz.length) * 100}%` }} />
              </div>
              <p className={styles.qCounter}>السؤال {qIndex + 1} من {quiz.length}</p>
              <p className={styles.qText}>{quiz[qIndex].q}</p>
              <div className={styles.opts}>
                {quiz[qIndex].opts.map((opt) => (
                  <button
                    key={opt}
                    className={`${styles.optBtn} ${selected === opt ? (opt === quiz[qIndex].a ? styles.correct : styles.wrong) : ''}`}
                    onClick={() => answer(opt)}
                    disabled={selected !== null}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <section className={styles.section} id="recovery">
      <div className={styles.container}>
        <h2 className={styles.title}>هل فاتك بعض الدروس؟ لا تقلق! 🎯</h2>
        <p className={styles.subtitle}>ابدأ مسار التعويض واستعد تقدّمك خطوة بخطوة</p>
        <div className={styles.grid}>
          {CLASS_NAMES.map((name, i) => (
            <motion.div
              key={i}
              className={styles.card}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.04 }}
            >
              <span className={styles.cardEmoji}>🎯</span>
              <h3 className={styles.cardTitle}>الصف {name}</h3>
              <p className={styles.cardDesc}>اختبار تشخيصي سريع من 5 أسئلة</p>
              <GlowButton variant={VARIANTS[i]} onClick={() => openQuiz(i + 1)}>
                ابدأ التعويض
              </GlowButton>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
